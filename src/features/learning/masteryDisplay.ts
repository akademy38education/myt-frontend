import { MasteryLevel } from "@myt/shared";

/**
 * Display metadata for a mastery band, matching the color language already
 * used by `features/mastery/components/MasteryMap` (not imported directly —
 * that module owns its own internals) so this feature's badges read as the
 * same product. Labels follow the Phase 12 band names (shared/constants/mastery.ts).
 */
export const MASTERY_LEVEL_META: Record<MasteryLevel, { label: string; className: string }> = {
  [MasteryLevel.NOT_STARTED]: { label: "Not started", className: "bg-muted text-muted-foreground border-border" },
  [MasteryLevel.EMERGING]: { label: "Learning", className: "bg-destructive/10 text-destructive border-destructive/20" },
  [MasteryLevel.DEVELOPING]: { label: "Developing", className: "bg-warning/15 text-warning-foreground border-warning/30" },
  [MasteryLevel.SECURE]: { label: "Proficient", className: "bg-secondary/10 text-secondary border-secondary/20" },
  [MasteryLevel.MASTERED]: { label: "Mastered", className: "bg-success/15 text-success border-success/30" },
};
