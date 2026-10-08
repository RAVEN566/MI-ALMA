import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'starlight' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 min-h-[44px] min-w-[44px]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-2 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  }[size];

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-twilight-600 to-twilight-500 hover:from-twilight-500 hover:to-twilight-400 text-white shadow-glow-sm hover:shadow-glow-md focus:ring-twilight-400 border border-twilight-400/30',
    secondary:
      'bg-midnight-800/80 hover:bg-midnight-700/80 text-twilight-200 dark:text-twilight-100 border border-twilight-500/20 hover:border-twilight-500/40 focus:ring-twilight-500',
    starlight:
      'bg-gradient-to-r from-starlight-500 to-starlight-400 hover:from-starlight-400 hover:to-starlight-300 text-midnight-950 font-semibold shadow-glow-gold focus:ring-starlight-400',
    ghost:
      'bg-transparent hover:bg-twilight-600/10 text-slate-700 dark:text-slate-200 hover:text-twilight-600 dark:hover:text-twilight-300 focus:ring-twilight-400',
    danger:
      'bg-rose-600 hover:bg-rose-500 text-white shadow-md focus:ring-rose-400 border border-rose-400/30',
  }[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};
