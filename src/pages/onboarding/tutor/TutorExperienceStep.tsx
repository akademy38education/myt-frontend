import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingStepCard } from "@/features/onboarding/components/OnboardingStepCard";
import { OnboardingStepFooter } from "@/features/onboarding/components/OnboardingStepFooter";
import { ToggleChip } from "@/components/shared/ToggleChip";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTutorOnboardingStore } from "@/features/onboarding/tutor/store";
import { AGE_GROUPS } from "@/constants/tutoring";
import { tutorStepPath } from "./steps";

export function TutorExperienceStep() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useTutorOnboardingStore();
  const [years, setYears] = useState(draft.yearsExperience?.toString() ?? "");
  const [ageGroups, setAgeGroups] = useState<string[]>(draft.ageGroups ?? []);
  const [error, setError] = useState<string | null>(null);

  function toggle(group: string) {
    setAgeGroups((current) => (current.includes(group) ? current.filter((g) => g !== group) : [...current, group]));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = Number(years);
    if (!years || Number.isNaN(parsed) || parsed < 0) {
      setError("Enter your years of teaching/tutoring experience.");
      return;
    }
    updateDraft({ yearsExperience: parsed, ageGroups });
    navigate(tutorStepPath("qualifications"));
  }

  return (
    <OnboardingStepCard title="Your teaching experience" description="A little context helps students and parents feel confident choosing you.">
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div className="max-w-[12rem] space-y-1.5">
          <Label htmlFor="years">Years of experience</Label>
          <Input id="years" type="number" min={0} value={years} onChange={(e) => setYears(e.target.value)} aria-invalid={Boolean(error)} />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <div>
          <Label className="mb-2 block">Age groups you're comfortable teaching</Label>
          <div className="flex flex-wrap gap-2.5">
            {AGE_GROUPS.map((group) => (
              <ToggleChip key={group} label={group} selected={ageGroups.includes(group)} onToggle={() => toggle(group)} />
            ))}
          </div>
        </div>

        <OnboardingStepFooter onBack={() => navigate(tutorStepPath("subjects"))} />
      </form>
    </OnboardingStepCard>
  );
}
