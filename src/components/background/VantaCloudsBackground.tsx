import { useEffect, useRef, useState } from "react";
import type { VantaEffectInstance } from "vanta/dist/vanta.clouds.min";
import { cn } from "@/utils/cn";

/** Vanta CLOUDS color config — matches the exact values the user picked in the Vanta.js customizer. */
const CLOUD_COLORS = {
  backgroundColor: 0xffffff,
  skyColor: 0x68b8d7,
  cloudColor: 0xadc1de,
  cloudShadowColor: 0x183550,
  sunColor: 0xff9919,
  sunGlareColor: 0xff6633,
  sunlightColor: 0xff9933,
};

/**
 * The Home Page's single background animation (Prompt 21) — replaces the
 * CSS ambient/orb system there. Mounted once as a `fixed` layer behind all
 * Home Page content (see `HomePage.tsx`); the existing rotating "Learning
 * Universe" orbit and all page content render above it with `relative z-10`.
 *
 * Uses the real `VANTA.CLOUDS` WebGL effect (three.js). `three` + `vanta`
 * are ~600kB combined, so both are loaded via a runtime `import()` inside
 * the effect rather than a static top-level import — otherwise every page
 * in the app (not just the Home Page) would pay for that weight in its
 * initial bundle. Vite/Rollup automatically splits a dynamically-imported
 * module into its own chunk, fetched only when this component mounts.
 *
 * Initialized once and destroyed on unmount — no re-init on re-render, no
 * lingering WebGL context after navigating away. A `cancelled` flag guards
 * against the dynamic import resolving after the component has already
 * unmounted (e.g. a very fast route change away from the Home Page).
 *
 * Under `prefers-reduced-motion: reduce`, Vanta/three are never even
 * fetched (no WebGL context is created) and a static CSS gradient sky
 * renders instead — matching this project's reduced-motion policy
 * elsewhere: keep a good-looking background, remove the motion.
 */
export function VantaCloudsBackground({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const effectRef = useRef<VantaEffectInstance | null>(null);
  // Lazy initializer runs synchronously on mount (this app is client-only,
  // no SSR) so the correct fallback renders on the very first paint —
  // a ref here would never trigger the re-render needed to apply it.
  const [reducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;
    let cancelled = false;

    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    const isTablet = !isMobile && window.matchMedia("(max-width: 1023px)").matches;
    const speed = isMobile ? 0.6 : isTablet ? 0.8 : 1;

    Promise.all([import("three"), import("vanta/dist/vanta.clouds.min")]).then(([THREE, { default: CLOUDS }]) => {
      if (cancelled || !containerRef.current) return;
      effectRef.current = CLOUDS({
        el: containerRef.current,
        THREE,
        mouseControls: !isMobile,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        speed,
        ...CLOUD_COLORS,
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
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", reducedMotion && "bg-gradient-to-b from-[#68b8d7] to-[#adc1de]", className)}
    />
  );
}
