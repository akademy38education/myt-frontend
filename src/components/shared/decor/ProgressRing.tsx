import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export interface ProgressRingProps {
  /** 0-100 */
  percent: number;
  size?: number;
  strokeWidth?: number;
  color?: "primary" | "secondary" | "success";
  className?: string;
  children?: ReactNode;
}

/**
 * A circular progress indicator (subject mastery, homework completion,
 * course progress). Animates via a CSS `transition` on `stroke-dashoffset`
 * rather than a keyframe loop, so it settles once and doesn't run
 * continuously — safe under `prefers-reduced-motion` with no extra handling
 * needed (a one-off transition, not a repeating animation).
 */
export function ProgressRing({ percent, size = 64, strokeWidth = 6, color = "primary", className, children }: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" role="img" aria-label={`${clamped}% progress`}>
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} className="fill-none stroke-muted" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="fill-none transition-[stroke-dashoffset] duration-slow ease-brand"
          style={{
            stroke: `hsl(var(--${color}))`,
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children ?? <span className="text-sm font-semibold tabular-nums">{clamped}%</span>}</div>
    </div>
  );
}
