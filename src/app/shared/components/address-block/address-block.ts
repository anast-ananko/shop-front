import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { countries } from 'countries-list';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Address, AddressVM } from '../../../core/services/customer/models';
import { CustomerService } from '../../../core/services/customer/customer.service';
import { AddressCard } from '../address-card/address-card';
import { AddressDialog, AddressDialogResult } from '../address-dialog/address-dialog';
import { customerActions } from '../../../core/services/customer/customerActions';

export interface AddressDialogData {
  mode: 'create' | 'edit';
  address?: AddressVM;
}

@Component({
  selector: 'app-address-block',
  imports: [AddressCard, MatCard, MatIcon],
  templateUrl: './address-block.html',
  styleUrl: './address-block.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressBlock {
  customerService = inject(CustomerService);
  readonly dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  readonly address = signal('');

  addressesVM = computed<AddressVM[]>(() => {
    const data = this.customerService.customer();

    if (!data) return [];

    return data.addresses.map((addr) => ({
      ...addr,

      isDefaultShipping: data.defaultShippingAddressId === addr.id,
      isDefaultBilling: data.defaultBillingAddressId === addr.id,

      isShipping: data.shippingAddressIds.includes(addr.id),
      isBilling: data.billingAddressIds.includes(addr.id),

      countryName: countries[addr.country as keyof typeof countries]?.name ?? addr.country,
    }));
  });

  addAddress() {
    const dialogRef = this.dialog.open(AddressDialog, {
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe((result: AddressDialogResult) => {
      if (!result) {
        return;
      }

      if (result.action === 'save' && result.mode === 'create') {
        const newAddress: Omit<Address, 'id'> = {
          streetName: result.address.streetName,
          streetNumber: result.address.streetNumber,
          city: result.address.city,
          postalCode: result.address.postalCode,
          country: result.address.country,
        };

        this.customerService
          .updateMe([customerActions.addAddress(newAddress)])
          .pipe(
            switchMap((customer) => {
              const address = customer.addresses.at(-1);

              if (!address) {
                throw new Error('No address returned from API');
              }

              const actions = [];

              if (result.address.isShipping) {
                actions.push(customerActions.addShippingAddressId(address.id));
              }

              if (result.address.isBilling) {
                actions.push(customerActions.addBillingAddressId(address.id));
              }

              return this.customerService.updateMe(actions);
            }),
          )
          .subscribe({
            next: () => {
              this.snackBar.open('Address added', 'OK', {
                duration: 2500,
                panelClass: ['snackbar-success'],
              });
            },
            error: () => {
              this.snackBar.open('Failed to add address', 'Close', {
                duration: 4000,
                panelClass: ['snackbar-error'],
              });
            },
          });
      }
    });
  }

  defaultShippingId = computed(() => this.customerService.customer()?.defaultShippingAddressId);

  defaultBillingId = computed(() => this.customerService.customer()?.defaultBillingAddressId);

  shippingAddresses = computed(
    () =>
      this.customerService
        .customer()
        ?.addresses.filter(
          (a) =>
            this.customerService.customer()?.shippingAddressIds.includes(a.id) &&
            a.id !== this.defaultShippingId(),
        ) || [],
  );

  billingAddresses = computed(
    () =>
      this.customerService
        .customer()
        ?.addresses.filter(
          (a) =>
            this.customerService.customer()?.billingAddressIds.includes(a.id) &&
            a.id !== this.defaultBillingId(),
        ) || [],
  );

  defaultShipping = computed(() =>
    this.customerService.customer()?.addresses.find((a) => a.id === this.defaultShippingId()),
  );

  defaultBilling = computed(() =>
    this.customerService.customer()?.addresses.find((a) => a.id === this.defaultBillingId()),
  );
}
