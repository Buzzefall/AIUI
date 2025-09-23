import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { useTranslation } from "../../hooks/useTranslation";
import { PdfIcon } from "../shared/Icons";
import styles from './MessagePart.module.css';

interface FilePreviewProps {
  mimeType: string;
  data: string;
  isModel: boolean;
}

export const ChatFilePreview = ({ mimeType, data, isModel }: FilePreviewProps) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const alignmentClass = isModel ? 'self-start' : 'self-end';

  const handleToggleExpand = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Prevent deep event propagation causing UI stuttering, ruining CSS transition animations and activation of unintended handlers 
    e.stopPropagation();
    
    if (mimeType.startsWith('image/') || mimeType.startsWith('text/')) {
      setIsExpanded(!isExpanded);
    } else {
      alert(t('filePreview.unsupported', { mimeType }));
    }
  };

  if (mimeType.startsWith('image/')) {
    return (
      <div
        onClick={handleToggleExpand}
        className={`m-4 cursor-pointer ${alignmentClass} hover:border-indigo-500/75 transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-w-full' : 'max-w-xs'
        }`}
      >
        <img
          src={`data:${mimeType};base64,${data}`}
          alt={t('filePreview.userUploadAlt')}
          className="rounded-md block w-full"
        />
      </div>
    );
  }

  if (mimeType === 'application/pdf') {
    return (
      <div
        onClick={handleToggleExpand}
        className={`m-4 p-3 bg-slate-200 rounded-md flex items-center gap-3 max-w-xs border border-slate-300 hover:border-indigo-500/75 transition-colors cursor-pointer ${alignmentClass}`}
      >
        <PdfIcon />
        <div className="text-slate-700 overflow-hidden">
          <p className="text-sm font-semibold truncate">{t('filePreview.pdfDocument')}</p>
          <p className="text-xs">{t('filePreview.pdfDetails')}</p>
        </div>
      </div>
    );
  }
  
  if (mimeType.startsWith('text/')) {
    const decodedText = atob(data);
    return (
      <div
        onClick={handleToggleExpand}
        className={`relative m-4 p-4 bg-slate-100 rounded-md border-2 border-slate-300 hover:border-indigo-500/75 transition-all duration-300 ease-in-out cursor-pointer ${alignmentClass} ${
          isExpanded ? 'max-w-2xl' : 'max-w-xs'
        }`}
      >
        <div className={`prose prose-sm max-w-none overflow-hidden ${isExpanded ? 'max-h-96 overflow-scroll' : 'max-h-40'}`}>
          <ReactMarkdown
            className={`${styles.textMarkdown} ${styles.previewMarkdown}`}
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {decodedText}
          </ReactMarkdown>
        </div>
        {!isExpanded && decodedText.length > 200 && <div className="h-8 w-full bg-gradient-to-t from-slate-100 absolute bottom-4 left-0"></div>}
      </div>
    );
  }

  return null; // Or a generic fallback for other file types
};
