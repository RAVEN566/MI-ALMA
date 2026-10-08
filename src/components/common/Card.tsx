import React from 'react';

export interface CardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  icon,
  headerAction,
  children,
  className = '',
  onClick,
  interactive = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-2xl p-4 sm:p-5 text-slate-800 dark:text-slate-100 ${
        interactive ? 'cursor-pointer hover:scale-[1.01] active:scale-[0.99]' : ''
      } ${className}`}
    >
      {(title || subtitle || icon || headerAction) && (
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-twilight-500/15">
          <div className="flex items-center gap-2.5 min-w-0">
            {icon && (
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-twilight-500/15 text-twilight-400 dark:text-twilight-300 flex items-center justify-center">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              {title && (
                <h3 className="font-semibold text-sm sm:text-base tracking-wide truncate">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {headerAction && <div className="flex-shrink-0 ml-2">{headerAction}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};
