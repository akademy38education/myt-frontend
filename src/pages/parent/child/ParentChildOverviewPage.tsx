import { useOutletContext } from "react-router-dom";
import type { StudentProfile } from "@myt/shared";
import { CalendarClock, ClipboardList, Target, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { useBookings, isUpcoming } from "@/features/bookings";
import { useHomeworkList } from "@/features/homework";
import { useSubjectMastery } from "@/features/mastery";
import { formatDate } from "@/utils/formatters";
import { HomeworkStatus } from "@myt/shared";

export function ParentChildOverviewPage() {
  const { child } = useOutletContext<{ child: StudentProfile }>();
  const { data: bookings } = useBookings({ studentId: child.id });
  const { data: homework } = useHomeworkList(child.id);
  const { data: mastery } = useSubjectMastery(child.id);

  const upcoming = (bookings ?? []).filter(isUpcoming).sort((a, b) => a.scheduledStart.localeCompare(b.scheduledStart));
  const pendingHomework = (homework ?? []).filter((h) => h.status === HomeworkStatus.ASSIGNED || h.status === HomeworkStatus.IN_PROGRESS || h.status === HomeworkStatus.OVERDUE);
  const avgProgress = mastery && mastery.length > 0 ? Math.round(mastery.reduce((s, m) => s + m.overallPercent, 0) / mastery.length) : null;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Next lesson" value={upcoming[0] ? formatDate(upcoming[0].scheduledStart) : "None scheduled"} icon={CalendarClock} />
        <StatCard label="Homework outstanding" value={pendingHomework.length} icon={ClipboardList} />
        <StatCard label="Overall progress" value={avgProgress !== null ? `${avgProgress}%` : "—"} icon={TrendingUp} />
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="mb-3 flex items-center gap-2 font-semibold">
            <Target className="h-4 w-4 text-primary" />
            Learning goals
          </h2>
          {child.learningGoals.length === 0 ? (
            <EmptyState title="No learning goals set" description="Goals set during onboarding will appear here." className="py-8" />
          ) : (
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {child.learningGoals.map((goal) => (
                <li key={goal}>• {goal}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {mastery && mastery.length === 0 && bookings && bookings.length === 0 && (
        <EmptyState title="We're just getting started" description="Once your child completes lessons, their learning progress will appear here." />
      )}
    </div>
  );
}
