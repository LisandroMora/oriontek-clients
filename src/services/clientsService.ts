import { apiClient } from '@/api/apiClient';
import type { Address, AddressFormData, Client, ClientFormData } from '@/types';
import { generateId } from '@/utils/helpers';

const RESOURCE = '/clients';
const nowIso = (): string => new Date().toISOString();

export const clientsService = {

  async getAll(): Promise<Client[]> {
    const { data } = await apiClient.get<Client[]>(RESOURCE);
    return data;
  },

  async getById(id: string): Promise<Client> {
    const { data } = await apiClient.get<Client>(`${RESOURCE}/${id}`);
    return data;
  },

  async create(formData: ClientFormData): Promise<Client> {
    const newClient: Client = {
      id: generateId(),
      ...formData,
      addresses: [],
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    const { data } = await apiClient.post<Client>(RESOURCE, newClient);
    return data;
  },

  async update(id: string, formData: ClientFormData): Promise<Client> {
    const { data } = await apiClient.patch<Client>(`${RESOURCE}/${id}`, {
      ...formData,
      updatedAt: nowIso(),
    });
    return data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${RESOURCE}/${id}`);
  },

  async addAddress(clientId: string, addressData: AddressFormData): Promise<Client> {
    const client = await this.getById(clientId);

    const newAddress: Address = {
      id: generateId(),
      ...addressData,
      createdAt: nowIso(),
    };

    const addresses = newAddress.isPrimary
      ? client.addresses.map((a) => ({ ...a, isPrimary: false }))
      : client.addresses;

    const { data } = await apiClient.patch<Client>(`${RESOURCE}/${clientId}`, {
      addresses: [...addresses, newAddress],
      updatedAt: nowIso(),
    });
    return data;
  },

  async updateAddress(
    clientId: string,
    addressId: string,
    addressData: AddressFormData,
  ): Promise<Client> {
    const client = await this.getById(clientId);

    const addresses = client.addresses.map((a) => {
      if (a.id === addressId) {
        return { ...a, ...addressData };
      }
      if (addressData.isPrimary) {
        return { ...a, isPrimary: false };
      }
      return a;
    });

    const { data } = await apiClient.patch<Client>(`${RESOURCE}/${clientId}`, {
      addresses,
      updatedAt: nowIso(),
    });
    return data;
  },

  async deleteAddress(clientId: string, addressId: string): Promise<Client> {
    const client = await this.getById(clientId);

    const { data } = await apiClient.patch<Client>(`${RESOURCE}/${clientId}`, {
      addresses: client.addresses.filter((a) => a.id !== addressId),
      updatedAt: nowIso(),
    });
    return data;
  },
};