import React, { useMemo } from 'react';
import SimpleMdeEditor from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

import { SendIcon } from '../shared/Icons';
import { useTranslation } from '../../hooks/useTranslation';

interface PromptInputProps {
  prompt: string;
  isLoading: boolean;
  apiKey: string | null;
  formRef: React.RefObject<HTMLFormElement>;
  onPromptChange: (prompt: string) => void;
}

export function PromptInput({ prompt, isLoading, apiKey, formRef, onPromptChange }: PromptInputProps) {
  const { t } = useTranslation();

  const editorOptions = useMemo(() => {
    return {
      autofocus: true,
      placeholder: t('promptingPanel.placeholder'),
      toolbar: false,
      status: false,
      spellChecker: false,
      // shortcuts: {
      //   "submit": "Ctrl-Enter", // This is the key for the action
      // },

      // Override the default "submit" action
      // Define extraKeys for CodeMirror to handle shortcuts
      // extraKeys: {
      //   'Ctrl-Enter': () => {
      //     console.log('Ctrl-Enter shortcut triggered!');
      //     formRef.current?.requestSubmit();
      //   },
      // },
    };
  }, [t, formRef]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      console.log('Ctrl-Enter or Cmd-Enter triggered!');
      formRef.current?.requestSubmit();
    }
  };

  return (
    <div className="prompting-panel__textarea-container">
      <SimpleMdeEditor
        className='prompting-panel__editor'
        value={prompt}
        options={editorOptions}
        onChange={onPromptChange}
        onKeyDown={handleKeyDown}
      />
      <button type="submit" className="prompting-panel__submit-button" disabled={isLoading || !prompt.trim() || !apiKey}>
        <SendIcon />
      </button>
    </div>
  );
}