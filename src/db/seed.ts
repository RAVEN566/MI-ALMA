import { db } from './database';
import type { CatProfile, AppSettings, Task } from '@/types/db.types';

export async function initializeDatabaseSeed(): Promise<void> {
  // Check if cat profile exists
  const existingCat = await db.catProfile.get('primary_cat');
  if (!existingCat) {
    const defaultCat: CatProfile = {
      id: 'primary_cat',
      name: 'Luna',
      breed: 'Celestial Shorthair',
      level: 1,
      xp: 0,
      stardust: 100,
      hunger: 85,
      happiness: 95,
      energy: 90,
      currentMood: 'content',
      equippedAccessories: {},
      lastFedAt: new Date().toISOString(),
      lastPettedAt: new Date().toISOString(),
      lastInteractedAt: new Date().toISOString(),
    };
    await db.catProfile.put(defaultCat);
  }

  // Check if settings exist
  const existingSettings = await db.appSettings.get('user_settings');
  if (!existingSettings) {
    const defaultSettings: AppSettings = {
      id: 'user_settings',
      theme: 'dark',
      quietHoursEnabled: true,
      quietHoursStart: '22:00',
      quietHoursEnd: '08:00',
      notificationsEnabled: false,
      soundEnabled: true,
      soundVolume: 0.8,
      reducedMotion: false,
      installedAsPwa: false,
    };
    await db.appSettings.put(defaultSettings);
  }

  // Check if initial tasks exist
  const taskCount = await db.tasks.count();
  if (taskCount === 0) {
    const now = new Date().toISOString();
    const initialTasks: Task[] = [
      {
        id: 'task-seed-1',
        title: 'Greet Luna in the celestial sanctuary',
        description: 'Spend a mindful moment with your new celestial companion.',
        priority: 'starlight',
        status: 'pending',
        tags: ['welcome', 'companion'],
        subtasks: [
          { id: 'sub-1', title: 'Say hello to Luna', completed: false },
          { id: 'sub-2', title: 'Check current lunar phase', completed: false },
        ],
        actualMinutes: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'task-seed-2',
        title: 'Complete your first Starlight focus session',
        description: 'Try a 25-minute Pomodoro timer or 10-minute sprint to earn Stardust.',
        priority: 'moonlight',
        status: 'pending',
        tags: ['focus', 'ritual'],
        subtasks: [],
        actualMinutes: 0,
        createdAt: now,
        updatedAt: now,
      },
    ];
    await db.tasks.bulkPut(initialTasks);
  }
}
