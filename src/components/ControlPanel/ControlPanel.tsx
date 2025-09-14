import { Panel } from '../shared/Panel';
import { HistoryPanel } from '../HistoryPanel/HistoryPanel';
import { Separator } from '../shared/Separator';
import { ImportExportPanel } from './ImportExportPanel';
import { LocaleSwitcher } from './LocaleSwitcher';
import { ApiKeyPanel } from './ApiKeyPanel';
import { TroubleshootingModeToggle } from './TroubleshootingModeToggle';

export function ControlPanel() {
  return (
    <Panel orientation="vertical" className="w-80 flex-shrink-0 p-4 space-y-4 overflow-hidden">
      <HistoryPanel />
      <ApiKeyPanel />
      <TroubleshootingModeToggle />
      <ImportExportPanel />
      <Separator />
      <LocaleSwitcher />
    </Panel>
  );
}
