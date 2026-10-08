import React from 'react';

export const CosmicBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Base background fill */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-midnight-950 transition-colors duration-500" />

      {/* Radiant nebula gradient orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-twilight-600/10 dark:bg-twilight-700/20 blur-3xl animate-pulse-slow" />
      <div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-astral-500/10 dark:bg-astral-700/15 blur-3xl" />
      <div className="absolute -bottom-24 left-1/4 w-96 h-96 rounded-full bg-aurora-500/10 dark:bg-aurora-700/15 blur-3xl" />

      {/* Subtle starlight specks */}
      <div className="absolute inset-0 opacity-20 dark:opacity-40 bg-[radial-gradient(#9f6af5_1px,transparent_1px)] [background-size:24px_24px]" />
    </div>
  );
};
