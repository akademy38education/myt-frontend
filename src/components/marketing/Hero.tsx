import type { ReactNode } from "react";
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
   * `CloudSkyBackground`. Every other Hero usage is unaffected and keeps
   * the default background.
   */
  backgroundSlot?: ReactNode;
}

/**
 * The reusable hero section used at the top of every marketing page —
 * warm, static brand backdrop + eyebrow/title/description/actions, so every
 * page's "top of page" moment feels like the same product.
 *
 * Previously ran an animated particle/node/connection-line ambient system
 * here — replaced with a plain warm gradient after feedback that the
 * floating tech-visualization motion read as generic SaaS rather than an
 * education platform. A calm, static backdrop plus real content carries the
 * "education" feeling instead (the same approach the Tiny Steps/Own Sandbox
 * references take — almost no ambient motion, warmth from color and copy).
 */
export function Hero({ eyebrow, title, description, actions, align = "center", size = "default", className, children, backgroundSlot }: HeroProps) {
  return (
    <section className={cn("relative overflow-hidden", !backgroundSlot && "bg-gradient-to-b from-warm to-background", className)}>
      {backgroundSlot}
      <div
        className={cn(
          "relative z-10 mx-auto max-w-6xl px-4",
          size === "default" ? "py-20 sm:py-28" : "py-14 sm:py-20",
          align === "center" ? "text-center" : "text-left"
        )}
      >
        {/*
          `backgroundSlot` (Vanta Clouds on the Home Page) is a live WebGL
          canvas redrawn every frame — `backdrop-blur` here would force the
          browser to re-blur that canvas continuously, which is exactly what
          caused the reported stutter. A solid-enough panel (no blur) gives
          the same contrast/readability for free.
        */}
        <div className={cn(backgroundSlot && "rounded-3xl border border-white/40 bg-white/85 px-6 py-8 shadow-lg sm:px-10 sm:py-10")}>
          {eyebrow && (
            <Caption className={cn("mb-4 flex items-center gap-2 text-primary", align === "center" ? "justify-center text-center" : "justify-start")}>
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              {eyebrow}
            </Caption>
          )}
          <div className={cn(align === "center" && "mx-auto max-w-4xl")}>
            <h1
              className={cn(
                "font-bold leading-[1.05] tracking-tight text-foreground",
                size === "default" ? "text-5xl sm:text-6xl lg:text-7xl" : "text-3xl sm:text-4xl"
              )}
            >
              {title}
            </h1>
            {description && (
              <p
                className={cn(
                  "mt-6 text-lg",
                  backgroundSlot ? "text-foreground/80" : "text-muted-foreground",
                  align === "center" && "mx-auto max-w-2xl"
                )}
              >
                {description}
              </p>
            )}
          </div>
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
