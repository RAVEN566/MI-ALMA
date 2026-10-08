// src/features/cat/activityScheduler.ts
import { CatStateMachine } from './catStateMachine';
import { MoodManager } from './moodManager';
import { SoundController } from './soundController';

/**
 * Simple activity scheduler that triggers random cat activities at intervals.
 * It uses the state machine to change states, updates mood, and plays sounds.
 */
export function scheduleActivities(
  stateMachine: CatStateMachine,
  moodMgr: MoodManager,
  soundCtrl: SoundController,
) {
  let intervalId: number | undefined;
  const possibleActivities: Array<{ state: string; moodDelta: number }> = [
    { state: 'YARN_PLAY', moodDelta: 15 },
    { state: 'GROOMING', moodDelta: 10 },
    { state: 'PURRING', moodDelta: 5 },
    { state: 'HISSING', moodDelta: -10 },
    { state: 'CHASING', moodDelta: 10 },
    { state: 'EATING', moodDelta: 20 },
    { state: 'CELEBRATING', moodDelta: 25 },
  ];

  const randomActivity = () => {
    const act = possibleActivities[Math.floor(Math.random() * possibleActivities.length)];
    // Change state
    // @ts-ignore – state is a valid CatState
    stateMachine.setState(act.state as any);
    // Adjust mood
    moodMgr.adjust(act.moodDelta);
    // Play associated sound if any
    soundCtrl.play(act.state);
    // Return to idle after a short delay
    setTimeout(() => stateMachine.setState('IDLE'), 2000);
  };

  return {
    start() {
      // Trigger an activity every 15‑30 seconds randomly.
      const min = 15000;
      const max = 30000;
      const scheduleNext = () => {
        const delay = Math.floor(Math.random() * (max - min + 1)) + min;
        intervalId = setTimeout(() => {
          randomActivity();
          scheduleNext();
        }, delay) as unknown as number;
      };
      scheduleNext();
    },
    stop() {
      if (intervalId !== undefined) {
        clearTimeout(intervalId);
        intervalId = undefined;
      }
    },
  };
}
