import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingStepCard } from "@/features/onboarding/components/OnboardingStepCard";
import { OnboardingStepFooter } from "@/features/onboarding/components/OnboardingStepFooter";
import { ToggleChip } from "@/components/shared/ToggleChip";
import { useStudentOnboardingStore } from "@/features/onboarding/student/store";
import { SUBJECTS } from "@/constants/subjects";
import { studentStepPath } from "./steps";

export function StudentSubjectsStep() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useStudentOnboardingStore();
  const [selected, setSelected] = useState<string[]>(draft.subjects ?? []);
  const [showError, setShowError] = useState(false);

  function toggle(id: string) {
    setSelected((current) => (current.includes(id) ? current.filter((s) => s !== id) : [...current, id]));
    setShowError(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selected.length === 0) {
      setShowError(true);
      return;
    }
    updateDraft({ subjects: selected });
    navigate(studentStepPath("goals"));
  }

  return (
    <OnboardingStepCard title="What would you like help with?" description="Select every subject you'd like a tutor for — you can change this anytime.">
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex flex-wrap gap-2.5">
          {SUBJECTS.map((subject) => (
            <ToggleChip key={subject.id} label={subject.name} selected={selected.includes(subject.id)} onToggle={() => toggle(subject.id)} />
          ))}
        </div>
        {showError && <p className="mt-3 text-sm text-destructive">Pick at least one subject to continue.</p>}

        <OnboardingStepFooter onBack={() => navigate(studentStepPath("education"))} />
      </form>
    </OnboardingStepCard>
  );
}
