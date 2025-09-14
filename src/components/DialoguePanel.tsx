import { Panel } from "./shared/Panel";
import { ResponsePanel } from "./ResponsePanel/ResponsePanel";
import { PromptingPanel } from "./PromptingPanel/PromptingPanel";
import { Separator } from "./shared/Separator";

export function DialoguePanel() {
  return (
    <Panel orientation="vertical" className="h-full p-4 w-auto">
      <ResponsePanel />
      <Separator />
      <PromptingPanel />
    </Panel>
  );
}