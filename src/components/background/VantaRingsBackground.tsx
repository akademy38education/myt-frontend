import { useEffect, useRef, useState } from "react";
import type { VantaEffectInstance } from "vanta/dist/vanta.clouds.min";
import { cn } from "@/utils/cn";

/**
 * Vanta RINGS color config. `color` seeds the ring palette, but — tested
 * with three quite different hues/lightnesses here — Vanta's RINGS effect
 * generates most individual ring colors with its own internal
 * randomization, only loosely anchored to this one value; several rings
 * always render as darker navy/maroon/olive tones no matter what `color`
 * is set to. That can't be fixed through this config alone, so the
 * container is rendered at reduced opacity below (see `CANVAS_OPACITY`)
 * to soften those dark tones rather than chasing an unreachable
 * "everything is light blue/green" via color alone. Background is white;
 * `backgroundAlpha: 1` (fully opaque) rather than the customizer's 0.6: a
 * translucent canvas blends with whatever's behind it, and against this
 * app's page chrome that blend washed the rings out to near-invisible
 * (confirmed by screenshot).
 */
const RINGS_COLORS = {
  color: 0x8fe3d9,
  backgroundColor: 0xffffff,
  backgroundAlpha: 1,
};

/** Softens the effect overall (see `RINGS_COLORS` comment) — a dark ring at this opacity over the white page reads as a muted pastel instead of a harsh solid line. */
const CANVAS_OPACITY = "opacity-45";

/**
 * The Student area's page background — the `VANTA.RINGS` effect, mounted
 * once by `StudentLayout.tsx` (via `RoleShellLayout`'s `customBackground`
 * prop) so it persists across every page under `/student`, not just the
 * dashboard. Because it's mounted at the layout level, React Router keeps
 * it alive across route changes within the student area (only the nested
 * `<Outlet/>` content swaps) — one continuous instance, never re-created
 * per page.
 *
 * `position: fixed` (not `absolute`) so it stays pinned behind the content
 * while a page's own scroll container moves, rather than scrolling away.
 * The container's own `bg-white` is just a same-color placeholder for the
 * brief moment before the canvas mounts.
 *
 * Same lifecycle discipline as `VantaCloudsBackground`: `three` + `vanta`
 * are loaded via a runtime `import()` inside the effect (not a static
 * top-level import) so this ~600kB dependency is only fetched when a
 * student actually opens their area, never bundled into every other
 * page/role. Destroyed on unmount; guarded against the async import
 * resolving after the component has already unmounted.
 *
 * Under `prefers-reduced-motion: reduce`, Vanta/three are never fetched at
 * all and a static dark gradient (matching the same two colors) renders
 * instead.
 */
export function VantaRingsBackground({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const effectRef = useRef<VantaEffectInstance | null>(null);
  const [reducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;
    let cancelled = false;

    Promise.all([import("three"), import("vanta/dist/vanta.rings.min")]).then(([THREE, { default: RINGS }]) => {
      if (cancelled || !containerRef.current) return;
      effectRef.current = RINGS({
        el: containerRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1,
        scaleMobile: 1,
        ...RINGS_COLORS,
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
      className={cn("pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white", CANVAS_OPACITY, reducedMotion && "bg-white", className)}
    />
  );
}
