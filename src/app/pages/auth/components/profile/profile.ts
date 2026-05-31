import { Component, DestroyRef, inject, signal } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

import { AuthService } from '../../../../core/auth/auth.service';
import { passwordMatchValidator } from '../../../../utils/password-match.validator';
import { CustomerService } from '../../../../core/services/customer/customer.service';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, MatCard, MatIcon, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private fb = inject(FormBuilder);
  authService = inject(AuthService);
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
      currentPassword: [''],
      newPassword: ['', [Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/)]],
      confirmPassword: [''],
    },
    {
      validators: passwordMatchValidator,
    },
  );

  ngOnInit() {
    const customer = this.customerService.customer();

    if (!customer) return;

    this.form.patchValue({
      firstName: customer.firstName ?? '',
      lastName: customer.lastName ?? '',
      email: customer.email ?? '',
      dateOfBirth: customer.dateOfBirth ?? '',
    });

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

    let action: any;

    switch (field) {
      case 'firstName':
        action = { action: 'setFirstName', firstName: value };
        break;
      case 'lastName':
        action = { action: 'setLastName', lastName: value };
        break;
      case 'email':
        action = { action: 'changeEmail', email: value };
        break;
      case 'dateOfBirth':
        action = { action: 'setDateOfBirth', dateOfBirth: value };
        break;
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

  togglePassword() {
    this.showPassword.update((v) => !v);
  }

  cancelPassword() {
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

    if (!current || !newPass || !confirm) return;

    this.customerService
      .changePassword(current, newPass)
      .pipe(
        switchMap(() => {
          return this.authService.getCustomerToken({
            email: this.form.getRawValue().email,
            password: this.formPassword.getRawValue().newPassword,
          });
        }),
        switchMap(() => {
          return this.customerService.getMe();
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.serverSuccess.set(true);
          this.formPassword.reset();

          setTimeout(() => {
            this.serverSuccess.set(false);
          }, 3000);
        },
        error: (err) => {
          const apiError = err.error;

          this.serverError.set(apiError?.message || 'Failed t0 change password');
        },
      });
  }
}
