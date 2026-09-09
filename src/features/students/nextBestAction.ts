import { HomeworkStatus } from "@myt/shared";
import type { LessonView } from "@/features/lessons";
import type { HomeworkView } from "@/features/homework";

export interface NextBestActionDescriptor {
  headline: string;
  detail: string;
  ctaLabel: string;
  ctaTo: string;
}

const HOMEWORK_DUE_SOON_MS = 48 * 60 * 60 * 1000;

/**
 * Pure priority logic for the dashboard's single primary CTA — kept out of
 * the `NextBestAction` component (presentational only) and out of the
 * dashboard page, per the "components must not contain business logic"
 * rule. Business rule, in priority order:
 *   1. A lesson starting imminently (join/prepare)
 *   2. Overdue or due-soon homework
 *   3. No upcoming lessons at all (go find a tutor)
 *   4. Otherwise, a gentle nudge to keep learning
 */
export function computeNextBestAction(lessons: LessonView[], homework: HomeworkView[]): NextBestActionDescriptor {
  const upcoming = lessons
    .filter((l) => l.state === "upcoming" || l.state === "starting-soon" || l.state === "ready-to-join")
    .sort((a, b) => a.booking.scheduledStart.localeCompare(b.booking.scheduledStart));

  const nextLesson = upcoming[0];
  if (nextLesson && (nextLesson.state === "starting-soon" || nextLesson.state === "ready-to-join")) {
    const minutesAway = Math.max(0, Math.round((new Date(nextLesson.booking.scheduledStart).getTime() - Date.now()) / 60000));
    return {
      headline: nextLesson.state === "ready-to-join" ? "Your lesson is starting now" : `Your next lesson starts in ${minutesAway} minutes`,
      detail: `${nextLesson.subjectName} with ${nextLesson.tutorName}`,
      ctaLabel: nextLesson.state === "ready-to-join" ? "Join Lesson" : "Prepare for Lesson",
      ctaTo: `/student/lessons/${nextLesson.booking.id}`,
    };
  }

  const pendingHomework = homework.filter((h) => h.status !== HomeworkStatus.SUBMITTED && h.status !== HomeworkStatus.REVIEWED);
  const urgentHomework = pendingHomework.filter(
    (h) => h.status === HomeworkStatus.OVERDUE || new Date(h.dueAt).getTime() - Date.now() < HOMEWORK_DUE_SOON_MS
  );
  const [firstUrgent] = urgentHomework;
  if (firstUrgent) {
    return {
      headline: `You have ${pendingHomework.length} homework task${pendingHomework.length === 1 ? "" : "s"} waiting`,
      detail: firstUrgent.status === HomeworkStatus.OVERDUE ? `${firstUrgent.title} is overdue` : `${firstUrgent.title} is due soon`,
      ctaLabel: "Continue Homework",
      ctaTo: `/student/homework/${firstUrgent.id}`,
    };
  }

  if (upcoming.length === 0) {
    return {
      headline: "You haven't booked your next lesson yet",
      detail: "Find a tutor who fits your subject and goals.",
      ctaLabel: "Find a Tutor",
      ctaTo: "/student/find-tutor",
    };
  }

  return {
    headline: "You're all caught up",
    detail: "Keep your momentum going with a bit of practice.",
    ctaLabel: "Browse Learning Library",
    ctaTo: "/student/library",
  };
}
