import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { selectCurrentConversation } from '../../state/chatSlice';
import { updateTokenCountThunk } from '../../state/updateTokenCountThunk';
import './TokenCountDisplay.css';

export function TokenCountDisplay() {
  const dispatch = useAppDispatch();
  const currentConversation = useAppSelector(selectCurrentConversation);

  useEffect(() => {
    if (currentConversation && 
        currentConversation.messages.length > 0 && 
        !currentConversation.totalTokens) {
      dispatch(updateTokenCountThunk({ conversationId: currentConversation.id }));
    }
  }, [currentConversation, dispatch]);

  if (!currentConversation) {
    return null;
  }

  const { totalTokens, cachedContentTokenCount } = currentConversation;
  
  const maxTokens = 1000000;

  return (
    <div className="token-count-display">
      <div className="token-count-display__bar-container">
        <span className="token-count-display__label">History tokens: </span>
        <span className="token-count-display__label">{totalTokens}</span>
        <div className="token-count-display__bar">
          <div
            className="token-count-display__bar-fill"
            style={{ width: `${(totalTokens / 1000000 + 1) * 100}%` }} // Assuming a max of 1m tokens for visualization
          ></div>
        </div>
        <span className="token-count-display__value">{maxTokens}</span>
      </div>
      <div className="token-count-display__bar-container">
        <span className="token-count-display__label">History tokens (cached): </span>
        <span className="token-count-display__label">{totalTokens}</span>
        <div className="token-count-display__bar">
          <div
            className="token-count-display__bar-fill--cached"
            style={{ width: `${(cachedContentTokenCount / 1000000) * 100}%` }} // Assuming a max of 1m tokens for visualization
          ></div>
        </div>
        <span className="token-count-display__value">{maxTokens}</span>
      </div>
    </div>
  );
}