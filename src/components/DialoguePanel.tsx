import { Panel } from "./Panel";
import { ResponsePanel } from "./ResponsePanel/ResponsePanel";
import { PromptingPanel } from "./PromptingPanel/PromptingPanel";
import { Separator } from "./Separator";

export function DialoguePanel() {
    return (
        <Panel orientation="vertical" className="flex-grow h-full p-4">
            <ResponsePanel />
            <Separator />
            <PromptingPanel />
        </Panel>
    );
}