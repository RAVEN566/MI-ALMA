// src/features/cat/moodManager.ts
/**
 * Simple mood manager for the cat.
 * Mood is a numeric value from -100 (sad) to +100 (happy).
 * It decays toward 0 over time and can be affected by interactions.
 */
export type Mood = number;

export class MoodManager {
  private mood: Mood = 0;
  private decayRate: number = 1; // per second

  /** Get current mood value */
  getMood(): Mood {
    return this.mood;
  }

  /** Adjust mood by delta */
  adjust(delta: number) {
    this.mood = Math.max(-100, Math.min(100, this.mood + delta));
  }

  /** Decay mood towards neutral over elapsed seconds */
  decay(seconds: number) {
    if (this.mood > 0) {
      this.mood = Math.max(0, this.mood - this.decayRate * seconds);
    } else if (this.mood < 0) {
      this.mood = Math.min(0, this.mood + this.decayRate * seconds);
    }
  }
}

/** Initialise a MoodManager with default settings */
export function initMoodManager() {
  return new MoodManager();
}
