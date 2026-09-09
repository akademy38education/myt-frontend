import { cn } from "@/utils/cn";

/**
 * Three small dots with a staggered opacity pulse — a quiet "something is
 * happening" indicator (e.g. tutor typing, AI summary generating). Opacity
 * only (no bounce/scale), and stilled to a static low-opacity state under
 * `prefers-reduced-motion` via the shared `.myt-dot-pulse` rule.
 */
export function AnimatedDots({ className, color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <span aria-hidden="true" className={cn("inline-flex items-center gap-1", className)}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="myt-dot-pulse h-1.5 w-1.5 rounded-full"
          style={{ background: color, animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </span>
  );
}
