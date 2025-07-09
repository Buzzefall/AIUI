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
    <footer className="flex-shrink-0 p-4">
      <div className="w-1/3 mx-auto bg-white rounded-2xl shadow-xl p-4 border border-slate-200/50 flex flex-col items-center gap-2">
        <label
          htmlFor="api-key"
          className="text-lg font-semibold text-slate-600"
        >
          Gemini API Key
        </label>
        <input
          id="api-key"
          type="password"
          value={apiKey || ''}
          onChange={handleApiKeyChange}
          placeholder="Enter your API Key here"
          className="w-3/4 p-3 text-left border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm"
        />
        {!apiKey && <p className="text-xs text-red-500">API Key is required to make requests.</p>}
      </div>
    </footer>
  );
}