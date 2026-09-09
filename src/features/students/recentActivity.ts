import type { Goal } from "@myt/shared";
import { HomeworkStatus } from "@myt/shared";
import type { LessonView } from "@/features/lessons";
import type { HomeworkView } from "@/features/homework";

export type RecentActivityKind = "lesson" | "homework" | "goal";

export interface RecentActivityItem {
  id: string;
  kind: RecentActivityKind;
  title: string;
  detail: string;
  at: string;
}

/**
 * Builds the dashboard's "recent activity" timeline purely from data
 * already loaded for other dashboard sections (completed lessons, marked
 * homework, completed goals) — no separate activity-log endpoint exists, and
 * per project rules this must stay real data, never invented placeholder
 * entries. Sorted newest first, capped by the caller.
 */
export function computeRecentActivity(lessons: LessonView[], homework: HomeworkView[], goals: Goal[]): RecentActivityItem[] {
  const items: RecentActivityItem[] = [];

  for (const lesson of lessons) {
    if (lesson.state === "completed") {
      items.push({
        id: `lesson-${lesson.booking.id}`,
        kind: "lesson",
        title: `Completed a ${lesson.subjectName} lesson`,
        detail: `with ${lesson.tutorName}`,
        at: lesson.booking.scheduledEnd,
      });
    }
  }

  for (const item of homework) {
    if (item.status === HomeworkStatus.REVIEWED && item.reviewedAt) {
      items.push({ id: `hw-reviewed-${item.id}`, kind: "homework", title: `"${item.title}" was reviewed`, detail: typeof item.score === "number" ? `Score: ${item.score}%` : "Feedback available", at: item.reviewedAt });
    } else if (item.status === HomeworkStatus.SUBMITTED && item.submittedAt) {
      items.push({ id: `hw-submitted-${item.id}`, kind: "homework", title: `Submitted "${item.title}"`, detail: "Waiting for tutor review", at: item.submittedAt });
    }
  }

  for (const goal of goals) {
    if (goal.progress >= 100) {
      items.push({ id: `goal-${goal.id}`, kind: "goal", title: `Achieved goal: ${goal.title}`, detail: "100% complete", at: goal.updatedAt });
    }
  }

  return items.sort((a, b) => b.at.localeCompare(a.at));
}
