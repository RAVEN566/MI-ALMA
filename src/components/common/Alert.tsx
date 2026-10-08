import React from 'react';
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  type?: AlertType;
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  onDismiss,
  className = '',
}) => {
  const config = {
    info: {
      icon: <Info className="w-5 h-5 text-astral-400" />,
      border: 'border-astral-500/30',
      bg: 'bg-astral-900/20 text-astral-100',
    },
    success: {
      icon: <CheckCircle2 className="w-5 h-5 text-aurora-400" />,
      border: 'border-aurora-500/30',
      bg: 'bg-aurora-900/20 text-aurora-100',
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5 text-starlight-400" />,
      border: 'border-starlight-500/30',
      bg: 'bg-starlight-900/20 text-starlight-100',
    },
    error: {
      icon: <AlertCircle className="w-5 h-5 text-rose-400" />,
      border: 'border-rose-500/30',
      bg: 'bg-rose-950/25 text-rose-100',
    },
  }[type];

  return (
    <div
      role="alert"
      className={`relative flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-md ${config.border} ${config.bg} ${className}`}
    >
      <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
      <div className="flex-1 text-xs sm:text-sm">
        {title && <h4 className="font-semibold mb-0.5">{title}</h4>}
        <div className="opacity-90">{children}</div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 opacity-70 hover:opacity-100 p-1 -mr-1 -mt-1 transition-opacity min-h-[36px] min-w-[36px] flex items-center justify-center"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
