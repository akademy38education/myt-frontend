import type { TutorProfile } from "@myt/shared";
import type { TutorSearchFilter } from "./types";

/**
 * A transparent "how well does this tutor fit what I asked for" indicator —
 * literally the fraction of the filters you've set that this tutor
 * satisfies. This is NOT the SmartMatch score (see features/smart-match,
 * which uses a separate weighted algorithm with its own explanations);
 * it's computed here, from the exact filters visible in the search UI, so
 * it's never misrepresented as more intelligent than it is.
 *
 * Returns `null` when no filters are active (nothing to match against).
 */
export function computeMatchScore(tutor: TutorProfile, filter: TutorSearchFilter): number | null {
  const checks: boolean[] = [];

  if (filter.subjectId) checks.push(tutor.subjects.includes(filter.subjectId));
  if (filter.minRating) checks.push(tutor.rating >= filter.minRating);
  if (filter.minPrice) checks.push(tutor.hourlyRate >= filter.minPrice);
  if (filter.maxPrice) checks.push(tutor.hourlyRate <= filter.maxPrice);
  if (filter.yearLevel) checks.push(tutor.yearLevels.includes(filter.yearLevel));
  if (filter.curriculum) checks.push(tutor.curricula.includes(filter.curriculum));
  if (filter.teachingStyle) checks.push(tutor.teachingStyle === filter.teachingStyle);
  if (filter.availability) checks.push(tutor.availabilitySlots.includes(filter.availability));
  if (filter.language) checks.push(tutor.languages.includes(filter.language));
  if (filter.verifiedOnly) checks.push(tutor.verificationStatus === "APPROVED");
  if (filter.trialAvailable) checks.push(Boolean(tutor.trialLessonEnabled));

  if (checks.length === 0) return null;
  const matched = checks.filter(Boolean).length;
  return Math.round((matched / checks.length) * 100);
}
