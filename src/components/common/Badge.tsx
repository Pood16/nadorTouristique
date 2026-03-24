import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

type BadgeVariant = 'active' | 'inactive' | 'success' | 'error' | 'warning' | 'info';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}

const variantClasses: Record<BadgeVariant, { wrapper: string; dot: string }> = {
  active: {
    wrapper: 'bg-accent-100 text-accent-700 border border-accent-300',
    dot: 'bg-accent-500',
  },
  inactive: {
    wrapper: 'bg-neutral-100 text-neutral-500 border border-neutral-200',
    dot: 'bg-neutral-400',
  },
  success: {
    wrapper: 'bg-accent-100 text-accent-700',
    dot: 'bg-accent-500',
  },
  error: {
    wrapper: 'bg-red-50 text-secondary-700',
    dot: 'bg-secondary-700',
  },
  warning: {
    wrapper: 'bg-secondary-100 text-secondary-500',
    dot: 'bg-secondary-500',
  },
  info: {
    wrapper: 'bg-primary-100 text-primary-700',
    dot: 'bg-primary-500',
  },
};

export default function Badge({ variant = 'info', children, dot = true, className }: BadgeProps) {
  const styles = variantClasses[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold',
        styles.wrapper,
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', styles.dot)} />}
      {children}
    </span>
  );
}


interface CategoryBadgeProps {
  label: string;
  color: string; 
  textColor: string; 
  className?: string;
}

export function CategoryBadge({ label, color, textColor, className }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
        color,
        textColor,
        className
      )}
    >
      {label}
    </span>
  );
}
