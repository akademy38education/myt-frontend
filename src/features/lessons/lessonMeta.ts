import type { LessonMeta } from "./types";

/**
 * Mock lesson detail keyed by booking id — see types.ts's doc comment.
 * `booking-1` and `booking-2` match the real seeded bookings from the
 * backend (backend/src/models/seedData.ts); the others back the
 * mock-only past-lesson history in `mocks/lessons.mock.ts`.
 */
export const LESSON_META: Record<string, LessonMeta> = {
  "booking-1": {
    topic: "Quadratic equations — factorising with negative coefficients",
    goals: ["Factorise quadratics with negative coefficients", "Build speed on the completing-the-square method"],
    prepNotes: "Review your notes on factorising positive quadratics from last lesson before we start.",
    resources: [
      { title: "Factorising quadratics, step by step", type: "video" },
      { title: "Quadratic equations practice pack", type: "worksheet" },
    ],
    questionsToAsk: ["What should I do when the coefficient of x² isn't 1?", "How do I check my factorisation is correct?"],
  },
  "booking-2": {
    topic: "Macbeth — Act 3 close reading",
    goals: ["Identify imagery patterns across Act 3", "Practise integrating quotations smoothly"],
    prepNotes: "Re-read Act 3, Scene 2 and note every reference to blood or darkness.",
    resources: [{ title: "Writing about imagery in Macbeth", type: "article" }],
    questionsToAsk: ["How many quotations should I use per paragraph?"],
  },
  "booking-past-1": {
    topic: "Quadratic equations — factorising",
    goals: ["Factorise simple quadratics"],
    prepNotes: "",
    resources: [{ title: "Factorising quadratics, step by step", type: "video" }],
    questionsToAsk: [],
  },
  "booking-past-2": {
    topic: "Macbeth — Act 3 close reading",
    goals: ["Identify imagery patterns across Act 3"],
    prepNotes: "",
    resources: [{ title: "Writing about imagery in Macbeth", type: "article" }],
    questionsToAsk: [],
  },
  "booking-past-3": {
    topic: "Forces — Newton's laws recap",
    goals: ["Recap Newton's three laws of motion"],
    prepNotes: "",
    resources: [],
    questionsToAsk: [],
  },
};

export function getLessonMeta(bookingId: string): LessonMeta | undefined {
  return LESSON_META[bookingId];
}
