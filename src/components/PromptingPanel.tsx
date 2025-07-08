import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { selectChatState, setFileData, setPrompt } from '../state/chatSlice';
import { generateContent } from '../state/chatThunks';
import { useFileConverter } from '../hooks/useFileConverter';

export function PromptingPanel() {
  const dispatch = useAppDispatch();
  const { prompt, isLoading, fileData } = useAppSelector(selectChatState);
  const apiKey = useAppSelector((state) => state.settings.apiKey);

  // Local state to manage the File object from the input
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { base64Data, error: fileError, convertFile, reset: resetFileConverter } = useFileConverter();

  // When a file is selected in the input, start the conversion process
  useEffect(() => {
    if (selectedFile) {
      // Basic validation for images
      if (selectedFile.type.startsWith('image/')) {
        convertFile(selectedFile);
      } else {
        alert('Only image files are supported at this time.');
        handleRemoveFile();
      }
    }
  }, [selectedFile, convertFile]);

  // When the conversion is complete, update the Redux store
  useEffect(() => {
    if (base64Data && selectedFile) {
      dispatch(setFileData({ mimeType: selectedFile.type, base64: base64Data }));
    }
  }, [base64Data, selectedFile, dispatch]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    resetFileConverter();
    dispatch(setFileData(null));
    // Clear the file input value for consistency
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt || isLoading || !apiKey) return;

    dispatch(generateContent());
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4">Prompt</h2>
      <textarea
        value={prompt}
        onChange={(e) => dispatch(setPrompt(e.target.value))}
        placeholder="Enter your prompt here... For example: 'What is in this image?'"
        className="flex-grow p-3 border border-slate-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
        disabled={isLoading}
      />
      <div className="mt-4">
        <label htmlFor="file-upload" className="cursor-pointer bg-white py-2 px-4 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50">
          Upload Image
        </label>
        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" disabled={isLoading} />
        {selectedFile && (
          <div className="mt-2 text-sm text-slate-600 inline-flex items-center ml-4">
            <span>{selectedFile.name}</span>
            <button type="button" onClick={handleRemoveFile} className="ml-2 text-red-500 hover:text-red-700 font-bold" disabled={isLoading}>
              &times;
            </button>
          </div>
        )}
        {fileError && <p className="text-xs text-red-500 mt-1">{fileError}</p>}
      </div>
      <button type="submit" disabled={isLoading || !prompt || !apiKey} className="mt-6 w-full bg-indigo-600 text-white py-2.5 px-4 rounded-md font-semibold hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed">
        {isLoading ? 'Generating...' : 'Generate'}
      </button>
    </form>
  );
}