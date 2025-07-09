import { useState, useCallback } from 'react';

interface ContextMenuState {
  isOpen: boolean;
  position: { x: number; y: number };
  contextData: any | null;
}

export const useContextMenu = () => {
  const [menuState, setMenuState] = useState<ContextMenuState>({
    isOpen: false,
    position: { x: 0, y: 0 },
    contextData: null,
  });

  const openMenu = useCallback((event: React.MouseEvent, data?: any) => {
    event.preventDefault();
    setMenuState({
      isOpen: true,
      position: { x: event.clientX, y: event.clientY },
      contextData: data || null,
    });
  }, []);

  const closeMenu = useCallback(() => {
    if (menuState.isOpen) {
      setMenuState((prev) => ({ ...prev, isOpen: false, contextData: null }));
    }
  }, [menuState.isOpen]);

  return {
    ...menuState,
    openMenu,
    closeMenu,
  };
};