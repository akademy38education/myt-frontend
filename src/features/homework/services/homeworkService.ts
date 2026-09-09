import type { HomeworkDetail } from "@myt/shared";
import { UserRole } from "@myt/shared";
import { mockHomework, mockQuestions, mockStudents, mockTutors } from "@/mocks";
import { SUBJECTS } from "@/constants/subjects";
import { apiRequest, ApiError } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { useAuthStore } from "@/stores/authStore";
import { delay } from "@/utils/delay";
import { useHomeworkAnswersStore } from "../store";
import type { HomeworkView } from "../types";

/**
 * `Homework`/`Question` are scaffolded backend entities (see
 * backend/src/modules/homework, /questions) — this service is mock-only
 * regardless of `VITE_USE_MOCK_API`, overlaid with the real, locally-persisted
 * in-progress/submitted state from `../store.ts`. Swapping in the real
 * backend later means changing this file only.
 */
function toMockView(homeworkId: string): HomeworkView | undefined {
  const base = mockHomework.find((h) => h.id === homeworkId);
  if (!base) return undefined;

  const { statusOverrides, answersByQuestionId, feedbackByHomeworkId } = useHomeworkAnswersStore.getState();
  const questions = base.questionIds.map((id) => mockQuestions.find((q) => q.id === id)).filter((q): q is NonNullable<typeof q> => Boolean(q));
  const tutor = mockTutors.find((t) => t.id === base.tutorId);
  const student = mockStudents.find((s) => s.id === base.studentId);
  const subjectName = SUBJECTS.find((s) => s.id === questions[0]?.subjectId)?.name ?? "General";
  const answeredCount = questions.filter((q) => answersByQuestionId[q.id]).length;

  return {
    ...base,
    status: statusOverrides[base.id] ?? base.status,
    tutorName: tutor?.headline ?? "Your tutor",
    studentName: student?.fullName ?? "Student",
    subjectName,
    questions,
    answeredCount,
    feedback: feedbackByHomeworkId[base.id],
  };
}

/** `tutorFeedback` is the real backend field name; `feedback` is kept as an alias on `HomeworkView` so consumer components didn't need renaming. */
function toView(detail: HomeworkDetail): HomeworkView {
  return { ...detail, feedback: detail.tutorFeedback };
}

/** Mirrors saved server answers into the local echo store so `getAnswer`/`answeredCount` read correctly right after a fetch, without a round trip per keystroke while the student is still typing. */
function seedAnswers(detail: HomeworkDetail): void {
  const { setAnswer } = useHomeworkAnswersStore.getState();
  for (const answer of detail.answers ?? []) setAnswer(answer.questionId, answer.response);
}

export const homeworkService = {
  async list(studentId: string): Promise<HomeworkView[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay(200);
      return mockHomework
        .filter((h) => h.studentId === studentId)
        .map((h) => toMockView(h.id))
        .filter((h): h is HomeworkView => Boolean(h))
        .sort((a, b) => a.dueAt.localeCompare(b.dueAt));
    }

    const role = useAuthStore.getState().user?.role;
    let items: HomeworkDetail[];
    if (role === UserRole.TUTOR) {
      const all = await apiRequest<HomeworkDetail[]>(ENDPOINTS.homework.listForTutor);
      items = all.filter((h) => h.studentId === studentId);
    } else if (role === UserRole.STUDENT) {
      items = await apiRequest<HomeworkDetail[]>(ENDPOINTS.homework.list);
    } else {
      items = await apiRequest<HomeworkDetail[]>(ENDPOINTS.homework.listForStudent(studentId));
    }
    return items.map(toView).sort((a, b) => a.dueAt.localeCompare(b.dueAt));
  },

  async getById(homeworkId: string): Promise<HomeworkView | undefined> {
    if (env.VITE_USE_MOCK_API) {
      await delay(200);
      return toMockView(homeworkId);
    }

    try {
      const detail = await apiRequest<HomeworkDetail>(ENDPOINTS.homework.getById(homeworkId));
      seedAnswers(detail);
      return toView(detail);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return undefined;
      throw error;
    }
  },

  /** Homework assigned as a direct result of one lesson — see `Homework.lessonId` (keyed by booking id, matching this app's id convention). Powers the classroom's "related homework" panel. */
  async listForLesson(bookingId: string): Promise<HomeworkView[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay(200);
      return mockHomework
        .filter((h) => h.lessonId === bookingId)
        .map((h) => toMockView(h.id))
        .filter((h): h is HomeworkView => Boolean(h));
    }

    const items = await apiRequest<HomeworkDetail[]>(ENDPOINTS.homework.listForLesson(bookingId));
    return items.map(toView);
  },

  /** All homework across every student this tutor teaches — the review queue backing `/tutor/homework`. */
  async listForTutor(tutorId: string): Promise<HomeworkView[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay(200);
      return mockHomework
        .filter((h) => h.tutorId === tutorId)
        .map((h) => toMockView(h.id))
        .filter((h): h is HomeworkView => Boolean(h))
        .sort((a, b) => a.dueAt.localeCompare(b.dueAt));
    }

    const items = await apiRequest<HomeworkDetail[]>(ENDPOINTS.homework.listForTutor);
    return items.map(toView).sort((a, b) => a.dueAt.localeCompare(b.dueAt));
  },

  async saveAnswer(homeworkId: string, questionId: string, answer: string): Promise<void> {
    useHomeworkAnswersStore.getState().setAnswer(questionId, answer);
    if (env.VITE_USE_MOCK_API) return;
    await apiRequest<HomeworkDetail>(ENDPOINTS.homework.saveAnswers(homeworkId), {
      method: "POST",
      body: { answers: [{ questionId, response: answer }] },
    });
  },

  async submit(homeworkId: string): Promise<void> {
    if (env.VITE_USE_MOCK_API) {
      await delay(400);
      useHomeworkAnswersStore.getState().submitHomework(homeworkId);
      return;
    }
    await apiRequest<HomeworkDetail>(ENDPOINTS.homework.submit(homeworkId), { method: "POST" });
  },

  async review(homeworkId: string, feedback: string): Promise<void> {
    if (env.VITE_USE_MOCK_API) {
      await delay(400);
      useHomeworkAnswersStore.getState().reviewHomework(homeworkId, feedback);
      return;
    }
    await apiRequest<HomeworkDetail>(ENDPOINTS.homework.review(homeworkId), { method: "POST", body: { feedback } });
  },

  getAnswer(questionId: string): string | undefined {
    return useHomeworkAnswersStore.getState().answersByQuestionId[questionId];
  },
};
