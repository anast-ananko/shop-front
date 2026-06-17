import { DestroyRef, Directive, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, ControlContainer, FormGroup, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appPostalCodeSync]',
})
export class PostalCodeSyncDirective implements OnInit {
  private destroyRef = inject(DestroyRef);
  private controlContainer = inject(ControlContainer);

  private get group(): FormGroup {
    const control = this.controlContainer.control;

    if (!control || !(control instanceof FormGroup)) {
      throw new Error('appPostalCodeSync must be used inside a FormGroup');
    }

    return control;
  }

  ngOnInit() {
    this.initLogic();
  }

  private initLogic(): void {
    const group = this.group;
    const { country, postalCode } = group.controls;

    country.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      postalCode.reset('');
      postalCode.markAsUntouched();
      group.updateValueAndValidity();
    });

    group.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.syncErrors();
    });
  }

  private syncErrors(): void {
    const group = this.group;
    const { country, postalCode } = group.controls;

    const error = group.hasError('invalidPostalCode');

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
