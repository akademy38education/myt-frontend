import type { AchievementDefinition, AchievementKey } from "../types/learning";

/**
 * The full achievement catalog — code-defined, not admin-editable, since
 * each one's unlock criteria is a specific rule in
 * `backend/src/modules/achievements/achievements.service.ts`, not
 * freestanding data (Phase 12 spec §50: "Badges must have transparent
 * criteria"). Adding a new achievement means adding both an entry here and
 * the matching rule in that service.
 */
export const ACHIEVEMENT_CATALOG: Record<AchievementKey, AchievementDefinition> = {
  first_lesson_completed: {
    key: "first_lesson_completed",
    title: "First Lesson",
    description: "Completed your first lesson.",
    icon: "GraduationCap",
  },
  first_goal_completed: {
    key: "first_goal_completed",
    title: "Goal Crusher",
    description: "Reached your first learning goal.",
    icon: "Target",
  },
  ten_learning_activities: {
    key: "ten_learning_activities",
    title: "Consistent Learner",
    description: "Completed 10 learning activities (lessons, homework and revision combined).",
    icon: "Sparkles",
  },
  seven_day_streak: {
    key: "seven_day_streak",
    title: "Learning Streak",
    description: "Learned for 7 days in a row.",
    icon: "Flame",
  },
  subject_mastered: {
    key: "subject_mastered",
    title: "Subject Master",
    description: "Reached Mastered level in a topic.",
    icon: "Trophy",
  },
};
