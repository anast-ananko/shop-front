import { Address, CustomerGroupAssignment, StoreReference } from '../http/services/customer/models';

export interface AppToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface Token {
  access_token: string;
  expires_in: number;
  scope: string;
  refresh_token: string;
  token_type: string;
}

export interface SignupResponse {
  customer: Customer;
}

export type Customer = CustomerBase;

export interface CustomerBase {
  id: string;
  version: number;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  addresses: Address[];
  shippingAddressIds: string[];
  billingAddressIds: string[];
  isEmailVerified: boolean;
  stores: StoreReference[];
  authenticationMode: string;
  customerGroupAssignments: CustomerGroupAssignment[];
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
