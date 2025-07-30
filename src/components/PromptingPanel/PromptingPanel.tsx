import React, { useRef, useState } from 'react';

// Import the refactored component and its types
import { FileUploadManager, ManagedFile, FileUploadManagerRef } from './FileUploadManager';
import { PromptInput } from './PromptInput';

import { useAppDispatch, useAppSelector } from '../../state/hooks';

import { updateTokenCountThunk } from '../../state/updateTokenCountThunk';
import { generateContent as generateContentThunk } from '../../state/chatThunks';

import { selectApiKey } from '../../state/settingsSlice';
import { selectPrompt, setPrompt } from '../../state/promptSlice';
import { selectCurrentConversationId, selectIsLoading } from '../../state/chatSlice';

import { TokenCountDisplay } from '../TokenCountDisplay/TokenCountDisplay';

import './PromptingPanel.css';

// The ManagedFile interface is now imported from FileUploadManager

export function PromptingPanel() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const apiKey = useAppSelector(selectApiKey);
  const currentConversationId = useAppSelector(selectCurrentConversationId);
  const prompt = useAppSelector(selectPrompt);
  const formRef = useRef<HTMLFormElement>(null);

  // State to hold the files, updated by the child component
  const [managedFiles, setManagedFiles] = useState<ManagedFile[]>([]);
  // Create a ref for the FileUploadManager component
  const fileUploadManagerRef = useRef<FileUploadManagerRef>(null);
  // The handleFilesChange callback updates the parent's state
  const handleFilesChange = (files: ManagedFile[]) => {
    setManagedFiles(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim() || isLoading || !apiKey || !currentConversationId) return;

    const filesToSubmit = managedFiles.map(({ mimeType, base64 }) => ({ mimeType, base64 }));
    await dispatch(generateContentThunk({ prompt, files: filesToSubmit }));
    await dispatch(updateTokenCountThunk({ conversationId: currentConversationId }));
    
    dispatch(setPrompt(''));

    // Call the reset method on the child component
    fileUploadManagerRef.current?.reset();
  };

  return (
    <div className={"prompting-panel"}>
      <div className="prompting-panel__header">
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
          onPromptChange={(newPrompt) => dispatch(setPrompt(newPrompt))}
        />

        <FileUploadManager
          ref={fileUploadManagerRef}
          isLoading={isLoading}
          onFilesChange={handleFilesChange}
        />

        <TokenCountDisplay />
      </form>
    </div>
  );
}
