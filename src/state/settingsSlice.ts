import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

// Define a type for the slice state
interface SettingsState {
  apiKey: string | null;
}

// Define the initial state, attempting to load the key from localStorage
const initialState: SettingsState = {
  apiKey: localStorage.getItem('gemini-api-key') || null,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setApiKey: (state, action: PayloadAction<string>) => {
      state.apiKey = action.payload;
      // Persist the API key to localStorage for convenience
      localStorage.setItem('gemini-api-key', action.payload);
    },
    setSettingsState: (state, action: PayloadAction<SettingsState>) => {
      state.apiKey = action.payload.apiKey;
      localStorage.setItem('gemini-api-key', action.payload.apiKey || '');
    },
  },
});

export const { setApiKey, setSettingsState } = settingsSlice.actions;

export const selectApiKey = (state: RootState) => state.settings.apiKey;

export default settingsSlice.reducer;