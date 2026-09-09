import { Sparkles } from "lucide-react";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";
import { useLearningInsights } from "../hooks/useLearningInsights";
import { LearningInsightCard } from "./LearningInsightCard";

export function LearningInsightsPanel({ studentId }: { studentId?: string }) {
  const { data: insights, isLoading } = useLearningInsights(studentId);

  if (isLoading) return <LoadingState label="Loading insights..." />;

  if (!insights || insights.length === 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title="No new insights yet"
        description="Check back after your next lesson or homework."
      />
    );
  }

  return (
    <div className="space-y-3">
      {insights.map((insight) => (
        <LearningInsightCard key={insight.id} insight={insight} />
      ))}
    </div>
  );
}
