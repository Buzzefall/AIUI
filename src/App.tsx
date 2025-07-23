import { useEffect } from 'react';
import { ApiKeyPanel } from './components/ApiKeyPanel';
import { useAppDispatch, useAppSelector } from './state/hooks';
import { selectCurrentConversationId, startNewChat } from './state/chatSlice';
import { ConversationPanel } from './components/ConversationPanel';
import { useTranslation } from './hooks/useTranslation';
import { Separator } from './components/Separator';
import { Panel } from './components/Panel';

function App() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const currentConversationId = useAppSelector(selectCurrentConversationId);

  // On initial load, if there's no active chat, create one.
  useEffect(() => {
    if (!currentConversationId) {
      dispatch(startNewChat(t('chat.newChatTitle')));
    }
  }, [currentConversationId, dispatch, t]);

  return (
    <Panel orientation="vertical" className="h-screen border border-slate-100 rounded-2xl shadow-xl font-sans text-slate-800">
      <ConversationPanel />
    </Panel>
  );
}

export default App;