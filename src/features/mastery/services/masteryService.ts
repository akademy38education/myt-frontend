import { MasteryLevel, type MasteryHistoryPoint, type MasteryRecord } from "@myt/shared";
import { mockMastery } from "@/mocks";
import { SUBJECTS } from "@/constants/subjects";
import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import { MASTERY_LEVEL_WEIGHT, type SubjectMasterySummary } from "../types";

/** `record.score` (0-100) is the real backend's evidence-derived figure; MASTERY_LEVEL_WEIGHT is only a fallback for records that predate scoring. */
function recordPercent(record: MasteryRecord): number {
  return record.score ?? MASTERY_LEVEL_WEIGHT[record.level] * 100;
}

function summarize(subjectId: string, records: MasteryRecord[]): SubjectMasterySummary {
  return {
    subjectId,
    subjectName: SUBJECTS.find((s) => s.id === subjectId)?.name ?? subjectId,
    overallPercent: Math.round(records.reduce((sum, r) => sum + recordPercent(r), 0) / records.length),
    records,
    strongTopics: records.filter((r) => r.level === MasteryLevel.SECURE || r.level === MasteryLevel.MASTERED).map((r) => r.topic),
    needsAttentionTopics: records.filter((r) => r.level === MasteryLevel.EMERGING || r.level === MasteryLevel.NOT_STARTED).map((r) => r.topic),
  };
}

export const masteryService = {
  async getSubjectSummaries(studentId: string): Promise<SubjectMasterySummary[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay(200);
      const records = mockMastery.filter((m) => m.studentId === studentId);
      const subjectIds = Array.from(new Set(records.map((r) => r.subjectId)));

      return subjectIds.map((subjectId) => {
        const subjectRecords = records.filter((r) => r.subjectId === subjectId);
        const overallPercent = Math.round(
          (subjectRecords.reduce((sum, r) => sum + MASTERY_LEVEL_WEIGHT[r.level], 0) / subjectRecords.length) * 100
        );
        return {
          subjectId,
          subjectName: SUBJECTS.find((s) => s.id === subjectId)?.name ?? subjectId,
          overallPercent,
          records: subjectRecords,
          strongTopics: subjectRecords.filter((r) => r.level === MasteryLevel.SECURE || r.level === MasteryLevel.MASTERED).map((r) => r.topic),
          needsAttentionTopics: subjectRecords.filter((r) => r.level === MasteryLevel.EMERGING || r.level === MasteryLevel.NOT_STARTED).map((r) => r.topic),
        };
      });
    }

    const records = await apiRequest<MasteryRecord[]>(ENDPOINTS.mastery.forStudent(studentId));
    const subjectIds = Array.from(new Set(records.map((r) => r.subjectId)));
    return subjectIds.map((subjectId) => summarize(subjectId, records.filter((r) => r.subjectId === subjectId)));
  },

  async getHistory(studentId: string, topicId: string): Promise<MasteryHistoryPoint[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay(150);
      return [];
    }
    return apiRequest<MasteryHistoryPoint[]>(ENDPOINTS.mastery.history(studentId, topicId));
  },
};
