import { createAsyncThunk } from '@reduxjs/toolkit';
import { Content, Part } from '@google/generative-ai';

import { GeminiApiClient } from '../api/gemini';

import type { RootState } from './store';
import { selectCurrentLocale } from './localeSlice';
import { selectCurrentConversation } from './chatSlice';
import { getTranslation } from '../utils/getTranslation';


interface GenerateContentArgs {
  prompt: string;
  files?: {
    mimeType: string;
    base64: string;
  }[];
}

interface GenerateContentResult {
  userMessage: Content;
  modelResponse: Content;
}

/**
 * An async thunk to generate content using the Gemini API.
 * It orchestrates the entire API call lifecycle, including fetching state,
 * making the request, and handling success or failure.
 */
export const generateContent = createAsyncThunk<
  GenerateContentResult,
  GenerateContentArgs,
  { state: RootState; rejectValue: string }
>('chat/generateContent', async ({ prompt, files }, { getState, rejectWithValue }) => {
  const state = getState();
  const { settings } = state;
  const currentLocale = selectCurrentLocale(state);
  const currentConversation = selectCurrentConversation(state);

  if (!settings.apiKey) {
    return rejectWithValue(getTranslation(currentLocale, 'errors.apiKeyNotSet'));

  }

  if (!currentConversation) {
    return rejectWithValue(getTranslation(currentLocale, 'errors.noActiveConversation'));
  }

  try {
    // For multimodal prompts, the order of parts is important.
    // The file data should come before the text prompt.
    const latestUserMessage: Part[] = [];
    if (files) {
      files.forEach(file => {
        latestUserMessage.push({ inlineData: { mimeType: file.mimeType, data: file.base64 } });
      });
    }
    // The text part should always be present.
    latestUserMessage.push({ text: prompt });

    const client = new GeminiApiClient(settings.apiKey);
    const result = await client.generateContent({ history: currentConversation.messages, latestUserMessage });
    const text = result.response.text();

    const userMessage: Content = { role: 'user', parts: latestUserMessage };
    const modelResponse: Content = { role: 'model', parts: [{ text }] };

    return { userMessage, modelResponse };
  } catch (error: any) {
    const errorMessage = error.message || getTranslation(currentLocale, 'errors.unknownApiError');
    return rejectWithValue(errorMessage);
  }
});
