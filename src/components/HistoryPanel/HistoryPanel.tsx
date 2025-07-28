import { useContextMenu } from '../../hooks/useContextMenu';
import { useTranslation } from '../../hooks/useTranslation';
import {
  Conversation,
  deleteConversation,
  selectConversations,
  selectCurrentConversationId,
  selectIsLoading,
  startNewChat,
  switchConversation,
} from '../../state/chatSlice';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { downloadFile, formatToJson, formatToMarkdown, sanitizeFilename } from '../../utils/exportUtils';
import { ConversationList } from './ConversationList';
import './HistoryPanel.css';
import { NewChatButton } from './NewChatButton';

export function HistoryPanel() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const conversations = useAppSelector(selectConversations);
  const currentId = useAppSelector(selectCurrentConversationId);
  const isLoading = useAppSelector(selectIsLoading);
  const { menuState, openMenu, closeMenu } = useContextMenu();

  const handleNewChat = () => {
    dispatch(startNewChat(t('chat.newChatTitle')));
  };

  const handleSwitchConversation = (id: string) => {
    dispatch(switchConversation(id));
  };

  const handleDeleteConversation = (id: string) => {
    dispatch(deleteConversation(id));
  };

  const handleExportMarkdown = (convo: Conversation) => {
    const content = formatToMarkdown(convo);
    downloadFile(content, `${sanitizeFilename(convo.title)}.md`, 'text/markdown');
  };

  const handleExportJson = (convo: Conversation) => {
    const content = formatToJson(convo);
    downloadFile(content, `${sanitizeFilename(convo.title)}.json`, 'application/json');
  };

  return (
    <aside className="history-panel">
      <NewChatButton isLoading={isLoading} onClick={handleNewChat} />
      <ConversationList
        conversations={conversations}
        currentId={currentId}
        isLoading={isLoading}
        onSwitchConversation={handleSwitchConversation}
        onDeleteConversation={handleDeleteConversation}
        onOpenContextMenu={openMenu}
        menuState={menuState}
        onCloseContextMenu={closeMenu}
        onExportMarkdown={handleExportMarkdown}
        onExportJson={handleExportJson}
      />
    </aside>
  );
}