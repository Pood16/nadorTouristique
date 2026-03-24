import type { ReactNode } from 'react';
import { SearchX } from 'lucide-react';
import { cn } from '@/utils/cn';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-6',
        className
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mb-4 text-primary-500">
        {icon ?? <SearchX className="w-8 h-8" />}
      </div>
      <h3 className="text-xl font-semibold text-neutral-800 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-neutral-500 max-w-sm mb-6">{description}</p>
      )}
      {action}
    </div>
  );
}
