import React, { useState, Children, isValidElement } from 'react';

interface MenuItemProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const MenuItem: React.FC<MenuItemProps> = ({ label, onClick, disabled, children }) => {
  const [isHovered, setIsHovered] = useState(false);
  const hasSubMenu = Children.count(children) > 0;

  if (label === '---') {
    return <hr className="my-1 border-slate-200" />;
  }

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };

  return (
    <li
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={handleClick}
        disabled={disabled}
        className="w-full text-nowrap text-left px-3 py-1.5 text-sm text-slate-700 rounded-md hover:bg-primary/10 hover:text-primary flex justify-between items-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {label}
        {hasSubMenu && <span className="text-xs">&gt;</span>}
      </button>
      {hasSubMenu && isHovered && (
        <ul
          className="absolute left-full top-0 mt-[-8px] bg-white rounded-md shadow-lg border border-slate-200 p-1 z-20 min-w-[100px] animate-fade-in"
          style={{ animationDuration: '0.1s' }}
        >
          {Children.map(children, child => {
            if (isValidElement(child)) {
              return child;
            }
            return null;
          })}
        </ul>
      )}
    </li>
  );
};