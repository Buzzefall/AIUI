import { useAppDispatch, useAppSelector } from '../state/hooks';
import {
  Conversation,
  selectConversations,
  selectCurrentConversationId,
  selectIsLoading,
  startNewChat,
  switchConversation,
  deleteConversation,
} from '../state/chatSlice';
import { useContextMenu } from '../hooks/useContextMenu';
import { ContextMenu /*, MenuItem*/ } from './ContextMenu';
import { downloadFile, formatToJson, formatToMarkdown, sanitizeFilename } from '../utils/exportUtils';

const MoreOptionsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
  </svg>
);

export function HistoryPanel() {
  const dispatch = useAppDispatch();
  const conversations = useAppSelector(selectConversations);
  const currentId = useAppSelector(selectCurrentConversationId);
  const isLoading = useAppSelector(selectIsLoading);
  const { isOpen, position, contextData, openMenu, closeMenu } = useContextMenu();

  const handleContextMenu = (e: React.MouseEvent, conversation: Conversation) => {
    openMenu(e, conversation);
  };

  return (
    <aside className="flex flex-col h-full">
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
                onClick={() => !isOpen && dispatch(switchConversation(convo.id))}
                onContextMenu={(e) => handleContextMenu(e, convo)}
                disabled={isLoading}
                className={`w-full text-left text-sm p-2 rounded-md flex justify-between items-center transition-colors ${
                  currentId === convo.id
                    ? 'bg-primary/20 text-primary-dark font-semibold'
                    : 'text-slate-700 font-medium hover:bg-slate-200'
                }`}
              >
                <span className="truncate pr-2">{convo.title}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); handleContextMenu(e, convo); }}
                  className="p-1 rounded-full hover:bg-slate-300/50 text-slate-500"
                  title="More options"
                >
                  <MoreOptionsIcon />
                </button>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <ContextMenu
        isOpen={isOpen}
        position={position}
        onClose={closeMenu}
        items={[
          {
            label: 'Export',
            items: [
              {
                label: 'as Markdown (.md)',
                onClick: () => {
                  const convo = contextData as Conversation;
                  if (convo) {
                    const content = formatToMarkdown(convo);
                    downloadFile(content, `${sanitizeFilename(convo.title)}.md`, 'text/markdown');
                  }
                  closeMenu();
                },
              },
              {
                label: 'as JSON (.json)',
                onClick: () => {
                  const convo = contextData as Conversation;
                  if (convo) {
                    const content = formatToJson(convo);
                    downloadFile(content, `${sanitizeFilename(convo.title)}.json`, 'application/json');
                  }
                  closeMenu();
                },
              },
            ],
          },
          { label: '---' }, // This will be rendered as a separator
          {
            label: 'Delete',
            onClick: () => {
              const convo = contextData as Conversation;
              if (convo && window.confirm(`Are you sure you want to delete "${convo.title}"?`)) {
                dispatch(deleteConversation(convo.id));
              }
              closeMenu();
            },
          },
        ]}
      />
      <div className="p-2 text-xs text-center text-slate-400">
        Chat history is saved in your browser.
      </div>
    </aside>
  );
}