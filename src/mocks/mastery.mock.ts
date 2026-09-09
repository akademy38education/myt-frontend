import { MasteryLevel, type MasteryRecord } from "@myt/shared";

export const mockMastery: MasteryRecord[] = [
  { id: "mastery-1", studentId: "student-1", subjectId: "subject-maths", topic: "Quadratic equations", level: MasteryLevel.DEVELOPING, confidence: 0.62, createdAt: "2026-09-01T17:10:00.000Z", updatedAt: "2026-09-06T17:10:00.000Z" },
  { id: "mastery-2", studentId: "student-1", subjectId: "subject-maths", topic: "Simultaneous equations", level: MasteryLevel.SECURE, confidence: 0.81, createdAt: "2026-08-20T17:10:00.000Z", updatedAt: "2026-08-20T17:10:00.000Z" },
  { id: "mastery-3", studentId: "student-1", subjectId: "subject-maths", topic: "Algebra basics", level: MasteryLevel.MASTERED, confidence: 0.93, createdAt: "2026-07-01T17:10:00.000Z", updatedAt: "2026-07-01T17:10:00.000Z" },
  { id: "mastery-4", studentId: "student-1", subjectId: "subject-maths", topic: "Trigonometry", level: MasteryLevel.EMERGING, confidence: 0.28, createdAt: "2026-08-15T17:10:00.000Z", updatedAt: "2026-08-15T17:10:00.000Z" },
  { id: "mastery-5", studentId: "student-1", subjectId: "subject-physics", topic: "Forces", level: MasteryLevel.EMERGING, confidence: 0.34, createdAt: "2026-08-15T17:10:00.000Z", updatedAt: "2026-08-15T17:10:00.000Z" },
  { id: "mastery-6", studentId: "student-1", subjectId: "subject-physics", topic: "Energy", level: MasteryLevel.NOT_STARTED, confidence: 0, createdAt: "2026-08-15T17:10:00.000Z", updatedAt: "2026-08-15T17:10:00.000Z" },
  { id: "mastery-7", studentId: "student-1", subjectId: "subject-english", topic: "Macbeth", level: MasteryLevel.DEVELOPING, confidence: 0.58, createdAt: "2026-08-18T17:10:00.000Z", updatedAt: "2026-09-03T17:10:00.000Z" },
  { id: "mastery-8", studentId: "student-1", subjectId: "subject-english", topic: "Poetry analysis", level: MasteryLevel.SECURE, confidence: 0.76, createdAt: "2026-07-20T17:10:00.000Z", updatedAt: "2026-07-20T17:10:00.000Z" },
];
