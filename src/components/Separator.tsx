interface SeparatorProps {
  orientation?: 'vertical' | 'horizontal';
  className?: string | '';
}

export function Separator({ orientation = 'horizontal', className: additionalClasses = ''}: SeparatorProps) {
  const baseClasses = 'from-transparent via-slate-300 to-transparent';
  const orientationClasses =
    orientation === 'vertical'
      ? 'w-px h-full bg-gradient-to-t' // Vertical gradient
      : 'h-px w-full bg-gradient-to-r'; // Horizontal gradient

  return (
    <div className={`${baseClasses} ${orientationClasses} ${additionalClasses}`}></div>
  );
}