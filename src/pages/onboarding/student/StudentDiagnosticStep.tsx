import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ClipboardCheck } from "lucide-react";
import { OnboardingStepCard } from "@/features/onboarding/components/OnboardingStepCard";
import { OnboardingStepFooter } from "@/features/onboarding/components/OnboardingStepFooter";
import { SelectableCard } from "@/components/shared/SelectableCard";
import { LoadingState } from "@/components/shared/LoadingState";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useStudentOnboardingStore } from "@/features/onboarding/student/store";
import { useQuickDiagnosticQuestions, useSubmitQuickDiagnostic } from "@/features/diagnostics";
import { studentStepPath } from "./steps";

export function StudentDiagnosticStep() {
  const navigate = useNavigate();
  const { diagnosticChoice, setDiagnosticChoice } = useStudentOnboardingStore();
  const { data: questions, isLoading } = useQuickDiagnosticQuestions();
  const submitDiagnostic = useSubmitQuickDiagnostic();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  function handleContinue() {
    navigate(studentStepPath("complete"));
  }

  if (diagnosticChoice === null) {
    return (
      <OnboardingStepCard title="Before we find your tutor..." description="Want to understand where you're strongest and where you may need more support?">
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectableCard
            icon={Sparkles}
            title="Take a quick diagnostic"
            description="3 sample questions, about 2 minutes."
            selected={false}
            onSelect={() => setDiagnosticChoice("taken")}
          />
          <SelectableCard
            icon={ClipboardCheck}
            title="Skip for now"
            description="You can take a full diagnostic later from your dashboard."
            selected={false}
            onSelect={() => {
              setDiagnosticChoice("skipped");
              handleContinue();
            }}
          />
        </div>
        <OnboardingStepFooter onBack={() => navigate(studentStepPath("preferences"))} continueDisabled />
      </OnboardingStepCard>
    );
  }

  if (submitDiagnostic.isSuccess) {
    return (
      <OnboardingStepCard title="Thanks for taking the diagnostic!" description="We'll use this as a starting point — your tutor will build on it in your first lesson.">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleContinue();
          }}
        >
          <OnboardingStepFooter continueLabel="Continue" />
        </form>
      </OnboardingStepCard>
    );
  }

  return (
    <OnboardingStepCard title="Quick diagnostic" description="Answer as best you can — this isn't graded.">
      {isLoading || !questions ? (
        <LoadingState label="Loading questions..." />
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitDiagnostic.mutate(answers);
          }}
          className="space-y-6"
        >
          {questions.map((question, index) => (
            <div key={question.id} className="space-y-2">
              <p className="font-medium">
                {index + 1}. {question.prompt}
              </p>
              <RadioGroup
                value={answers[question.id] ?? ""}
                onValueChange={(value) => setAnswers((current) => ({ ...current, [question.id]: value }))}
                className="grid grid-cols-2 gap-2 sm:grid-cols-4"
              >
                {question.choices.map((choice) => (
                  <label
                    key={choice}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-border p-2.5 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                  >
                    <RadioGroupItem value={choice} />
                    {choice}
                  </label>
                ))}
              </RadioGroup>
            </div>
          ))}

          <OnboardingStepFooter
            onSkip={() => {
              setDiagnosticChoice("skipped");
              handleContinue();
            }}
            continueLabel="Submit answers"
            continueDisabled={Object.keys(answers).length < questions.length}
            isLoading={submitDiagnostic.isPending}
          />
        </form>
      )}
    </OnboardingStepCard>
  );
}
