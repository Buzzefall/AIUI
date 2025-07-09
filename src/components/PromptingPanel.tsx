import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { selectCurrentConversationId, selectIsLoading } from '../state/chatSlice';
import { generateContent } from '../state/chatThunks';
import { useFileConverter } from '../hooks/useFileConverter';
import { selectApiKey } from '../state/settingsSlice';

const PdfIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V8.414a1 1 0 00-.293-.707l-4-4A1 1 0 0011.586 3H4zm4 8a1 1 0 100 2h4a1 1 0 100-2H8z" clipRule="evenodd" />
  </svg>
);

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-400 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

export function PromptingPanel() {
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
        alert('Only image and PDF files are supported.');
        resetForm();
      }
    }
  }, [selectedFile, convertFile]);

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
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt here... For example: 'What is in this image?'"
        className="w-full p-3 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:bg-slate-100 text-base"
        disabled={isLoading}
        rows={4}
        onClick={(e) => e.stopPropagation()} // Prevent form's onClick from firing
      />

      <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*,application/pdf" disabled={isLoading} />

      {selectedFile && (
        <div className="p-2 bg-slate-100 rounded-md flex items-center justify-between animate-fade-in border border-slate-200">
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
          className={`flex flex-col items-center justify-center group p-4 border-2 border-dashed rounded-xl 
          cursor-pointer hover:border-primary transition-colors 
          ${isDragging ? 'border-primary bg-primary/5' : 'border-slate-300'}`
          }
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <PlusIcon />
          <p className="text-slate-400 text-sm mt-2 group-hover:text-primary transition-colors">Drag & drop or click to attach a file</p>
        </div>
      )}

      <div className="flex justify-end">
        <button type="submit" disabled={isLoading || !prompt.trim() || !apiKey} className="bg-primary text-white py-2 px-6 rounded-md font-semibold hover:bg-primary-dark disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">
          {isLoading ? 'Generating...' : 'Send'}
        </button>
      </div>
    </form>
  );
}