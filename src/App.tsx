import { useEffect } from 'react';
import { ApiKeyPanel } from './components/ApiKeyPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { PromptingPanel } from './components/PromptingPanel';
import { ResponsePanel } from './components/ResponsePanel';
import { useAppDispatch, useAppSelector } from './state/hooks';
import { selectCurrentConversationId, startNewChat } from './state/chatSlice';

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
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      <HistoryPanel />
      <div className="flex flex-col flex-grow h-screen">
        {/* Main Content Area */}
        <main className="flex-grow flex flex-col p-6 overflow-y-auto">
          <div className="flex-grow">
            <ResponsePanel />
          </div>
          <div className="flex-shrink-0 pt-6">
            <PromptingPanel />
          </div>
        </main>
        <div className="flex-shrink-0">
          <ApiKeyPanel />
        </div>
      </div>
    </div>
  );
}

export default App;