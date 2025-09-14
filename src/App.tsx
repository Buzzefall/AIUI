import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './state/hooks';
import { selectCurrentConversationId, startNewChat } from './state/chatSlice';
import { ConversationPanel } from './components/ConversationPanel';
import { useTranslation } from './hooks/useTranslation';
import { Panel } from './components/shared/Panel';
import './App.css';


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

  const containerClasses = "h-screen max-w-[90vw] max-h-[95vh] ";
  const borderClasses = "border-slate-300 shadow-lg shadow-slate-200 border rounded-lg p-1";
  const textClasses = "font-sans text-slate-800";

  return (
    <div className="h-screen flex items-center justify-center">
      <Panel orientation="vertical" className={`w-fit ${containerClasses} ${borderClasses} ${textClasses}`}>
        <ConversationPanel />
      </Panel>
    </div>
  );
}

export default App;