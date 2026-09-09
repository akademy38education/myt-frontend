import { MasteryLevel } from "../types/enums";

/**
 * The single source of truth for what a mastery score means — referenced by
 * both `masteryService.recalculate()` (backend) and any frontend display
 * that needs to explain a score, never hardcoded a second time anywhere
 * else (Phase 12 spec §7). Thresholds are the lower bound of each band
 * (inclusive), checked highest-first.
 */
export const MASTERY_THRESHOLDS: Array<{ level: MasteryLevel; min: number }> = [
  { level: MasteryLevel.MASTERED, min: 90 },
  { level: MasteryLevel.SECURE, min: 75 },
  { level: MasteryLevel.DEVELOPING, min: 50 },
  { level: MasteryLevel.EMERGING, min: 25 },
  { level: MasteryLevel.NOT_STARTED, min: 0 },
];

export function scoreToMasteryLevel(score: number): MasteryLevel {
  for (const { level, min } of MASTERY_THRESHOLDS) {
    if (score >= min) return level;
  }
  return MasteryLevel.NOT_STARTED;
}

/** A topic needs at least this many pieces of graded evidence before a score is meaningful — fewer than this and it stays NOT_STARTED regardless of how the few available answers went (Phase 12 spec §30: "Avoid marking a topic weak from one mistake"). */
export const MIN_EVIDENCE_FOR_SCORE = 2;

/** A topic is "stale" (candidate for revision) once this many days pass with no graded activity. */
export const REVISION_STALE_DAYS = 21;
