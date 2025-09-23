import React, { useState, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { PlusIcon, FileIcon } from '../shared/Icons';
import { determineMimeType } from '../../utils/mimeTypeUtils';

// Define and export the ManagedFile type for reusability
export interface ManagedFile {
  file: File;
  base64: string;
  mimeType: string;
}

// Define the props for the component
interface FileUploadManagerProps {
  isLoading: boolean;
  onFilesChange: (files: ManagedFile[]) => void;
}

// Define the shape of the imperative handle
export interface FileUploadManagerRef {
  reset: () => void;
}

export const FileUploadManager = forwardRef<FileUploadManagerRef, FileUploadManagerProps>(({ isLoading, onFilesChange }, ref) => {
  const [isDragging, setIsDragging] = useState(false);
  const [managedFiles, setManagedFiles] = useState<ManagedFile[]>([]);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  // Notify parent component of file changes
  const notifyParent = useCallback((files: ManagedFile[]) => {
    onFilesChange(files);
  }, [onFilesChange]);

  // Imperative handle to allow parent to reset the state
  useImperativeHandle(ref, () => ({
    reset() {
      setManagedFiles([]);
      setFileErrors([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      notifyParent([]);
    },
  }));

  const handleFileSelect = (newFiles: File[]) => {
    const filePromises = newFiles.map(file => {
      return new Promise<ManagedFile | null>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            file,
            mimeType: file.type == '' ? determineMimeType(file) : file.type,
            base64: (reader.result as string).split(',')[1],
          });
        };
        reader.onerror = () => {
          setFileErrors(prev => [...prev, `Error reading file: ${file.name}`]);
          resolve(null);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then(results => {
      const newManagedFiles = results.filter((result): result is ManagedFile => result !== null);
      setManagedFiles(prev => {
        const updatedFiles = [...prev, ...newManagedFiles];
        notifyParent(updatedFiles);
        return updatedFiles;
      });
    });
  };

  const handleFileRemove = (fileToRemove: File) => {
    setManagedFiles(prev => {
      const updatedFiles = prev.filter(mf => mf.file !== fileToRemove);
      notifyParent(updatedFiles);
      return updatedFiles;
    });
  };

  const handleRemoveAll = () => {
    setManagedFiles([]);
    notifyParent([]);
  };

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
      handleFileSelect(files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      handleFileSelect(files);
    }
  };

  return (
    <>
      <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" className="prompting-panel__file-upload" onChange={handleFileChange} disabled={isLoading} multiple />
      <div
        className={`prompting-panel__dropzone ${isDragging ? 'prompting-panel__dropzone--dragging' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <PlusIcon className="prompting-panel__remove-all-icon" />
        <p className="prompting-panel__dropzone-text">{t('promptingPanel.dropzone')}</p>
      </div>

      {managedFiles.length > 0 && (
        <div className="prompting-panel__file-preview-grid">
          <div className="prompting-panel__remove-all-container">
            <button type="button" className="prompting-panel__remove-all-button" onClick={handleRemoveAll} disabled={isLoading}>
              &times;
            </button>
          </div>
          {managedFiles.map(({ file }, index) => (
            <div key={index} className="prompting-panel__file-tile">
              <div className="prompting-panel__file-info">
                <FileIcon className="prompting-panel__file-icon" />
                <span className="prompting-panel__file-name">{file.name}</span>
              </div>
              <button type="button" className="prompting-panel__file-remove-button" onClick={() => handleFileRemove(file)} disabled={isLoading}>
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {fileErrors.map((error, index) => (
        <p key={index} className="prompting-panel__error">{error}</p>
      ))}
    </>
  );
});
