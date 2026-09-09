import { Target } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { GridCardSkeleton } from "@/components/shared/CardListSkeleton";
import { useCurrentStudentProfile } from "@/features/students";
import { useGoals, GoalCard, CreateGoalDialog } from "@/features/goals";

export function StudentGoalsPage() {
  const { studentId } = useCurrentStudentProfile();
  const { data: goals, isLoading, isError, refetch } = useGoals(studentId);

  const current = goals?.filter((g) => g.progress < 100) ?? [];
  const completed = goals?.filter((g) => g.progress >= 100) ?? [];

  return (
    <div className="space-y-8">
      <PageHeader title="Goals" description="What you're working towards, and how close you are." actions={studentId ? <CreateGoalDialog studentId={studentId} /> : undefined} />

      {isLoading && <GridCardSkeleton count={2} />}
      {isError && <ErrorState onRetry={() => refetch()} />}
      {!isLoading && !isError && goals && goals.length === 0 && (
        <EmptyState icon={Target} title="No goals yet" description="Set a goal to stay motivated and track what matters to you." />
      )}

      {current.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold tracking-tight">Current goals</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {current.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </section>
      )}

      {completed.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold tracking-tight">Completed goals</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {completed.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
