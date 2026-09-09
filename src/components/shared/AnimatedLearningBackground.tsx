import type { CSSProperties } from "react";
import { cn } from "@/utils/cn";
import { FloatingShape } from "./decor";

export type LearningBackgroundVariant = "hero" | "student" | "parent" | "tutor" | "admin" | "public";
type Density = "minimal" | "low" | "moderate" | "rich";

/** Core nodes render at every breakpoint; extra nodes only appear from `lg` up (Prompt 20 §11 — reduce node count on smaller screens). */
const CORE_NODES: Array<{ top: string; left: string }> = [
  { top: "14%", left: "20%" },
  { top: "22%", left: "68%" },
  { top: "55%", left: "12%" },
  { top: "68%", left: "80%" },
  { top: "40%", left: "45%" },
];
const EXTRA_NODES: Array<{ top: string; left: string }> = [
  { top: "8%", left: "48%" },
  { top: "78%", left: "30%" },
  { top: "32%", left: "88%" },
  { top: "60%", left: "55%" },
];

/** A handful of static, low-opacity lines between core nodes — "concepts are connected", not a network diagram (Prompt 20 §5). Hidden below `sm` per §12 (no lines behind mobile content). */
const CONNECTIONS: Array<[number, number]> = [
  [0, 4],
  [1, 3],
  [2, 4],
];

/** Desktop / tablet / mobile particle counts per density tier (Prompt 20 §6 — desktop 30-60 total decorative elements is the ceiling across orbs+nodes+particles; particles alone stay well under that). */
const DENSITY_COUNTS: Record<Density, { mobile: number; tablet: number; desktop: number }> = {
  minimal: { mobile: 5, tablet: 10, desktop: 16 },
  low: { mobile: 6, tablet: 16, desktop: 26 },
  moderate: { mobile: 8, tablet: 20, desktop: 36 },
  rich: { mobile: 12, tablet: 28, desktop: 46 },
};

const VARIANT_CONFIG: Record<LearningBackgroundVariant, { showNodes: boolean; showLines: boolean; showShapes: boolean; density: Density }> = {
  hero: { showNodes: true, showLines: true, showShapes: true, density: "rich" },
  student: { showNodes: true, showLines: true, showShapes: true, density: "rich" },
  tutor: { showNodes: true, showLines: false, showShapes: false, density: "moderate" },
  parent: { showNodes: false, showLines: false, showShapes: false, density: "low" },
  admin: { showNodes: false, showLines: false, showShapes: false, density: "minimal" },
  public: { showNodes: true, showLines: false, showShapes: false, density: "low" },
};

/** Deterministic (seeded, not `Math.random`) so the layout is stable across renders/navigations rather than reshuffling — a tiny local PRNG, same approach used for the backend's demo-data generator. */
function seededParticles(count: number) {
  let seed = 42;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return (seed % 1000) / 1000;
  };
  return Array.from({ length: count }, () => ({
    top: `${(rand() * 90 + 5).toFixed(1)}%`,
    left: `${(rand() * 90 + 5).toFixed(1)}%`,
    size: Math.round(rand() * 3 + 2),
    delay: `${(rand() * 6).toFixed(1)}s`,
    duration: `${(8 + rand() * 6).toFixed(1)}s`,
  }));
}
const PARTICLE_POOL = seededParticles(46);

/**
 * MyT's single, reusable "Learning Universe" ambient background system
 * (Prompt 20) — one component, retinted and re-tuned per `variant` rather
 * than duplicated per page. Composed of up to four CSS-only layers (large
 * drifting orbs, pulsing concept nodes, a few static connection lines,
 * and a pool of tiny floating particles), all `transform`/`opacity`
 * animation — no canvas, no JS animation loop, no per-frame recalculation.
 *
 * Two places mount this globally so every page underneath automatically
 * gets an ambient atmosphere without each page wiring its own:
 * - `RoleShellLayout` (variant = the current role: student/parent/tutor/admin)
 * - `PublicLayout` (variant="public")
 * `Hero.tsx` additionally layers `variant="hero"` (richer) behind the
 * landing hero specifically (Prompt 20 §20).
 *
 * Particle/node counts are reduced at smaller breakpoints via plain CSS
 * `hidden md:block` / `hidden lg:block` visibility toggles on
 * pre-rendered, deterministically-positioned elements — never a JS resize
 * listener or per-frame recalculation. Mobile additionally gets a hard
 * opacity ceiling (see the `@media (max-width: 639px)` rule in
 * globals.css) regardless of `intensity`, per Prompt 20 §12.
 *
 * Fully stilled under `prefers-reduced-motion` (globals.css) and retints
 * automatically in dark mode since every color is an HSL token.
 *
 * Render as the first child of a `relative` (or `relative isolate`)
 * ancestor and give real content `relative z-10` above it. This component
 * itself is `pointer-events-none` and `aria-hidden` — purely decorative,
 * never a click target, never conveys information a screen reader needs.
 */
export function AnimatedLearningBackground({
  variant,
  intensity = "normal",
  showNodes,
  className,
}: {
  variant: LearningBackgroundVariant;
  intensity?: "subtle" | "normal";
  /** Override the variant's default node visibility (e.g. force off in a tight header card). */
  showNodes?: boolean;
  className?: string;
}) {
  const config = VARIANT_CONFIG[variant];
  const nodesEnabled = showNodes ?? config.showNodes;
  const counts = DENSITY_COUNTS[config.density];
  const particles = PARTICLE_POOL.slice(0, counts.desktop);

  const orbOpacity = intensity === "subtle" ? 0.1 : 0.16;
  const nodeOpacity = intensity === "subtle" ? 0.2 : 0.32;
  const particleOpacity = intensity === "subtle" ? 0.28 : 0.4;
  const lineOpacity = intensity === "subtle" ? 0.1 : 0.16;

  return (
    <div
      aria-hidden="true"
      data-bg-variant={variant}
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={
        {
          "--myt-orb-opacity": orbOpacity,
          "--myt-node-opacity": nodeOpacity,
          "--myt-particle-opacity": particleOpacity,
          "--myt-line-opacity": lineOpacity,
        } as CSSProperties
      }
    >
      <div className="myt-orb myt-orb-1" style={{ width: 420, height: 420, top: "-12%", left: "-6%" }} />
      <div className="myt-orb myt-orb-2" style={{ width: 360, height: 360, top: "30%", right: "-10%" }} />
      <div className="myt-orb myt-orb-3" style={{ width: 300, height: 300, bottom: "-14%", left: "35%" }} />

      {config.showLines && (
        <svg className="absolute inset-0 hidden h-full w-full sm:block" preserveAspectRatio="none" viewBox="0 0 100 100">
          {CONNECTIONS.map(([a, b], i) => {
            const from = CORE_NODES[a]!;
            const to = CORE_NODES[b]!;
            return (
              <line
                key={i}
                className="myt-ambient-line"
                x1={from.left}
                y1={from.top}
                x2={to.left}
                y2={to.top}
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>
      )}

      {nodesEnabled &&
        CORE_NODES.map((node, i) => <span key={i} className="myt-node-dot" style={{ top: node.top, left: node.left, width: 5, height: 5, animationDelay: `${i * 1.6}s` }} />)}
      {nodesEnabled &&
        EXTRA_NODES.map((node, i) => (
          <span key={i} className="myt-node-dot hidden lg:block" style={{ top: node.top, left: node.left, width: 4, height: 4, animationDelay: `${i * 1.3 + 0.5}s` }} />
        ))}

      {particles.map((p, i) => (
        <span
          key={i}
          className={cn("myt-ambient-particle", i >= counts.tablet ? "hidden lg:block" : i >= counts.mobile ? "hidden md:block" : "block")}
          style={{ top: p.top, left: p.left, width: p.size, height: p.size, animationDelay: p.delay, animationDuration: p.duration }}
        />
      ))}

      {config.showShapes && (
        <>
          <FloatingShape shape="ring" size={28} top="18%" right="14%" color="secondary" delay="1s" className="hidden lg:block" />
          <FloatingShape shape="circle" size={16} bottom="20%" left="8%" color="primary" delay="3s" className="hidden lg:block" />
        </>
      )}
    </div>
  );
}
