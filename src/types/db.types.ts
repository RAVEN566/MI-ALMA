export type TaskPriority = 'starlight' | 'moonlight' | 'solar' | 'supernova';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'archived' | 'deleted';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
}

export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'lunar';
  interval: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  lunarPhaseTarget?: 'new_moon' | 'full_moon' | 'first_quarter' | 'third_quarter';
  endDate?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category?: string; // e.g., "work", "personal", "ritual"
  dueDate?: string;      // ISO date (YYYY-MM-DD)
  dueTime?: string;      // Optional time (HH:mm)
  priority: TaskPriority;
  status: TaskStatus;
  tags: string[];
  subtasks: Subtask[];
  // optional reminder timestamp (ISO) for a pre‑task alert
  reminderAt?: string;
  // optional focus timer duration in minutes (e.g., Pomodoro)
  focusDurationMinutes?: number;
  // free‑form notes attached to the task
  notes?: string;
  recurrence?: RecurrenceRule;
  estimatedMinutes?: number;
  actualMinutes: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskHistory {
  id: string;
  taskId: string;
  action: 'created' | 'completed' | 'uncompleted' | 'rescheduled' | 'edited' | 'archived';
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  allDay: boolean;
  category: 'focus_block' | 'ritual' | 'appointment' | 'routine' | 'milestone';
  lunarPhaseTag?: string;
  reminders: number[];
  taskId?: string;
  colorToken?: string;
  createdAt: string;
  updatedAt: string;
}

export type FocusMode = 'pomodoro' | 'stopwatch' | 'sprint';

export interface FocusSession {
  id: string;
  taskId?: string;
  mode: FocusMode;
  targetDurationMinutes: number;
  actualDurationSeconds: number;
  completed: boolean;
  startedAt: string;
  endedAt?: string;
  xpEarned: number;
  stardustEarned: number;
  notes?: string;
}

export type CatMood = 'ecstatic' | 'content' | 'playful' | 'sleepy' | 'mystical' | 'curious';

export interface CatProfile {
  id: string; // 'primary_cat'
  name: string;
  breed: string;
  level: number;
  xp: number;
  stardust: number;
  hunger: number;
  happiness: number;
  energy: number;
  currentMood: CatMood;
  equippedAccessories: {
    head?: string;
    collar?: string;
    rug?: string;
    floating?: string;
  };
  lastFedAt: string;
  lastPettedAt: string;
  lastInteractedAt: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  moodScore: 1 | 2 | 3 | 4 | 5;
  emotionalTags: string[];
  textContent: string;
  tarotDrawId?: string;
  lunarPhase: string;
  moonSign: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  id: string; // 'user_settings'
  theme: 'dark' | 'light' | 'midnight_velvet' | 'twilight_amethyst';
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  reducedMotion: boolean;
  installedAsPwa: boolean;
  lastBackupAt?: string;
  // Calendar preferences
  firstDayOfWeek: number; // 0=Sun,1=Mon,...
  timeFormat24h: boolean; // true=24h
  defaultEventColors: Record<string,string>; // category → hex
  calendarDensity: 'compact' | 'spacious';
}
