import React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export function Section({ title, children }: SectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-sm font-medium text-slate-600">{title}</h2>
      {children}
    </div>
  );
}
