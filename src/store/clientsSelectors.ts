import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from './store';

import type { Client } from '@/types';

export const selectClients = (state: RootState): Client[] => state.clients.items;
export const selectClientsStatus = (state: RootState) => state.clients.status;
export const selectClientsError = (state: RootState) => state.clients.error;

export const selectClientById =
  (id: string) =>
  (state: RootState): Client | undefined =>
    state.clients.items.find((c: Client) => c.id === id);

export const makeSelectFilteredClients = () =>
  createSelector(
    [selectClients, (_: RootState, search: string) => search],
    (clients, search) => {
      if (!search.trim()) return clients;
      const q = search.toLowerCase();
      return clients.filter(
        (c: Client) =>
          c.firstName.toLowerCase().includes(q) ||
          c.lastName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.documentId.toLowerCase().includes(q),
      );
    },
  );

export const selectClientsCount = createSelector(
  [selectClients],
  (clients) => clients.length,
);