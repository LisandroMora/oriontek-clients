import { combineReducers, configureStore } from '@reduxjs/toolkit';

import clientsReducer from './clientsSlice';

const rootReducer = combineReducers({
  clients: clientsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;