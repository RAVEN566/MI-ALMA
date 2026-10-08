// src/features/cat/touchController.ts
import * as PIXI from 'pixi.js';
import { CatStateMachine } from './catStateMachine';
import { PositionManager } from './positionManager';

/**
 * Handles user interaction (touch / click) on the cat canvas.
 * For demo purposes, tapping cycles through a few states.
 */
export function initTouchController(
  view: HTMLCanvasElement,
  stateMachine: CatStateMachine,
  positionMgr: PositionManager
) {
  const handler = () => {
    // Simple interaction: toggle between IDLE and PETTING
    const current = stateMachine.getState();
    if (current === 'IDLE') {
      stateMachine.setState('PETTING');
    } else {
      stateMachine.setState('IDLE');
    }
  };
  view.addEventListener('pointerdown', handler);

  // Return a cleanup function
  return {
    destroy() {
      view.removeEventListener('pointerdown', handler);
    },
  };
}
