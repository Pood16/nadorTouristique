import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'icon';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-700 text-white hover:bg-primary-900 shadow hover:shadow-color focus:ring-primary-500',
  secondary:
    'bg-neutral-100 text-primary-700 border border-primary-300 hover:bg-primary-100 hover:border-primary-500 focus:ring-primary-300',
  danger:
    'bg-secondary-700 text-white hover:bg-secondary-900 shadow focus:ring-secondary-500',
  outline:
    'bg-transparent text-primary-700 border-2 border-primary-700 hover:bg-primary-100 focus:ring-primary-500',
  ghost:
    'bg-transparent text-neutral-600 hover:text-primary-700 hover:bg-primary-100 focus:ring-primary-300',
  icon:
    'p-2 rounded-lg text-neutral-500 hover:text-primary-700 hover:bg-primary-100 focus:ring-primary-300',
};

const sizeVariantClasses: Partial<Record<ButtonVariant, Record<ButtonSize, string>>> = {
  primary: { sm: 'px-3 py-1.5 text-sm', md: 'px-5 py-2.5 text-base', lg: 'px-6 py-3 text-lg' },
  secondary: { sm: 'px-3 py-1.5 text-sm', md: 'px-5 py-2.5 text-base', lg: 'px-6 py-3 text-lg' },
  danger: { sm: 'px-3 py-1.5 text-sm', md: 'px-5 py-2.5 text-base', lg: 'px-6 py-3 text-lg' },
  outline: { sm: 'px-3 py-1.5 text-sm', md: 'px-5 py-2.5 text-base', lg: 'px-6 py-3 text-lg' },
  ghost: { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-base', lg: 'px-5 py-2.5 text-lg' },
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const isIcon = variant === 'icon';
    const sizeClass = !isIcon ? (sizeVariantClasses[variant]?.[size] ?? '') : '';

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-semibold rounded-lg',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClass,
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
