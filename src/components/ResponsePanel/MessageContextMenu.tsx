import React, { useState } from 'react';
import { ContextMenu } from '../shared/ContextMenu/ContextMenu';
import { MenuItem } from '../shared/ContextMenu/MenuItem';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { deleteSelectedMessages, clearMessageSelection, selectSelectedMessageIds, Conversation, Message } from '../../state/chatSlice';
import { regenerateLastResponse } from '../../state/chatThunks';
import { useTranslation } from '../../hooks/useTranslation';
import { ConfirmationDialog } from '../shared/ConfirmationDialog';

interface MessageContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  message: Message;
  conversation: Conversation;
}

export const MessageContextMenu: React.FC<MessageContextMenuProps> = ({ isOpen, position, onClose, message, conversation }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const selectedMessageIds = useAppSelector(selectSelectedMessageIds);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const hasSelection = selectedMessageIds.length > 0;
  const itemsToDelete = hasSelection ? selectedMessageIds.length / 2 : 1;
  const confirmMessage = `Are you sure you want to delete ${itemsToDelete} message pair(s)? This action cannot be undone.`

  const isLastModelMessage = message.content.role === 'model' && conversation.messages[conversation.messages.length - 1].id === message.id;

  const handleDeleteClick = () => {
    onClose(); // Close context menu before opening dialog
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteSelectedMessagesThunk());
    setIsConfirmOpen(false);
  };

  const handleResend = () => {
    dispatch(regenerateLastResponse());
    onClose();
  };

  return (
    <>
      <ContextMenu isOpen={isOpen} position={position} onClose={onClose}>
        {isLastModelMessage && <MenuItem label={t('contextMenu.resend')} onClick={handleResend} />}
        <MenuItem 
          label={hasSelection ? t('contextMenu.deleteSelected') : t('contextMenu.delete')} 
          onClick={handleDeleteClick} 
        />
      </ContextMenu>
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message={confirmMessage}
      />
    </>
  );
};
