import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  iconBgClass?: string;
  iconTextClass?: string;
  className?: string;
}

export default function StatCard({
  icon,
  label,
  value,
  subValue,
  iconBgClass = 'bg-primary-100',
  iconTextClass = 'text-primary-700',
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl p-6 shadow-sm border border-neutral-200 flex items-center gap-4',
        className
      )}
    >
      <div
        className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
          iconBgClass,
          iconTextClass
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 truncate">
          {label}
        </p>
        <p className="text-3xl font-bold text-neutral-950 leading-tight">{value}</p>
        {subValue && (
          <p className="text-xs text-neutral-400 mt-0.5">{subValue}</p>
        )}
      </div>
    </div>
  );
}
