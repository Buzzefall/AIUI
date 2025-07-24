import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../state/hooks';
import { RootState } from '../state/store';
import { downloadFile, formatToJson, sanitizeFilename } from '../utils/exportUtils';
import { useTranslation } from '../hooks/useTranslation';
import { setChatState } from '../state/chatSlice';
import { setSettingsState } from '../state/settingsSlice';
import { setLocaleState } from '../state/localeSlice';

export function ExportPanel() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const chatState = useAppSelector((state: RootState) => state.chat);
  const settingsState = useAppSelector((state: RootState) => state.settings);
  const localeState = useAppSelector((state: RootState) => state.locale);

  const [isExportMode, setIsExportMode] = useState(true);

  const exportOptions = [
    {
      label: t('exportPanel.chatHistory'),
      getData: () => chatState,
      filename: 'chat-history.json',
    },
    {
      label: t('exportPanel.settings'),
      getData: () => settingsState,
      filename: 'settings.json',
    },
    {
      label: t('exportPanel.locale'),
      getData: () => localeState,
      filename: 'locale.json',
    },
    {
      label: t('exportPanel.fullState'),
      getData: () => ({ chat: chatState, settings: settingsState, locale: localeState }),
      filename: 'full-application-state.json',
    },
  ];

  const handleExport = (getData: () => any, filename: string) => {
    const content = formatToJson(getData());
    downloadFile(content, sanitizeFilename(filename), 'application/json');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          if (importedData.chat) {
            dispatch(setChatState(importedData.chat));
          }
          if (importedData.settings) {
            dispatch(setSettingsState(importedData.settings));
          }
          if (importedData.locale) {
            dispatch(setLocaleState(importedData.locale));
          }
          alert('Import successful!');
        } catch (error) {
          console.error('Error parsing imported file:', error);
          alert('Error importing file. Please ensure it is a valid JSON.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="p-2 text-normal text-center space-y-2">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <span className="font-semibold">{t('importPanel.title')}</span>
        <label htmlFor="toggle" className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              id="toggle"
              className="sr-only"
              checked={isExportMode}
              onChange={() => setIsExportMode(!isExportMode)}
            />
            <div className="block bg-slate-600 w-14 h-8 rounded-full"></div>
            <div
              className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${
                isExportMode ? 'translate-x-full' : ''
              }`}
            ></div>
          </div>
        </label>
        <span className="font-semibold">{t('exportPanel.title')}</span>
      </div>

      {isExportMode ? (
        <div className="flex flex-col space-y-2">
          {exportOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => handleExport(option.getData, option.filename)}
              className="w-full bg-slate-200 text-slate-800 py-1 px-2 rounded-md font-medium hover:bg-slate-300 transition-colors text-sm"
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col space-y-2">
          <label htmlFor="import-file" className="w-full bg-slate-200 text-slate-800 py-1 px-2 rounded-md font-medium hover:bg-slate-300 transition-colors text-sm cursor-pointer">
            {t('importPanel.selectFile')}
          </label>
          <input
            id="import-file"
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleImport}
          />
        </div>
      )}
    </div>
  );
}

