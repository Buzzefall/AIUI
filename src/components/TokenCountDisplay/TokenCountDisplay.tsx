import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { selectCurrentConversation } from '../../state/chatSlice';
import { updateTokenCountThunk } from '../../state/updateTokenCountThunk';
import { useTranslation } from '../../hooks/useTranslation';
import './TokenCountDisplay.css';

export function TokenCountDisplay() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const currentConversation = useAppSelector(selectCurrentConversation);

  useEffect(() => {
    if (currentConversation && currentConversation.messages.length > 0 && !currentConversation.totalTokens) {
      dispatch(updateTokenCountThunk({ conversationId: currentConversation.id }));
    }
  }, [currentConversation, dispatch]);

  if (!currentConversation) {
    return null;
  }

  const { totalTokens, cachedContentTokenCount } = currentConversation;

  const tokens = totalTokens ? totalTokens : 0;
  const cachedTokens = cachedContentTokenCount ? cachedContentTokenCount : 0;
  
  const maxTokens = 1000000;

  return (
    <div className="token-count-display">
      <div className="token-count-display__bar-container">
        <span className="token-count-display__label">{t('tokenCount.historyTokens')} </span>
        <span className="token-count-display__label">{tokens}</span>
        <div className="token-count-display__bar">
          <div
            className="token-count-display__bar-fill"
            style={{ width: `${(tokens / maxTokens + 0.01) * 100}%` }} // Assuming a max of 1m tokens for visualization
          ></div>
        </div>
        <span className="token-count-display__value">{maxTokens}</span>
      </div>
      <div className="token-count-display__bar-container">
        <span className="token-count-display__label">{t('tokenCount.historyTokensCached')}</span>
        <span className="token-count-display__label">{cachedTokens}</span>
        <div className="token-count-display__bar">
          <div
            className="token-count-display__bar-fill--cached"
            style={{ width: `${(cachedTokens / maxTokens + 0.01) * 100}%` }} // Assuming a max of 1m tokens for visualization
          ></div>
        </div>
        <span className="token-count-display__value">{maxTokens}</span>
      </div>
    </div>
  );
}