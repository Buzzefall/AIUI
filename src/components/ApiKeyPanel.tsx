import React from 'react';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { selectApiKey, setApiKey } from '../state/settingsSlice';

export function ApiKeyPanel() {
  const dispatch = useAppDispatch();
  const apiKey = useAppSelector(selectApiKey);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setApiKey(e.target.value));
  };

  return (
    <footer className="flex-shrink-0 p-4 bg-white border-t border-slate-200">
      <div className="max-w-md mx-auto">
        <label
          htmlFor="api-key"
          className="block text-sm font-medium text-slate-600 mb-1 text-center"
        >
          Gemini API Key
        </label>
        <input
          id="api-key"
          type="password"
          value={apiKey || ''}
          onChange={handleApiKeyChange}
          placeholder="Enter your API Key here"
          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {!apiKey && (
          <p className="text-xs text-red-500 mt-1 text-center">API Key is required to make requests.</p>
        )}
      </div>
    </footer>
  );
}