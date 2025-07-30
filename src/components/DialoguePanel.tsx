import { Panel } from "./shared/Panel";
import { ResponsePanel } from "./ResponsePanel/ResponsePanel";
import { PromptingPanel } from "./PromptingPanel/PromptingPanel";
import { Separator } from "./shared/Separator";

export function DialoguePanel() {
    return (
        <Panel orientation="vertical" className="flex-grow h-full p-4 overflow-hidden">
            <ResponsePanel />
            <Separator />
            <PromptingPanel />
        </Panel>
    );
}