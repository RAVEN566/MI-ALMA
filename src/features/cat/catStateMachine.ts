// src/features/cat/catStateMachine.ts
import * as PIXI from 'pixi.js';

/**
 * All possible cat states – must match the list in the design doc.
 */
export type CatState =
  | 'IDLE'
  | 'WALKING'
  | 'RUNNING'
  | 'SITTING'
  | 'SLEEPING'
  | 'GROOMING'
  | 'CHASING'
  | 'POUNCING'
  | 'PETTING'
  | 'PURRING'
  | 'ANNOYED'
  | 'HISSING'
  | 'RETREATING'
  | 'EATING'
  | 'YARN_PLAY'
  | 'TV_WATCHING'
  | 'FOCUSING'
  | 'CELEBRATING';

/**
 * Very small placeholder animation – we simply change the tint of a circle.
 * In a real implementation this would load a spritesheet per state.
 */
export class CatStateMachine {
  private container: PIXI.Container;
  private graphic: PIXI.Graphics;
  private currentState: CatState = 'IDLE';
  private debugCallback: (info: any) => void;

  constructor(container: PIXI.Container, debugCallback: (info: any) => void) {
    this.container = container;
    this.debugCallback = debugCallback;
    this.graphic = new PIXI.Graphics();
    this.container.addChild(this.graphic);
    this.renderState();
  }

  /**
   * Switch to a new state – updates the rendered graphic.
   */
  setState(state: CatState) {
    this.currentState = state;
    this.renderState();
    this.debugCallback?.({ state, x: this.container.x, y: this.container.y });
  }

  getState(): CatState {
    return this.currentState;
  }

  /**
   * Render a simple circle with a colour that represents the state.
   * Colours are chosen arbitrarily but give visual feedback.
   */
  private renderState() {
    // Clear previous drawing
    this.graphic.clear();
    const size = 48; // 48×48 as per asset spec
    const colorMap: Record<CatState, number> = {
      IDLE: 0x222222,
      WALKING: 0x555555,
      RUNNING: 0x888888,
      SITTING: 0xaaaaaa,
      SLEEPING: 0x444444,
      GROOMING: 0x333333,
      CHASING: 0x0066ff,
      POUNCING: 0xff6600,
      PETTING: 0xff00ff,
      PURRING: 0x00ff00,
      ANNOYED: 0xff0000,
      HISSING: 0x999999,
      RETREATING: 0x6600ff,
      EATING: 0xffff00,
      YARN_PLAY: 0x00ffff,
      TV_WATCHING: 0x008800,
      FOCUSING: 0x880088,
      CELEBRATING: 0xffd700,
    } as const;
    const colour = colorMap[this.currentState] ?? 0xffffff;
    this.graphic.beginFill(colour);
    this.graphic.drawCircle(size / 2, size / 2, size / 2);
    this.graphic.endFill();
    // Center the graphic inside the container
    this.graphic.x = -size / 2;
    this.graphic.y = -size / 2;
  }
}

// Factory to create a state machine with animation map
export function createStateMachine(
  anims: Record<CatState, PIXI.AnimatedSprite>,
  debugCallback: (info: any) => void,
) {
  const container = new PIXI.Container();
  // Attach animations to container (hidden initially)
  Object.values(anims).forEach((anim) => {
    anim.visible = false;
    container.addChild(anim);
  });
  const sm = new CatStateMachine(container, debugCallback);
  // Extend setState to handle animation visibility
  const originalSetState = sm.setState.bind(sm);
  sm.setState = (state: CatState) => {
    Object.values(anims).forEach((a) => (a.visible = false));
    const anim = anims[state];
    if (anim) {
      anim.visible = true;
    }
    originalSetState(state);
  };
  // expose container for external positioning if needed
  (sm as any).container = container;
  return sm;
}
