import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import ReactMarkdown from 'react-markdown';
import { Part } from '@google/genai';

import { ChatFilePreview } from './ChatFilePreview';
import styles from './MessagePart.module.css';

interface ChatMessagePartProps {
  part: Part;
  isModel: boolean;
}

const isErrorPart = (part: Part): boolean => {
  return part.text?.startsWith('**Error:**') || false;
}

export function ChatMessagePart({ part, isModel }: ChatMessagePartProps) {
  const isError = isErrorPart(part);

  if (isError) {
    return (
      <div className={styles.errorPart}>
        <ReactMarkdown
          className={`${styles.textMarkdown} prose prose-base max-w-[100%] prose-a:text-primary hover:prose-a:text-primary-dark`}
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {part.text}
        </ReactMarkdown>
      </div>
    );
  }

  if ('text' in part) {
    return (
      <ReactMarkdown
        className={`${styles.textMarkdown} prose prose-base max-w-[100%] prose-a:text-primary hover:prose-a:text-primary-dark`}
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {part.text}
      </ReactMarkdown>
    );
  }

  if ('inlineData' in part && part.inlineData) {
    return <ChatFilePreview mimeType={part.inlineData.mimeType ?? ''} data={part.inlineData.data ?? ''} isModel={isModel} />;
  }

  return null;
}
