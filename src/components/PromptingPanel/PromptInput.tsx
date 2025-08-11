import React, { useMemo } from 'react';

import SimpleMdeEditor from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

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
      // toolbar: false,
      // status: false,
      spellChecker: false,
    };
  }, [t]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // event.nativeEvent.stopPropagation();

    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      let abort = false;

      if (isLoading ) {
        console.log('Can not submit form while the chat is loading.')
        abort = true;
      }

      if (!prompt.trim() ) {
        console.log('Can not submit form with empty prompt.')
        abort = true;
      }

      if (!apiKey ) { 
        console.log('Can not submit form: API key required.')
        abort = true;
      }

      if (abort) return;

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
    </div>
  );
}
