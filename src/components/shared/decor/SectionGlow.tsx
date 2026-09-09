import { cn } from "@/utils/cn";

export interface SectionGlowProps {
  color?: "primary" | "secondary";
  size?: string;
  className?: string;
  /** Very slow breathing effect; off by default so most uses are a static glow. */
  animate?: boolean;
}

/**
 * A soft centered radial glow to sit behind a heading or a small cluster of
 * cards — for giving one section a gentle focal point without a full
 * `AnimatedBackground`. Render as the first child of a `relative` parent.
 */
export function SectionGlow({ color = "secondary", size = "60%", className, animate = false }: SectionGlowProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden", className)}
    >
      <div
        className={cn("rounded-full", animate && "myt-glow-pulse")}
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle, hsl(var(--${color}) / 0.16), transparent 70%)`,
        }}
      />
    </div>
  );
}
