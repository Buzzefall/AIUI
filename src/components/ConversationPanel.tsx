import { DialoguePanel } from './DialoguePanel';
import { Separator } from './Separator';
import { Panel } from './Panel';
import { ControlPanel } from './ControlPanel';

export function ConversationPanel() {
  return (
    <Panel orientation="horizontal" className="w-full bg-white p-4 flex flex-grow min-h-0">
      <ControlPanel />
      <Separator orientation="vertical" />
      <DialoguePanel />
    </Panel>
  );
}