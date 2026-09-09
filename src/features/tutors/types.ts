import type { BookingStatus } from "@myt/shared";

export interface TutorNextLesson {
  bookingId: string;
  studentId: string;
  studentName: string;
  subjectId: string;
  scheduledStart: string;
  scheduledEnd: string;
}

export interface TutorScheduleItem {
  bookingId: string;
  studentId: string;
  studentName: string;
  subjectId: string;
  scheduledStart: string;
  scheduledEnd: string;
  status: BookingStatus;
}

export interface TutorRecentStudent {
  studentId: string;
  name: string;
  subjectId: string;
  lastLessonAt: string;
}

export interface TutorDashboardSummary {
  tutorId: string;
  upcomingSessionsCount: number;
  studentsCount: number;
  averageRating: number;
  pendingHomeworkReviews: number;
  todaysLessonsCount: number;
  todaysStudentsCount: number;
  todaysTeachingMinutes: number;
  todaysEarnings: number;
  nextLesson: TutorNextLesson | null;
  todaysSchedule: TutorScheduleItem[];
  lessonsThisWeek: number;
  hoursTaughtThisWeek: number;
  completionRate: number;
  earningsThisWeek: number;
  earningsThisMonth: number;
  earningsPending: number;
  earningsAvailable: number;
  recentStudents: TutorRecentStudent[];
  attentionItems: string[];
  unfinishedSummariesCount: number;
}
