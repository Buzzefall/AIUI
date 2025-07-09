interface SeparatorProps {
  orientation?: 'vertical' | 'horizontal';
}

export function Separator({ orientation = 'vertical' }: SeparatorProps) {
  const baseClasses = 'bg-gradient-to-t from-transparent via-slate-300 to-transparent';
  const orientationClasses =
    orientation === 'vertical'
      ? 'w-px h-full bg-gradient-to-t' // Vertical gradient
      : 'h-px w-full bg-gradient-to-r'; // Horizontal gradient

  return (
    <div className={`${baseClasses} ${orientationClasses}`}></div>
  );
}