import React, { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { selectCurrentConversationId, selectIsLoading } from '../../state/chatSlice';
import { generateContent } from '../../state/chatThunks';
import { selectApiKey } from '../../state/settingsSlice';
import { PromptInput } from './PromptInput';
import { FileUploadManager } from './FileUploadManager';
import { ChevronUpIcon, ChevronDownIcon } from '../shared/Icons';
import './PromptingPanel.css';

interface ManagedFile {
  file: File;
  base64: string;
  mimeType: string;
}

export function PromptingPanel() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const apiKey = useAppSelector(selectApiKey);
  const currentConversationId = useAppSelector(selectCurrentConversationId);

  const [prompt, setPrompt] = useState('');
  const [managedFiles, setManagedFiles] = useState<ManagedFile[]>([]);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFileSelect = (newFiles: File[]) => {
    const filePromises = newFiles.map(file => {
      return new Promise<ManagedFile | null>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            file,
            mimeType: file.type,
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
      setManagedFiles(prev => [...prev, ...newManagedFiles]);
    });
  };

  const handleFileRemove = (fileToRemove: File) => {
    setManagedFiles(prev => prev.filter(mf => mf.file !== fileToRemove));
  };

  const resetForm = () => {
    setManagedFiles([]);
    setFileErrors([]);

    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim() || isLoading || !apiKey || !currentConversationId) return;

    const filesToSubmit = managedFiles.map(({ mimeType, base64 }) => ({ mimeType, base64 }));
    await dispatch(generateContent({ prompt, files: filesToSubmit }));
    
    setPrompt('');
    resetForm();
  };

  return (
    <div className={`prompting-panel ${isExpanded ? 'prompting-panel--expanded' : ''}`}>
      <div className="prompting-panel__header">
        <button onClick={() => setIsExpanded(!isExpanded)} className="prompting-panel__expand-button">
          {isExpanded ? <ChevronDownIcon /> : <ChevronUpIcon />}
        </button>
      </div>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="prompting-panel__form"
      >
        <PromptInput
          prompt={prompt}
          isLoading={isLoading}
          apiKey={apiKey}
          formRef={formRef}
          onPromptChange={setPrompt}
        />

        <FileUploadManager
          isLoading={isLoading}
          selectedFiles={managedFiles.map(mf => mf.file)}
          onFileSelect={handleFileSelect}
          onRemove={handleFileRemove}
          onRemoveAll={resetForm}
        />

        {fileErrors.map((error, index) => (
          <p key={index} className="prompting-panel__error">{error}</p>
        ))}
      </form>
    </div>
  );
}