import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { Content } from '@google/genai';
import { generateContent } from './chatThunks';
import type { RootState } from './store';

// --- New Message Interface ---
export interface Message {
  id: string;
  responseTo: string | null;
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

    let loadedState = JSON.parse(serializedState);
    if (!loadedState.conversations || loadedState.conversations.length === 0) {
      return loadedState; // No conversations to migrate
    }

    // Unified migration logic
    const migratedConversations = loadedState.conversations.map((convo: any) => {
      if (!convo.messages || convo.messages.length === 0) {
        return convo;
      }

      const newMessages: Message[] = [];
      for (let i = 0; i < convo.messages.length; i += 2) {
        const userMsgData = convo.messages[i];
        const modelMsgData = convo.messages[i + 1];

        // Handle cases where message is a raw Content object or a malformed Message object
        const userContent = userMsgData.content || userMsgData;
        const userMessage: Message = {
          id: userMsgData.id || nanoid(),
          responseTo: null,
          content: userContent,
          isErrorAssociated: userMsgData.isErrorAssociated || false,
        };
        newMessages.push(userMessage);

        if (modelMsgData) {
          const modelContent = modelMsgData.content || modelMsgData;
          const modelMessage: Message = {
            id: modelMsgData.id || nanoid(),
            responseTo: userMessage.id,
            content: modelContent,
            isErrorAssociated: modelMsgData.isErrorAssociated || false,
          };
          newMessages.push(modelMessage);
        }
      }
      return { ...convo, messages: newMessages };
    });

    loadedState = { ...loadedState, conversations: migratedConversations };
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
  selectedMessageIds: string[];
}

// --- Initial State ---

const initialState: ChatState = {
  conversations: [],
  currentConversationId: null,
  isLoading: false,
  troubleshootingMode: false,
  selectedMessageIds: [],
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
        state.selectedMessageIds = []; // Clear selection when switching conversations
        saveStateToLocalStorage(state);
      }
    },

    deleteConversation: (state, action: PayloadAction<string>) => {
      state.conversations = state.conversations.filter((c) => c.id !== action.payload);
      if (state.currentConversationId === action.payload) {
        state.currentConversationId = state.conversations[0]?.id || null;
      }
      state.selectedMessageIds = [];
      saveStateToLocalStorage(state);
    },

    setChatState: (state, action: PayloadAction<ChatState>) => {
      state.conversations = action.payload.conversations;
      state.currentConversationId = action.payload.currentConversationId;
      state.selectedMessageIds = [];
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

    toggleMessageSelection: (state, action: PayloadAction<{ messageId: string }>) => {
      const { messageId } = action.payload;
      const conversation = state.conversations.find(c => c.id === state.currentConversationId);
      if (!conversation) return;

      const message = conversation.messages.find(m => m.id === messageId);
      if (!message) return;

      let partnerId: string | null = null;
      if (message.content.role === 'user') {
        const partner = conversation.messages.find(m => m.responseTo === message.id);
        partnerId = partner?.id || null;
      } else { // role is 'model'
        partnerId = message.responseTo;
      }

      const messagePairIds = [messageId];
      if (partnerId) {
        messagePairIds.push(partnerId);
      }

      const areBothSelected = messagePairIds.every(id => state.selectedMessageIds.includes(id));

      if (areBothSelected) {
        state.selectedMessageIds = state.selectedMessageIds.filter(id => !messagePairIds.includes(id));
      } else {
        state.selectedMessageIds.push(...messagePairIds.filter(id => !state.selectedMessageIds.includes(id)));
      }
    },

    deleteSelectedMessages: (state) => {
      const conversation = state.conversations.find(c => c.id === state.currentConversationId);
      if (conversation) {
        conversation.messages = conversation.messages.filter(m => !state.selectedMessageIds.includes(m.id));
        state.selectedMessageIds = [];
        saveStateToLocalStorage(state);
      }
    },

    clearMessageSelection: (state) => {
      state.selectedMessageIds = [];
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
          const userMessage: Message = { id: nanoid(), responseTo: null, content: action.payload.userMessage };
          const modelMessage: Message = { id: nanoid(), responseTo: userMessage.id, content: action.payload.modelResponse };
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
            responseTo: null,
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
            responseTo: userMessageWithError.id,
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

export const { 
  startNewChat, 
  switchConversation, 
  deleteConversation, 
  setChatState, 
  addOrUpdateConversationState, 
  updateTokenCount, 
  toggleTroubleshootingMode,
  toggleMessageSelection,
  deleteSelectedMessages,
  clearMessageSelection,
} = chatSlice.actions;

// Selectors
export const selectIsLoading = (state: RootState) => state.chat.isLoading;
export const selectConversations = (state: RootState) => state.chat.conversations;
export const selectCurrentConversationId = (state: RootState) => state.chat.currentConversationId;
export const selectTroubleshootingMode = (state: RootState) => state.chat.troubleshootingMode;
export const selectSelectedMessageIds = (state: RootState) => state.chat.selectedMessageIds;

export const selectCurrentConversation = (state: RootState) => {
  return state.chat.conversations.find((c) => c.id === state.chat.currentConversationId) || null;
};

export default chatSlice.reducer;