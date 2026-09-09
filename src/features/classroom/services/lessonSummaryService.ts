import type { Lesson } from "@myt/shared";

export interface LessonSummaryInputs {
  lesson: Lesson;
  subjectName: string;
  sharedNoteBody?: string;
}

export interface RecommendedNextSteps {
  practice: string[];
  review: string[];
  nextLessonFocus?: string;
}

/**
 * The interface a real AI summarizer would sit behind later (Phase 7 spec
 * §60: "create an interface ready for future AI... use structured/mock
 * summaries for now, do NOT fake AI output as real AI"). Today this is
 * pure templating from whatever structured data the lesson actually has
 * (objectives, next steps, shared notes) — never invented content, and
 * never presented as AI-generated.
 */
export const lessonSummaryService = {
  buildRecommendations(inputs: LessonSummaryInputs): RecommendedNextSteps {
    const { lesson, subjectName } = inputs;
    return {
      practice: lesson.objectives?.length ? lesson.objectives.map((o) => `${subjectName}: ${o}`) : [`Review today's ${subjectName} lesson`],
      review: lesson.nextSteps?.length ? lesson.nextSteps : ["Go over your lesson notes before your next session"],
      nextLessonFocus: lesson.nextSteps?.[0],
    };
  },
};
