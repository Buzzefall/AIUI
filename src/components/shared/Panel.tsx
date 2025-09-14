import React from 'react';

interface PanelProps {
  orientation: 'vertical' | 'horizontal';
  children: React.ReactNode;
  className?: string;
  style?: object;
}

export function Panel({ orientation, children, className, style}: PanelProps) {
  const flexDirection = orientation === 'vertical' ? 'flex-col' : 'flex-row';

  return (
    <div className={`flex ${flexDirection} ${className}`} style={style}>
      {children}
    </div>
  );
}