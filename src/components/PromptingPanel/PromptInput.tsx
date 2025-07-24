import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { SendIcon } from '../shared/Icons';

interface PromptInputProps {
  prompt: string;
  isLoading: boolean;
  apiKey: string | null;
  formRef: React.RefObject<HTMLFormElement>;
  onPromptChange: (prompt: string) => void;
  isExpanded: boolean;
}

export function PromptInput({ prompt, isLoading, apiKey, formRef, onPromptChange, isExpanded }: PromptInputProps) {
  const { t } = useTranslation();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  return (
    <div className="prompting-panel__textarea-container">
      <textarea
        className="prompting-panel__textarea"
        rows={isExpanded ? 12 : 4}
        value={prompt}
        disabled={isLoading}
        placeholder={t('promptingPanel.placeholder')}
        onClick={(e) => e.stopPropagation()} // Prevent form's onClick from firing
        onChange={(e) => onPromptChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button type="submit" className="prompting-panel__submit-button" disabled={isLoading || !prompt.trim() || !apiKey}>
        <SendIcon />
      </button>
    </div>
  );
}