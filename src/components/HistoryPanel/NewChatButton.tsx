import { useTranslation } from '../../hooks/useTranslation';

interface NewChatButtonProps {
  isLoading: boolean;
  onClick: () => void;
}

export function NewChatButton({ isLoading, onClick }: NewChatButtonProps) {
  const { t } = useTranslation();

  return (
    <div className="history-panel__new-chat-button-container">
      <button
        onClick={onClick}
        disabled={isLoading}
        className="history-panel__new-chat-button"
      >
        {t('historyPanel.newChat')}
      </button>
    </div>
  );
}