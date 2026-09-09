import { cn } from "@/utils/cn";

const PARTICLES = [
  { top: "12%", left: "18%", size: 6, delay: "0s" },
  { top: "24%", left: "72%", size: 4, delay: "1.2s" },
  { top: "48%", left: "10%", size: 5, delay: "2.4s" },
  { top: "62%", left: "85%", size: 4, delay: "0.6s" },
  { top: "78%", left: "35%", size: 6, delay: "3s" },
  { top: "36%", left: "50%", size: 3, delay: "1.8s" },
  { top: "8%", left: "45%", size: 4, delay: "4s" },
];

/**
 * MyT's reusable decorative backdrop for public-facing, first-impression
 * surfaces: soft green/blue blobs, a faint center glow, and a handful of
 * floating particles — all CSS transform/opacity animation (GPU-friendly,
 * no canvas/JS animation loop) and automatically stilled under
 * `prefers-reduced-motion` (see styles/globals.css), which leaves a static
 * (but still on-brand) gradient wash rather than hiding it outright.
 *
 * Use on: hero sections, major landing sections, auth screens, special CTA
 * sections. Do NOT use behind dashboards or other dense, working UI — those
 * screens are read closely and repeatedly, so motion there should be limited
 * to small decorative touches (e.g. a subtle stat-card hover), not a
 * full backdrop.
 *
 * Render as the first child of a `relative` container and give the real
 * content `relative z-10` so it sits above the decoration.
 */
export function AnimatedBackground({ className, particles = true }: { className?: string; particles?: boolean }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="myt-blob myt-blob-a" />
      <div className="myt-blob myt-blob-b" />
      <div className="myt-blob myt-blob-c" />
      <div className="myt-glow" />
      {particles &&
        PARTICLES.map((p, i) => (
          <span
            key={i}
            className="myt-particle"
            style={{ top: p.top, left: p.left, width: p.size, height: p.size, animationDelay: p.delay }}
          />
        ))}
    </div>
  );
}
