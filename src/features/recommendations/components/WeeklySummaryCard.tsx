import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRecommendationSummary } from "../hooks/useRecommendationSummary";

/**
 * The summary text is a deterministic template built server-side from the
 * same data as the recommendation list — never a real AI model — so this
 * is labeled plainly rather than sold as "AI-powered" (Phase 11 philosophy:
 * don't oversell template text as AI magic).
 */
export function WeeklySummaryCard() {
  const { data, isLoading, isError } = useRecommendationSummary();

  if (isError) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Summary</CardTitle>
        <CardDescription>Auto-generated from your recent activity</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted" aria-hidden="true" />
        ) : (
          <p className="text-sm text-muted-foreground">{data.text}</p>
        )}
      </CardContent>
    </Card>
  );
}
