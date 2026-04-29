import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { ApiError } from '@/api/apiClient';
import { clientsService } from '@/services/clientsService';
import type { AddressFormData, Client, ClientFormData } from '@/types';

interface ClientsState {
  items: Client[];
  loading: boolean;
  error: string | null;
}

const initialState: ClientsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchClients = createAsyncThunk('clients/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await clientsService.getAll();
  } catch (err) {
    return rejectWithValue((err as ApiError).message);
  }
});

export const createClient = createAsyncThunk(
  'clients/create',
  async (data: ClientFormData, { rejectWithValue }) => {
    try {
      return await clientsService.create(data);
    } catch (err) {
      return rejectWithValue((err as ApiError).message);
    }
  },
);

export const updateClient = createAsyncThunk(
  'clients/update',
  async (args: { id: string; data: ClientFormData }, { rejectWithValue }) => {
    try {
      return await clientsService.update(args.id, args.data);
    } catch (err) {
      return rejectWithValue((err as ApiError).message);
    }
  },
);

export const deleteClient = createAsyncThunk(
  'clients/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await clientsService.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue((err as ApiError).message);
    }
  },
);

export const addAddress = createAsyncThunk(
  'clients/addAddress',
  async (args: { clientId: string; data: AddressFormData }, { rejectWithValue }) => {
    try {
      return await clientsService.addAddress(args.clientId, args.data);
    } catch (err) {
      return rejectWithValue((err as ApiError).message);
    }
  },
);

export const updateAddress = createAsyncThunk(
  'clients/updateAddress',
  async (
    args: { clientId: string; addressId: string; data: AddressFormData },
    { rejectWithValue },
  ) => {
    try {
      return await clientsService.updateAddress(args.clientId, args.addressId, args.data);
    } catch (err) {
      return rejectWithValue((err as ApiError).message);
    }
  },
);

export const deleteAddress = createAsyncThunk(
  'clients/deleteAddress',
  async (args: { clientId: string; addressId: string }, { rejectWithValue }) => {
    try {
      return await clientsService.deleteAddress(args.clientId, args.addressId);
    } catch (err) {
      return rejectWithValue((err as ApiError).message);
    }
  },
);

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action: PayloadAction<Client[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Error al cargar clientes';
      })

      .addCase(createClient.fulfilled, (state, action: PayloadAction<Client>) => {
        state.items.unshift(action.payload);
      })

      .addCase(updateClient.fulfilled, (state, action: PayloadAction<Client>) => {
        const i = state.items.findIndex((c) => c.id === action.payload.id);
        if (i !== -1) state.items[i] = action.payload;
      })

      .addCase(deleteClient.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      })

      .addCase(addAddress.fulfilled, (state, action: PayloadAction<Client>) => {
        const i = state.items.findIndex((c) => c.id === action.payload.id);
        if (i !== -1) state.items[i] = action.payload;
      })
      .addCase(updateAddress.fulfilled, (state, action: PayloadAction<Client>) => {
        const i = state.items.findIndex((c) => c.id === action.payload.id);
        if (i !== -1) state.items[i] = action.payload;
      })
      .addCase(deleteAddress.fulfilled, (state, action: PayloadAction<Client>) => {
        const i = state.items.findIndex((c) => c.id === action.payload.id);
        if (i !== -1) state.items[i] = action.payload;
      });
  },
});

export default clientsSlice.reducer;