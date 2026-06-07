import { DestroyRef, Directive, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, ControlContainer, FormGroup, ValidationErrors } from '@angular/forms';

@Directive({
  selector: 'form[appPostalCodeSync]',
})
export class PostalCodeSyncDirective implements OnInit {
  private destroyRef = inject(DestroyRef);
  private controlContainer = inject(ControlContainer);

  private get form(): FormGroup {
    const form = this.controlContainer.control;

    if (!form) {
      throw new Error('PostalCodeSyncDirective must be used inside a formGroup');
    }

    return form as FormGroup;
  }

  ngOnInit() {
    this.initLogic();
  }

  private initLogic(): void {
    const form = this.form;
    const { country, postalCode } = form.controls;

    country.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      postalCode.reset('');
      postalCode.markAsUntouched();
      form.updateValueAndValidity();
    });

    form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.syncErrors();
    });
  }

  private syncErrors(): void {
    const form = this.form;
    const { country, postalCode } = form.controls;

    const error = form.hasError('invalidPostalCode');

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
}
