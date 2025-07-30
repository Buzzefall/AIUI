import React, { useMemo, useRef, useEffect } from 'react';
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
  const editorContainerRef = useRef<HTMLDivElement>(null);

  const editorOptions = useMemo(() => {
    return {
      autofocus: true,
      placeholder: t('promptingPanel.placeholder'),
      toolbar: false,
      status: false,
      spellChecker: false,
    };
  }, [t]);

  useEffect(() => {
    if (editorContainerRef.current) {
      const codeMirrorScroll = editorContainerRef.current.querySelector('.CodeMirror-scroll') as HTMLElement;
      if (codeMirrorScroll) {
        codeMirrorScroll.style.height = 'auto';
        codeMirrorScroll.style.height = `${codeMirrorScroll.scrollHeight}px`;
      }
    }
  }, [prompt]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      formRef.current?.requestSubmit();
    }
  };

  return (
    <div className="prompting-panel__textarea-container" ref={editorContainerRef}>
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