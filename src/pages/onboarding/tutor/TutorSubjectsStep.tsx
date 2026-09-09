import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingStepCard } from "@/features/onboarding/components/OnboardingStepCard";
import { OnboardingStepFooter } from "@/features/onboarding/components/OnboardingStepFooter";
import { ToggleChip } from "@/components/shared/ToggleChip";
import { Label } from "@/components/ui/label";
import { useTutorOnboardingStore } from "@/features/onboarding/tutor/store";
import { SUBJECTS } from "@/constants/subjects";
import { YEAR_LEVELS, CURRICULA } from "@/constants/tutoring";
import { tutorStepPath } from "./steps";

export function TutorSubjectsStep() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useTutorOnboardingStore();
  const [subjects, setSubjects] = useState<string[]>(draft.subjects ?? []);
  const [yearLevels, setYearLevels] = useState<string[]>(draft.yearLevels ?? []);
  const [curricula, setCurricula] = useState<string[]>(draft.curricula ?? []);
  const [showError, setShowError] = useState(false);

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
    setShowError(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (subjects.length === 0) {
      setShowError(true);
      return;
    }
    updateDraft({ subjects, yearLevels, curricula });
    navigate(tutorStepPath("experience"));
  }

  return (
    <OnboardingStepCard title="What do you teach?" description="Select every subject, year level and curriculum you're qualified to teach.">
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div>
          <Label className="mb-2 block">Subjects</Label>
          <div className="flex flex-wrap gap-2.5">
            {SUBJECTS.map((subject) => (
              <ToggleChip key={subject.id} label={subject.name} selected={subjects.includes(subject.id)} onToggle={() => toggle(subjects, setSubjects, subject.id)} />
            ))}
          </div>
          {showError && <p className="mt-2 text-sm text-destructive">Select at least one subject.</p>}
        </div>

        <div>
          <Label className="mb-2 block">Year levels</Label>
          <div className="flex flex-wrap gap-2.5">
            {YEAR_LEVELS.map((level) => (
              <ToggleChip key={level} label={level} selected={yearLevels.includes(level)} onToggle={() => toggle(yearLevels, setYearLevels, level)} />
            ))}
          </div>
        </div>

        <div>
          <Label className="mb-2 block">Curricula</Label>
          <div className="flex flex-wrap gap-2.5">
            {CURRICULA.map((c) => (
              <ToggleChip key={c} label={c} selected={curricula.includes(c)} onToggle={() => toggle(curricula, setCurricula, c)} />
            ))}
          </div>
        </div>

        <OnboardingStepFooter onBack={() => navigate(tutorStepPath("profile"))} />
      </form>
    </OnboardingStepCard>
  );
}
