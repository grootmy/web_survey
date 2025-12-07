import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  onClick
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-lg border border-border-light bg-card-light px-4 py-2 text-sm font-medium text-text-light transition-colors duration-200 hover:-translate-y-0.5 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:border-border-dark dark:bg-card-dark dark:text-text-dark';

  const variantClasses = {
    primary: 'border-transparent bg-primary text-white shadow-card hover:bg-primary-light dark:bg-primary dark:hover:bg-primary-light',
    secondary: 'border-border-light bg-surface text-text-light hover:bg-background-light dark:border-border-dark dark:bg-background-dark dark:text-text-dark dark:hover:bg-card-dark',
    danger: 'border-transparent bg-danger text-white hover:bg-red-600',
  } as const;

  const sizeClasses = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  } as const;

  return (
    <button
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
