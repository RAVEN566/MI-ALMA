// src/context/FocusTimerContext.tsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { db } from '@/db/database';
import { addRewardTransaction, grantFocusReward } from '@/services/rewardService';
import type { FocusSession } from '@/types/db.types';
// UUID generation helper – replaces external uuid package
function uuidv4(): string {
  if (typeof crypto !== 'undefined' && (crypto as any).randomUUID) {
    return (crypto as any).randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}


interface FocusTimerState {
  session: FocusSession | null;
  isRunning: boolean;
  remainingSeconds: number; // countdown remaining
}

interface FocusTimerContextProps extends FocusTimerState {
  start: (durationMinutes: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

const FocusTimerContext = createContext<FocusTimerContextProps | undefined>(undefined);

export const FocusTimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<FocusSession | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [remaining, setRemaining] = useState(0);

  // Helper: compute remaining based on session start and target duration
  const computeRemaining = useCallback(() => {
    if (!session) return 0;
    const elapsed = Math.floor((Date.now() - new Date(session.startedAt).getTime()) / 1000);
    const total = session.targetDurationMinutes * 60;
    return Math.max(0, total - elapsed);
  }, [session]);

  // Load any in‑progress session on mount (e.g., after page reload)
  useEffect(() => {
    const loadActive = async () => {
      const active = await db.focusSessions
        .where('completed')
        .equals(false)
        .first();
      if (active) {
        setSession(active);
        setIsRunning(true);
        setRemaining(computeRemaining());
      }
    };
    loadActive();
  }, [computeRemaining]);

  // Countdown tick – respects reduced‑motion via media query handled elsewhere
  useEffect(() => {
    if (!isRunning) return undefined;
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          // auto‑complete session
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  const start = async (durationMinutes: number) => {
    const now = new Date().toISOString();
    const newSession: FocusSession = {
      id: uuidv4(),
      mode: 'pomodoro',
      targetDurationMinutes: durationMinutes,
      actualDurationSeconds: 0,
      completed: false,
      startedAt: now,
      endedAt: undefined,
      xpEarned: 0,
      stardustEarned: 0,
      notes: undefined,
    } as FocusSession;
    await db.focusSessions.add(newSession);
    setSession(newSession);
    setIsRunning(true);
    setRemaining(durationMinutes * 60);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const resume = () => {
    if (session && !session.completed) setIsRunning(true);
  };

  const stop = async () => {
    if (!session) return;
    const elapsed = (session.targetDurationMinutes * 60) - remaining;
    await db.focusSessions.update(session.id, {
      completed: true,
      actualDurationSeconds: elapsed,
      endedAt: new Date().toISOString(),
    });
    // Reward: 2 stardust per minute completed, 10 xp per minute
    const stardustEarned = Math.floor(elapsed / 60) * 2;
    const xpEarned = Math.floor(elapsed / 60) * 10;
    await grantFocusReward(stardustEarned, xpEarned);
    setSession(null);
    setIsRunning(false);
    setRemaining(0);
  };

  const handleComplete = async () => {
    if (!session) return;
    const totalSec = session.targetDurationMinutes * 60;
    await db.focusSessions.update(session.id, {
      completed: true,
      actualDurationSeconds: totalSec,
      endedAt: new Date().toISOString(),
    });
    const stardustEarned = session.targetDurationMinutes * 2;
    const xpEarned = session.targetDurationMinutes * 10;
    await grantFocusReward(stardustEarned, xpEarned);
    setSession(null);
    setIsRunning(false);
    setRemaining(0);
  };

  const value: FocusTimerContextProps = {
    session,
    isRunning,
    remainingSeconds: remaining,
    start,
    pause,
    resume,
    stop,
  };

  // Pause timer when page becomes hidden (visibilitychange) – preserve remaining
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        pause();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  return <FocusTimerContext.Provider value={value}>{children}</FocusTimerContext.Provider>;
};

export const useFocusTimer = () => {
  const ctx = useContext(FocusTimerContext);
  if (!ctx) throw new Error('useFocusTimer must be used within FocusTimerProvider');
  return ctx;
};
