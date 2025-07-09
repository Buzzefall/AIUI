import { useState } from 'react';

export interface MenuItem {
  label: string;
  onClick?: () => void;
  items?: MenuItem[]; // For nested sub-menus
}

interface ContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  items: MenuItem[];
  onClose: () => void;
}

const SubMenu = ({ items }: { items: MenuItem[] }) => {
  return (
    <ul
      className="absolute left-full top-0 mt-[-8px] bg-white rounded-md shadow-lg border border-slate-200 p-1 z-20 min-w-[150px] animate-fade-in"
      style={{ animationDuration: '0.1s' }}
    >
      {items.map((item, index) => (
        <MenuItemComponent key={index} item={item} />
      ))}
    </ul>
  );
};

const MenuItemComponent = ({ item }: { item: MenuItem }) => {
  const [isHovered, setIsHovered] = useState(false);
  const hasSubMenu = item.items && item.items.length > 0;

  if (item.label === '---') {
    return <hr className="my-1 border-slate-200" />;
  }

  return (
    <li
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={item.onClick}
        className="w-full text-left px-3 py-1.5 text-sm text-slate-700 rounded-md hover:bg-primary/10 hover:text-primary flex justify-between items-center"
      >
        {item.label}
        {hasSubMenu && <span className="text-xs">&gt;</span>}
      </button>
      {hasSubMenu && isHovered && <SubMenu items={item.items!} />}
    </li>
  );
};

export const ContextMenu = ({ isOpen, position, items, onClose }: ContextMenuProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop to catch outside clicks and other context menu events */}
      <div className="fixed inset-0 z-10" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }} />
      <div className="fixed z-20" style={{ top: position.y, left: position.x }}>
        <ul className="bg-white rounded-md shadow-lg border border-slate-200 p-1 min-w-[150px] animate-fade-in" style={{ animationDuration: '0.1s' }}>
          {items.map((item, index) => (
            <MenuItemComponent key={index} item={item} />
          ))}
        </ul>
      </div>
    </>
  );
};