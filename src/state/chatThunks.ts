import { createAsyncThunk } from '@reduxjs/toolkit';
import { GeminiApiClient } from '../api/gemini';
import { RootState } from './store';

/**
 * An async thunk to generate content using the Gemini API.
 * It orchestrates the entire API call lifecycle, including fetching state,
 * making the request, and handling success or failure.
 */
export const generateContent = createAsyncThunk<
  string, // Return type on success
  void,   // Argument type (void since we get data from state)
  { state: RootState; rejectValue: string }
>('chat/generateContent', async (_, { getState, rejectWithValue }) => {
  const { settings, chat } = getState();

  if (!settings.apiKey) {
    return rejectWithValue('API Key is not set. Please configure it at the bottom of the page.');
  }

  try {
    const client = new GeminiApiClient(settings.apiKey);
    const result = await client.generateContent({ prompt: chat.prompt, file: chat.fileData });
    const text = result.response.text();
    return text;
  } catch (error: any) {
    const errorMessage = error.message || 'An unknown error occurred while contacting the Gemini API.';
    return rejectWithValue(errorMessage);
  }
});