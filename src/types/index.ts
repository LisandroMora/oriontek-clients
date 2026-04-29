export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentId: string;
  addresses: Address[];
  createdAt: string;
  updatedAt: string;
}

export type ClientFormData = Omit<
  Client,
  'id' | 'addresses' | 'createdAt' | 'updatedAt'
>;

export type AddressFormData = Omit<Address, 'id' | 'createdAt'>;

/**
 * Estado de las llamadas async — patrón estándar para tracking de loading/errors.
 */
export type AsyncStatus = 'idle' | 'loading' | 'succeeded' | 'failed';