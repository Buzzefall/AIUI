import React from 'react';

interface ContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  children: React.ReactNode;
}

export const ContextMenu = ({ isOpen, position, onClose, children }: ContextMenuProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop to catch outside clicks and other context menu events */}
      <div className="fixed inset-0 z-10" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }} />
      <div className="fixed z-20" style={{ top: position.y, left: position.x }}>
        <ul className="bg-white rounded-md shadow-lg border border-slate-200 p-1 min-w-[100px] animate-fade-in" style={{ animationDuration: '0.1s' }}>
          {children}
        </ul>
      </div>
    </>
  );
};