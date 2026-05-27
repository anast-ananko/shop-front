import { Address } from "./models";


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
  setDefaultBilling: (id: string) => ({
    action: 'setDefaultBillingAddress',
    addressId: id,
  }),
  addBillingAddressId: (id: string) => ({
    action: 'addBillingAddressId',
    addressId: id,
  }),
};
