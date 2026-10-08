import Dexie, { type Table } from 'dexie';
import type {
  Task,
  TaskHistory,
  CalendarEvent,
  FocusSession,
  CatProfile,
  JournalEntry,
  AppSettings,
  RewardTransaction,
  Achievement,
  CatCurrentState,
  CatInventoryItem,
  CatAccessory,
  UnlockedDecoration,
  TarotReading,
  SpecialDate,
  ReminderPreference,
} from '@/types/db.types';

export class MoonPawDatabase extends Dexie {
  tasks!: Table<Task, string>;
  taskHistory!: Table<TaskHistory, string>;
  calendarEvents!: Table<CalendarEvent, string>;
  focusSessions!: Table<FocusSession, string>;
  catProfile!: Table<CatProfile, string>;
  journalEntries!: Table<JournalEntry, string>;
  appSettings!: Table<AppSettings, string>;
  // New tables for Phase 7
  rewardTransactions!: Table<RewardTransaction, string>;
  achievements!: Table<Achievement, string>;
  catCurrentState!: Table<CatCurrentState, string>;
  catInventory!: Table<CatInventoryItem, string>;
  catAccessories!: Table<CatAccessory, string>;
  unlockedDecorations!: Table<UnlockedDecoration, string>;
  tarotReadings!: Table<TarotReading, string>;
  specialDates!: Table<SpecialDate, string>;
  reminderPreferences!: Table<ReminderPreference, string>;

  constructor() {
    super('MoonPawDB');

    this.version(1).stores({
      tasks: 'id, status, priority, dueDate, dueTime, category, reminderAt, focusDurationMinutes, notes, createdAt, *tags, completedAt',
      taskHistory: 'id, taskId, timestamp, action',
      calendarEvents: 'id, start, end, taskId, category',
      focusSessions: 'id, taskId, startedAt, completed, mode',
      catProfile: 'id, level',
      journalEntries: 'id, date, moodScore, *emotionalTags, lunarPhase, moonSign',
      appSettings: 'id',
    })
    // Version 2 adds additional tables for rewards, achievements, cat state, etc.
    .version(2).stores({
      rewardTransactions: 'id, type, timestamp',
      achievements: 'id, name, earnedAt',
      catCurrentState: 'id, catId',
      catInventory: 'id, itemId',
      catAccessories: 'id, type, equipped',
      unlockedDecorations: 'id, name',
      tarotReadings: 'id, date',
      specialDates: 'id, date',
      reminderPreferences: 'id, type',
    });
  }
}

export const db = new MoonPawDatabase();
