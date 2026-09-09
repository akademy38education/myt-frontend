import type { ReactNode } from "react";
import { AnimatedBackground } from "@/components/shared/AnimatedBackground";
import { AnimatedLearningBackground } from "@/components/shared/AnimatedLearningBackground";
import { Caption } from "@/components/ui/typography";
import { cn } from "@/utils/cn";

export interface HeroProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  align?: "left" | "center";
  size?: "default" | "compact";
  className?: string;
  children?: ReactNode;
  /**
   * Replaces Hero's default background layers (the CSS ambient system +
   * gradient wash) with a custom one — used by the Home Page to swap in
   * `VantaCloudsBackground` (Prompt 21) without leaking that heavier,
   * WebGL-based dependency into every other page that renders a `Hero`.
   * Every other Hero usage is unaffected and keeps the default background.
   */
  backgroundSlot?: ReactNode;
}

/**
 * The reusable hero section used at the top of every marketing page —
 * animated brand backdrop + eyebrow/title/description/actions, so every
 * page's "top of page" moment feels like the same product.
 */
export function Hero({ eyebrow, title, description, actions, align = "center", size = "default", className, children, backgroundSlot }: HeroProps) {
  return (
    <section className={cn("relative overflow-hidden", !backgroundSlot && "bg-gradient-to-b from-accent/60 to-background", className)}>
      {backgroundSlot ?? (
        <>
          {/* Two layers, deliberately: AnimatedBackground gives the hero its
              established blob/glow/particle wash, and the richer "hero" variant
              of the global ambient system adds subject nodes + faint connection
              lines beneath it — the hero is the one place the ambient system is
              allowed to be more expressive than the rest of the site (Prompt 20 §20). */}
          <AnimatedLearningBackground variant="hero" intensity="normal" />
          <AnimatedBackground />
        </>
      )}
      <div
        className={cn(
          "relative z-10 mx-auto max-w-6xl px-4",
          size === "default" ? "py-20 sm:py-28" : "py-14 sm:py-20",
          align === "center" ? "text-center" : "text-left"
        )}
      >
        {eyebrow && <Caption className={cn("mb-3 block text-primary", align === "center" && "text-center")}>{eyebrow}</Caption>}
        <div className={cn(align === "center" && "mx-auto max-w-3xl")}>
          <h1 className={cn("font-bold tracking-tight", size === "default" ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl")}>
            {title}
          </h1>
          {description && (
            <p className={cn("mt-6 text-lg text-muted-foreground", align === "center" && "mx-auto max-w-2xl")}>{description}</p>
          )}
        </div>
        {actions && (
          <div className={cn("mt-8 flex flex-col gap-3 sm:flex-row", align === "center" ? "items-center justify-center" : "items-start")}>
            {actions}
          </div>
        )}
        {/* Standard breathing room below the CTA row for any hero illustration/diagram —
            centralized here (rather than left to each call site's own margin) so every
            page that passes `children` gets the same comfortable, responsive gap. */}
        {children && <div className="mt-20 lg:mt-24">{children}</div>}
      </div>
    </section>
  );
}
