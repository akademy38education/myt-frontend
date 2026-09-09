import type { Booking, StudentProfile, TutorStudentNote } from "@myt/shared";

export interface TutorStudentSummary {
  studentId: string;
  name: string;
  avatarUrl?: string;
  subjects: string[];
  lessonsCount: number;
  lastLessonAt?: string;
  nextLessonAt?: string;
  status: "active" | "inactive";
}

export interface TutorStudentDetail {
  student: StudentProfile;
  name: string;
  bookings: Booking[];
  lessonsCount: number;
  lastLessonAt?: string;
  nextLessonAt?: string;
  attendanceRate: number;
}

export type { TutorStudentNote };
