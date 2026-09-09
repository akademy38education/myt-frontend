import { cn } from "@/utils/cn";

export interface FloatingShapeProps {
  shape?: "circle" | "square" | "ring";
  size?: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  color?: "primary" | "secondary";
  delay?: string;
  className?: string;
}

/**
 * A tiny outlined shape that drifts and rotates very slowly — a subtle
 * "educational particle" accent for marketing surfaces (not a blurred blob,
 * not a filled icon). Use sparingly: 2-4 per section, never a swarm.
 */
export function FloatingShape({ shape = "circle", size = 20, top, left, right, bottom, color = "primary", delay = "0s", className }: FloatingShapeProps) {
  const shapeClass = shape === "square" ? "rounded-md" : "rounded-full";

  return (
    <div
      aria-hidden="true"
      className={cn("myt-shape-drift pointer-events-none absolute border-2", shapeClass, className)}
      style={{
        width: size,
        height: size,
        top,
        left,
        right,
        bottom,
        borderColor: `hsl(var(--${color}) / 0.3)`,
        background: shape === "ring" ? "transparent" : `hsl(var(--${color}) / 0.08)`,
        animationDelay: delay,
      }}
    />
  );
}
