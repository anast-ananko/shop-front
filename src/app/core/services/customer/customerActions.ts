import { Address } from './models';

export const customerActions = {
  addAddress: (address: Omit<Address, 'id'>) => ({ action: 'addAddress', address }),
  setDefaultShipping: (id: string) => ({
    action: 'setDefaultShippingAddress',
    addressId: id,
  }),
  addShippingAddressId: (id: string) => ({
    action: 'addShippingAddressId',
    addressId: id,
  }),
  removeShippingAddressId: (id: string) => ({
    action: 'removeShippingAddressId',
    addressId: id,
  }),
  setDefaultBilling: (id: string) => ({
    action: 'setDefaultBillingAddress',
    addressId: id,
  }),
  addBillingAddressId: (id: string) => ({
    action: 'addBillingAddressId',
    addressId: id,
  }),
  removeBillingAddressId: (id: string) => ({
    action: 'removeBillingAddressId',
    addressId: id,
  }),
  setDateOfBirth: (date: string) => ({
    action: 'setDateOfBirth',
    dateOfBirth: date,
  }),
  changeAddress: (address: Address) => {
    const { id, ...addressWithoutId } = address;

    return {
      action: 'changeAddress',
      addressId: id,
      address: addressWithoutId,
    };
  },
  removeAddress: (addressId: string) => ({
    action: 'removeAddress',
    addressId,
  }),
};
