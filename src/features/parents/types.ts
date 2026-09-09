import type { BookingStatus, ParentProfile, StudentProfile } from "@myt/shared";

export interface FamilyNextLesson {
  bookingId: string;
  childId: string;
  childName: string;
  tutorId: string;
  tutorName: string;
  subjectId: string;
  scheduledStart: string;
  scheduledEnd: string;
}

export interface FamilyScheduleItem extends FamilyNextLesson {
  status: BookingStatus;
}

export interface ParentDashboardSummary {
  profile: ParentProfile;
  children: StudentProfile[];
  upcomingSessionsCount: number;
  nextLesson: FamilyNextLesson | null;
  todaysSchedule: FamilyScheduleItem[];
  thisMonthSpending: number;
  currency: string;
  attentionItems: string[];
  recentReportsCount: number;
}
