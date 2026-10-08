import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '@/db/database';
import { initializeDatabaseSeed } from '@/db/seed';

describe('MoonPaw Dexie Database & Seed', () => {
  beforeEach(async () => {
    await db.tasks.clear();
    await db.catProfile.clear();
    await db.appSettings.clear();
  });

  it('initializes default cat profile and settings', async () => {
    await initializeDatabaseSeed();

    const cat = await db.catProfile.get('primary_cat');
    expect(cat).toBeDefined();
    expect(cat?.name).toBe('Luna');
    expect(cat?.level).toBe(1);
    expect(cat?.hunger).toBeGreaterThan(0);

    const settings = await db.appSettings.get('user_settings');
    expect(settings).toBeDefined();
    expect(settings?.theme).toBe('dark');

    const tasks = await db.tasks.toArray();
    expect(tasks.length).toBeGreaterThanOrEqual(2);
  });

  it('supports creating and updating tasks in IndexedDB', async () => {
    const taskId = 'test-task-1';
    await db.tasks.put({
      id: taskId,
      title: 'Starlight Meditation',
      priority: 'starlight',
      status: 'pending',
      tags: ['ritual'],
      subtasks: [],
      actualMinutes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const retrieved = await db.tasks.get(taskId);
    expect(retrieved?.title).toBe('Starlight Meditation');
    expect(retrieved?.status).toBe('pending');

    await db.tasks.update(taskId, { status: 'completed' });
    const updated = await db.tasks.get(taskId);
    expect(updated?.status).toBe('completed');
  });
});
