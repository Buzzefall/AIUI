import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { generateContent } from './chatThunks';
import { RootState } from './store';

// Define a type for the file data to be stored
export interface FileData {
  mimeType: string;
  base64: string;
}

// Define a type for the slice state
interface ChatState {
  prompt: string;
  fileData: FileData | null;
  isLoading: boolean;
  response: string | null;
  error: string | null;
}

// Define the initial state
const initialState: ChatState = {
  prompt: '',
  fileData: null,
  isLoading: false,
  response: null,
  error: null,
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setPrompt: (state, action: PayloadAction<string>) => {
      state.prompt = action.payload;
    },
    setFileData: (state, action: PayloadAction<FileData | null>) => {
      state.fileData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateContent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.response = null;
      })
      .addCase(generateContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.response = action.payload;
      })
      .addCase(generateContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setPrompt, setFileData } = chatSlice.actions;

// Selectors
export const selectChatState = (state: RootState) => state.chat;

export default chatSlice.reducer;