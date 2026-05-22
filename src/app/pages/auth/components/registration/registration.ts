import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
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
import { RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCard, MatCardTitle } from '@angular/material/card';


import { postalCodeValidator } from '../../../../utils/postal-code.validator';
import { CountriesService } from '../../../../core/services/countries.service';
import { AuthService } from '../../../../core/http/services/auth/auth.service';

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
export class Registration {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  countriesService = inject(CountriesService);

  serverError = signal<string | null>(null);

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
        street: ['', Validators.required],
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
        street: [''],
        city: [''],
        postalCode: [''],
        country: [''],
      },
      { validators: postalCodeValidator },
    ),
  });

  ngOnInit() {
    const shipping = this.form.controls.shippingAddress;
    const billing = this.form.controls.billingAddress;

    this.initAddressLogic(shipping);
    this.initAddressLogic(billing);
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

    const { [errorKey]: removed, ...rest } = errors;

    control.setErrors(Object.keys(rest).length ? rest : null);
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
  }
}
