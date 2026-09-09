import { Calculator, FlaskConical, Languages, UserCheck, ClipboardCheck, TrendingUp, GraduationCap, type LucideIcon } from "lucide-react";
import { SectionGlow } from "@/components/shared/decor";

const SIZE = 340;
const CENTER = SIZE / 2;
const RADIUS = 130;
const NODE_SIZE = 56;

type NodeColor = "primary" | "secondary" | "info" | "warning";

interface OrbNode {
  label: string;
  icon: LucideIcon;
  color: NodeColor;
}

const NODES: OrbNode[] = [
  { label: "Math", icon: Calculator, color: "primary" },
  { label: "Tutor", icon: UserCheck, color: "secondary" },
  { label: "Assessment", icon: ClipboardCheck, color: "info" },
  { label: "Progress", icon: TrendingUp, color: "warning" },
  { label: "English", icon: Languages, color: "secondary" },
  { label: "Science", icon: FlaskConical, color: "primary" },
];

const NODE_COLOR_CLASSES: Record<NodeColor, string> = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  info: "bg-info/10 text-info",
  warning: "bg-warning/10 text-warning",
};

function nodePosition(index: number) {
  const angle = ((-90 + index * 60) * Math.PI) / 180;
  return { x: CENTER + RADIUS * Math.cos(angle), y: CENTER + RADIUS * Math.sin(angle) };
}

/**
 * MyT's original hero illustration: a central "learning orb" connected to
 * six subject/journey nodes (Math, Tutor, Assessment, Progress, English,
 * Science), slowly orbiting around it — conceived for Phase 18 to give the
 * landing page its own distinct visual identity rather than reusing any
 * reference site's hero concept. The whole ring rotates very slowly (46s,
 * linear, one full turn) while each node counter-rotates by the same
 * amount so its icon/label stay upright instead of spinning — a classic
 * "orbit" technique using two separate elements per node (the position
 * wrapper never gets a rotation of its own, only the nested counter-layer
 * does) so the constant-speed centering transform and the counter-rotation
 * never fight over the same `transform` property. Fully stilled under
 * `prefers-reduced-motion` (see `.myt-orbit-rotate`/`.myt-orbit-counter` in
 * globals.css), which leaves the original static hexagon layout.
 */
export function LearningOrbIllustration({ className }: { className?: string }) {
  return (
    <div className={className} style={{ width: SIZE, height: SIZE, margin: "0 auto" }} aria-hidden="true">
      <div className="relative h-full w-full">
        <SectionGlow color="secondary" size="70%" animate />

        <div className="myt-orbit-rotate absolute inset-0">
          <svg width={SIZE} height={SIZE} className="absolute inset-0" viewBox={`0 0 ${SIZE} ${SIZE}`}>
            {NODES.map((_, i) => {
              const { x, y } = nodePosition(i);
              return <line key={i} x1={CENTER} y1={CENTER} x2={x} y2={y} stroke="hsl(var(--secondary) / 0.25)" strokeWidth={1.5} />;
            })}
          </svg>

          {NODES.map((node, i) => {
            const { x, y } = nodePosition(i);
            const Icon = node.icon;
            return (
              <div key={node.label} className="absolute" style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}>
                <div className="myt-orbit-counter">
                  <div
                    className="myt-card-hover relative flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2.5 shadow-sm"
                    style={{ width: NODE_SIZE + 40 }}
                  >
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full ${NODE_COLOR_CLASSES[node.color]}`}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="text-xs font-medium">{node.label}</span>
                    <span
                      className="myt-node-dot absolute -right-1 -top-1"
                      style={{ width: 6, height: 6, background: `hsl(var(--${node.color}))`, animationDelay: `${i * 1.2}s` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="absolute flex items-center justify-center rounded-full text-white shadow-lg"
          style={{ width: 96, height: 96, left: CENTER, top: CENTER, transform: "translate(-50%, -50%)", backgroundImage: "var(--gradient-brand)" }}
        >
          <GraduationCap className="h-9 w-9" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
