import { useTranslation } from '../../hooks/useTranslation';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { ConversationList } from './ConversationList';
import { NewChatButton } from './NewChatButton';
import {
  startNewChat,
  selectIsLoading,
} from '../../state/chatSlice';

import './HistoryPanel.css';

export function HistoryPanel() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);

  const handleNewChat = () => {
    dispatch(startNewChat(t('chat.newChatTitle')));
  };

  return (
    <aside className="history-panel">
      <NewChatButton isLoading={isLoading} onClick={handleNewChat} />
      <ConversationList isLoading={isLoading} />
    </aside>
  );
}