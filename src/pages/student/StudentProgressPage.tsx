import { CheckCircle2, ClipboardCheck, Target } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { StatCard } from "@/components/shared/StatCard";
import { useCurrentStudentProfile } from "@/features/students";
import { useLessons } from "@/features/lessons";
import { useHomeworkList } from "@/features/homework";
import { useGoals } from "@/features/goals";
import { useSubjectMastery, MasteryOverview } from "@/features/mastery";
import { HomeworkStatus } from "@myt/shared";

export function StudentProgressPage() {
  const { studentId } = useCurrentStudentProfile();
  const { isLoading } = useSubjectMastery(studentId);
  const { data: lessons } = useLessons(studentId);
  const { data: homework } = useHomeworkList(studentId);
  const { data: goals } = useGoals(studentId);

  const lessonsCompleted = lessons?.filter((l) => l.state === "completed").length ?? 0;
  const submittedHomework = homework?.filter((h) => h.status === HomeworkStatus.SUBMITTED || h.status === HomeworkStatus.REVIEWED).length ?? 0;
  const homeworkRate = homework && homework.length > 0 ? Math.round((submittedHomework / homework.length) * 100) : 0;
  const activeGoals = goals?.filter((g) => g.progress < 100).length ?? 0;

  if (isLoading) return <LoadingState label="Loading your progress..." />;

  return (
    <div className="space-y-8">
      <PageHeader title="Your Progress" description="How your understanding is building, subject by subject." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Lessons completed" value={lessonsCompleted} icon={CheckCircle2} />
        <StatCard label="Homework completion" value={`${homeworkRate}%`} icon={ClipboardCheck} />
        <StatCard label="Active goals" value={activeGoals} icon={Target} />
      </div>

      <MasteryOverview studentId={studentId} />
    </div>
  );
}
