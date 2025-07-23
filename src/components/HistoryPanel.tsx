import { ExportPanel } from './ExportPanel';
import { LocaleSwitcher } from './LocaleSwitcher';
import { ContextMenu /*, MenuItem*/ } from './ContextMenu';
import { MoreOptionsIcon } from './Icons';

import { useContextMenu } from '../hooks/useContextMenu';
import { useTranslation } from '../hooks/useTranslation';
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

import { downloadFile, formatToJson, formatToMarkdown, sanitizeFilename } from '../utils/exportUtils';

export function HistoryPanel() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const conversations = useAppSelector(selectConversations);
  const currentId = useAppSelector(selectCurrentConversationId);
  const isLoading = useAppSelector(selectIsLoading);
  const { menuState, openMenu, closeMenu } = useContextMenu(); // isOpen, position, contextData,

  const handleContextMenu = (e: React.MouseEvent, conversation: Conversation) => {
    openMenu(e, conversation);
  };

  return (
    <aside className="flex flex-col h-full w-1/6 flex-shrink-0">
      <div className="p-2">
        <button
          onClick={() => dispatch(startNewChat(t('chat.newChatTitle')))}
          disabled={isLoading}
          className="w-full bg-primary text-white py-2 px-4 rounded-md font-semibold hover:bg-primary-dark disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors text-base"
        >
          {t('historyPanel.newChat')}
        </button>
      </div>
      <nav className="flex-grow overflow-y-auto">
        <ul>
          {conversations.map((convo) => (
            <li key={convo.id} className="p-1">
              <button
                onClick={() => !menuState.isOpen && dispatch(switchConversation(convo.id))}
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
                  title={t('historyPanel.moreOptionsTitle')}
                >
                  <MoreOptionsIcon />
                </button>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <ContextMenu
        isOpen={menuState.isOpen}
        position={menuState.position}
        onClose={closeMenu}
        items={[
          {
            label: t('historyPanel.export'),
            items: [
              {
                label: t('historyPanel.exportMarkdown'),
                onClick: () => {
                  const convo = menuState.contextData as Conversation;
                  if (convo) {
                    const content = formatToMarkdown(convo);
                    downloadFile(content, `${sanitizeFilename(convo.title)}.md`, 'text/markdown');
                  }
                  closeMenu();
                },
              },
              {
                label: t('historyPanel.exportJson'),
                onClick: () => {
                  const convo = menuState.contextData as Conversation;
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
            label: t('historyPanel.delete'),
            onClick: () => {
              const convo = menuState.contextData as Conversation;
              if (convo && window.confirm(t('historyPanel.deleteConfirm', { title: convo.title }))) {
                dispatch(deleteConversation(convo.id));
              }
              closeMenu();
            },
          },
        ]}
      />
      <div className="p-2 text-xs text-center text-slate-400 space-y-2">
        <p>{t('historyPanel.footer')}</p>
        <ExportPanel />
        <LocaleSwitcher />
      </div>
    </aside>
  );
}