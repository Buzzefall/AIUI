import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { Content } from '@google/genai';
import { generateContent } from './chatThunks';
import type { RootState } from './store';

// --- New Message Interface ---
export interface Message {
  id: string;
  content: Content;
  isErrorAssociated?: boolean;
}

// --- Helper Functions ---

const CHAT_HISTORY_KEY = 'gemini-chat-history';

const saveStateToLocalStorage = (state: ChatState) => {
  try {
    const stateToSave = {
      conversations: state.conversations,
      currentConversationId: state.currentConversationId,
      troubleshootingMode: state.troubleshootingMode,
    };
    const serializedState = JSON.stringify(stateToSave);
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
    
    const loadedState = JSON.parse(serializedState);

    // Migration logic to handle legacy data format
    const firstConvo = loadedState.conversations?.find((c: any) => c.messages?.length > 0);
    if (firstConvo && firstConvo.messages[0] && typeof firstConvo.messages[0].content === 'undefined') {
      const migratedConversations = loadedState.conversations.map((convo: any) => ({
        ...convo,
        // message: Content --> message: Message { id: string; content: Content; isErrorAssociated?: boolean; }
        messages: convo.messages.map((oldMessage: Content) => ({
          id: nanoid(),
          content: oldMessage,
          isErrorAssociated: false,
        })),
      }));
      
      return {
        ...loadedState,
        conversations: migratedConversations,
      };
    }

    return loadedState;
  } catch (e) {
    console.warn('Could not load chat history from local storage', e);
    return {};
  }
};

// --- Conversation State Shape ---
export interface Conversation {
  id: string;
  title: string;
  totalTokens: number;
  cachedContentTokenCount: number;
  messages: Message[];
}

// Define a type for the slice state
interface ChatState {
  isLoading: boolean;
  currentConversationId: string | null;
  conversations: Conversation[];
  troubleshootingMode: boolean;
}

// --- Initial State ---

const initialState: ChatState = {
  conversations: [],
  currentConversationId: null,
  isLoading: false,
  troubleshootingMode: false,
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
        totalTokens: 0,
        cachedContentTokenCount: 0
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
    
    addOrUpdateConversationState: (state, action: PayloadAction<Conversation>) => {
        const updatedConversationId = state.conversations.findIndex((c) => c.id === action.payload.id);

        if (updatedConversationId !== -1) {
            state.conversations[updatedConversationId] = action.payload;
        }
        else {
            state.conversations.push(action.payload);
        }

        state.currentConversationId = action.payload.id;
        saveStateToLocalStorage(state);
    },

    updateTokenCount: (state, action: PayloadAction<{ conversationId: string; totalTokens: number; cachedContentTokenCount: number }>) => {
      const { conversationId, totalTokens, cachedContentTokenCount } = action.payload;
      const conversation = state.conversations.find((c) => c.id === conversationId);
      if (conversation) {
        conversation.totalTokens = totalTokens;
        conversation.cachedContentTokenCount = cachedContentTokenCount;
        saveStateToLocalStorage(state);
      }
    },

    toggleTroubleshootingMode: (state) => {
      state.troubleshootingMode = !state.troubleshootingMode;
      saveStateToLocalStorage(state);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(generateContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(generateContent.fulfilled, (state, action) => {
        const currentConvo = state.conversations.find((c) => c.id === state.currentConversationId);
        if (currentConvo) {
          const userMessage: Message = { id: nanoid(), content: action.payload.userMessage };
          const modelMessage: Message = { id: nanoid(), content: action.payload.modelResponse };
          currentConvo.messages.push(userMessage, modelMessage);
          
          if (currentConvo.messages.length === 2) {
            const firstUserMessage = action.payload.userMessage.parts
                ? action.payload.userMessage.parts.map(p => 'text' in p ? p.text : '').join(' ')
                : '<UNDEFINED>';

            currentConvo.title = firstUserMessage.substring(0, 40) + (firstUserMessage.length > 40 ? '...' : '');
          }
        }
        state.isLoading = false;
        saveStateToLocalStorage(state);
      })
      .addCase(generateContent.rejected, (state, action) => {
        const currentConvo = state.conversations.find((c) => c.id === state.currentConversationId);
        if (currentConvo && action.payload) {
          const { userMessage, errorMessage, finishReason } = action.payload;
          
          const userMessageWithError: Message = {
            id: nanoid(),
            content: userMessage,
            isErrorAssociated: true
          };

          const errorText = `**Error:** ${errorMessage}${finishReason ? `\n**Reason:** ${finishReason}` : ''}`;
          const errorContent: Content = {
            role: 'model',
            parts: [{ text: errorText }],
          };
          const modelErrorMessage: Message = {
            id: nanoid(),
            content: errorContent,
            isErrorAssociated: true
          };

          currentConvo.messages.push(userMessageWithError, modelErrorMessage);
        }
        state.isLoading = false;
        saveStateToLocalStorage(state);
      });
  },
});

export const { startNewChat, switchConversation, deleteConversation, setChatState, addOrUpdateConversationState, updateTokenCount, toggleTroubleshootingMode } = chatSlice.actions;

// Selectors
export const selectIsLoading = (state: RootState) => state.chat.isLoading;
export const selectConversations = (state: RootState) => state.chat.conversations;
export const selectCurrentConversationId = (state: RootState) => state.chat.currentConversationId;
export const selectTroubleshootingMode = (state: RootState) => state.chat.troubleshootingMode;

export const selectCurrentConversation = (state: RootState) => {
  return state.chat.conversations.find((c) => c.id === state.chat.currentConversationId) || null;
};

export default chatSlice.reducer;
