# MoonPaw - Database Schema & Persistence Design

**Document Version:** 1.0.0  
**Storage Engine:** IndexedDB via Dexie.js v4  
**Type Safety:** Strict TypeScript Entities  

---

## 1. Architectural Philosophy

MoonPaw is built on a **Local-First, Zero-Cloud** foundation.
- All persistent data resides exclusively in the browser's IndexedDB engine.
- Dexie.js provides transactional ACID guarantees, compound indexing for instant querying, and reactive observable streams via `dexie-react-hooks`.
- Relational integrity is managed through TypeScript foreign key references and transactional cascade hooks.

---

## 2. Dexie.js Schema Definition (Version 1)

```typescript
// Schema Definition for Dexie.js
export const MOONPAW_DB_VERSION = 1;

export const DB_SCHEMA_V1 = {
  tasks: 'id, status, priority, dueDate, createdAt, *tags, completedAt',
  taskHistory: 'id, taskId, timestamp, action',
  calendarEvents: 'id, start, end, taskId, category',
  focusSessions: 'id, taskId, startedAt, completed, mode',
  catProfile: 'id, level',
  inventory: 'id, itemId, itemType, isEquipped',
  itemCatalog: 'id, category, costInStardust, rarity, slot',
  journalEntries: 'id, date, moodScore, *tags, lunarPhase, moonSign',
  tarotDraws: 'id, date, spreadType',
  tarotCards: 'id, suit, arcana, number',
  lunarCache: 'id, date, phaseName, moonSign',
  appSettings: 'id',
  securityKeyMeta: 'id'
};
```

---

## 3. Entity Interfaces & Type Specifications

### 3.1 Task & Productivity Entities

```typescript
export type TaskPriority = 'starlight' | 'moonlight' | 'solar' | 'supernova';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'archived' | 'deleted';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string; // ISO 8601 UTC
}

export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'lunar';
  interval: number; // e.g. every 1 week, every 2 days
  daysOfWeek?: number[]; // 0 = Sun, 1 = Mon ... 6 = Sat
  dayOfMonth?: number;
  lunarPhaseTarget?: 'new_moon' | 'full_moon' | 'first_quarter' | 'third_quarter';
  endDate?: string;
}

export interface Task {
  id: string; // UUID v4
  title: string;
  description?: string;
  dueDate?: string; // ISO 8601 UTC
  dueTime?: string; // HH:mm
  priority: TaskPriority;
  status: TaskStatus;
  tags: string[]; // e.g. ['work', 'ritual', 'selfcare']
  subtasks: Subtask[];
  recurrence?: RecurrenceRule;
  estimatedMinutes?: number;
  actualMinutes: number;
  completedAt?: string; // ISO 8601 UTC
  createdAt: string;    // ISO 8601 UTC
  updatedAt: string;    // ISO 8601 UTC
}

export interface TaskHistory {
  id: string;
  taskId: string;
  action: 'created' | 'completed' | 'uncompleted' | 'rescheduled' | 'edited' | 'archived';
  timestamp: string; // ISO 8601 UTC
  metadata?: Record<string, unknown>;
}
```

### 3.2 Calendar & Scheduling Entities

```typescript
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string; // ISO 8601 UTC
  end: string;   // ISO 8601 UTC
  allDay: boolean;
  category: 'focus_block' | 'ritual' | 'appointment' | 'routine' | 'milestone';
  lunarPhaseTag?: string; // e.g. 'full_moon'
  reminders: number[];    // Minutes before event (e.g. [15, 60])
  taskId?: string;        // Optional link to related task
  colorToken?: string;    // e.g. 'var(--color-twilight)'
  createdAt: string;
  updatedAt: string;
}
```

### 3.3 Focus Timer Entities

```typescript
export type FocusMode = 'pomodoro' | 'stopwatch' | 'sprint';

export interface FocusPauseInterval {
  pausedAt: string;
  resumedAt: string;
}

export interface FocusSession {
  id: string;
  taskId?: string;
  mode: FocusMode;
  targetDurationMinutes: number;
  actualDurationSeconds: number;
  completed: boolean;
  startedAt: string;  // ISO 8601 UTC
  endedAt?: string;   // ISO 8601 UTC
  pauses: FocusPauseInterval[];
  xpEarned: number;
  stardustEarned: number;
  notes?: string;
}
```

### 3.4 Companion ("Luna") & Gamification Entities

```typescript
export type CatMood = 'ecstatic' | 'content' | 'playful' | 'sleepy' | 'mystical' | 'curious';
export type AccessorySlot = 'head' | 'collar' | 'back' | 'rug' | 'floating';

export interface CatProfile {
  id: 'primary_cat'; // Single-user companion singleton
  name: string;
  breed: string;
  level: number;
  xp: number;
  stardust: number;
  hunger: number;    // 0 to 100
  happiness: number; // 0 to 100
  energy: number;    // 0 to 100
  currentMood: CatMood;
  equippedAccessories: {
    head?: string;   // itemId
    collar?: string;
    rug?: string;
    floating?: string;
  };
  birthday?: string;
  lastFedAt: string;
  lastPettedAt: string;
  lastInteractedAt: string;
}

export interface CatInventoryItem {
  id: string;
  itemId: string;
  itemType: 'treat' | 'accessory' | 'room_decor';
  quantity: number;
  acquiredAt: string;
  isEquipped: boolean;
}

export interface ItemCatalog {
  id: string;
  name: string;
  category: 'treat' | 'accessory' | 'room_decor';
  slot?: AccessorySlot;
  costInStardust: number;
  rarity: 'common' | 'celestial' | 'astral' | 'cosmic';
  spriteKey: string;
  hungerRestore?: number;
  happinessBonus?: number;
  description: string;
  unlockCondition?: string;
}
```

### 3.5 Lunar Ephemeris & Tarot Entities

```typescript
export interface LunarCache {
  id: string; // YYYY-MM-DD
  date: string;
  phaseName: string;      // e.g. 'Waxing Crescent'
  phaseFraction: number;  // 0.0 (New) to 0.5 (Full) to 1.0 (New)
  illuminationPct: number; // 0.0 to 100.0%
  moonAgeDays: number;
  moonSign: string;       // e.g. 'Scorpio'
  isVoidOfCourse: boolean;
  calculatedAt: string;
}

export interface TarotCard {
  id: string; // e.g. 'major_00_fool', 'cups_01'
  name: string;
  arcana: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  number: number;
  uprightKeywords: string[];
  reversedKeywords: string[];
  uprightMeaning: string;
  reversedMeaning: string;
  reflectionPrompt: string;
  imagePath: string; // Reference to local bundled asset
}

export interface TarotCardDraw {
  cardId: string;
  isReversed: boolean;
  position: 'single' | 'past' | 'present' | 'future';
}

export interface TarotDraw {
  id: string;
  date: string; // YYYY-MM-DD
  spreadType: 'daily_single' | 'three_card' | 'lunar_reflection';
  cardsDrawn: TarotCardDraw[];
  interpretationNote?: string;
  linkedJournalEntryId?: string;
  createdAt: string;
}
```

### 3.6 Private Mood Journal Entity

```typescript
export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  moodScore: 1 | 2 | 3 | 4 | 5; // 1 = Dark, 5 = Radiant Full Moon
  emotionalTags: string[];      // ['peaceful', 'focused', 'restless']
  textContent: string;          // Private markdown notes
  tarotDrawId?: string;
  lunarPhase: string;
  moonSign: string;
  gratitudeList: string[];
  createdAt: string;
  updatedAt: string;
}
```

### 3.7 App Settings & Security Metadata

```typescript
export interface AppSettings {
  id: 'user_settings';
  theme: 'midnight_velvet' | 'twilight_amethyst' | 'starlight_rose' | 'aurora_borealis';
  quietHoursEnabled: boolean;
  quietHoursStart: string; // '22:00'
  quietHoursEnd: string;   // '08:00'
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  soundVolume: number;     // 0.0 to 1.0
  ambientNoiseTrack: 'none' | 'celestial_hum' | 'starlight_rain' | 'purr_stream';
  reducedMotion: boolean;
  installedAsPwa: boolean;
  lastBackupAt?: string;
}

export interface SecurityKeyMeta {
  id: 'security_meta';
  salt: string;          // Hex encoded 16-byte PBKDF2 salt
  iv: string;            // Hex encoded 12-byte AES-GCM IV
  iterations: number;    // 600,000
  keyCheckHash: string;  // SHA-256 hash of known challenge string for passphrase verification
  updatedAt: string;
}
```

---

## 4. Compound Indexing Strategy & Query Optimization

Dexie.js utilizes IndexedDB B-tree compound indexes to satisfy query performance under 16ms:

1. **Active Tasks Filter:** `[status+dueDate]`  
   Enables fetching all pending tasks ordered by due date without in-memory array filtering:
   ```typescript
   db.tasks.where('[status+dueDate]').between(['pending', Dexie.minKey], ['pending', todayEndOfDay]);
   ```
2. **Completed History Archive:** `[status+completedAt]`  
   Optimizes retrospective reporting and history views without loading thousands of completed records into active state.
3. **Journal Date Lookup:** `date` (Unique index)  
   Direct $O(1)$ lookups for day-based journal queries.
4. **Calendar Range Indexing:** `start` and `end`  
   Supports instantaneous slicing for month and week agenda ranges.

---

## 5. Schema Migration & Versioning Strategy

IndexedDB database versioning is strictly monotonic. Dexie handles migrations declaratively:

```typescript
// db/database.ts
export class MoonPawDatabase extends Dexie {
  tasks!: Table<Task, string>;
  calendarEvents!: Table<CalendarEvent, string>;
  focusSessions!: Table<FocusSession, string>;
  catProfile!: Table<CatProfile, string>;
  inventory!: Table<CatInventoryItem, string>;
  itemCatalog!: Table<ItemCatalog, string>;
  journalEntries!: Table<JournalEntry, string>;
  tarotDraws!: Table<TarotDraw, string>;
  tarotCards!: Table<TarotCard, string>;
  lunarCache!: Table<LunarCache, string>;
  appSettings!: Table<AppSettings, string>;
  securityKeyMeta!: Table<SecurityKeyMeta, string>;

  constructor() {
    super('MoonPawDB');

    // Version 1 (Initial Release)
    this.version(1).stores(DB_SCHEMA_V1);

    // Version 2 (Future schema migration template)
    // this.version(2).stores({
    //   tasks: 'id, status, priority, dueDate, createdAt, *tags, completedAt, categoryId',
    // }).upgrade(async tx => {
    //   await tx.table('tasks').toCollection().modify(task => {
    //     task.categoryId = 'default';
    //   });
    // });
  }
}
```

---

## 6. Export Envelope & Serialization Format

MoonPaw exports a single portable, encrypted `.moonpaw` backup file. The unencrypted envelope structure is defined as:

```json
{
  "version": 1,
  "exportedAt": "2026-10-08T15:45:00.000Z",
  "appVersion": "1.0.0",
  "checksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "payload": {
    "tasks": [...],
    "calendarEvents": [...],
    "focusSessions": [...],
    "catProfile": {...},
    "inventory": [...],
    "journalEntries": [...],
    "tarotDraws": [...],
    "appSettings": {...}
  }
}
```
When user-password encryption is enabled, the entire `payload` is encrypted using AES-256-GCM, and the resulting file contains only the cryptographic envelope headers (Salt, IV, Auth Tag, Ciphertext).
