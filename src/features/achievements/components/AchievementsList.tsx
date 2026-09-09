import { Trophy } from "lucide-react";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";
import { useAchievements } from "../hooks/useAchievements";
import { AchievementBadge } from "./AchievementBadge";

export function AchievementsList({ studentId }: { studentId: string }) {
  const { data: achievements, isLoading } = useAchievements(studentId);

  if (isLoading) return <LoadingState label="Loading achievements..." />;

  if (!achievements || achievements.length === 0) {
    return (
      <EmptyState
        icon={Trophy}
        title="Keep learning to unlock your first achievement"
        description="Badges are awarded automatically as you complete lessons, goals and revision."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {achievements.map((achievement) => (
        <AchievementBadge key={achievement.key} achievement={achievement} />
      ))}
    </div>
  );
}
