import { useEffect, useRef, useState } from "react";
import type { VantaEffectInstance } from "vanta/dist/vanta.clouds.min";
import { cn } from "@/utils/cn";

/** Vanta TOPOLOGY color config — matches the exact values the user picked in the Vanta.js customizer. */
const TOPOLOGY_COLORS = {
  color: 0xffffff,
  backgroundColor: 0x3f5454,
};

/**
 * The Tutor Dashboard's page background — the `VANTA.TOPOLOGY` effect,
 * scoped to that one page only (not the rest of the Tutor area, not other
 * roles — a separate, later request, same pattern as the Parent
 * Dashboard's `VantaFogBackground`). Mounted directly in
 * `TutorDashboardPage.tsx`, not at the layout level.
 *
 * Unlike the other Vanta backgrounds here, TOPOLOGY is built on p5.js, not
 * three.js — its bundle reads `window.p5` directly at module-evaluation
 * time (there's no `p5`-style option to pass in), so `p5` must be imported
 * and assigned to `window.p5` BEFORE the effect module is imported, not
 * just before calling it. Both imports still happen lazily inside this
 * effect (not a static top-level import) so the ~350kB p5 dependency is
 * only fetched when a tutor actually opens their dashboard.
 *
 * `position: fixed` (not `absolute`) so it stays pinned behind the content
 * while the page's own scroll container moves. Destroyed on unmount;
 * guarded against the async import resolving after unmount.
 *
 * IMPORTANT (learned the hard way on the Parent Dashboard): this
 * component's own `fixed` container must NOT be wrapped in an extra
 * `isolate` at the page level — `RoleShellLayout`'s root already
 * establishes the one stacking context needed for a `-z-10` fixed
 * background to correctly stay behind the Sidebar/Topbar; nesting a
 * second `isolate` inside the page breaks that and makes the background
 * paint over the sidebar instead of behind it.
 *
 * Under `prefers-reduced-motion: reduce`, p5/Vanta are never fetched at
 * all and a static gradient (matching the same two colors) renders
 * instead.
 */
export function VantaTopologyBackground({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const effectRef = useRef<VantaEffectInstance | null>(null);
  const [reducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;
    let cancelled = false;

    import("p5")
      .then((p5Module) => {
        if (cancelled) return undefined;
        window.p5 = p5Module.default;
        return import("vanta/dist/vanta.topology.min");
      })
      .then((topologyModule) => {
        if (cancelled || !containerRef.current || !topologyModule) return;
        effectRef.current = topologyModule.default({
          el: containerRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200,
          minWidth: 200,
          scale: 1,
          scaleMobile: 1,
          ...TOPOLOGY_COLORS,
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
      className={cn("pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#3f5454]", reducedMotion && "bg-[#3f5454]", className)}
    />
  );
}
