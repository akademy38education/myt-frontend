import type { Booking, Lesson } from "@myt/shared";

export type LessonViewState = "starting-soon" | "upcoming" | "ready-to-join" | "completed" | "cancelled" | "missed";

export interface LessonResource {
  title: string;
  type: "worksheet" | "video" | "article";
}

/**
 * Rich per-lesson detail that doesn't exist on the real `Booking` entity
 * (or the scaffolded `Lesson` entity) yet — topic, goals, prep notes,
 * resources. Keyed by booking id in `lessonMeta.ts` so it can be merged
 * onto real booking data. See that file's doc comment for why.
 */
export interface LessonMeta {
  topic: string;
  goals: string[];
  prepNotes: string;
  resources: LessonResource[];
  questionsToAsk: string[];
}

/** A booking, merged with its (mock) Lesson record and LessonMeta, ready for display. */
export interface LessonView {
  booking: Booking;
  lesson?: Lesson;
  meta?: LessonMeta;
  tutorName: string;
  subjectName: string;
  state: LessonViewState;
}
