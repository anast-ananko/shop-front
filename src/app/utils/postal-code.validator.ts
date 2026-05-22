import { AbstractControl, ValidationErrors } from '@angular/forms';
import { validatePostalCode } from 'postal-code-checker';

export function postalCodeValidator(control: AbstractControl): ValidationErrors | null {
  const country = control.get('country')?.value;
  const postalCode = control.get('postalCode')?.value;

  if (!country || !postalCode) return null;

  const isValid = validatePostalCode(country, postalCode);

  return isValid ? null : { invalidPostalCode: true };
}
