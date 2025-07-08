import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './settingsSlice';
import chatReducer from './chatSlice';

// We will add reducers here in the next steps
export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    chat: chatReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;