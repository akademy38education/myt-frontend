export interface LessonReportSummary {
  bookingId: string;
  studentId: string;
  tutorId: string;
  tutorName: string;
  subjectId: string;
  lessonDate: string;
  durationMinutes: number;
  summary?: string;
  objectives?: string[];
  nextSteps?: string[];
  homeworkIds?: string[];
}

export interface ReportFilter {
  childId: string;
  subjectId?: string;
  tutorId?: string;
  from?: string;
  to?: string;
}
