import React from 'react';

interface PanelProps {
  orientation: 'vertical' | 'horizontal';
  children: React.ReactNode;
  className?: string;
}

export function Panel({ orientation, children, className }: PanelProps) {
  const flexDirection = orientation === 'vertical' ? 'flex-col' : 'flex-row';

  return (
    <div className={`flex ${flexDirection} ${className}`}>
      {children}
    </div>
  );
}