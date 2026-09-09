import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PartyPopper, Check } from "lucide-react";
import { OnboardingStepCard } from "@/features/onboarding/components/OnboardingStepCard";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useStudentOnboardingStore } from "@/features/onboarding/student/store";
import { useSaveStudentOnboarding } from "@/features/students";
import { firstName } from "@/utils/formatters";

export function StudentCompleteStep() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { draft, reset } = useStudentOnboardingStore();
  const saveOnboarding = useSaveStudentOnboarding();

  useEffect(() => {
    if (!user) return;
    saveOnboarding.mutate({ studentUserId: user.id, input: draft, completeOnboarding: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (saveOnboarding.isPending || saveOnboarding.isIdle) {
    return (
      <OnboardingStepCard title="Setting up your MyT profile...">
        <LoadingState label="Saving your answers..." />
      </OnboardingStepCard>
    );
  }

  if (saveOnboarding.isError) {
    return (
      <OnboardingStepCard title="Something went wrong">
        <ErrorState
          title="We couldn't save your profile"
          description="Your answers are still saved on this device — let's try again."
          onRetry={() => user && saveOnboarding.mutate({ studentUserId: user.id, input: draft, completeOnboarding: true })}
        />
      </OnboardingStepCard>
    );
  }

  const greetName = user ? firstName(user.fullName) : "there";
  const savedItems = [
    { label: "Your subjects", count: draft.subjects?.length ?? 0 },
    { label: "Your goals", count: draft.learningGoals?.length ?? 0 },
    { label: "Your learning preferences", count: 1 },
  ];

  return (
    <Card>
      <CardContent className="p-6 sm:p-8">
      <div className="flex flex-col items-center py-4 text-center">
        <div className="flex h-16 w-16 animate-in zoom-in-50 items-center justify-center rounded-full bg-gradient-brand text-white duration-500">
          <PartyPopper className="h-8 w-8" aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">You're ready, {greetName}!</h1>
        <p className="mt-2 max-w-sm text-muted-foreground">Your MyT learning journey is ready to begin.</p>

        <ul className="mt-6 w-full max-w-xs space-y-2 text-left">
          {savedItems.map((item) => (
            <li key={item.label} className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2 text-sm">
              <Check className="h-4 w-4 text-success" aria-hidden="true" />
              {item.label}
            </li>
          ))}
        </ul>

        <div className="mt-8 w-full max-w-xs space-y-2">
          <p className="text-sm font-medium">Next step: find your ideal tutor.</p>
          <Button
            size="lg"
            className="w-full"
            onClick={() => {
              reset();
              navigate("/student/find-tutor", { replace: true });
            }}
          >
            Find My Tutor
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => {
              reset();
              navigate("/student", { replace: true });
            }}
          >
            Go to my dashboard
          </Button>
        </div>
      </div>
      </CardContent>
    </Card>
  );
}
