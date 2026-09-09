import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ListChecks, Target, Users2, HeartHandshake } from "lucide-react";
import { OnboardingStepCard } from "@/features/onboarding/components/OnboardingStepCard";
import { OnboardingStepFooter } from "@/features/onboarding/components/OnboardingStepFooter";
import { SelectableCard } from "@/components/shared/SelectableCard";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTutorOnboardingStore } from "@/features/onboarding/tutor/store";
import { tutorStepPath } from "./steps";

const STYLES = [
  { value: "Structured", icon: ListChecks, description: "Clear plans, consistent structure every lesson." },
  { value: "Exam-focused", icon: Target, description: "Practice papers, technique and exam timing." },
  { value: "Interactive", icon: Users2, description: "Discussion-led, lots of questions and back-and-forth." },
  { value: "Patient & supportive", icon: HeartHandshake, description: "Confidence-building, at the student's own pace." },
];

export function TutorTeachingStyleStep() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useTutorOnboardingStore();
  const [style, setStyle] = useState(draft.teachingStyle ?? "");
  const [approach, setApproach] = useState(draft.lessonApproach ?? "");
  const [showError, setShowError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!style) {
      setShowError(true);
      return;
    }
    updateDraft({ teachingStyle: style, lessonApproach: approach || undefined });
    navigate(tutorStepPath("pricing"));
  }

  return (
    <OnboardingStepCard title="How do you teach?" description="This helps students find a tutor whose style fits how they learn best.">
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {STYLES.map((option) => (
            <SelectableCard key={option.value} icon={option.icon} title={option.value} description={option.description} selected={style === option.value} onSelect={() => { setStyle(option.value); setShowError(false); }} />
          ))}
        </div>
        {showError && <p className="text-sm text-destructive">Choose the style that best describes you.</p>}

        <div className="space-y-1.5">
          <Label htmlFor="approach">Describe your lesson approach (optional)</Label>
          <Textarea id="approach" rows={3} placeholder="e.g. I usually start each lesson with a 5-minute recap..." value={approach} onChange={(e) => setApproach(e.target.value)} />
        </div>

        <OnboardingStepFooter onBack={() => navigate(tutorStepPath("verification"))} />
      </form>
    </OnboardingStepCard>
  );
}
