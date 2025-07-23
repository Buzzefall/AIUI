import { useState } from "react";
import { useTranslation } from "../../hooks/useTranslation";
import { PdfIcon } from "../Icons"; 

interface FilePreviewProps {
  mimeType: string;
  data: string;
  isModel: boolean;
}

export const ChatFilePreview = ({ mimeType, data, isModel }: FilePreviewProps) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const alignmentClass = isModel ? 'self-start' : 'self-end';

  const handleToggleExpand = () => {
    if (mimeType.startsWith('image/')) {
      setIsExpanded(!isExpanded);
    } else {
      alert(t('filePreview.unsupported', { mimeType }));
    }
  };

  if (mimeType.startsWith('image/')) {
    return (
      <div
        onClick={handleToggleExpand}
        className={`my-2 cursor-pointer ${alignmentClass} transition-all duration-300 ease-in-out ${
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
        className={`my-2 p-3 bg-slate-200 rounded-md flex items-center gap-3 max-w-xs border border-slate-300 hover:bg-slate-300/70 transition-colors cursor-pointer ${alignmentClass}`}
      >
        <PdfIcon />
        <div className="text-slate-700 overflow-hidden">
          <p className="text-sm font-semibold truncate">{t('filePreview.pdfDocument')}</p>
          <p className="text-xs">{t('filePreview.pdfDetails')}</p>
        </div>
      </div>
    );
  }

  return null; // Or a generic fallback for other file types
};
