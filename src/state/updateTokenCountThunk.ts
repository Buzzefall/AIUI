import { createAsyncThunk } from '@reduxjs/toolkit';
import { GeminiApiClient } from '../api/gemini';
import { updateTokenCount } from './chatSlice';
import type { RootState } from './store';

export const updateTokenCountThunk = createAsyncThunk<
  void,
  { conversationId: string },
  { state: RootState }
>('chat/updateTokenCount', async ({ conversationId }, { getState, dispatch }) => {
  const state = getState();
  const { settings } = state;
  const conversation = state.chat.conversations.find((c) => c.id === conversationId);

  if (!settings.apiKey || !conversation) {
    return;
  }

  try {
    const client = new GeminiApiClient(settings.apiKey);
    const { totalTokens, cachedContentTokenCount } = await client.countTokens(conversation.messages);
    dispatch(updateTokenCount({ conversationId, totalTokens, cachedContentTokenCount }));
  } catch (error) {
    console.error('Failed to update token count:', error);
  }
});
