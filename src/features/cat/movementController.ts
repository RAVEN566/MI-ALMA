// src/features/cat/movementController.ts
import * as PIXI from 'pixi.js';
import { CatStateMachine } from './catStateMachine';
import { PositionManager } from './positionManager';

/**
 * Configuration for movement speeds per state (pixels per second).
 */
const speedMap: Record<string, number> = {
  IDLE: 0,
  WALKING: 30,
  RUNNING: 80,
  SITTING: 0,
  SLEEPING: 0,
  GROOMING: 0,
  CHASING: 60,
  POUNCING: 70,
  PETTING: 0,
  PURRING: 0,
  ANNOYED: 20,
  HISSING: 20,
  RETREATING: 50,
  EATING: 0,
  YARN_PLAY: 40,
  TV_WATCHING: 0,
  FOCUSING: 0,
  CELEBRATING: 50,
};

/**
 * Starts a movement loop tied to the PIXI ticker.
 * The loop reads the cat's current state, looks up a speed, and moves the container.
 */
export function startMovementLoop(
  ticker: PIXI.Ticker,
  stateMachine: CatStateMachine,
  positionMgr: PositionManager
) {
  const update = (delta: number) => {
    const state = stateMachine.getState();
    const speed = speedMap[state] ?? 0; // px per second
    if (speed > 0) {
      const distance = (speed * delta) / ticker.FPS; // delta is frames
      positionMgr.moveBy(distance);
    }
  };

  return {
    start() {
      ticker.add(update);
    },
    stop() {
      ticker.remove(update);
    },
  };
}
