import { useState } from 'react';
import { Content } from '@google/generative-ai';
import { useTranslation } from '../../hooks/useTranslation';
import { ChatMessagePart } from './MessagePart';
import { ClipboardIcon } from '../shared/Icons';

interface ChatMessageProps {
  message: Content;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { t } = useTranslation();
  const isModel = message.role === 'model';
  const [copied, setCopied] = useState(false);

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
        {message.parts.map((part, index) => (
          <ChatMessagePart key={index} part={part} isModel={isModel} />
        ))}
        <button
            className="absolute bottom-2 right-2 p-1 rounded-md text-slate-400 hover:bg-slate-200 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
            title={t('responsePanel.copyToClipboard')}
            onClick={handleCopy}
          >
            <ClipboardIcon copied={copied} />
        </button>
      </div>
    </div>
  );
}