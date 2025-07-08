import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Content, Part } from '@google/generative-ai';
import { useAppSelector } from '../state/hooks';
import { selectCurrentConversation, selectError, selectIsLoading } from '../state/chatSlice';
import { LoadingSpinner } from './LoadingSpinner';

const ChatMessage = ({ message }: { message: Content }) => {
  const isModel = message.role === 'model';

  const renderPart = (part: Part, index: number) => {
    if ('text' in part) {
      return (
        <ReactMarkdown key={index} className="prose max-w-none prose-a:text-primary hover:prose-a:text-primary-dark" remarkPlugins={[remarkGfm]}>
          {part.text}
        </ReactMarkdown>
      );
    }
    if ('inlineData' in part && part.inlineData) {
      const { mimeType, data } = part.inlineData;
      return <img key={index} src={`data:${mimeType};base64,${data}`} alt="User upload" className="max-w-xs rounded-md my-2" />;
    }
    return null;
  };

  return (
    <div className={`flex items-start gap-4 my-4 ${!isModel && 'flex-row-reverse'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${isModel ? 'bg-primary' : 'bg-slate-400'}`}>
        {isModel ? 'G' : 'U'}
      </div>
      <div className={`p-4 rounded-lg max-w-2xl ${isModel ? 'bg-slate-100' : 'bg-primary/10'}`}>
        {message.parts.map(renderPart)}
      </div>
    </div>
  );
};

export function ResponsePanel() {
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
    <div className="h-full flex flex-col">
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
          <p className="font-bold">An error occurred:</p>
          <pre className="whitespace-pre-wrap text-sm">{error}</pre>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}