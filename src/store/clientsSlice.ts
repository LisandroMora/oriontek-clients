import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { ApiError } from '@/api/apiClient';
import { clientsService } from '@/services/clientsService';
import type { AddressFormData, AsyncStatus, Client, ClientFormData } from '@/types';

interface ClientsState {
  items: Client[];
  status: AsyncStatus;
  error: string | null;
  mutationStatus: AsyncStatus;
}

const initialState: ClientsState = {
  items: [],
  status: 'idle',
  error: null,
  mutationStatus: 'idle',
};

interface UpdateClientArg {
  id: string;
  data: ClientFormData;
}

interface AddAddressArg {
  clientId: string;
  data: AddressFormData;
}

interface UpdateAddressArg {
  clientId: string;
  addressId: string;
  data: AddressFormData;
}

interface DeleteAddressArg {
  clientId: string;
  addressId: string;
}


export const fetchClients = createAsyncThunk<Client[], void, { rejectValue: string }>(
  'clients/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await clientsService.getAll();
    } catch (err) {
      const error = err as ApiError;
      return rejectWithValue(error.message);
    }
  },
);

export const createClient = createAsyncThunk<Client, ClientFormData, { rejectValue: string }>(
  'clients/create',
  async (formData, { rejectWithValue }) => {
    try {
      return await clientsService.create(formData);
    } catch (err) {
      const error = err as ApiError;
      return rejectWithValue(error.message);
    }
  },
);

export const updateClient = createAsyncThunk<Client, UpdateClientArg, { rejectValue: string }>(
  'clients/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await clientsService.update(id, data);
    } catch (err) {
      const error = err as ApiError;
      return rejectWithValue(error.message);
    }
  },
);

export const deleteClient = createAsyncThunk<string, string, { rejectValue: string }>(
  'clients/delete',
  async (id, { rejectWithValue }) => {
    try {
      await clientsService.delete(id);
      return id;
    } catch (err) {
      const error = err as ApiError;
      return rejectWithValue(error.message);
    }
  },
);

export const addAddress = createAsyncThunk<Client, AddAddressArg, { rejectValue: string }>(
  'clients/addAddress',
  async ({ clientId, data }, { rejectWithValue }) => {
    try {
      return await clientsService.addAddress(clientId, data);
    } catch (err) {
      const error = err as ApiError;
      return rejectWithValue(error.message);
    }
  },
);

export const updateAddress = createAsyncThunk<Client, UpdateAddressArg, { rejectValue: string }>(
  'clients/updateAddress',
  async ({ clientId, addressId, data }, { rejectWithValue }) => {
    try {
      return await clientsService.updateAddress(clientId, addressId, data);
    } catch (err) {
      const error = err as ApiError;
      return rejectWithValue(error.message);
    }
  },
);

export const deleteAddress = createAsyncThunk<Client, DeleteAddressArg, { rejectValue: string }>(
  'clients/deleteAddress',
  async ({ clientId, addressId }, { rejectWithValue }) => {
    try {
      return await clientsService.deleteAddress(clientId, addressId);
    } catch (err) {
      const error = err as ApiError;
      return rejectWithValue(error.message);
    }
  },
);

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action: PayloadAction<Client[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Error al cargar clientes';
      })

      .addCase(createClient.pending, (state) => {
        state.mutationStatus = 'loading';
      })
      .addCase(createClient.fulfilled, (state, action: PayloadAction<Client>) => {
        state.mutationStatus = 'succeeded';
        state.items.unshift(action.payload);
      })
      .addCase(createClient.rejected, (state, action) => {
        state.mutationStatus = 'failed';
        state.error = action.payload ?? 'Error al crear cliente';
      })

      .addCase(updateClient.fulfilled, (state, action: PayloadAction<Client>) => {
        const index = state.items.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })

      .addCase(deleteClient.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      })

      .addCase(addAddress.fulfilled, (state, action: PayloadAction<Client>) => {
        const index = state.items.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateAddress.fulfilled, (state, action: PayloadAction<Client>) => {
        const index = state.items.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteAddress.fulfilled, (state, action: PayloadAction<Client>) => {
        const index = state.items.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      });
  },
});

export const { clearError } = clientsSlice.actions;
export default clientsSlice.reducer;