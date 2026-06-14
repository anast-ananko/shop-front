import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  model,
  OnInit,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { postalCodeValidator } from '../../../utils/postal-code.validator';
import { CountriesService } from '../../../core/services/countries/countries.service';
import { AddressDialogData } from '../address-block/address-block';
import { AddressVM } from '../../../core/services/customer/models';
import { PostalCodeSyncDirective } from '../../../core/directives/postal-code-sync/postal-code-sync';

export interface AddressDialogResult {
  action: 'save';
  address: AddressVM;
  mode: 'create' | 'edit';
}

@Component({
  selector: 'app-address-dialog',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatDialogActions,
    MatDialogClose,
    MatCheckbox,
    MatFormField,
    MatLabel,
    MatSelectModule,
    PostalCodeSyncDirective,
  ],
  templateUrl: './address-dialog.html',
  styleUrl: './address-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressDialog implements OnInit {
  readonly dialogRef = inject(MatDialogRef<AddressDialog>);
  readonly data = inject<AddressDialogData>(MAT_DIALOG_DATA);
  readonly address = model(this.data.address);
  private fb = inject(FormBuilder);
  countriesService = inject(CountriesService);
  private destroyRef = inject(DestroyRef);

  form = this.fb.nonNullable.group(
    {
      streetName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      streetNumber: ['', [Validators.required, Validators.maxLength(10)]],
      city: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
      isShipping: [true],
      isBilling: [true],
    },
    { validators: postalCodeValidator },
  );

  ngOnInit() {
    if (this.data.mode === 'edit' && this.data.address) {
      this.form.patchValue(this.data.address);
    }

    this.form.controls.isShipping.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((val) => {
        if (!val && !this.form.controls.isBilling.value) {
          this.form.controls.isBilling.setValue(true, { emitEvent: false });
        }
      });

    this.form.controls.isBilling.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((val) => {
        if (!val && !this.form.controls.isShipping.value) {
          this.form.controls.isShipping.setValue(true, { emitEvent: false });
        }
      });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
