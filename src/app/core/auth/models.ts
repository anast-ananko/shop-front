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

export interface Customer {
  addresses: Address[];
  email: string;
  firstName: string;
  id: string;
  isEmailVerified: boolean;
  lastName: string;
  password: string;
  version: number;
  createdAt: string;
  lastModifiedAt: string;
  authenticationMode: string;
  stores: StoreReference[];
  shippingAddressIds: string[];
  billingAddressIds: string[];
  customerGroupAssignments: CustomerGroupAssignment[];
}

export type Address = Record<string, unknown>;
export type StoreReference = Record<string, unknown>;
export type CustomerGroupAssignment = Record<string, unknown>;

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface MeResponse {
  id: string;
  version: number;
  createdAt: string;
  lastModifiedAt: string;
  createdBy: ClientInfo;
  lastModifiedBy: ClientInfo;
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

export interface ClientInfo {
  clientId: string;
  isPlatformClient: boolean;
}
