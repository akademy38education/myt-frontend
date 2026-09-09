import { mockExams, type ExamMock } from "@/mocks";
import { delay } from "@/utils/delay";

/**
 * Exam mode foundation only — see docs/product/README.md. Real adaptive
 * exam generation/scoring is a future MyT Intelligence capability; this
 * service just surfaces upcoming exams and a revision-progress snapshot
 * from mock data.
 */
export const examService = {
  async list(): Promise<ExamMock[]> {
    await delay(150);
    return [...mockExams].sort((a, b) => a.date.localeCompare(b.date));
  },
};
