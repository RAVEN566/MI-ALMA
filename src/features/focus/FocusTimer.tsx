// src/features/focus/FocusTimer.tsx
import React from 'react';
import { Button } from '@/components/common/Button';
import { useFocusTimer } from '@/context/FocusTimerContext';
import { Clock } from 'lucide-react';

const PRESET_MINUTES = [5, 15, 25, 45, 60];

export const FocusTimer: React.FC = () => {
  const { session, isRunning, remainingSeconds, start, pause, resume, stop } = useFocusTimer();

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!session) {
    // No active session – show preset buttons
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-200">Start a Focus Session</p>
        <div className="flex flex-wrap gap-2">
          {PRESET_MINUTES.map((min) => (
            <Button key={min} variant="primary" size="sm" onClick={() => start(min)}>
              {min} min
            </Button>
          ))}
        </div>
      </div>
    );
  }

  // Session active – show timer and controls
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-starlight-300">
        <Clock className="w-5 h-5" />
        <span className="text-lg font-mono">{formatTime(remainingSeconds)}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {isRunning ? (
          <Button variant="secondary" size="sm" onClick={pause}>
            Pause
          </Button>
        ) : (
          <Button variant="secondary" size="sm" onClick={resume}>
            Resume
          </Button>
        )}
        <Button variant="danger" size="sm" onClick={stop}>
          Stop & Earn Rewards
        </Button>
      </div>
      <p className="text-xs text-slate-400">
        {session.targetDurationMinutes} minute Pomodoro – Earn {session.targetDurationMinutes * 2} Stardust &amp;{' '}
        {session.targetDurationMinutes * 10} XP upon completion.
      </p>
    </div>
  );
};
