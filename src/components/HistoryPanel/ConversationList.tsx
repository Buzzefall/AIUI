import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { useTranslation } from '../../hooks/useTranslation';
import { useContextMenu } from '../../hooks/useContextMenu';
import { ContextMenu } from '../shared/ContextMenu/ContextMenu';
import { MenuItem } from '../shared/ContextMenu/MenuItem';
import { MoreOptionsIcon } from '../shared/Icons';
import { Conversation, deleteConversation, selectConversations, selectCurrentConversationId, switchConversation } from '../../state/chatSlice';
import { formatToMarkdown, downloadFile, sanitizeFilename, formatToJson } from '../../utils/exportUtils';

interface ConversationListProps {
  isLoading: boolean;
}

export function ConversationList({ isLoading }: ConversationListProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const conversations = useAppSelector(selectConversations);
  const currentId = useAppSelector(selectCurrentConversationId);
  const { menuState, openMenu, closeMenu } = useContextMenu();

  const handleSwitchConversation = (id: string) => {
    dispatch(switchConversation(id));
  };
  
  const handleDeleteConversation = () => {
    const convo = menuState.contextData as Conversation;
    
    if (convo && window.confirm(t('historyPanel.deleteConfirm', { title: convo.title }))) {
      dispatch(deleteConversation(convo.id));
    }

    closeMenu();
  };

  const handleExportMarkdown = () => {
    const convo = menuState.contextData as Conversation;

    if (convo) {
        const content = formatToMarkdown(convo);
        downloadFile(content, `${sanitizeFilename(convo.title)}.md`, 'text/markdown');
    }

    closeMenu();
  };

  const handleExportJson = () => {
    const convo = menuState.contextData as Conversation;

    if (convo) {
      const content = formatToJson(convo);
      downloadFile(content, `${sanitizeFilename(convo.title)}.json`, 'application/json');
    }

    closeMenu();
  };

  return (
    <nav className="history-panel__conversation-list">
      <ul>
        {conversations.map((convo) => (
          <li key={convo.id} className="history-panel__conversation-item">
            <button
              onClick={() => !menuState.isOpen && handleSwitchConversation(convo.id)}
              onContextMenu={(e) => openMenu(e, convo)}
              disabled={isLoading}
              className={`history-panel__conversation-button ${
                currentId === convo.id
                  ? 'history-panel__conversation-button--active'
                  : ''
              }`.trim()}
            >
              <span className="history-panel__conversation-title">{convo.title}</span>
              <div
                onClick={(e) => { e.stopPropagation(); openMenu(e, convo); }}
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
        onClose={closeMenu}
      >
        <MenuItem label={t('historyPanel.export')}>
          <MenuItem label={t('historyPanel.exportMarkdown')} onClick={handleExportMarkdown} />
          <MenuItem label={t('historyPanel.exportJson')} onClick={handleExportJson} />
        </MenuItem>
        <MenuItem label="---" />
        <MenuItem label={t('historyPanel.delete')} onClick={handleDeleteConversation} />
      </ContextMenu>
    </nav>
  );
}