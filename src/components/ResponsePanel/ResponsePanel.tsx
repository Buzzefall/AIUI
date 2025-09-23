import { useEffect, useRef } from 'react';
import { useAppSelector } from '../../state/hooks';
import { selectCurrentConversation, selectIsLoading, selectSelectedMessageIds } from '../../state/chatSlice';
import { LoadingSpinner } from './LoadingSpinner';
import { ChatMessage } from './ChatMessage';

export function ResponsePanel() {
  const currentConversation = useAppSelector(selectCurrentConversation);
  const isLoading = useAppSelector(selectIsLoading);
  const selectedMessageIds = useAppSelector(selectSelectedMessageIds); // Select selectedMessageIds here
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages, isLoading]);


  const msgMessageWidth = '85ch'; // TailwindCSS width: '65ch' + 20 (to take paddings into account)
  const msgListStyle = { width: msgMessageWidth, padding: '4rem' };

  return (
    <div className="flex-grow flex flex-col overflow-y-auto p-4 mx-auto" style={msgListStyle}>  
      {currentConversation?.messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} isSelected={selectedMessageIds.includes(msg.id)} /> // Pass isSelected prop
      ))}

      {isLoading && (
        <div className="flex items-start gap-4 my-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold bg-primary">G</div>
          <div className="p-4 rounded-lg bg-slate-100">
            <LoadingSpinner />
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
