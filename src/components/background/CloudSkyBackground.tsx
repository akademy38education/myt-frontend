import { useState } from "react";
import { cn } from "@/utils/cn";

/**
 * The Home Page's hero background. Previously a real `VANTA.CLOUDS` WebGL
 * effect (three.js) — replaced after user reports of the page stuttering
 * and freezing. Profiling showed why: Vanta's `CLOUDS` effect recomputes
 * cloud-plane geometry in JS every frame, which measured as 9+ seconds of
 * main-thread blocking (one single task blocking 4s straight) over a 4s
 * window of normal scroll/mouse interaction — on a page with no Vanta at
 * all, that number is zero. There's no "quality" knob on CLOUDS to turn
 * down; the render loop itself is the heavy part.
 *
 * This is a pure CSS sky — a static gradient plus a few soft, blurred
 * "cloud" blobs drifting via `transform` only (GPU-composited, no JS
 * per-frame work, no `filter`/`backdrop-filter` recalculated against a
 * moving layer). Same color palette as the old Vanta config, so the look
 * is close to identical; the difference is it costs nothing to render.
 */
export function CloudSkyBackground({ className }: { className?: string }) {
  const [reducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden bg-gradient-to-b from-[#68b8d7] via-[#8fb4cf] to-[#adc1de]", className)}>
      {/* Soft sun glow, upper-right — matches the old sunColor/sunGlareColor warmth */}
      <div
        className="absolute -right-24 -top-24 h-[32rem] w-[32rem] rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(circle, #ffcf80 0%, #ffb266 40%, transparent 70%)" }}
      />
      {/* Cloud blobs — soft, blurred, low-opacity white shapes drifting slowly left/right */}
      <div
        className={cn(
          "absolute left-[-10%] top-[20%] h-64 w-[60%] rounded-full bg-white/50 blur-3xl",
          !reducedMotion && "motion-safe:animate-[cloud-drift-a_70s_ease-in-out_infinite]"
        )}
      />
      <div
        className={cn(
          "absolute right-[-15%] top-[45%] h-72 w-[65%] rounded-full bg-white/35 blur-3xl",
          !reducedMotion && "motion-safe:animate-[cloud-drift-b_90s_ease-in-out_infinite]"
        )}
      />
      <div
        className={cn(
          "absolute left-[5%] top-[65%] h-56 w-[50%] rounded-full opacity-60 blur-3xl",
          !reducedMotion && "motion-safe:animate-[cloud-drift-a_80s_ease-in-out_infinite]"
        )}
        style={{ background: "radial-gradient(ellipse, #4a6f94 0%, transparent 70%)" }}
      />
    </div>
  );
}
