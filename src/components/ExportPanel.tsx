import { useAppSelector } from '../state/hooks';
import { RootState } from '../state/store';
import { downloadFile, formatToJson, sanitizeFilename } from '../utils/exportUtils';
import { useTranslation } from '../hooks/useTranslation';

export function ExportPanel() {
  const { t } = useTranslation();
  const chatState = useAppSelector((state: RootState) => state.chat);
  const settingsState = useAppSelector((state: RootState) => state.settings);
  const localeState = useAppSelector((state: RootState) => state.locale);

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

  return (
    <div className="p-2 text-sm text-center space-y-2">
      <p className="font-semibold text-normal">{t('exportPanel.title')}</p>
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
    </div>
  );
}
