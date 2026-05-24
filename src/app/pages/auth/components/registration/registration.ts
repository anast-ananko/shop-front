import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCard, MatCardTitle } from '@angular/material/card';
import { map, Observable, switchMap } from 'rxjs';

import { postalCodeValidator } from '../../../../utils/postal-code.validator';
import { CountriesService } from '../../../../core/services/countries.service';
import { AuthService } from '../../../../core/http/services/auth/auth.service';
import { CustomerService } from '../../../../core/http/services/customer/customer.service';
import { customerActions } from '../../../../core/http/services/customer/customerActions';
import { Address, MeResponse } from '../../../../core/http/services/customer/models';

@Component({
  selector: 'app-registration',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCard,
    MatCardTitle,
  ],
  templateUrl: './registration.html',
  styleUrl: './registration.scss',
})
export class Registration implements OnInit {
  private fb = inject(FormBuilder);
  countriesService = inject(CountriesService);
  private authService = inject(AuthService);
  private customerService = inject(CustomerService);
  private router = inject(Router);

  serverError = signal<string | null>(null);
  success = signal<boolean>(false);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/),
      ],
    ],
    firstName: [
      '',
      [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-zÀ-ž]+$/)],
    ],
    lastName: [
      '',
      [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-zÀ-ž]+$/)],
    ],
    dateOfBirth: ['', Validators.required],

    shippingAddress: this.fb.group(
      {
        streetName: ['', Validators.required],
        streetNumber: ['', Validators.required],
        city: ['', Validators.required],
        postalCode: ['', Validators.required],
        country: ['', Validators.required],
        isDefault: [true],
      },
      { validators: postalCodeValidator },
    ),

    billingSameAsShipping: [true],

    billingAddress: this.fb.group(
      {
        streetName: [''],
        streetNumber: [''],
        city: [''],
        postalCode: [''],
        country: [''],
        isDefault: [true],
      },
      { validators: postalCodeValidator },
    ),
  });

  ngOnInit() {
    const shipping = this.form.controls.shippingAddress;
    const billing = this.form.controls.billingAddress;

    this.initAddressLogic(shipping);
    this.initAddressLogic(billing);

    this.form.valueChanges.subscribe(() => {
      this.serverError.set(null);
    });
  }

  private initAddressLogic(address: FormGroup): void {
    const country = address.controls['country'];
    const postalCode = address.controls['postalCode'];

    country.valueChanges.subscribe(() => {
      postalCode.reset('');
      postalCode.markAsUntouched();
      address.updateValueAndValidity();
    });

    address.valueChanges.subscribe(() => {
      this.syncAddressErrorToControls(address);
    });
  }

  private syncAddressErrorToControls(address: FormGroup): void {
    const error = address.hasError('invalidPostalCode');

    const country = address.controls['country'];
    const postalCode = address.controls['postalCode'];

    if (error) {
      country.setErrors({ invalidPostalCode: true });
      postalCode.setErrors({ invalidPostalCode: true });
    } else {
      this.clearControlError(country, 'invalidPostalCode');
      this.clearControlError(postalCode, 'invalidPostalCode');
    }
  }

  private clearControlError(control: AbstractControl, errorKey: string): void {
    const errors: ValidationErrors | null = control.errors;

    if (!errors) return;

    const updatedErrors = { ...errors };
    delete updatedErrors[errorKey];

    control.setErrors(Object.keys(updatedErrors).length ? updatedErrors : null);
  }

  private mapAddress(address: any): Omit<Address, 'id'> {
    return {
      streetName: address.streetName ?? '',
      streetNumber: address.streetNumber ?? '',
      city: address.city ?? '',
      postalCode: address.postalCode ?? '',
      country: address.country ?? '',
    };
  }

  private addAddress(address: Omit<Address, 'id'>): Observable<string> {
    return this.customerService
      .updateMe([customerActions.addAddress(address)])
      .pipe(map((customer) => customer.addresses.at(-1)!.id));
  }

  private setDefault(type: 'shipping' | 'billing', addressId: string): Observable<MeResponse> {
    return this.customerService.updateMe([
      type === 'shipping'
        ? customerActions.setDefaultShipping(addressId)
        : customerActions.setDefaultBilling(addressId),
    ]);
  }

  private addId(type: 'shipping' | 'billing', addressId: string): Observable<MeResponse> {
    return this.customerService.updateMe([
      type === 'shipping'
        ? customerActions.addShippingAddressId(addressId)
        : customerActions.addBillingAddressId(addressId),
    ]);
  }

  private handleAddress = (
    type: 'shipping' | 'billing',
    address: Omit<Address, 'id'>,
    isDefault: boolean,
  ): Observable<MeResponse> =>
    this.addAddress(address).pipe(
      switchMap((id) => (isDefault ? this.setDefault(type, id) : this.addId(type, id))),
    );

  submit() {
    if (this.form.invalid) {
      return;
    }

    const form = this.form.getRawValue();

    const signupPayload = {
      email: form.email,
      password: form.password,
      firstName: form.firstName,
      lastName: form.lastName,
    };

    this.authService
      .signup(signupPayload)
      .pipe(
        switchMap(() => this.authService.getCustomerToken(form.email, form.password)),

        switchMap(() => {
          const shipping = this.mapAddress(form.shippingAddress);

          const billing = this.mapAddress(form.billingAddress);

          if (form.billingSameAsShipping) {
            return this.handleAddress('shipping', shipping, !!form.shippingAddress.isDefault).pipe(
              switchMap((customer) =>
                form.shippingAddress.isDefault
                  ? this.setDefault('billing', customer.addresses.at(-1)!.id)
                  : this.addId('billing', customer.addresses.at(-1)!.id),
              ),
            );
          }

          return this.handleAddress('shipping', shipping, !!form.shippingAddress.isDefault).pipe(
            switchMap(() =>
              this.handleAddress('billing', billing, !!form.billingAddress.isDefault),
            ),
          );
        }),
      )
      .subscribe({
        next: () => {
          this.success.set(true);
          this.form.reset();

          setTimeout(() => {
            this.router.navigateByUrl('/');
          }, 3000);
        },
        error: (err) => {
          const apiError = err.error;

          this.serverError.set(apiError?.message || 'Registration failed');
        },
      });
  }
}
