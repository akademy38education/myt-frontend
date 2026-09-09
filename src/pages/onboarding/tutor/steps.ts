import type { OnboardingStepMeta } from "@/features/onboarding/components/ProgressIndicator";

export const TUTOR_ONBOARDING_STEPS: OnboardingStepMeta[] = [
  { slug: "profile", label: "Profile" },
  { slug: "subjects", label: "Subjects" },
  { slug: "experience", label: "Experience" },
  { slug: "qualifications", label: "Qualifications" },
  { slug: "verification", label: "Verification" },
  { slug: "teaching-style", label: "Teaching Style" },
  { slug: "pricing", label: "Pricing" },
  { slug: "availability", label: "Availability" },
  { slug: "review", label: "Review" },
];

export function tutorStepPath(slug: string) {
  return `/onboarding/tutor/${slug}`;
}
