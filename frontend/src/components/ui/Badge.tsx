import React from 'react';

export interface BadgeProps {
  variant?: 'critical' | 'urgent' | 'routine' | 'success' | 'warning' | 'neutral';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'routine', children, className = '' }) => {
  const styles = {
    critical: 'bg-red-100 text-red-800 border-red-300 font-bold',
    urgent: 'bg-amber-100 text-amber-800 border-amber-300 font-semibold',
    routine: 'bg-sky-100 text-sky-800 border-sky-300',
    success: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    neutral: 'bg-slate-100 text-slate-700 border-slate-300',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
