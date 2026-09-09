export type LearningStatus = "on-track" | "making-progress" | "needs-attention" | "at-risk";

export const LEARNING_STATUS_LABEL: Record<LearningStatus, string> = {
  "on-track": "On Track",
  "making-progress": "Making Progress",
  "needs-attention": "Needs Attention",
  "at-risk": "At Risk",
};

export const LEARNING_STATUS_VARIANT: Record<LearningStatus, "success" | "outline" | "warning" | "destructive"> = {
  "on-track": "success",
  "making-progress": "outline",
  "needs-attention": "warning",
  "at-risk": "destructive",
};

/**
 * A simple, deterministic, rule-based indicator — never a machine-learning
 * prediction (Phase 9 spec §7 explicitly forbids "fake AI predictions"
 * here). `null` inputs mean "no data yet" and are treated as neutral rather
 * than penalized, so a brand-new child isn't marked "at risk" purely for
 * lack of history.
 */
export function computeLearningStatus(params: { avgProgress: number | null; overdueHomeworkCount: number; attendanceRate: number | null }): LearningStatus {
  const { avgProgress, overdueHomeworkCount, attendanceRate } = params;
  if (overdueHomeworkCount >= 3 || (attendanceRate !== null && attendanceRate < 60)) return "at-risk";
  if (overdueHomeworkCount >= 1 || (attendanceRate !== null && attendanceRate < 80) || (avgProgress !== null && avgProgress < 50)) return "needs-attention";
  if (avgProgress !== null && avgProgress >= 75) return "on-track";
  return "making-progress";
}
