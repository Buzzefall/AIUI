import { ApiKeyPanel } from './components/ApiKeyPanel';
import { PromptingPanel } from './components/PromptingPanel';
import { ResponsePanel } from './components/ResponsePanel';

function App() {
  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-800">
      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center">
        <div className="flex w-full h-full max-w-screen-xl mx-auto p-6">
          {/* Panels Container */}
          <div className="flex-grow flex items-center justify-center">
            <div className="flex w-full bg-white rounded-lg shadow-lg" style={{ height: '75vh' }}>
              {/* Left: Prompting Panel */}
              <div className="w-1/2 p-6 border-r border-slate-200 flex flex-col">
                <PromptingPanel />
              </div>

              {/* Right: Rendering Panel */}
              <div className="w-1/2 p-6 flex flex-col">
                <ResponsePanel />
              </div>
            </div>
          </div>
        </div>
      </main>

      <ApiKeyPanel />
    </div>
  );
}

export default App;