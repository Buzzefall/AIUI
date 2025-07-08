import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAppSelector } from '../state/hooks';
import { selectChatState } from '../state/chatSlice';
import { LoadingSpinner } from './LoadingSpinner';

export function ResponsePanel() {
  const { isLoading, response, error } = useAppSelector(selectChatState);

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4 flex-shrink-0">Response</h2>
      <div className="flex-grow p-4 border border-slate-200 rounded-md bg-slate-100/50 overflow-y-auto">
        {isLoading && <LoadingSpinner />}
        {error && (
          <div className="text-red-600 bg-red-50 p-4 rounded-md">
            <p className="font-bold">An error occurred:</p>
            <pre className="whitespace-pre-wrap text-sm">{error}</pre>
          </div>
        )}
        {response && !isLoading && (
          <ReactMarkdown className="prose max-w-none" remarkPlugins={[remarkGfm]}>
            {response}
          </ReactMarkdown>
        )}
        {!isLoading && !response && !error && (
          <div className="flex items-center justify-center h-full text-slate-400">
            <p>The result from Gemini will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}