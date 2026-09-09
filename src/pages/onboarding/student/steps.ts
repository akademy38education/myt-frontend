import type { OnboardingStepMeta } from "@/features/onboarding/components/ProgressIndicator";

export const STUDENT_ONBOARDING_STEPS: OnboardingStepMeta[] = [
  { slug: "basic-info", label: "Basic Info" },
  { slug: "education", label: "Education" },
  { slug: "subjects", label: "Subjects" },
  { slug: "goals", label: "Goals" },
  { slug: "preferences", label: "Preferences" },
  { slug: "diagnostic", label: "Diagnostic" },
  { slug: "complete", label: "Complete" },
];

export function studentStepPath(slug: string) {
  return `/onboarding/student/${slug}`;
}
