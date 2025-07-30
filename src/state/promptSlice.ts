import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export type Prompt = string;

interface PromptState {
  value: string;
}

const initialState: PromptState = {
  value: localStorage.getItem('prompt') ?? '',
};

const promptSlice = createSlice({
  name: 'prompt',
  initialState,
  reducers: {
    setPrompt: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
      localStorage.setItem('prompt', action.payload);
    },
  },
});

export const { setPrompt } = promptSlice.actions;

export const selectPrompt = (state: RootState) => state.prompt.value;

export default promptSlice.reducer;
