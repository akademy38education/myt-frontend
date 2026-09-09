import { cn } from "@/utils/cn";

export interface LearningNodeProps {
  top: string;
  left: string;
  size?: number;
  color?: "primary" | "secondary";
  pulse?: boolean;
  delay?: string;
  className?: string;
}

/**
 * A single small "concept node" dot — used to build connected-node diagrams
 * (see the landing hero's learning-orb illustration) or scattered sparingly
 * as a background accent. Pairs with `.myt-node-line` (rendered by the
 * parent) for connecting lines between nodes.
 */
export function LearningNode({ top, left, size = 8, color = "secondary", pulse = true, delay = "0s", className }: LearningNodeProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("myt-node-dot", !pulse && "!animate-none", className)}
      style={{
        top,
        left,
        width: size,
        height: size,
        background: `hsl(var(--${color}) / 1)`,
        animationDelay: delay,
      }}
    />
  );
}
