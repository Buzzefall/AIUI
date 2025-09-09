import { createAsyncThunk } from '@reduxjs/toolkit';
import { Content, FinishReason, Part } from '@google/genai';

import { GeminiApiClient } from '../api/gemini';

import type { RootState } from './store';
import { selectCurrentLocale } from './localeSlice';
import { selectCurrentConversation, selectTroubleshootingMode } from './chatSlice'; // <-- Import selector
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

interface RejectValue {
  userMessage: Content;
  errorMessage: string;
  finishReason?: FinishReason;
}

/**
 * An async thunk to generate content using the Gemini API.
 * It orchestrates the entire API call lifecycle, including fetching state,
 * making the request, and handling success or failure.
 */
export const generateContent = createAsyncThunk<
  GenerateContentResult,
  GenerateContentArgs,
  { state: RootState; rejectValue: RejectValue }
>('chat/generateContent', async ({ prompt, files }, { getState, rejectWithValue }) => {
  const state = getState();
  const { settings } = state;
  const currentLocale = selectCurrentLocale(state);
  const currentConversation = selectCurrentConversation(state);
  const troubleshootingMode = selectTroubleshootingMode(state); // <-- Get mode

  // For multimodal prompts, the order of parts is important.
  const latestUserMessageParts: Part[] = [];
  if (files) {
    files.forEach(file => {
      latestUserMessageParts.push({ inlineData: { mimeType: file.mimeType, data: file.base64 } });
    });
  }
  latestUserMessageParts.push({ text: prompt });
  const userMessage: Content = { role: 'user', parts: latestUserMessageParts };

  if (!settings.apiKey) {
    const errorMessage = getTranslation(currentLocale, 'errors.apiKeyNotSet');
    return rejectWithValue({ userMessage, errorMessage });
  }

  if (!currentConversation) {
    const errorMessage = getTranslation(currentLocale, 'errors.noActiveConversation');
    return rejectWithValue({ userMessage, errorMessage });
  }

  // Filter history based on troubleshooting mode
  const history = troubleshootingMode
    ? currentConversation.messages.map(m => m.content)
    : currentConversation.messages
        .filter(m => !m.isErrorAssociated)
        .map(m => m.content);

  try {
    const client = new GeminiApiClient(settings.apiKey);
    const result = await client.generateContent({
      history, // <-- Use filtered history
      latestUserMessage: userMessage.parts,
      thinkingConfig: { includeThoughts: false, thinkingBudget: 32000 }
    });

    const text = result.text;

    if (text === undefined) {
      const finishReason = result.candidates?.[0]?.finishReason;
      const errorMessage =
        result.candidates?.[0]?.finishMessage ||
        getTranslation(currentLocale, 'errors.unknownApiError');

      return rejectWithValue({ userMessage, errorMessage, finishReason });
    }

    const modelResponse: Content = { role: 'model', parts: [{ text }] };

    return { userMessage, modelResponse };
  } catch (error: any) {
    const errorMessage = error.message || getTranslation(currentLocale, 'errors.unknownApiError');
    return rejectWithValue({ userMessage, errorMessage });
  }
});

export const regenerateLastResponse = createAsyncThunk<
  GenerateContentResult,
  void, // No arguments needed
  { state: RootState; rejectValue: RejectValue }
>('chat/regenerateLastResponse', async (_, { getState, rejectWithValue }) => {
  const state = getState();
  const { settings } = state;
  const currentLocale = selectCurrentLocale(state);
  const currentConversation = selectCurrentConversation(state);
  const troubleshootingMode = selectTroubleshootingMode(state);

  if (!currentConversation || currentConversation.messages.length < 2) {
    // Cannot regenerate if there's no history or only a user message
    return rejectWithValue({ 
      userMessage: { role: 'user', parts: [] }, 
      errorMessage: 'Not enough messages to regenerate response.' 
    });
  }

  // The last message is the model's, the one before is the user's
  const lastModelMessage = currentConversation.messages[currentConversation.messages.length - 1];
  const correspondingUserMessage = currentConversation.messages.find(m => m.id === lastModelMessage.responseTo);

  if (!correspondingUserMessage) {
    return rejectWithValue({ 
      userMessage: { role: 'user', parts: [] }, 
      errorMessage: 'Could not find the corresponding user message to regenerate.' 
    });
  }

  const userMessage = correspondingUserMessage.content;

  if (!settings.apiKey) {
    const errorMessage = getTranslation(currentLocale, 'errors.apiKeyNotSet');
    return rejectWithValue({ userMessage, errorMessage });
  }

  // History excludes the last model message
  const history = troubleshootingMode
    ? currentConversation.messages.slice(0, -1).map(m => m.content)
    : currentConversation.messages
        .slice(0, -1)
        .filter(m => !m.isErrorAssociated)
        .map(m => m.content);

  try {
    const client = new GeminiApiClient(settings.apiKey);
    const result = await client.generateContent({
      history,
      latestUserMessage: userMessage.parts,
      thinkingConfig: { includeThoughts: false, thinkingBudget: 24576 }
    });

    const text = result.text;

    if (text === undefined) {
      const finishReason = result.candidates?.[0]?.finishReason;
      const errorMessage =
        result.candidates?.[0]?.finishMessage ||
        getTranslation(currentLocale, 'errors.unknownApiError');

      return rejectWithValue({ userMessage, errorMessage, finishReason });
    }

    const modelResponse: Content = { role: 'model', parts: [{ text }] };

    return { userMessage, modelResponse };

  } catch (error: any) {
    const errorMessage = error.message || getTranslation(currentLocale, 'errors.unknownApiError');
    return rejectWithValue({ userMessage, errorMessage });
  }
});
