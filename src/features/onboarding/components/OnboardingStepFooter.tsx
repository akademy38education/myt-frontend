import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface OnboardingStepFooterProps {
  onBack?: () => void;
  backLabel?: string;
  continueLabel?: string;
  onSkip?: () => void;
  isLoading?: boolean;
  continueDisabled?: boolean;
}

/**
 * The standard Back / (optional) Skip / Continue row every onboarding step
 * ends with. `Continue` is a `type="submit"` so it triggers the step's own
 * form's `onSubmit` (and therefore its Zod validation) — steps should wrap
 * this in their `<form>`, not attach a separate onClick handler.
 */
export function OnboardingStepFooter({ onBack, backLabel = "Back", continueLabel = "Continue", onSkip, isLoading, continueDisabled }: OnboardingStepFooterProps) {
  return (
    <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
      <div>
        {onBack && (
          <Button type="button" variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Button>
        )}
      </div>
      <div className="flex items-center gap-3">
        {onSkip && (
          <Button type="button" variant="ghost" onClick={onSkip}>
            Skip for now
          </Button>
        )}
        <Button type="submit" isLoading={isLoading} disabled={continueDisabled}>
          {continueLabel}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
