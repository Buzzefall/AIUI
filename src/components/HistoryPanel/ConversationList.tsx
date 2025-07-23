import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { ContextMenu } from '../ContextMenu';
import { MoreOptionsIcon } from '../Icons';
import { Conversation } from '../../state/chatSlice';

interface ConversationListProps {
  conversations: Conversation[];
  currentId: string | null;
  isLoading: boolean;
  onSwitchConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onOpenContextMenu: (e: React.MouseEvent, conversation: Conversation) => void;
  menuState: any; // TODO: Define a proper type for menuState
  onCloseContextMenu: () => void;
  onExportMarkdown: (convo: Conversation) => void;
  onExportJson: (convo: Conversation) => void;
}

export function ConversationList({
  conversations,
  currentId,
  isLoading,
  onSwitchConversation,
  onDeleteConversation,
  onOpenContextMenu,
  menuState,
  onCloseContextMenu,
  onExportMarkdown,
  onExportJson,
}: ConversationListProps) {
  const { t } = useTranslation();

  return (
    <nav className="history-panel__conversation-list">
      <ul>
        {conversations.map((convo) => (
          <li key={convo.id} className="history-panel__conversation-item">
            <button
              onClick={() => !menuState.isOpen && onSwitchConversation(convo.id)}
              onContextMenu={(e) => onOpenContextMenu(e, convo)}
              disabled={isLoading}
              className={`history-panel__conversation-button ${
                currentId === convo.id
                  ? 'history-panel__conversation-button--active'
                  : ''
              }`.trim()}
            >
              <span className="history-panel__conversation-title">{convo.title}</span>
              <div
                onClick={(e) => { e.stopPropagation(); onOpenContextMenu(e, convo); }}
                className="history-panel__more-options-button"
                title={t('historyPanel.moreOptionsTitle')}
              >
                <MoreOptionsIcon />
              </div>
            </button>
          </li>
        ))}
      </ul>
      <ContextMenu
        isOpen={menuState.isOpen}
        position={menuState.position}
        onClose={onCloseContextMenu}
        items={[
          {
            label: t('historyPanel.export'),
            items: [
              {
                label: t('historyPanel.exportMarkdown'),
                onClick: () => {
                  const convo = menuState.contextData as Conversation;
                  if (convo) {
                    onExportMarkdown(convo);
                  }
                  onCloseContextMenu();
                },
              },
              {
                label: t('historyPanel.exportJson'),
                onClick: () => {
                  const convo = menuState.contextData as Conversation;
                  if (convo) {
                    onExportJson(convo);
                  }
                  onCloseContextMenu();
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
                onDeleteConversation(convo.id);
              }
              onCloseContextMenu();
            },
          },
        ]}
      />
    </nav>
  );
}