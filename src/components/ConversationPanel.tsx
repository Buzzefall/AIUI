import { DialoguePanel } from './DialoguePanel';
import { Separator } from './shared/Separator';
import { Panel } from './shared/Panel';
import { ControlPanel } from './ControlPanel/ControlPanel';

export function ConversationPanel() {
  return (
    <Panel orientation="horizontal" className="h-full bg-white min-h-0 overflow-hidden">
      <ControlPanel />
      <Separator orientation="vertical" />
      <DialoguePanel />
    </Panel>
  );
}