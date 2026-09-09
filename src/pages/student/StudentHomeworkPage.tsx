import { HomeworkStatus } from "@myt/shared";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { GridCardSkeleton } from "@/components/shared/CardListSkeleton";
import { useCurrentStudentProfile } from "@/features/students";
import { useHomeworkList, HomeworkCard, type HomeworkView } from "@/features/homework";

function groupHomework(homework: HomeworkView[]) {
  const now = Date.now();
  const dueSoonMs = 48 * 60 * 60 * 1000;
  return {
    overdue: homework.filter((h) => h.status === HomeworkStatus.OVERDUE),
    dueSoon: homework.filter((h) => h.status !== HomeworkStatus.OVERDUE && h.status !== HomeworkStatus.SUBMITTED && h.status !== HomeworkStatus.REVIEWED && new Date(h.dueAt).getTime() - now < dueSoonMs),
    inProgress: homework.filter(
      (h) =>
        (h.status === HomeworkStatus.ASSIGNED || h.status === HomeworkStatus.IN_PROGRESS) &&
        new Date(h.dueAt).getTime() - now >= dueSoonMs
    ),
    completed: homework.filter((h) => h.status === HomeworkStatus.SUBMITTED || h.status === HomeworkStatus.REVIEWED),
  };
}

function Section({ title, items }: { title: string; items: HomeworkView[] }) {
  if (items.length === 0) return null;
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold tracking-tight">
        {title} <span className="font-normal text-muted-foreground">({items.length})</span>
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((h) => (
          <HomeworkCard key={h.id} homework={h} />
        ))}
      </div>
    </section>
  );
}

export function StudentHomeworkPage() {
  const { studentId } = useCurrentStudentProfile();
  const { data: homework, isLoading, isError, refetch } = useHomeworkList(studentId);

  return (
    <div className="space-y-8">
      <PageHeader title="Homework" description="Everything your tutors have set, in one place." />

      {isLoading && <GridCardSkeleton count={4} />}
      {isError && <ErrorState title="We couldn't load your homework" description="Your work is safe." onRetry={() => refetch()} />}
      {!isLoading && !isError && homework && homework.length === 0 && <EmptyState title="You're all caught up! 🎉" description="No homework assigned right now." />}

      {homework && homework.length > 0 && (
        <>
          {(() => {
            const groups = groupHomework(homework);
            return (
              <>
                <Section title="Overdue" items={groups.overdue} />
                <Section title="Due soon" items={groups.dueSoon} />
                <Section title="In progress" items={groups.inProgress} />
                <Section title="Completed" items={groups.completed} />
              </>
            );
          })()}
        </>
      )}
    </div>
  );
}
