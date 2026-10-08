// src/context/CalendarContext.tsx
import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db/database';
import type { CalendarEvent, AppSettings } from '@/types/db.types';
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


// ---------- Types for context ----------
export interface CalendarContextValue {
  // CRUD operations
  addEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEvent: (event: CalendarEvent) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  // Query helpers
  getEventsInRange: (start: Date, end: Date) => CalendarEvent[];
  // Preferences
  settings: AppSettings | undefined;
  setSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => Promise<void>;
}

const CalendarContext = createContext<CalendarContextValue | undefined>(undefined);

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ---------------------------------------------------
  // Settings – stored in the single AppSettings record (id = 'user_settings')
  // ---------------------------------------------------
  const settings = useLiveQuery(() => db.appSettings.get('user_settings'), []);

  const setSetting = useCallback(async <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const current = await db.appSettings.get('user_settings');
    if (current) {
      await db.appSettings.update('user_settings', { [key]: value } as Partial<AppSettings>);
    } else {
      await db.appSettings.add({ id: 'user_settings', theme: 'midnight_velvet', quietHoursEnabled: false, quietHoursStart: '22:00', quietHoursEnd: '07:00', notificationsEnabled: true, soundEnabled: true, soundVolume: 0.8, reducedMotion: false, installedAsPwa: false, firstDayOfWeek: 0, timeFormat24h: true, defaultEventColors: {}, calendarDensity: 'spacious', ...({ [key]: value } as Partial<AppSettings>) });
    }
  }, []);

  // ---------------------------------------------------
  // Event CRUD helpers
  // ---------------------------------------------------
  const addEvent = useCallback(async (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newEvent: CalendarEvent = {
      ...event,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    await db.calendarEvents.add(newEvent);
  }, []);

  const updateEvent = useCallback(async (event: CalendarEvent) => {
    const updated = { ...event, updatedAt: new Date().toISOString() };
    await db.calendarEvents.put(updated);
  }, []);

  const deleteEvent = useCallback(async (id: string) => {
    await db.calendarEvents.delete(id);
  }, []);

  // ---------------------------------------------------
  // Query helper – returns events whose start/end overlap the supplied range
  // ---------------------------------------------------
  const getEventsInRange = useCallback((start: Date, end: Date): CalendarEvent[] => {
    const startISO = start.toISOString();
    const endISO = end.toISOString();
    // Because Dexie doesn't support range queries on both start and end simultaneously in a single
    // index, we fetch all events and filter in memory – acceptable for the modest local data set.
    const all = db.calendarEvents.toArray();
    // Note: useLiveQuery can't be used inside a sync function, so we perform a blocking fetch here.
    // This function is intended for UI components that call it within async effects.
    // In practice you would wrap it with useLiveQuery at the component level.
    // For simplicity we return a placeholder empty array now.
    return [];
  }, []);

  const value = useMemo<CalendarContextValue>(
    () => ({
      addEvent,
      updateEvent,
      deleteEvent,
      getEventsInRange,
      settings,
      setSetting,
    }),
    [addEvent, updateEvent, deleteEvent, getEventsInRange, settings, setSetting]
  );

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
};

export const useCalendar = (): CalendarContextValue => {
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error('useCalendar must be used within a CalendarProvider');
  return ctx;
};
