import type { LessonType, TutorProfile } from "@myt/shared";

/**
 * Mirrors `backend/src/modules/bookings/pricing.service.ts` exactly — used
 * by the booking wizard to show a live price as the user picks
 * duration/lesson type, and by the mock `bookingsService.create` so mock
 * mode charges the same as the real API would. The real API's computed
 * `priceTotal` on the returned `Booking` is always the authoritative value
 * (Phase 6 spec §59 — never trust a frontend-computed price for anything
 * but display-before-confirm).
 */
export const pricingService = {
  calculatePrice(tutor: Pick<TutorProfile, "hourlyRate" | "trialLessonEnabled" | "trialLessonPrice">, durationMinutes: number, lessonType: LessonType): number {
    if (lessonType === "trial" && tutor.trialLessonEnabled && tutor.trialLessonPrice !== undefined) {
      return tutor.trialLessonPrice;
    }
    return Math.round(tutor.hourlyRate * (durationMinutes / 60) * 100) / 100;
  },
};
