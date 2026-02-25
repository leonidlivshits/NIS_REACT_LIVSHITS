import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SettingsState = {
  lang: 'en' | 'ru';
  theme: 'light' | 'dark';
  pageSize: number;
};

const persisted = (() => {
  try {
    const raw = localStorage.getItem('app_settings');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

const initialState: SettingsState = persisted ?? {
  lang: 'en',
  theme: 'light',
  pageSize: 10,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLang(state, action: PayloadAction<'en' | 'ru'>) {
      state.lang = action.payload;
      localStorage.setItem('app_settings', JSON.stringify(state));
    },
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload;
      localStorage.setItem('app_settings', JSON.stringify(state));
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
      localStorage.setItem('app_settings', JSON.stringify(state));
    },
  },
});

export const { setLang, setTheme, setPageSize } = settingsSlice.actions;
export default settingsSlice.reducer;
