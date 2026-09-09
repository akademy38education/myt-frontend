import type { LearningProfile, Question, RevisionQueueItem, StudyPlan, SubjectProgress } from "@myt/shared";
import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import { SUBJECTS } from "@/constants/subjects";
import type { SubjectDetailResponse, TopicDetailResponse } from "../types";

const EMPTY_PROFILE: LearningProfile = {
  strengths: [],
  areasNeedingImprovement: [],
  currentSubjects: [],
  recentActivityCount: 0,
  learningStreak: 0,
  goalsInProgress: 0,
  goalsCompleted: 0,
};

/**
 * Phase 12 "My Learning" hub. No pre-existing mock dataset backs this
 * brand-new feature (see `features/reports/services/reportsService.ts` for
 * the same precedent), so mock mode returns honest empty/zero shapes rather
 * than inventing progress that was never earned.
 */
export const learningService = {
  async getProfile(): Promise<LearningProfile> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return EMPTY_PROFILE;
    }
    return apiRequest<LearningProfile>(ENDPOINTS.learning.profile);
  },

  async getProgress(): Promise<SubjectProgress[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return [];
    }
    return apiRequest<SubjectProgress[]>(ENDPOINTS.learning.progress);
  },

  async getSubjectDetail(subjectId: string): Promise<SubjectDetailResponse> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return { subjectId, subjectName: SUBJECTS.find((s) => s.id === subjectId)?.name ?? subjectId, topics: [] };
    }
    return apiRequest<SubjectDetailResponse>(ENDPOINTS.learning.subject(subjectId));
  },

  async getTopicDetail(topicId: string): Promise<TopicDetailResponse> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      throw new Error("Topic not found");
    }
    return apiRequest<TopicDetailResponse>(ENDPOINTS.learning.topic(topicId));
  },

  async getRevisionQueue(): Promise<RevisionQueueItem[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return [];
    }
    return apiRequest<RevisionQueueItem[]>(ENDPOINTS.learning.revision);
  },

  async getStudyPlan(): Promise<StudyPlan> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return { items: [], generatedAt: new Date().toISOString() };
    }
    return apiRequest<StudyPlan>(ENDPOINTS.learning.studyPlan);
  },

  async getPracticeQuestions(topicId: string): Promise<Question[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return [];
    }
    return apiRequest<Question[]>(ENDPOINTS.practiceQuestions.byTopic(topicId));
  },
};
