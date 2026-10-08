// src/features/cat/positionManager.ts
import * as PIXI from 'pixi.js';

/**
 * Manages the cat's position within the canvas bounds.
 */
export class PositionManager {
  private container: PIXI.Container;
  private maxWidth: number;
  private maxHeight: number;

  constructor(container: PIXI.Container, maxWidth: number, maxHeight: number) {
    this.container = container;
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    // centre initially
    this.container.x = maxWidth / 2;
    this.container.y = maxHeight / 2;
  }

  /** Move horizontally by delta pixels. */
  moveBy(delta: number) {
    this.container.x += delta;
    this.enforceBounds();
  }

  private enforceBounds() {
    const half = 24; // half cat size
    if (this.container.x < half) this.container.x = half;
    if (this.container.x > this.maxWidth - half) this.container.x = this.maxWidth - half;
    // vertical bounds for future use
    if (this.container.y < half) this.container.y = half;
    if (this.container.y > this.maxHeight - half) this.container.y = this.maxHeight - half;
  }
}

/** Helper to initialise manager using current renderer size. */
export function initPositionManager(width: number, height: number) {
  const dummy = new PIXI.Container();
  const mgr = new PositionManager(dummy, width, height);
  // allow container to be set later
  (mgr as any).setContainer = (c: PIXI.Container) => {
    (mgr as any).container = c;
    c.x = width / 2;
    c.y = height / 2;
  };
  return mgr as PositionManager & { setContainer: (c: PIXI.Container) => void };
}
