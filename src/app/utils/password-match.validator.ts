import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPassword = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');

  if (!newPassword || !confirmPassword) {
    return null;
  }

  const newValue = newPassword.value;
  const confirmValue = confirmPassword.value;

  if (!newValue || !confirmValue) {
    return null;
  }

  const mismatch = newValue !== confirmValue;

  if (mismatch) {
    newPassword.setErrors({
      ...newPassword.errors,
      passwordMismatch: true,
    });

    confirmPassword.setErrors({
      ...confirmPassword.errors,
      passwordMismatch: true,
    });

    return { passwordMismatch: true };
  }

  if (newPassword.hasError('passwordMismatch')) {
    const errors = { ...newPassword.errors };
    delete errors['passwordMismatch'];

    newPassword.setErrors(Object.keys(errors).length ? errors : null);
  }

  if (confirmPassword.hasError('passwordMismatch')) {
    const errors = { ...confirmPassword.errors };
    delete errors['passwordMismatch'];

    confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
  }

  return null;
}
