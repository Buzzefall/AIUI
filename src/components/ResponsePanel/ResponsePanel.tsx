import { useEffect, useRef } from 'react';
import { useAppSelector } from '../../state/hooks';
import { selectCurrentConversation, selectError, selectIsLoading } from '../../state/chatSlice';
import { LoadingSpinner } from './LoadingSpinner';
import { useTranslation } from '../../hooks/useTranslation';
import { ChatMessage } from './ChatMessage';

export function ResponsePanel() {
  const { t } = useTranslation();
  const currentConversation = useAppSelector(selectCurrentConversation);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages, isLoading]);

  return (
    <div className="flex-grow flex flex-col overflow-y-auto">
      {currentConversation?.messages.map((msg, index) => (
        <ChatMessage key={index} message={msg} />
      ))}

      {isLoading && (
        <div className="flex items-start gap-4 my-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold bg-primary">G</div>
          <div className="p-4 rounded-lg bg-slate-100">
            <LoadingSpinner />
          </div>
        </div>
      )}

      {error && (
        <div className="text-red-600 bg-red-50 p-4 rounded-md my-4">
          <p className="font-bold">{t('responsePanel.errorTitle')}</p>
          <pre className="whitespace-pre-wrap text-sm">{error}</pre>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}