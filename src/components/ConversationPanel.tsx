import { DialoguePanel } from './DialoguePanel';
import { Separator } from './shared/Separator';
import { Panel } from './shared/Panel';
import { ControlPanel } from './ControlPanel/ControlPanel';

export function ConversationPanel() {
  return (
    <Panel orientation="horizontal" className="w-full bg-white p-4 flex flex-grow min-h-0 overflow-hidden">
      <ControlPanel />
      <Separator orientation="vertical" />
      <DialoguePanel />
    </Panel>
  );
}