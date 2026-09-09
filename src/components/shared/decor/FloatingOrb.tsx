import { cn } from "@/utils/cn";

export interface FloatingOrbProps {
  color?: "primary" | "secondary";
  size?: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  /** Cycles through 3 slightly different drift paths/durations so multiple orbs never move in lockstep. */
  variant?: 1 | 2 | 3;
  opacity?: number;
  className?: string;
}

/**
 * A single large, softly-blurred drifting circle — the base shape behind
 * `AnimatedLearningBackground`. Also usable standalone for a section that
 * wants one subtle accent shape rather than a full background. CSS
 * transform/opacity only; stilled under `prefers-reduced-motion`.
 */
export function FloatingOrb({ color = "primary", size = 320, top, left, right, bottom, variant = 1, opacity = 0.18, className }: FloatingOrbProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("myt-orb", `myt-orb-${variant}`, className)}
      style={{
        width: size,
        height: size,
        top,
        left,
        right,
        bottom,
        background: `hsl(var(--${color}) / 1)`,
        opacity,
      }}
    />
  );
}
