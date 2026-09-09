import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TutorCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
          <div className="space-y-2.5">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-64" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-8 w-40" />
        </div>
      </CardContent>
    </Card>
  );
}

export function MarketplaceSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading tutors">
      {Array.from({ length: count }).map((_, index) => (
        <TutorCardSkeleton key={index} />
      ))}
    </div>
  );
}
