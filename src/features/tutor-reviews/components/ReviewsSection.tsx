import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleChip } from "@/components/shared/ToggleChip";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import { useTutorReviews } from "../hooks/useTutorReviews";
import { RatingDistributionBars } from "./RatingDistributionBars";
import { ReviewCard } from "./ReviewCard";

const RATING_FILTERS: Array<{ label: string; value: number | undefined }> = [
  { label: "All", value: undefined },
  { label: "5 stars", value: 5 },
  { label: "4+ stars", value: 4 },
  { label: "3+ stars", value: 3 },
];

export function ReviewsSection({ tutorId }: { tutorId: string }) {
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const { data, isLoading } = useTutorReviews(tutorId, minRating);

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="mb-4 font-semibold">Reviews</h2>

        {isLoading && <LoadingState label="Loading reviews..." />}

        {data && (
          <>
            <RatingDistributionBars distribution={data.distribution} total={data.total} averageRating={data.averageRating} />

            {data.total > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {RATING_FILTERS.map((option) => (
                  <ToggleChip key={option.label} label={option.label} selected={minRating === option.value} onToggle={() => setMinRating(option.value)} />
                ))}
              </div>
            )}

            <div className="mt-5 space-y-4">
              {data.total === 0 ? (
                <EmptyState title="No reviews yet" description="This tutor hasn't received any written reviews yet." className="py-8" />
              ) : data.reviews.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">No reviews match this filter.</p>
              ) : (
                data.reviews.map((review) => <ReviewCard key={review.id} review={review} />)
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
