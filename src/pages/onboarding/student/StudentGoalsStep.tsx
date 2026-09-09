import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingStepCard } from "@/features/onboarding/components/OnboardingStepCard";
import { OnboardingStepFooter } from "@/features/onboarding/components/OnboardingStepFooter";
import { ToggleChip } from "@/components/shared/ToggleChip";
import { useStudentOnboardingStore } from "@/features/onboarding/student/store";
import { LEARNING_GOALS } from "@/constants/tutoring";
import { studentStepPath } from "./steps";

export function StudentGoalsStep() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useStudentOnboardingStore();
  const [selected, setSelected] = useState<string[]>(draft.learningGoals ?? []);
  const [showError, setShowError] = useState(false);

  function toggle(goal: string) {
    setSelected((current) => (current.includes(goal) ? current.filter((g) => g !== goal) : [...current, goal]));
    setShowError(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selected.length === 0) {
      setShowError(true);
      return;
    }
    updateDraft({ learningGoals: selected });
    navigate(studentStepPath("preferences"));
  }

  return (
    <OnboardingStepCard title="What are you working towards?" description="Pick everything that applies — this shapes the lessons and homework you get.">
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex flex-wrap gap-2.5">
          {LEARNING_GOALS.map((goal) => (
            <ToggleChip key={goal} label={goal} selected={selected.includes(goal)} onToggle={() => toggle(goal)} />
          ))}
        </div>
        {showError && <p className="mt-3 text-sm text-destructive">Pick at least one goal to continue.</p>}

        <OnboardingStepFooter onBack={() => navigate(studentStepPath("subjects"))} />
      </form>
    </OnboardingStepCard>
  );
}
