import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

import { passwordMatchValidator } from '../../../../../utils/password-match.validator';
import { CustomerService } from '../../../../../core/services/customer/customer.service';
import { AddressBlock } from '../../../../../shared/components/address-block/address-block';
import { customerActions } from '../../../../../core/services/customer/customerActions';
import { TokenService } from '../../../../../core/auth/services/token-service';
import { FormatDatePipe } from '../../../../../shared/pipes/format-date';

@Component({
  selector: 'app-settings',
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatIcon,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    AddressBlock,
    FormatDatePipe,
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Settings implements OnInit {
  private fb = inject(FormBuilder);
  tokenService = inject(TokenService);
  customerService = inject(CustomerService);
  private destroyRef = inject(DestroyRef);

  editingField = signal<string | null>(null);

  saveError = signal<string | null>(null);
  saveSuccess = signal<boolean>(false);

  serverError = signal<string | null>(null);
  serverSuccess = signal<boolean>(false);

  showPassword = signal(false);
  showCurrentPassword = signal<boolean>(false);
  showNewPassword = signal<boolean>(false);
  showConfirmPassword = signal<boolean>(false);

  form = this.fb.nonNullable.group({
    firstName: [
      '',
      [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-zÀ-ž]+$/)],
    ],
    lastName: [
      '',
      [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-zÀ-ž]+$/)],
    ],
    email: ['', [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)]],
    dateOfBirth: ['', Validators.required],
  });

  formPassword = this.fb.nonNullable.group(
    {
      currentPassword: ['', [Validators.required]],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: passwordMatchValidator,
    },
  );

  ngOnInit() {
    this.formPassword.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.serverError.set(null);
    });
  }

  edit(field: string): void {
    const customer = this.customerService.customer();
    if (!customer) return;

    this.editingField.set(field);

    this.form.patchValue({
      [field]: customer[field as keyof typeof customer],
    });
  }

  cancel(): void {
    this.editingField.set(null);
  }

  save(field: string): void {
    const control = this.form.get(field);
    if (!control || control.invalid) {
      control?.markAsTouched();
      return;
    }

    const customer = this.customerService.customer();
    if (!customer) return;

    const value = control.value;

    let action: unknown;

    switch (field) {
      case 'firstName':
        action = customerActions.setFirstName(value);
        break;

      case 'lastName':
        action = customerActions.setLastName(value);
        break;

      case 'email':
        action = customerActions.changeEmail(value);
        break;

      case 'dateOfBirth':
        action = customerActions.setDateOfBirth(value);
        break;

      default:
        return;
    }

    this.saveError.set(null);
    this.saveSuccess.set(false);

    this.customerService.updateMe([action]).subscribe({
      next: () => {
        this.saveSuccess.set(true);
        this.cancel();

        setTimeout(() => {
          this.saveSuccess.set(false);
        }, 3000);
      },
      error: (err) => {
        this.saveError.set(err?.error?.message || 'Failed to update data');

        setTimeout(() => {
          this.saveError.set(null);
        }, 3000);
      },
    });
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  cancelPassword(): void {
    this.showPassword.set(false);
    this.formPassword.patchValue({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  }

  submit() {
    const current = this.formPassword.get('currentPassword')?.value;
    const newPass = this.formPassword.get('newPassword')?.value;
    const confirm = this.formPassword.get('confirmPassword')?.value;
    const email = this.customerService.customer()?.email;

    if (!current || !newPass || !confirm || !email) return;

    this.customerService
      .changePassword(current, newPass)
      .pipe(
        switchMap(() => {
          return this.tokenService.getCustomerToken({
            email,
            password: this.formPassword.getRawValue().newPassword,
          });
        }),
        switchMap(() => {
          return this.customerService.getMe();
        }),
      )
      .subscribe({
        next: () => {
          this.serverSuccess.set(true);
          this.formPassword.reset();

          setTimeout(() => {
            this.serverSuccess.set(false);
            this.showPassword.set(false);
          }, 3000);
        },
        error: (err) => {
          const apiError = err.error;

          this.serverError.set(apiError?.message || 'Failed to change password');
        },
      });
  }
}
