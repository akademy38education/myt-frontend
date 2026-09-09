import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingStepCard } from "@/features/onboarding/components/OnboardingStepCard";
import { OnboardingStepFooter } from "@/features/onboarding/components/OnboardingStepFooter";
import { AvailabilityEditor, type AvailabilityRange } from "@/components/shared/AvailabilityEditor";
import { useTutorOnboardingStore } from "@/features/onboarding/tutor/store";
import { tutorStepPath } from "./steps";

export function TutorAvailabilityStep() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useTutorOnboardingStore();
  const [availability, setAvailability] = useState<AvailabilityRange[]>(draft.availability ?? []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateDraft({ availability });
    navigate(tutorStepPath("review"));
  }

  return (
    <OnboardingStepCard title="When are you available to teach?" description="Toggle the days you're free and set your usual hours — students will only be able to book within these windows.">
      <form onSubmit={handleSubmit} noValidate>
        <AvailabilityEditor value={availability} onChange={setAvailability} />
        <OnboardingStepFooter onBack={() => navigate(tutorStepPath("pricing"))} onSkip={() => navigate(tutorStepPath("review"))} />
      </form>
    </OnboardingStepCard>
  );
}
