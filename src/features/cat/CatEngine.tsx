// src/features/cat/CatEngine.tsx
import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import { createStateMachine, CatState } from './catStateMachine';
import { startMovementLoop } from './movementController';
import { initPositionManager } from './positionManager';
import { initMoodManager } from './moodManager';
import { initTouchController } from './touchController';
import { initSoundController } from './soundController';
import { scheduleActivities } from './activityScheduler';
import { useAppSettings } from '@/context/AppSettingsContext'; // hypothetical context for user settings

/**
 * Main interactive cat component using PixiJS.
 * Renders a canvas that fills its container and runs the cat engine.
 * Debug overlay is only shown in development mode.
 */
export const CatEngine: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const { settings } = useAppSettings(); // expects "disableCat" flag

  // Initialise Pixi Application once
  useEffect(() => {
    if (!canvasRef.current) return;
    const app = new PIXI.Application({
      backgroundAlpha: 0,
      resizeTo: canvasRef.current,
      antialias: true,
      autoDensity: true,
    });
    canvasRef.current.appendChild(app.view as HTMLCanvasElement);
    appRef.current = app;

    // Load sprite sheets – placeholders for now
    const loader = new PIXI.Loader();
    const states: CatState[] = [
      'IDLE', 'WALKING', 'RUNNING', 'SITTING', 'SLEEPING', 'GROOMING',
      'CHASING', 'POUNCING', 'PETTING', 'PURRING', 'ANNOYED', 'HISSING',
      'RETREATING', 'EATING', 'YARN_PLAY', 'TV_WATCHING', 'FOCUSING', 'CELEBRATING'
    ];
    states.forEach((s) => {
      // Expect each state to have a spritesheet JSON or image sequence in assets/cat/${s}.json
      loader.add(s, `/assets/cat/${s}.json`);
    });
    loader.load((_loader, resources) => {
      // Create animated sprites for each state and store them on the stage container
      const container = new PIXI.Container();
      app.stage.addChild(container);
      const anims: Record<CatState, PIXI.AnimatedSprite> = {} as any;
      states.forEach((s) => {
        const sheet = resources[s]?.spritesheet;
        if (!sheet) return;
        const anim = new PIXI.AnimatedSprite(sheet.animations[s]);
        anim.animationSpeed = 0.15;
        anim.loop = true;
        anim.visible = false;
        container.addChild(anim);
        anims[s] = anim;
      });

      // Initialise subsystems with shared context
      const stateMachine = createStateMachine(anims, setDebugInfo);
      const positionMgr = initPositionManager(app.renderer.width, app.renderer.height);
      (positionMgr as any).setContainer(container);
      const moodMgr = initMoodManager();
      const soundCtrl = initSoundController();
      const touchCtrl = initTouchController(app.view, stateMachine, positionMgr);
      const movementLoop = startMovementLoop(app.ticker, stateMachine, positionMgr);
      const activitySched = scheduleActivities(stateMachine, moodMgr, soundCtrl);

      // Kick‑off the engine
      stateMachine.setState('IDLE');
      movementLoop.start();
      activitySched.start();

      // Cleanup on unmount
      app.ticker.add(() => {
        // placeholder tick – could be used for mood decay etc.
      });
    });

    return () => {
      app.destroy(true, { children: true, texture: true, baseTexture: true });
      appRef.current = null;
    };
  }, []);

  // Respect user setting to hide cat
  if (settings?.disableCat) return null;

  return (
    <div className="relative w-full h-full" ref={canvasRef}>
      {/* Development debug overlay */}
      {process.env.NODE_ENV !== 'production' && debugInfo && (
        <pre className="absolute inset-0 text-xs bg-black bg-opacity-50 text-white p-2 pointer-events-none">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      )}
    </div>
  );
};
