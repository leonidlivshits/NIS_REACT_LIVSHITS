import React, { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import type { RenderOptions } from '@testing-library/react';
import { api } from '../app/api/apiSlice';
import authReducer from '../features/auth/authSlice';
import settingsReducer from '../features/settings/settingsSlice';

export type RootState = {
  api: ReturnType<typeof api.reducer>;
  auth: ReturnType<typeof authReducer>;
  settings: ReturnType<typeof settingsReducer>;
};

export type AppStore = ReturnType<typeof setupStore>;

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: combineReducers({
      [api.reducerPath]: api.reducer,
      auth: authReducer,
      settings: settingsReducer,
    }),
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });
}

export function setupApiStore(
  api: any,
  extraReducers?: Record<string, any>,
  preloadedState?: Partial<RootState>
) {
  const rootReducer = combineReducers({
    [api.reducerPath]: api.reducer,
    ...extraReducers,
  });

  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });

  return { store, api };
}

export function renderWithProviders(
  ui: ReactNode,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  }: {
    preloadedState?: Partial<RootState>;
    store?: AppStore;
  } = {}
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}