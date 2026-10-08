// src/db/calendarService.ts
import { db } from '@/db/database';
import type { CalendarEvent } from '@/types/db.types';
// UUID generation helper – replaces external uuid package
function uuidv4(): string {
  // Use native crypto.randomUUID when available (modern browsers)
  if (typeof crypto !== 'undefined' && (crypto as any).randomUUID) {
    return (crypto as any).randomUUID();
  }
  // Fallback to RFC4122 version 4 compliant generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Add a new calendar event. */
export async function addCalendarEvent(event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<CalendarEvent> {
  const now = new Date().toISOString();
  const newEvent: CalendarEvent = {
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
    ...event,
  } as CalendarEvent;
  await db.calendarEvents.add(newEvent);
  return newEvent;
}

/** Get events, optionally filtered by start/end ISO strings. */
export async function getCalendarEvents(start?: string, end?: string): Promise<CalendarEvent[]> {
  if (start && end) {
    return db.calendarEvents.where('start').between(start, end, true, true).toArray();
  }
  return db.calendarEvents.toArray();
}

/** Update an event. */
export async function updateCalendarEvent(id: string, updates: Partial<CalendarEvent>): Promise<void> {
  const now = new Date().toISOString();
  await db.calendarEvents.update(id, { ...updates, updatedAt: now });
}

/** Delete an event. */
export async function deleteCalendarEvent(id: string): Promise<void> {
  await db.calendarEvents.delete(id);
}

/** Hook for React components using dexie-react-hooks. */
export function useLiveCalendarEvents() {
  const { useLiveQuery } = require('dexie-react-hooks');
  return useLiveQuery(() => db.calendarEvents.toArray(), []);
}
