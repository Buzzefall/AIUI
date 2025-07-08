import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { selectCurrentConversationId, selectIsLoading } from '../state/chatSlice';
import { generateContent } from '../state/chatThunks';
import { useFileConverter } from '../hooks/useFileConverter';
import { selectApiKey } from '../state/settingsSlice';

export function PromptingPanel() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const apiKey = useAppSelector(selectApiKey);
  const currentConversationId = useAppSelector(selectCurrentConversationId);

  const [prompt, setPrompt] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { base64Data, error: fileError, convertFile, reset: resetFileConverter } = useFileConverter();

  useEffect(() => {
    if (selectedFile) {
      // Update validation to accept both image and PDF files.
      if (selectedFile.type.startsWith('image/') || selectedFile.type === 'application/pdf') {
        convertFile(selectedFile);
      } else {
        alert('Only image and PDF files are supported.');
        resetForm();
      }
    }
  }, [selectedFile, convertFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
  };

  const resetForm = () => {
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
    <form onSubmit={handleSubmit} className="bg-white border border-slate-300 rounded-lg p-4 shadow-sm">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt here... For example: 'What is in this image?'"
        className="w-full p-2 border border-slate-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:bg-slate-100"
        disabled={isLoading}
        rows={3}
      />
      <div className="mt-2 flex justify-between items-center">
        <div>
          <label htmlFor="file-upload" className="cursor-pointer bg-white py-2 px-3 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50" title="Attach an image or PDF file">
            Attach File
          </label>
          <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*,application/pdf" disabled={isLoading} />
          {selectedFile && (
            <div className="mt-2 text-sm text-slate-600 inline-flex items-center ml-4">
              <span>{selectedFile.name}</span>
              <button type="button" onClick={resetForm} className="ml-2 text-red-500 hover:text-red-700 font-bold" disabled={isLoading}>
                &times;
              </button>
            </div>
          )}
          {fileError && <p className="text-xs text-red-500 mt-1">{fileError}</p>}
        </div>
        <button type="submit" disabled={isLoading || !prompt.trim() || !apiKey} className="bg-primary text-white py-2 px-6 rounded-md font-semibold hover:bg-primary-dark disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">
          {isLoading ? 'Generating...' : 'Send'}
        </button>
      </div>
    </form>
  );
}