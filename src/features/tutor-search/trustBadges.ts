import type { TutorProfile } from "@myt/shared";
import { TutorVerificationStatus } from "@myt/shared";

export interface TrustBadge {
  key: string;
  label: string;
}

/**
 * Every badge here is derived from a structured field on `TutorProfile` —
 * never randomly assigned — so a badge always means something a student
 * can verify by reading the rest of the profile. See Phase 5 spec §41/§16:
 * badges must reflect real data, and verification must not be overstated
 * while the underlying check is still a mock/manual process.
 */
export function getTrustBadges(tutor: TutorProfile): TrustBadge[] {
  const badges: TrustBadge[] = [];

  if (tutor.verificationStatus === TutorVerificationStatus.APPROVED) {
    badges.push({ key: "verified", label: "Verified" });
    if (tutor.qualifications && tutor.qualifications.length > 0) {
      badges.push({ key: "qualifications-verified", label: "Qualifications verified" });
    }
  }
  if (tutor.responseTimeMinutes !== undefined && tutor.responseTimeMinutes <= 20) {
    badges.push({ key: "fast-responder", label: "Fast responder" });
  }
  if (tutor.rating >= 4.8 && tutor.reviewCount >= 10) {
    badges.push({ key: "highly-rated", label: "Highly rated" });
  }
  if (tutor.reviewCount >= 100) {
    badges.push({ key: "popular", label: "Popular tutor" });
  } else if (tutor.reviewCount < 20) {
    badges.push({ key: "new", label: "New tutor" });
  }

  return badges;
}
