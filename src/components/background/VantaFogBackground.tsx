import { useEffect, useRef, useState } from "react";
import type { VantaEffectInstance } from "vanta/dist/vanta.clouds.min";
import { cn } from "@/utils/cn";

/** Vanta FOG color config — matches the exact values the user picked in the Vanta.js customizer. */
const FOG_COLORS = {
  highlightColor: 0xffc300,
  midtoneColor: 0xff1f00,
  lowlightColor: 0x2d00ff,
  baseColor: 0xffebeb,
  blurFactor: 0.6,
  zoom: 1,
  speed: 1,
};

/**
 * The Parent Dashboard's page background — the `VANTA.FOG` effect, scoped
 * to that one page only (not the rest of the Parent area, not other
 * roles — a separate, later request). Mounted directly in
 * `ParentDashboardPage.tsx`, not at the layout level (contrast with the
 * Student area's `VantaRingsBackground`, which the user explicitly asked
 * to run across every page under `/student`).
 *
 * `position: fixed` (not `absolute`) so it stays pinned behind the content
 * while the page's own scroll container moves, rather than scrolling away.
 *
 * Same lifecycle discipline as the other Vanta backgrounds: `three` +
 * `vanta` are loaded via a runtime `import()` inside the effect (not a
 * static top-level import) so this ~600kB dependency is only fetched when
 * a parent actually opens their dashboard, never bundled into every other
 * page/role. Destroyed on unmount; guarded against the async import
 * resolving after the component has already unmounted.
 *
 * Under `prefers-reduced-motion: reduce`, Vanta/three are never fetched at
 * all and a static gradient (matching the same palette) renders instead.
 */
export function VantaFogBackground({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const effectRef = useRef<VantaEffectInstance | null>(null);
  const [reducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;
    let cancelled = false;

    Promise.all([import("three"), import("vanta/dist/vanta.fog.min")]).then(([THREE, { default: FOG }]) => {
      if (cancelled || !containerRef.current) return;
      effectRef.current = FOG({
        el: containerRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        ...FOG_COLORS,
      });
    });

    return () => {
      cancelled = true;
      effectRef.current?.destroy();
      effectRef.current = null;
    };
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#ffebeb]",
        reducedMotion && "bg-gradient-to-br from-[#ffebeb] to-[#ffc300]",
        className
      )}
    />
  );
}
