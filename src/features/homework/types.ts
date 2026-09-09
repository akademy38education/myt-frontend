import type { HomeworkDetail } from "@myt/shared";

/** `HomeworkDetail` plus `feedback` — a `tutorFeedback` alias kept so consumer components didn't need to be touched when this swapped from mock to the real, `tutorFeedback`-named backend field. */
export interface HomeworkView extends HomeworkDetail {
  feedback?: string;
}
