import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { selectTroubleshootingMode, toggleTroubleshootingMode } from '../../state/chatSlice';
import { useTranslation } from '../../hooks/useTranslation';

export function TroubleshootingModeToggle() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const troubleshootingMode = useAppSelector(selectTroubleshootingMode);

  const handleToggle = () => {
    dispatch(toggleTroubleshootingMode());
  };

  return (
    <div className="flex items-center justify-between p-2 bg-slate-100 rounded-md">
      <label htmlFor="troubleshooting-mode" className="text-sm font-medium text-slate-700">
        {t('controlPanel.troubleshootingMode')}
      </label>
      <div
        onClick={handleToggle}
        className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${
          troubleshootingMode ? 'bg-primary' : 'bg-slate-300'
        }`}
      >
        <span
          className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
            troubleshootingMode ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </div>
      <input
        type="checkbox"
        id="troubleshooting-mode"
        className="sr-only"
        checked={troubleshootingMode}
        onChange={handleToggle}
      />
    </div>
  );
}
