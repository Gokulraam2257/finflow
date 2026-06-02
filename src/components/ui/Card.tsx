import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-xl p-6 bg-slate-900/70 border border-slate-700/50 backdrop-blur transition-all duration-200 hover:border-slate-600 shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}