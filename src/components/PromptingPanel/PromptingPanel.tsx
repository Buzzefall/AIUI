import React, { useRef, useState } from 'react';
import { unwrapResult } from '@reduxjs/toolkit'; // <-- Import unwrapResult

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
    
    try {
      const resultAction = await dispatch(generateContentThunk({ prompt, files: filesToSubmit }));
      unwrapResult(resultAction);

      // --- Success Case ---
      // Clear inputs only if the API call was successful
      dispatch(setPrompt(''));
      fileUploadManagerRef.current?.reset();
      
      // Update token count on success
      await dispatch(updateTokenCountThunk({ conversationId: currentConversationId }));

    } catch (error) {
      // --- Failure Case ---
      // The error is already handled and added to the chat history by the rejected reducer.
      // We can optionally log it here for debugging, but we don't clear the inputs.
      console.error('Failed to generate content:', error);
    }
  };

  return (
    <div className="prompting-panel">
      {/* <div className="prompting-panel__header">
      </div> */}
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

      </form>
      <FileUploadManager
        ref={fileUploadManagerRef}
        isLoading={isLoading}
        onFilesChange={handleFilesChange}
      />

      <TokenCountDisplay />
    </div>
  );
}