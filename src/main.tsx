import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import './index.css';
import './shared/i18n';
import { setCredentials } from './features/auth/authSlice';
import i18n from './shared/i18n';
import type { RootState } from './app/store';

const token = localStorage.getItem('token');
const user = localStorage.getItem('user');
if (token) {
  try {
    const parsedUser = user ? JSON.parse(user) : null;
    store.dispatch(setCredentials({ token, user: parsedUser }));
  } catch {
    store.dispatch(setCredentials({ token, user: null }));
  }
}

const state = store.getState() as RootState;
if (state?.settings) {
  const s = state.settings;
  if (s.lang) { i18n.changeLanguage(s.lang); }
  if (s.theme) { document.documentElement.setAttribute('data-theme', s.theme); }
}

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);