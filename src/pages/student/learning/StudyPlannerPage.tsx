import { Link } from "react-router-dom";
import { Video, RotateCcw, Target, CalendarDays } from "lucide-react";
import type { StudyPlanItem, StudyPlanItemType } from "@myt/shared";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStudyPlan } from "@/features/learning";
import { SUBJECTS } from "@/constants/subjects";

const DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const TYPE_META: Record<StudyPlanItemType, { label: string; icon: typeof Video }> = {
  lesson: { label: "Lesson", icon: Video },
  revision: { label: "Revision", icon: RotateCcw },
  goal: { label: "Goal", icon: Target },
};

function PlanItemRow({ item }: { item: StudyPlanItem }) {
  const meta = TYPE_META[item.type];
  const Icon = meta.icon;
  const subjectName = item.subjectId ? SUBJECTS.find((s) => s.id === item.subjectId)?.name : undefined;

  const content = (
    <Card className={item.link ? "transition-colors hover:border-primary/40" : undefined}>
      <CardContent className="flex items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium">{item.title}</p>
            <p className="text-xs text-muted-foreground">
              {subjectName ? `${subjectName} · ` : ""}
              {item.durationMinutes} min
            </p>
          </div>
        </div>
        <Badge variant="outline">{meta.label}</Badge>
      </CardContent>
    </Card>
  );

  return item.link ? <Link to={item.link}>{content}</Link> : content;
}

export function StudyPlannerPage() {
  const { data, isLoading, isError, refetch } = useStudyPlan();

  if (isLoading) return <LoadingState label="Loading your study plan..." />;
  if (isError || !data) return <ErrorState title="We couldn't load your study plan" onRetry={() => refetch()} />;

  const byDay = DAY_LABELS.map((label, dayOfWeek) => ({
    dayOfWeek,
    label,
    items: data.items.filter((item) => item.dayOfWeek === dayOfWeek),
  }));

  return (
    <div className="space-y-8">
      <PageHeader title="Study Planner" description="A suggested week, built from your lessons, revision queue and goals." />

      {data.items.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No suggested plan yet" description="Once you have upcoming lessons, revision items or goals, a suggested weekly plan will appear here." />
      ) : (
        <div className="space-y-6">
          {byDay
            .filter((day) => day.items.length > 0)
            .map((day) => (
              <section key={day.dayOfWeek}>
                <h2 className="mb-3 text-lg font-semibold tracking-tight">{day.label}</h2>
                <div className="space-y-2">
                  {day.items.map((item) => (
                    <PlanItemRow key={item.id} item={item} />
                  ))}
                </div>
              </section>
            ))}
        </div>
      )}
    </div>
  );
}
