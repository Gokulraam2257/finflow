import clsx from 'clsx';

interface ProgressBarProps {
  progress: number; // 0–100
  color?: string;
  height?: string;
}

export function ProgressBar({ progress, color = 'bg-blue-500', height = 'h-2' }: ProgressBarProps) {
  return (
    <div className={clsx('w-full rounded-full bg-slate-700/30 overflow-hidden', height)}>
      <div
        className={clsx('h-full rounded-full transition-all duration-700', color)}
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
}