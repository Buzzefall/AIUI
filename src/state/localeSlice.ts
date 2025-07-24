import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export type Locale = 'en' | 'ru';

interface LocaleState {
  locale: Locale;
}

const getInitialLocale = (): Locale => {
  const savedLocale = localStorage.getItem('gemini-chat-locale');
  if (savedLocale === 'en' || savedLocale === 'ru') {
    return savedLocale;
  }
  return 'en';
};

const initialState: LocaleState = {
  locale: getInitialLocale(),
};

const localeSlice = createSlice({
  name: 'locale',
  initialState,
  reducers: {
    setLocale: (state, action: PayloadAction<Locale>) => {
      state.locale = action.payload;
      localStorage.setItem('gemini-chat-locale', action.payload);
    },
    setLocaleState: (state, action: PayloadAction<LocaleState>) => {
      state.locale = action.payload.locale;
      localStorage.setItem('gemini-chat-locale', action.payload.locale);
    },
  },
});

export const { setLocale, setLocaleState } = localeSlice.actions;
export const selectLocale = (state: RootState) => state.locale.locale;
export default localeSlice.reducer;