export interface ProgressReportMock {
  id: string;
  studentId: string;
  periodLabel: string;
  subjectId: string;
  summary: string;
  generatedAt: string;
}

export const mockReports: ProgressReportMock[] = [
  {
    id: "report-1",
    studentId: "student-1",
    periodLabel: "August 2026",
    subjectId: "subject-maths",
    summary: "Amelia attended 4 lessons this month and moved from Emerging to Developing on quadratic equations. Recommended focus: negative coefficients.",
    generatedAt: "2026-09-01T00:00:00.000Z",
  },
];
