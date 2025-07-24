import React from 'react';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { selectApiKey, setApiKey } from '../state/settingsSlice';
import { useTranslation } from '../hooks/useTranslation';
import { Panel } from './Panel';

export function ApiKeyPanel() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const apiKey = useAppSelector(selectApiKey);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setApiKey(e.target.value));
  };

  return (
    <Panel orientation='vertical' className="flex-shrink-0 m-4">
      <label
        htmlFor="api-key"
        className="text-sm font-semibold text-slate-600 text-justify"
      >
        {t('apiKeyPanel.label')}
      </label>
      <input
        id="api-key"
        type="password"
        value={apiKey || ''}
        onChange={handleApiKeyChange}
        placeholder={t('apiKeyPanel.placeholder')}
        className="w-full px-3 py-2 text-center border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm"
      />
      {!apiKey && <p className="text-xs text-red-500">{t('apiKeyPanel.requiredError')}</p>}
    </Panel>
  );
}