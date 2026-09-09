import { Link } from "react-router-dom";
import { CheckCircle2, ListChecks } from "lucide-react";
import type { RecommendationPriority } from "@myt/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { useRecommendations } from "../hooks/useRecommendations";

const PRIORITY_VARIANT: Record<RecommendationPriority, BadgeProps["variant"]> = {
  high: "warning",
  medium: "outline",
  low: "muted",
};

const PRIORITY_LABEL: Record<RecommendationPriority, string> = {
  high: "High priority",
  medium: "Medium priority",
  low: "Low priority",
};

export function RecommendationList() {
  const { data, isLoading, isError, refetch } = useRecommendations();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ListChecks className="h-4 w-4 text-primary" />
          What's next?
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <LoadingState label="Loading recommendations..." className="py-8" />}
        {!isLoading && isError && <ErrorState className="py-8" description="We couldn't load your recommendations." onRetry={() => refetch()} />}
        {!isLoading && !isError && data && data.length === 0 && (
          <EmptyState icon={CheckCircle2} title="You're all caught up" description="No new recommendations right now." className="py-8" />
        )}
        {!isLoading && !isError && data && data.length > 0 && (
          <ul className="space-y-3">
            {data.map((item) => (
              <li key={item.id} className="rounded-md border border-border p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{item.title}</p>
                  <Badge variant={PRIORITY_VARIANT[item.priority]} className="shrink-0">
                    {PRIORITY_LABEL[item.priority]}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                {item.actionLabel && item.actionLink && (
                  <Button size="sm" variant="outline" className="mt-3 w-fit" asChild>
                    <Link to={item.actionLink}>{item.actionLabel}</Link>
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
