import { MasteryLevel, type MasteryRecord } from "@myt/shared";

export interface SubjectMasterySummary {
  subjectId: string;
  subjectName: string;
  overallPercent: number;
  records: MasteryRecord[];
  strongTopics: string[];
  needsAttentionTopics: string[];
}

export const MASTERY_LEVEL_WEIGHT: Record<MasteryLevel, number> = {
  [MasteryLevel.NOT_STARTED]: 0,
  [MasteryLevel.EMERGING]: 0.25,
  [MasteryLevel.DEVELOPING]: 0.5,
  [MasteryLevel.SECURE]: 0.75,
  [MasteryLevel.MASTERED]: 1,
};
