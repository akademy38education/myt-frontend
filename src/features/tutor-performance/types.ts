export interface TutorPerformance {
  averageRating: number;
  totalReviews: number;
  completionRate: number;
  attendanceRate: number;
  responseTimeMinutes?: number;
  lessonsThisWeek: number;
  lessonsThisMonth: number;
  hoursTaughtThisWeek: number;
  hoursTaughtThisMonth: number;
  newStudentsThisMonth: number;
  returningStudents: number;
  repeatBookingRate: number;
  lessonsOverTime: Array<{ weekStart: string; count: number }>;
  ratingTrend: Array<{ date: string; rating: number }>;
}
