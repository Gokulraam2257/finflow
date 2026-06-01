interface ProgressRingProps {
  progress: number; // 0–100
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}

export function ProgressRing({
  progress,
  size = 100,
  strokeWidth = 8,
  color = '#3b82f6',
  label,
}: ProgressRingProps) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(100, Math.max(0, progress)) / 100) * circ;

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(100, 116, 139, 0.3)" strokeWidth={strokeWidth} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          {label && <span className="text-xl font-bold text-white">{label}</span>}
        </div>
      </div>
    </div>
  );
}