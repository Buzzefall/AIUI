import { HistoryPanel } from './HistoryPanel';
import { PromptingPanel } from './PromptingPanel/PromptingPanel';
import { ResponsePanel } from './ResponsePanel/ResponsePanel';
import { Separator } from './Separator';

export function ConversationPanel() {
  return (
    <div className="w-full h-full bg-white rounded-2xl shadow-xl p-1 flex border border-slate-200/50 m-4 -mb-2">
      <div className="w-80 flex-shrink-0 h-full p-2">
        <HistoryPanel />
      </div>

      <div className="mx-2">
        <Separator orientation="vertical" />
      </div>

      <div className="flex-grow flex flex-col h-full overflow-hidden">
        <div className="flex-grow p-4 relative">
          <div className="absolute inset-0 overflow-y-auto">
            <ResponsePanel />
          </div>
        </div>
        <div className="flex-shrink-0 p-4 border-t border-slate-200">
          <PromptingPanel />
        </div>
      </div>
    </div>
  );
}