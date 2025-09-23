import { useState, memo } from 'react';
import { Message, toggleMessageSelection, selectCurrentConversation, selectSelectedMessageIds } from '../../state/chatSlice';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { useTranslation } from '../../hooks/useTranslation';
import { useContextMenu } from '../../hooks/useContextMenu';
import { ChatMessagePart } from './MessagePart';
import { ClipboardIcon } from '../shared/Icons';
import { MessageContextMenu } from './MessageContextMenu';
import styles from './ChatMessage.module.css';

interface ChatMessageProps {
  message: Message;
  isSelected: boolean; // Add isSelected to props
}

export const ChatMessage = memo(({ message, isSelected }: ChatMessageProps) => { // Wrap in memo and destructure isSelected
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { menuState, openMenu, closeMenu } = useContextMenu();
  const currentConversation = useAppSelector(selectCurrentConversation);
  const selectedMessageIds = useAppSelector(selectSelectedMessageIds); // Get selected message IDs

  const [copied, setCopied] = useState(false);
  
  const msgParts = message.content.parts;
  const isModel = message.content.role === 'model';

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent container click from firing
    const textToCopy = msgParts?.map(p => ('text' in p ? p.text : '')).join('\n') || '';

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Prevent deep event propagation causing UI stuttering, ruining CSS transition animations and activation of unintended handlers
    e.stopPropagation();

    dispatch(toggleMessageSelection({ messageId: message.id }));
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (!selectedMessageIds.includes(message.id)) {
      // If the right-clicked message is not part of the current selection,
      // clear existing selections and select only this message.
      dispatch(toggleMessageSelection({ messageId: message.id, clearOthers: true }));
    }
    openMenu(e); // Open the context menu
  };
  // Base classes
  const messageContainerBase = "group flex items-start gap-4 my-4 cursor-pointer max-w-[100%]";
  const messageBubbleBase = "relative p-2 rounded-lg overflow-auto flex flex-col max-w-[100%]";

  // Role-specific classes
  const userContainer = "flex-row-reverse";
  const modelContainer = "";

  const bgSelected = "bg-indigo-100";
  const userBubble = isSelected ? bgSelected : "bg-primary/10";
  const modelBubble = isSelected ? bgSelected : "bg-slate-100";

  // Avatar classes
  const userAvatar = "bg-slate-400";
  const modelAvatar = "bg-primary";

  const containerClasses = `${messageContainerBase} ${isModel ? modelContainer : userContainer}`;
  const bubbleClasses = `${messageBubbleBase} ${isModel ? modelBubble : userBubble} ${isSelected ? styles.messageSelected : 'border-2 border-transparent'}`;
  const avatarClasses = `flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${isModel ? modelAvatar : userAvatar}`;
  const avatarLetter = isModel ? 'G' : 'U';

  return (
    <div className={containerClasses} onClick={handleContainerClick} onContextMenu={handleContextMenu}>
      <div className={avatarClasses}>
        {avatarLetter}
      </div>
      <div className={bubbleClasses}>
        {msgParts && msgParts.map((part, index) => (
          <ChatMessagePart key={index} part={part} isModel={isModel} />
        ))}
        <button
            className="absolute bottom-2 right-2 p-1 rounded-md text-slate-400 hover:bg-slate-200 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
            title={t('responsePanel.copyToClipboard')}
            onClick={handleCopy}
          >
            <ClipboardIcon copied={copied} />
        </button>
      </div>
      <MessageContextMenu
        isOpen={menuState.isOpen}
        position={menuState.position}
        onClose={closeMenu}
        message={message}
        conversation={currentConversation!}
      />
    </div>
  );
})