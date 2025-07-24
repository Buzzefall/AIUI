import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { Content } from '@google/generative-ai';
import { generateContent } from './chatThunks';
import type { RootState } from './store';

// --- Helper Functions ---

const CHAT_HISTORY_KEY = 'gemini-chat-history';

const saveStateToLocalStorage = (state: ChatState) => {
  try {
    const serializedState = JSON.stringify({
      conversations: state.conversations,
      currentConversationId: state.currentConversationId,
    });
    localStorage.setItem(CHAT_HISTORY_KEY, serializedState);
  } catch (e) {
    console.warn('Could not save chat history to local storage', e);
  }
};

const loadStateFromLocalStorage = (): Partial<ChatState> => {
  try {
    const serializedState = localStorage.getItem(CHAT_HISTORY_KEY);
    if (serializedState === null) {
      return {};
    }
    return JSON.parse(serializedState);
  } catch (e) {
    console.warn('Could not load chat history from local storage', e);
    return {};
  }
};

// --- Conversation State Shape ---
export interface Conversation {
  id: string;
  title: string;
  messages: Content[];
}

// Define a type for the slice state
interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  error: string | null;
}

// --- Initial State ---

const initialState: ChatState = {
  conversations: [],
  currentConversationId: null,
  isLoading: false,
  error: null,
  ...loadStateFromLocalStorage(),
};

// --- Slice Definition ---

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
      startNewChat: (state, action: PayloadAction<string>) => {
      const newConversation: Conversation = {
        id: nanoid(),
        title: action.payload,
        messages: [],
      };
      state.conversations.unshift(newConversation);
      state.currentConversationId = newConversation.id;
      saveStateToLocalStorage(state);
    },
    
    switchConversation: (state, action: PayloadAction<string>) => {
      if (state.conversations.some((c) => c.id === action.payload)) {
        state.currentConversationId = action.payload;
        saveStateToLocalStorage(state);
      }
    },

    deleteConversation: (state, action: PayloadAction<string>) => {
      state.conversations = state.conversations.filter((c) => c.id !== action.payload);
      if (state.currentConversationId === action.payload) {
        state.currentConversationId = state.conversations[0]?.id || null;
      }
      saveStateToLocalStorage(state);
    },
    setChatState: (state, action: PayloadAction<ChatState>) => {
      state.conversations = action.payload.conversations;
      state.currentConversationId = action.payload.currentConversationId;
      saveStateToLocalStorage(state);
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(generateContent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateContent.fulfilled, (state, action) => {
        const currentConvo = state.conversations.find((c) => c.id === state.currentConversationId);
        if (currentConvo) {
          currentConvo.messages.push(action.payload.userMessage, action.payload.modelResponse);
          // Auto-title the conversation after the first exchange
          if (currentConvo.messages.length === 2) {
            const firstUserMessage = action.payload.userMessage.parts.map(p => 'text' in p ? p.text : '').join(' ');
            currentConvo.title = firstUserMessage.substring(0, 40) + (firstUserMessage.length > 40 ? '...' : '');
          }
        }
        state.isLoading = false;
        saveStateToLocalStorage(state);
      })
      .addCase(generateContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { startNewChat, switchConversation, deleteConversation } = chatSlice.actions;

// Selectors
export const selectIsLoading = (state: RootState) => state.chat.isLoading;
export const selectError = (state: RootState) => state.chat.error;
export const selectConversations = (state: RootState) => state.chat.conversations;
export const selectCurrentConversationId = (state: RootState) => state.chat.currentConversationId;

export const selectCurrentConversation = (state: RootState) => {
  return state.chat.conversations.find((c) => c.id === state.chat.currentConversationId) || null;
};

export default chatSlice.reducer;