import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgClass } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { EMPTY, switchMap } from 'rxjs';

import { Address } from '../../../core/services/customer/models';
import { CustomerService } from '../../../core/services/customer/customer.service';
import { AddressDialog, AddressDialogResult } from '../address-dialog/address-dialog';
import { customerActions } from '../../../core/services/customer/customerActions';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import { COUNTRIES } from '../../tokens/countries';

@Component({
  selector: 'app-address-card',
  imports: [MatCard, MatChipsModule, MatIcon, NgClass],
  templateUrl: './address-card.html',
  styleUrl: './address-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressCard {
  readonly dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  customerService = inject(CustomerService);
  countries = inject(COUNTRIES);

  @Input() address!: Address;
  @Input() showActions = true;
  @Input() mode: 'shipping' | 'billing' | 'defaultShipping' | 'defaultBilling' | 'simple' =
    'simple';
  @Output() setDefault = new EventEmitter<Address>();

  get headerText(): string | null {
    if (this.mode === 'defaultShipping') return 'Default shipping address';
    if (this.mode === 'defaultBilling') return 'Default billing address';

    if (this.mode === 'shipping') return 'Shipping address';
    if (this.mode === 'billing') return 'Billing address';

    return null;
  }

  editAddress(): void {
    const dialogRef = this.dialog.open(AddressDialog, {
      data: { mode: 'edit', address: this.address },
    });

    dialogRef.afterClosed().subscribe((result: AddressDialogResult) => {
      if (!result) {
        return;
      }

      if (result.action === 'save' && result.mode === 'edit') {
        const updatedAddress: Address = {
          id: this.address.id,
          streetName: result.address.streetName,
          streetNumber: result.address.streetNumber,
          city: result.address.city,
          postalCode: result.address.postalCode,
          country: result.address.country,
        };

        this.customerService.updateMe([customerActions.changeAddress(updatedAddress)]).subscribe({
          next: () => {
            this.snackBar.open('Address updated', 'OK', {
              duration: 2500,
              panelClass: ['snackbar-success'],
            });
          },
          error: () => {
            this.snackBar.open('Failed to update address', 'Close', {
              duration: 4000,
              panelClass: ['snackbar-error'],
            });
          },
        });
      }
    });
  }

  deleteAddress(): void {
    const dialogRef = this.dialog.open(ConfirmDialog);

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      const customer = this.customerService.customer();

      const isShipping = customer?.shippingAddressIds.includes(this.address.id);
      const isBilling = customer?.billingAddressIds.includes(this.address.id);

      let action: { action: string; addressId: string } = {
        action: '',
        addressId: '',
      };

      if (isShipping && (this.mode === 'shipping' || this.mode === 'defaultShipping')) {
        action = customerActions.removeShippingAddressId(this.address.id);
      }

      if (isBilling && (this.mode === 'billing' || this.mode === 'defaultBilling')) {
        action = customerActions.removeBillingAddressId(this.address.id);
      }

      this.customerService
        .updateMe([action])
        .pipe(
          switchMap((customer) => {
            const notUsed =
              !customer.shippingAddressIds.includes(this.address.id) &&
              !customer.billingAddressIds.includes(this.address.id);

            if (!notUsed) {
              return EMPTY;
            }

            return this.customerService.updateMe([customerActions.removeAddress(this.address.id)]);
          }),
        )
        .subscribe({
          next: () => {
            this.snackBar.open('Address deleted', 'OK', {
              duration: 2500,
              panelClass: ['snackbar-success'],
            });
          },
          error: () => {
            this.snackBar.open('Failed to delete address', 'Close', {
              duration: 4000,
              panelClass: ['snackbar-error'],
            });
          },
        });
    });
  }

  setDefaultShipping() {
    this.customerService.updateMe([customerActions.setDefaultShipping(this.address.id)]).subscribe({
      next: () => {
        this.snackBar.open('Default shipping address changed', 'OK', {
          duration: 2500,
          panelClass: ['snackbar-success'],
        });
      },
      error: () => {
        this.snackBar.open('Failed to change default address', 'Close', {
          duration: 4000,
          panelClass: ['snackbar-error'],
        });
      },
    });
  }

  setDefaultBilling() {
    this.customerService.updateMe([customerActions.setDefaultBilling(this.address.id)]).subscribe({
      next: () => {
        this.snackBar.open('Default billing address changed', 'OK', {
          duration: 2500,
          panelClass: ['snackbar-success'],
        });
      },
      error: () => {
        this.snackBar.open('Failed to change default address', 'Close', {
          duration: 4000,
          panelClass: ['snackbar-error'],
        });
      },
    });
  }
}
