import { ResponsiveContainer, Tooltip, type TooltipProps } from "recharts";
import { cn } from "@/utils/cn";

/**
 * Categorical series colors, in fixed hue order — never reassign a color to
 * a different series when a filter changes which series are visible.
 * Values are CSS custom properties defined in styles/globals.css so light
 * and dark mode swap automatically.
 */
export const CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"] as const;

export const CHART_STATUS_COLORS = {
  good: "var(--chart-good)",
  warning: "var(--chart-warning)",
  serious: "var(--chart-serious)",
  critical: "var(--chart-critical)",
} as const;

export function ChartContainer({ children, className, height = 280 }: { children: React.ReactElement; className?: string; height?: number }) {
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

export function ChartTooltip(props: TooltipProps<number, string>) {
  return (
    <Tooltip
      {...props}
      contentStyle={{
        background: "hsl(var(--popover))",
        border: "1px solid hsl(var(--border))",
        borderRadius: "var(--radius)",
        color: "hsl(var(--popover-foreground))",
        fontSize: "0.875rem",
      }}
      cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }}
    />
  );
}
