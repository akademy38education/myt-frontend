/**
 * Phase 12 — Advanced Learning + Education Engine. Response/catalog shapes
 * shared between frontend and backend. Every numeric here (score, progress,
 * streak) is computed server-side from real repository data — never
 * invented — see `backend/src/modules/learning/`.
 */
import type { MasteryLevel } from "./enums";
import type { Homework, Question } from "./entities";

/** `Homework` enriched with everything a detail/list view needs in one round trip — assembled server-side in `homework.service.ts`, never reconstructed ad hoc on the frontend. */
export interface HomeworkDetail extends Homework {
  tutorName: string;
  studentName: string;
  subjectName: string;
  questions: Question[];
  answeredCount: number;
}

export interface SubjectProgress {
  subjectId: string;
  subjectName: string;
  /** 0-100, the average of this subject's topic mastery scores. */
  overallScore: number;
  topicsTotal: number;
  topicsStarted: number;
  topicsMastered: number;
}

export interface TopicMastery {
  topicId: string;
  topicTitle: string;
  subjectId: string;
  level: MasteryLevel;
  score: number;
  evidenceCount: number;
  lastActivityAt?: string;
}

/** One point in a topic's score-over-time trend — appended only when a recalculation actually changes the score, so the series stays meaningful rather than noisy (Phase 12 spec §8). */
export interface MasteryHistoryPoint {
  topicId: string;
  score: number;
  recordedAt: string;
}

export interface LearningProfile {
  strengths: string[];
  areasNeedingImprovement: string[];
  currentSubjects: SubjectProgress[];
  recentActivityCount: number;
  learningStreak: number;
  goalsInProgress: number;
  goalsCompleted: number;
}

export type RevisionReason = "low-mastery" | "stale" | "upcoming-lesson";

export interface RevisionQueueItem {
  topicId: string;
  topicTitle: string;
  subjectId: string;
  subjectName: string;
  reason: RevisionReason;
  level: MasteryLevel;
  score: number;
  lastActivityAt?: string;
}

export type LearningInsightKind = "strength" | "improvement" | "opportunity";

export interface LearningInsight {
  id: string;
  kind: LearningInsightKind;
  title: string;
  description: string;
}

export type StudyPlanItemType = "lesson" | "revision" | "goal";

export interface StudyPlanItem {
  id: string;
  dayOfWeek: number;
  title: string;
  subjectId?: string;
  durationMinutes: number;
  type: StudyPlanItemType;
  link?: string;
}

export interface StudyPlan {
  items: StudyPlanItem[];
  generatedAt: string;
}

export type AchievementKey = "first_lesson_completed" | "first_goal_completed" | "ten_learning_activities" | "seven_day_streak" | "subject_mastered";

export interface AchievementDefinition {
  key: AchievementKey;
  title: string;
  description: string;
  icon: string;
}

export interface UnlockedAchievement extends AchievementDefinition {
  unlockedAt: string;
}
