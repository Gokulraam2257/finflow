import clsx from 'clsx';

interface BadgeProps {
  label: string;
  color?: 'green' | 'yellow' | 'red' | 'blue' | 'purple' | 'gray';
}

const colorMap = {
  green: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  red: 'bg-red-500/20 text-red-400 border-red-500/30',
  blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  gray: 'bg-white/5 text-white/50 border-white/10',
};

export function Badge({ label, color = 'gray' }: BadgeProps) {
  return (
    <span className={clsx('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', colorMap[color])}>
      {label}
    </span>
  );
}