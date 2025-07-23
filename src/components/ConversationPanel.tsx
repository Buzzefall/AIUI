import { HistoryPanel } from './HistoryPanel';
import { DialoguePanel } from './DialoguePanel';
import { Separator } from './Separator';
import { Panel } from './Panel';

export function ConversationPanel() {
  return (
    <Panel orientation="horizontal" className="w-full h-full bg-white p-4 flex">
      <HistoryPanel />
      <Separator orientation="vertical" />
      <DialoguePanel />
    </Panel>
  );
}