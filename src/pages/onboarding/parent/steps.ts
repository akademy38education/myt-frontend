import type { OnboardingStepMeta } from "@/features/onboarding/components/ProgressIndicator";

export const PARENT_ONBOARDING_STEPS: OnboardingStepMeta[] = [
  { slug: "account", label: "Account" },
  { slug: "children", label: "Children" },
  { slug: "goals", label: "Goals" },
  { slug: "permissions", label: "Permissions" },
  { slug: "complete", label: "Complete" },
];

export function parentStepPath(slug: string) {
  return `/onboarding/parent/${slug}`;
}
