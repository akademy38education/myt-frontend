import type { TutorMatchResult, TutorProfile } from "@myt/shared";
import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import { mockTutors } from "@/mocks";
import { SUBJECTS } from "@/constants/subjects";
import type { SmartMatchAnswers } from "../types";

const MAX_RESULTS = 6;

interface ScoreBreakdown {
  subject: number;
  teachingStyle: number;
  availability: number;
  budget: number;
  yearLevel: number;
  quality: number;
}

/**
 * Mirrors `backend/src/modules/smart-match/smartMatch.service.ts`'s
 * weighted scoring exactly, so mock mode and the real API never disagree
 * about what a "96% match" means. This is explicitly NOT real AI — see
 * that file's doc comment. Swapping in a real recommendation engine later
 * means changing this file (and its backend counterpart) only.
 */
function score(tutor: TutorProfile, answers: SmartMatchAnswers): ScoreBreakdown {
  const subject = tutor.subjects.includes(answers.subjectId) ? 30 : 0;
  const teachingStyle = !answers.teachingStyle ? 10 : tutor.teachingStyle === answers.teachingStyle ? 20 : 5;
  const availability =
    answers.availability.length === 0
      ? 10
      : Math.round((20 * answers.availability.filter((slot) => tutor.availabilitySlots.includes(slot)).length) / answers.availability.length);
  const budget =
    answers.budgetPerHour === undefined ? 10 : tutor.hourlyRate <= answers.budgetPerHour ? 15 : tutor.hourlyRate <= answers.budgetPerHour * 1.15 ? 7 : 0;
  const yearLevel = !answers.yearLevel ? 5 : tutor.yearLevels.includes(answers.yearLevel) ? 10 : 0;
  const quality = Math.round((tutor.rating / 5) * 5);
  return { subject, teachingStyle, availability, budget, yearLevel, quality };
}

function explain(tutor: TutorProfile, answers: SmartMatchAnswers, breakdown: ScoreBreakdown): string[] {
  const reasons: string[] = [];
  const subjectName = SUBJECTS.find((s) => s.id === answers.subjectId)?.name ?? "your subject";

  if (breakdown.subject > 0) reasons.push(`Teaches ${subjectName}`);
  if (breakdown.teachingStyle >= 20) reasons.push(`Matches your preferred "${answers.teachingStyle}" teaching style`);
  if (breakdown.availability >= 15) reasons.push("Available when you need lessons");
  else if (breakdown.availability > 0) reasons.push("Partially available at your preferred times");
  if (breakdown.budget >= 15) reasons.push("Fits your budget");
  else if (breakdown.budget > 0) reasons.push("Close to your budget");
  if (breakdown.yearLevel >= 10 && answers.yearLevel) reasons.push(`Experienced teaching ${answers.yearLevel} students`);
  if (tutor.rating >= 4.8) reasons.push("Exceptionally high student satisfaction");
  else if (tutor.rating >= 4.5) reasons.push("Highly rated by students");
  if (tutor.reviewCount >= 100) reasons.push("Popular, well-established tutor");
  if (tutor.trialLessonEnabled) reasons.push("Offers a trial lesson");

  return reasons;
}

export const smartMatchService = {
  async getRecommendations(answers: SmartMatchAnswers): Promise<TutorMatchResult[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay(900); // gives the "Finding your matches..." step something real to show for
      const tutors = mockTutors.filter((t) => t.subjects.includes(answers.subjectId));
      return tutors
        .map((tutor) => {
          const breakdown = score(tutor, answers);
          const matchScore = Math.max(0, Math.min(100, breakdown.subject + breakdown.teachingStyle + breakdown.availability + breakdown.budget + breakdown.yearLevel + breakdown.quality));
          return { tutor, matchScore, matchReasons: explain(tutor, answers, breakdown) };
        })
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, MAX_RESULTS);
    }

    await delay(600); // the real call is fast; this keeps the "Finding your matches..." step from flashing instantly
    return apiRequest<TutorMatchResult[]>(ENDPOINTS.smartMatch.recommend, { method: "POST", body: answers });
  },
};
