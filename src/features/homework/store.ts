import { create } from "zustand";
import { persist } from "zustand/middleware";
import { HomeworkStatus } from "@myt/shared";

interface HomeworkAnswersState {
  answersByQuestionId: Record<string, string>;
  statusOverrides: Record<string, HomeworkStatus>;
  feedbackByHomeworkId: Record<string, string>;
  setAnswer: (questionId: string, answer: string) => void;
  submitHomework: (homeworkId: string) => void;
  reviewHomework: (homeworkId: string, feedback: string) => void;
}

/**
 * Homework/Question are scaffolded backend entities — there's no server to
 * persist an in-progress attempt or a submission to yet, so this store is
 * the (explicitly allowed, see docs/product/README.md) client-side stand-in:
 * real answers, real "submitted" state, just local to this browser. See
 * services/homeworkService.ts for how it overlays onto the base mock data.
 */
export const useHomeworkAnswersStore = create<HomeworkAnswersState>()(
  persist(
    (set) => ({
      answersByQuestionId: {},
      statusOverrides: {},
      feedbackByHomeworkId: {},
      setAnswer: (questionId, answer) =>
        set((state) => ({ answersByQuestionId: { ...state.answersByQuestionId, [questionId]: answer } })),
      submitHomework: (homeworkId) =>
        set((state) => ({ statusOverrides: { ...state.statusOverrides, [homeworkId]: HomeworkStatus.SUBMITTED } })),
      reviewHomework: (homeworkId, feedback) =>
        set((state) => ({
          statusOverrides: { ...state.statusOverrides, [homeworkId]: HomeworkStatus.REVIEWED },
          feedbackByHomeworkId: { ...state.feedbackByHomeworkId, [homeworkId]: feedback },
        })),
    }),
    { name: "myt-homework-answers" }
  )
);
