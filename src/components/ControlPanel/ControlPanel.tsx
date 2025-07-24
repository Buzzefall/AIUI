import { Panel } from '../shared/Panel';
import { HistoryPanel } from '../HistoryPanel/HistoryPanel';
import { Separator } from '../shared/Separator';
import { ImportExportPanel } from './ImportExportPanel';
import { LocaleSwitcher } from './LocaleSwitcher';
import { ApiKeyPanel } from './ApiKeyPanel';

export function ControlPanel() {
  return (
    <Panel orientation="vertical" className="w-1/6 flex-shrink-0">
      <HistoryPanel />
      <ApiKeyPanel />
      <ImportExportPanel />
      <Separator />
      <LocaleSwitcher />
    </Panel>
  );
}