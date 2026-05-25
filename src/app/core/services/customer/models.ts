import { CustomerBase } from '../../auth/models';

export type MeResponse = CustomerBase & AuditFields;

interface AuditFields {
  createdAt: string;
  lastModifiedAt: string;
  createdBy: ClientInfo;
  lastModifiedBy: ClientInfo;
}

export interface Address {
  id: string;
  streetName: string;
  streetNumber: string;
  postalCode: string;
  city: string;
  country: string;
}

export type StoreReference = Record<string, unknown>;
export type CustomerGroupAssignment = Record<string, unknown>;

export interface ClientInfo {
  clientId: string;
  isPlatformClient: boolean;
}
