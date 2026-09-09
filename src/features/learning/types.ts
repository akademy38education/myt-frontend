import type { MasteryHistoryPoint, MasteryLevel } from "@myt/shared";

/** One topic as returned by `GET /learning/subjects/:subjectId` — `Topic` merged with this student's `MasteryRecord`, so the tree can be built and mastery shown in one round trip. */
export interface SubjectDetailTopic {
  topicId: string;
  title: string;
  description?: string;
  objectives: string[];
  parentTopicId?: string;
  order: number;
  level: MasteryLevel;
  score: number;
  evidenceCount: number;
  lastActivityAt?: string;
}

export interface SubjectDetailResponse {
  subjectId: string;
  subjectName: string;
  topics: SubjectDetailTopic[];
}

export interface TopicDetailResponse {
  topicId: string;
  subjectId: string;
  subjectName: string;
  title: string;
  description?: string;
  objectives: string[];
  level: MasteryLevel;
  score: number;
  evidenceCount: number;
  lastActivityAt?: string;
  history: MasteryHistoryPoint[];
  relatedHomeworkIds: string[];
}
