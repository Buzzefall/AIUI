import React, { useRef, useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { PlusIcon, FileIcon } from '../Icons';

interface FileUploadManagerProps {
  isLoading: boolean;
  selectedFiles: File[];
  onFileSelect: (files: File[]) => void;
  onRemove: (file: File) => void;
  onRemoveAll: () => void;
}

export function FileUploadManager({ isLoading, selectedFiles, onFileSelect, onRemove, onRemoveAll }: FileUploadManagerProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

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

    const files = Array.from(e.dataTransfer.files);

    if (files.length) {
      onFileSelect(files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length) {
      onFileSelect(files);
    }
  };

  const dropzoneClassName = `prompting-panel__dropzone ${
    isDragging ? 'prompting-panel__dropzone--dragging' : ''
  }`.trim();

  return (
    <>
      {selectedFiles.length > 0 && (
        <div className="prompting-panel__file-preview-grid">
          <div className="prompting-panel__remove-all-container">
            <button type="button" className="prompting-panel__remove-all-button" onClick={onRemoveAll} disabled={isLoading}>
               &times;
            </button>
          </div>
          {selectedFiles.map((file, index) => (
            <div key={index} className="prompting-panel__file-tile">
              <div className="prompting-panel__file-info">
                <FileIcon className="prompting-panel__file-icon" />
                <span className="prompting-panel__file-name">{file.name}</span>
              </div>
              <button type="button" className="prompting-panel__file-remove-button" onClick={() => onRemove(file)}  disabled={isLoading}>
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" className="prompting-panel__file-upload" onChange={handleFileChange} disabled={isLoading} multiple />
      <div
        className={dropzoneClassName}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <PlusIcon />
        <p className="prompting-panel__dropzone-text">{t('promptingPanel.dropzone')}</p>
      </div>
    </>
  );
}