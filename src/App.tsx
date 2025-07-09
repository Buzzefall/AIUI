import { useEffect } from 'react';
import { ApiKeyPanel } from './components/ApiKeyPanel';
import { useAppDispatch, useAppSelector } from './state/hooks';
import { selectCurrentConversationId, startNewChat } from './state/chatSlice';
import { ConversationPanel } from './components/ConversationPanel';

function App() {
  const dispatch = useAppDispatch();
  const currentConversationId = useAppSelector(selectCurrentConversationId);

  // On initial load, if there's no active chat, create one.
  useEffect(() => {
    if (!currentConversationId) {
      dispatch(startNewChat());
    }
  }, [currentConversationId, dispatch]);

  return (
    <div className="flex flex-col h-screen bg-slate-100 font-sans text-slate-800">
      <main className="flex-grow flex items-center justify-center p-4">
        <ConversationPanel />
      </main>
      <ApiKeyPanel />
    </div>
  );
}

export default App;