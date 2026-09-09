import type { Booking, StudentProfile } from "@myt/shared";

export interface StudentDashboardSummary {
  profile: StudentProfile;
  upcomingBookings: Booking[];
  homeworkDueCount: number;
  activeGoalsCount: number;
}
