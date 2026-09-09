import type { ReactNode, CSSProperties } from "react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/utils/cn";

/**
 * Wraps content that should subtly fade+slide in the first time it scrolls
 * into view — used for marketing sections so motion supports scanning the
 * page rather than competing with it. Renders at full opacity immediately
 * when `prefers-reduced-motion` is set, rather than relying on CSS to
 * cancel an animation that would otherwise still jump from opacity 0.
 */
export function Reveal({ children, className, delayMs = 0 }: { children: ReactNode; className?: string; delayMs?: number }) {
  const { ref, isInView } = useInView<HTMLDivElement>();
  const prefersReducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const style: CSSProperties = { animationDelay: `${delayMs}ms`, animationDuration: "600ms" };

  return (
    <div
      ref={ref}
      className={cn("fill-mode-both", isInView ? "animate-in fade-in slide-in-from-bottom-3" : "opacity-0", className)}
      style={isInView ? style : undefined}
    >
      {children}
    </div>
  );
}
