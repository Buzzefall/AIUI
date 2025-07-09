import { useState } from "react";
import { useTranslation } from "../../hooks/useTranslation";

const PdfIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V8.414a1 1 0 00-.293-.707l-4-4A1 1 0 0011.586 3H4zm4 8a1 1 0 100 2h4a1 1 0 100-2H8z" clipRule="evenodd" />
  </svg>
);

export const FilePreview = ({ mimeType, data, isModel }: { mimeType: string; data: string; isModel: boolean }) => {
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
