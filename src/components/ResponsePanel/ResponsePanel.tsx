import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Content, Part } from '@google/generative-ai';
import { useAppSelector } from '../../state/hooks';
import { selectCurrentConversation, selectError, selectIsLoading } from '../../state/chatSlice';
import { LoadingSpinner } from './LoadingSpinner';
import { FilePreview } from './FilePreview';

const ClipboardIcon = ({ copied }: { copied: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    {copied ? (
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    )}
  </svg>
);

const ChatMessage = ({ message }: { message: Content }) => {
  const isModel = message.role === 'model';
  const [copied, setCopied] = useState(false);

  const renderPart = (part: Part, index: number) => {
    if ('text' in part) {
      return (
        <ReactMarkdown key={index} className="prose prose-base max-w-none prose-a:text-primary hover:prose-a:text-primary-dark" remarkPlugins={[remarkGfm]}>
          {part.text}
        </ReactMarkdown>
      );
    }
    if ('inlineData' in part && part.inlineData) {
      return <FilePreview key={index} mimeType={part.inlineData.mimeType} data={part.inlineData.data} isModel={isModel} />;
    }
    return null;
  };

  const handleCopy = () => {
    const textToCopy = message.parts
      .map(p => ('text' in p ? p.text : ''))
      .join('\n');

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={`group flex items-start gap-4 my-4 ${!isModel && 'flex-row-reverse'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${isModel ? 'bg-primary' : 'bg-slate-400'}`}>
        {isModel ? 'G' : 'U'}
      </div>
      <div className={`relative p-4 rounded-lg max-w-2xl flex flex-col ${isModel ? 'bg-slate-100' : 'bg-primary/10'}`}>
        {isModel && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-1 rounded-md text-slate-400 hover:bg-slate-200 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Copy to clipboard"
          >
            <ClipboardIcon copied={copied} />
          </button>
        )}
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