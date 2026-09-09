import { Star } from "lucide-react";
import type { RatingDistribution } from "../types";

export function RatingDistributionBars({ distribution, total, averageRating }: { distribution: RatingDistribution; total: number; averageRating: number }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex shrink-0 flex-col items-center justify-center sm:w-28">
        <span className="text-3xl font-bold leading-none">{averageRating.toFixed(1)}</span>
        <div className="mt-1 flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={i < Math.round(averageRating) ? "h-3.5 w-3.5 fill-warning text-warning" : "h-3.5 w-3.5 text-muted"} />
          ))}
        </div>
        <span className="mt-1 text-xs text-muted-foreground">
          {total} review{total === 1 ? "" : "s"}
        </span>
      </div>
      <div className="flex-1 space-y-1.5">
        {([5, 4, 3, 2, 1] as const).map((star) => {
          const count = distribution[star];
          const percent = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={star} className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-3 text-right">{star}</span>
              <Star className="h-3 w-3 fill-warning text-warning" />
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-warning" style={{ width: `${percent}%` }} />
              </div>
              <span className="w-6 text-right">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
