import { cn } from "@/utils/cn";

export interface GradientBlobProps {
  size?: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  opacity?: number;
  className?: string;
}

/**
 * A large brand-gradient wash, blurred into a soft blob — for giving a
 * section (e.g. a pricing card, a CTA band) a subtle color lift without a
 * full `AnimatedBackground`. Static by default (no motion), since it's
 * meant as a color accent rather than a moving element.
 */
export function GradientBlob({ size = 380, top, left, right, bottom, opacity = 0.16, className }: GradientBlobProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute rounded-full", className)}
      style={{
        width: size,
        height: size,
        top,
        left,
        right,
        bottom,
        backgroundImage: "var(--gradient-brand)",
        filter: "blur(80px)",
        opacity,
      }}
    />
  );
}
