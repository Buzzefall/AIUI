import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import ReactMarkdown from 'react-markdown';
import { Part } from '@google/generative-ai';
import { ChatFilePreview } from './ChatFilePreview';

interface ChatMessagePartProps {
  part: Part;
  isModel: boolean;
}

export function ChatMessagePart({ part, isModel }: ChatMessagePartProps) {
  if ('text' in part) {
    return (
      <ReactMarkdown className="prose prose-base max-w-none prose-a:text-primary hover:prose-a:text-primary-dark" remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
        {part.text}
      </ReactMarkdown>
    );
  }

  if ('inlineData' in part && part.inlineData) {
    return <ChatFilePreview mimeType={part.inlineData.mimeType} data={part.inlineData.data} isModel={isModel} />;
  }
  
  return null;
}