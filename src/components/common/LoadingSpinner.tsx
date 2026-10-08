import React from 'react';
import { Moon, Sparkles } from 'lucide-react';

export interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Loading celestial data...',
  size = 'md',
  fullScreen = false,
}) => {
  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }[size];

  const content = (
    <div className="flex flex-col items-center justify-center gap-3 p-6 text-center" role="status">
      <div className="relative">
        <Moon className={`${iconSizes} text-twilight-400 animate-spin duration-1000`} />
        <Sparkles className="w-3.5 h-3.5 text-starlight-400 absolute -top-1 -right-1 animate-pulse" />
      </div>
      {label && (
        <p className="text-xs sm:text-sm font-medium tracking-wide text-twilight-300 animate-pulse">
          {label}
        </p>
      )}
      <span className="sr-only">{label}</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight-950/80 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return content;
};
