// src/features/cat/soundController.ts
/**
 * Simple sound controller for the cat.
 * Plays audio cues based on cat state. Uses HTMLAudioElement.
 * Placeholder audio files should be placed under public/assets/sounds/.
 */
export class SoundController {
  private audioMap: Record<string, HTMLAudioElement> = {};

  constructor() {
    // Load placeholder sounds – ensure files exist or use silent placeholders.
    this.load('PURRING', '/assets/sounds/purr.mp3');
    this.load('HISSING', '/assets/sounds/hiss.mp3');
    this.load('CELEBRATING', '/assets/sounds/celebrate.mp3');
  }

  private load(name: string, src: string) {
    const audio = new Audio(src);
    audio.preload = 'auto';
    this.audioMap[name] = audio;
  }

  /** Play sound for a given cat state if available */
  play(state: string) {
    const audio = this.audioMap[state];
    if (audio) {
      // small restart logic
      audio.currentTime = 0;
      audio.play().catch(() => {
        // ignore play errors (e.g., user gesture not yet made)
      });
    }
  }

  /** Stop all sounds */
  stopAll() {
    Object.values(this.audioMap).forEach((a) => a.pause());
  }
}

/** Initialise a new SoundController */
export function initSoundController() {
  return new SoundController();
}
