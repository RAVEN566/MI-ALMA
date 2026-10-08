// src/services/rewardService.ts
import { db } from '@/db/database';
import type { RewardTransaction, CatProfile } from '@/types/db.types';
// UUID generation helper – replaces external uuid package
function uuidv4(): string {
  if (typeof crypto !== 'undefined' && (crypto as any).randomUUID) {
    return (crypto as any).randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}


/**
 * Record a generic reward transaction.
 * @param type - "focus" | other types (future extensions)
 * @param stardustEarned - number of stardust awarded
 * @param xpEarned - number of xp awarded
 */
export async function addRewardTransaction(type: 'focus', stardustEarned: number, xpEarned: number) {
  const now = new Date().toISOString();
  const tx: RewardTransaction = {
    id: uuidv4(),
    type,
    stardustEarned,
    xpEarned,
    timestamp: now,
    // other optional fields can be added later
  } as RewardTransaction;
  await db.rewardTransactions.add(tx);
  return tx;
}

/**
 * Apply a focus‑session reward to the cat profile.
 * Increments stardust and xp according to the session length.
 */
export async function grantFocusReward(stardustEarned: number, xpEarned: number) {
  // Update cat profile (primary cat)
  const cat = await db.catProfile.get('primary_cat');
  if (!cat) return;
  const newStardust = Math.max(0, cat.stardust + stardustEarned);
  const newXp = cat.xp + xpEarned;
  await db.catProfile.update('primary_cat', {
    stardust: newStardust,
    xp: newXp,
    // optional: lastInteractedAt may be updated elsewhere
  });
  // Record the transaction
  await addRewardTransaction('focus', stardustEarned, xpEarned);
}
