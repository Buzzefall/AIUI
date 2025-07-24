import { Panel } from './Panel';
import { HistoryPanel } from './HistoryPanel/HistoryPanel';
import { Separator } from './Separator';
import { ExportPanel } from './ExportPanel';
import { LocaleSwitcher } from './LocaleSwitcher';
import { ApiKeyPanel } from './ApiKeyPanel';

export function ControlPanel() {
  return (
    <Panel orientation="vertical" className="w-1/6 flex-shrink-0">
      <HistoryPanel />
      <ApiKeyPanel />
      <Separator />
      <Separator />
      <ExportPanel />
      <Separator />
      <LocaleSwitcher />
    </Panel>
  );
}