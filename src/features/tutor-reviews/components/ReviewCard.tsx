import { Star } from "lucide-react";
import type { Review } from "@myt/shared";
import { formatDate } from "@/utils/formatters";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="border-b border-border pb-4 last:border-0 last:pb-0">
      <div className="mb-1 flex items-center justify-between gap-2">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={i < review.rating ? "h-3.5 w-3.5 fill-warning text-warning" : "h-3.5 w-3.5 text-muted"} />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
      </div>
      {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
    </div>
  );
}
