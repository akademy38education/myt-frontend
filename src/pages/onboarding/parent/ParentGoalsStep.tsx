import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { OnboardingStepCard } from "@/features/onboarding/components/OnboardingStepCard";
import { OnboardingStepFooter } from "@/features/onboarding/components/OnboardingStepFooter";
import { ToggleChip } from "@/components/shared/ToggleChip";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useParentOnboardingStore } from "@/features/onboarding/parent/store";
import { parentsService } from "@/features/parents";
import { SUBJECTS } from "@/constants/subjects";
import { LEARNING_GOALS } from "@/constants/tutoring";
import { parentStepPath } from "./steps";

export function ParentGoalsStep() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { savedChildren, setSavedChildren } = useParentOnboardingStore();
  const [isSaving, setIsSaving] = useState(false);
  const [selections, setSelections] = useState<Record<string, { subjects: string[]; goals: string[] }>>(() =>
    Object.fromEntries(savedChildren.map((child) => [child.id, { subjects: child.subjects, goals: child.learningGoals }]))
  );

  function toggleSubject(childId: string, subjectId: string) {
    setSelections((current) => {
      const entry = current[childId] ?? { subjects: [], goals: [] };
      const subjects = entry.subjects.includes(subjectId) ? entry.subjects.filter((s) => s !== subjectId) : [...entry.subjects, subjectId];
      return { ...current, [childId]: { ...entry, subjects } };
    });
  }

  function toggleGoal(childId: string, goal: string) {
    setSelections((current) => {
      const entry = current[childId] ?? { subjects: [], goals: [] };
      const goals = entry.goals.includes(goal) ? entry.goals.filter((g) => g !== goal) : [...entry.goals, goal];
      return { ...current, [childId]: { ...entry, goals } };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || savedChildren.length === 0) {
      navigate(parentStepPath("permissions"));
      return;
    }
    setIsSaving(true);
    try {
      const updated = await Promise.all(
        savedChildren.map((child) => {
          const entry = selections[child.id] ?? { subjects: [], goals: [] };
          return parentsService.updateChild(user.id, child.id, { subjects: entry.subjects, learningGoals: entry.goals });
        })
      );
      setSavedChildren(updated);
      navigate(parentStepPath("permissions"));
    } catch {
      toast.error("We couldn't save your children's goals. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  if (savedChildren.length === 0) {
    return (
      <OnboardingStepCard title="Goals" description="Add a child on the previous step first.">
        <form onSubmit={handleSubmit}>
          <OnboardingStepFooter onBack={() => navigate(parentStepPath("children"))} />
        </form>
      </OnboardingStepCard>
    );
  }

  return (
    <OnboardingStepCard title="What does each child need help with?" description="Set subjects and goals per child — you can fine-tune this anytime.">
      <form onSubmit={handleSubmit} noValidate>
        <Tabs defaultValue={savedChildren[0]?.id}>
          <TabsList className="flex-wrap">
            {savedChildren.map((child) => (
              <TabsTrigger key={child.id} value={child.id}>
                {child.fullName || "Child"}
              </TabsTrigger>
            ))}
          </TabsList>
          {savedChildren.map((child) => {
            const entry = selections[child.id] ?? { subjects: [], goals: [] };
            return (
              <TabsContent key={child.id} value={child.id} className="space-y-6 pt-4">
                <div>
                  <p className="mb-2 text-sm font-medium">Subjects</p>
                  <div className="flex flex-wrap gap-2.5">
                    {SUBJECTS.map((subject) => (
                      <ToggleChip
                        key={subject.id}
                        label={subject.name}
                        selected={entry.subjects.includes(subject.id)}
                        onToggle={() => toggleSubject(child.id, subject.id)}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">Goals</p>
                  <div className="flex flex-wrap gap-2.5">
                    {LEARNING_GOALS.map((goal) => (
                      <ToggleChip key={goal} label={goal} selected={entry.goals.includes(goal)} onToggle={() => toggleGoal(child.id, goal)} />
                    ))}
                  </div>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>

        <OnboardingStepFooter onBack={() => navigate(parentStepPath("children"))} isLoading={isSaving} />
      </form>
    </OnboardingStepCard>
  );
}
