import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { selectCurrentConversationId, selectIsLoading } from '../../state/chatSlice';
import { generateContent } from '../../state/chatThunks';
import { useFileConverter } from '../../hooks/useFileConverter';
import { selectApiKey } from '../../state/settingsSlice';
import { useTranslation } from '../../hooks/useTranslation';
import { PdfIcon, ImageIcon, PlusIcon } from '../Icons';
import {
  dropzoneBaseStyles,
  getDropzoneDynamicStyles,
  selectedFilePreviewStyles,
  submitButtonStyles,
  textareaStyles,
} from './styles';

export function PromptingPanel() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const apiKey = useAppSelector(selectApiKey);
  const currentConversationId = useAppSelector(selectCurrentConversationId);

  const [prompt, setPrompt] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { base64Data, error: fileError, convertFile, reset: resetFileConverter } = useFileConverter();

  useEffect(() => {
    if (selectedFile) {
      if (selectedFile.type.startsWith('image/') || selectedFile.type === 'application/pdf') {
        convertFile(selectedFile);
      } else {
        alert(t('promptingPanel.unsupportedFile'));
        resetForm();
      }
    }
  }, [selectedFile, convertFile, t]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];

    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    setSelectedFile(file || null);
  };

  const resetForm = (e?: React.MouseEvent) => {
    e?.stopPropagation(); // Prevent file dialog from opening when removing
    setSelectedFile(null);
    resetFileConverter();

    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading || !apiKey || !currentConversationId) return;

    const filePayload =
      selectedFile && base64Data
        ? { mimeType: selectedFile.type, base64: base64Data }
        : undefined;

    await dispatch(generateContent({ prompt, file: filePayload }));

    setPrompt('');
    resetForm();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <textarea 
        className={textareaStyles}
        rows={4}
        value={prompt}
        disabled={isLoading}
        placeholder={t('promptingPanel.placeholder')}
        onClick={(e) => e.stopPropagation()} // Prevent form's onClick from firing
        onChange={(e) => setPrompt(e.target.value)}
      />

      <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*,application/pdf" disabled={isLoading} />

      {selectedFile && (
        <div className={selectedFilePreviewStyles}>
          <div className="flex items-center gap-2 overflow-hidden">
            {selectedFile.type.startsWith('image/') ? <ImageIcon /> : <PdfIcon />}
            <span className="text-sm text-slate-700 truncate">{selectedFile.name}</span>
          </div>
          <button type="button" onClick={resetForm} className="ml-2 text-slate-400 hover:text-red-500 font-bold flex-shrink-0" disabled={isLoading}>
            &times;
          </button>
        </div>
      )}

      {fileError && <p className="text-xs text-red-500">{fileError}</p>}

      {!selectedFile && (
        <div
          className={`${dropzoneBaseStyles} ${getDropzoneDynamicStyles(isDragging)}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <PlusIcon />
          <p className="text-slate-400 text-sm mt-2 group-hover:text-primary transition-colors">{t('promptingPanel.dropzone')}</p>
        </div>
      )}

      <div className="flex justify-end">
        <button type="submit" className={submitButtonStyles} disabled={isLoading || !prompt.trim() || !apiKey}>
          {isLoading ? t('promptingPanel.generating') : t('promptingPanel.send')}
        </button>
      </div>
    </form>
  );
}