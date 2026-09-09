import { TutorVerificationStatus, type TutorApplicationWithApplicant } from "@myt/shared";

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();

/**
 * Mirrors `backend/src/models/seedData.ts`'s `HAND_WRITTEN_TUTOR_APPLICATIONS`
 * field-for-field, enriched with `applicantName`/`applicantEmail` the same
 * way `tutor-verification.service.ts`'s `withApplicant()` does server-side
 * (see `mockUsers` in `users.mock.ts` for the matching `user-tutor-pending`
 * record) — so the admin verification queue has a real PENDING application
 * to approve/reject/request-info against in mock mode, instead of an
 * honestly-empty queue.
 */
export const mockTutorApplications: TutorApplicationWithApplicant[] = [
  {
    id: "application-nadia",
    tutorId: "user-tutor-pending",
    applicantName: "Nadia Farouk",
    applicantEmail: "nadia.applicant@myt.dev",
    status: TutorVerificationStatus.PENDING,
    headline: "Spanish & French tutor, native bilingual speaker",
    bio: "Recently completed a Master's in Modern Languages and have spent the last two years tutoring privately. Looking to bring that experience to MyT.",
    location: "Leeds, UK",
    languages: ["English", "Spanish", "French"],
    subjects: ["subject-spanish", "subject-french"],
    yearLevels: ["GCSE", "A-Level"],
    curricula: ["Edexcel"],
    yearsExperience: 2,
    ageGroups: ["11-16", "16-18"],
    qualifications: [{ id: "qual-nadia-1", title: "MA Modern Languages", institution: "University of Leeds", year: 2024, subject: "Modern Languages" }],
    teachingStyle: "Conversational",
    lessonApproach: "Lessons are conducted mostly in the target language from the first session, building confidence through real conversation rather than rote grammar drills.",
    hourlyRate: 28,
    currency: "GBP",
    trialLessonEnabled: true,
    trialLessonPrice: 10,
    availability: [
      { dayOfWeek: 2, startTime: "16:00", endTime: "19:00" },
      { dayOfWeek: 4, startTime: "16:00", endTime: "19:00" },
    ],
    submittedAt: daysAgo(1),
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
];
