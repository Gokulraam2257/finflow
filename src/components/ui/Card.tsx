import React from 'react';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-lg p-4 bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm transition-all duration-200 hover:border-slate-600/50',
        className
      )}
    >
      {children}
    </div>
  );
}