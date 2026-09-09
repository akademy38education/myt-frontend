import type { StudentProfile } from "@myt/shared";

export const mockStudents: StudentProfile[] = [
  {
    id: "student-1",
    userId: "user-student-1",
    parentId: "parent-1",
    fullName: "Amelia Carter",
    yearGroup: "Year 11",
    subjects: ["subject-maths", "subject-physics"],
    learningGoals: ["Improve algebra fluency", "Build exam confidence for Physics Paper 2"],
    timezone: "Europe/London",
    createdAt: "2026-01-10T09:00:00.000Z",
    updatedAt: "2026-01-10T09:00:00.000Z",
  },
  {
    id: "student-9",
    parentId: "parent-1",
    fullName: "Zara Carter",
    yearGroup: "Year 7",
    subjects: ["subject-english", "subject-french"],
    learningGoals: ["Build confidence reading aloud in French"],
    timezone: "Europe/London",
    createdAt: "2026-08-27T09:00:00.000Z",
    updatedAt: "2026-08-27T09:00:00.000Z",
  },
];
