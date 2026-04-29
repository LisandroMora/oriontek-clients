import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from './store';

export const selectClients = (state: RootState) => state.clients.items;
export const selectLoading = (state: RootState) => state.clients.loading;
export const selectError = (state: RootState) => state.clients.error;

export const selectClientById = (id: string) => (state: RootState) =>
  state.clients.items.find((c) => c.id === id);

export const makeSelectFilteredClients = () =>
  createSelector(
    [selectClients, (_: RootState, search: string) => search],
    (clients, search) => {
      if (!search.trim()) return clients;
      const q = search.toLowerCase();
      return clients.filter(
        (c) =>
          c.firstName.toLowerCase().includes(q) ||
          c.lastName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.documentId.toLowerCase().includes(q),
      );
    },
  );

export const selectClientsCount = createSelector([selectClients], (clients) => clients.length);