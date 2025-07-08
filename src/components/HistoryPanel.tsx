import { useAppDispatch, useAppSelector } from '../state/hooks';
import {
  selectConversations,
  selectCurrentConversationId,
  selectIsLoading,
  startNewChat,
  switchConversation,
  deleteConversation,
} from '../state/chatSlice';

export function HistoryPanel() {
  const dispatch = useAppDispatch();
  const conversations = useAppSelector(selectConversations);
  const currentId = useAppSelector(selectCurrentConversationId);
  const isLoading = useAppSelector(selectIsLoading);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent switching to the conversation before deleting
    if (window.confirm('Are you sure you want to delete this chat?')) {
      dispatch(deleteConversation(id));
    }
  };

  return (
    <aside className="w-64 bg-slate-100 border-r border-slate-200 flex flex-col h-full">
      <div className="p-2 border-b border-slate-200">
        <button
          onClick={() => dispatch(startNewChat())}
          disabled={isLoading}
          className="w-full bg-primary text-white py-2 px-4 rounded-md font-semibold hover:bg-primary-dark disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors text-sm"
        >
          + New Chat
        </button>
      </div>
      <nav className="flex-grow overflow-y-auto">
        <ul>
          {conversations.map((convo) => (
            <li key={convo.id} className="p-1">
              <button
                onClick={() => dispatch(switchConversation(convo.id))}
                disabled={isLoading}
                className={`w-full text-left text-sm p-2 rounded-md flex justify-between items-center ${
                  currentId === convo.id
                    ? 'bg-primary/20 text-primary-dark font-semibold'
                    : 'hover:bg-slate-200'
                }`}
              >
                <span className="truncate pr-2">{convo.title}</span>
                <span
                  onClick={(e) => handleDelete(e, convo.id)}
                  className="text-slate-400 hover:text-red-500 font-bold px-1 rounded-full"
                  title="Delete Chat"
                >
                  &times;
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-2 text-xs text-center text-slate-400">
        Chat history is saved in your browser.
      </div>
    </aside>
  );
}