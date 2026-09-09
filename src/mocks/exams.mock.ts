export interface ExamMock {
  id: string;
  subjectId: string;
  title: string;
  examBoard: string;
  date: string;
  revisionProgress: number;
  topicsToRevise: string[];
}

export const mockExams: ExamMock[] = [
  {
    id: "exam-1",
    subjectId: "subject-maths",
    title: "Maths Mock Exam — Paper 1",
    examBoard: "AQA",
    date: "2026-11-15T09:00:00.000Z",
    revisionProgress: 45,
    topicsToRevise: ["Trigonometry", "Quadratic equations"],
  },
  {
    id: "exam-2",
    subjectId: "subject-physics",
    title: "Physics Paper 2",
    examBoard: "AQA",
    date: "2026-12-03T09:00:00.000Z",
    revisionProgress: 20,
    topicsToRevise: ["Forces", "Energy"],
  },
];
