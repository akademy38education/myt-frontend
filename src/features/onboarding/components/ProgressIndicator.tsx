import { Check } from "lucide-react";
import { cn } from "@/utils/cn";

export interface OnboardingStepMeta {
  slug: string;
  label: string;
}

export function ProgressIndicator({ steps, currentIndex }: { steps: OnboardingStepMeta[]; currentIndex: number }) {
  const current = steps[currentIndex];

  return (
    <div>
      {/* Desktop: full dot-and-label stepper */}
      <ol className="hidden items-center sm:flex">
        {steps.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;
          return (
            <li key={step.slug} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors duration-300",
                    isComplete && "bg-primary text-primary-foreground",
                    isCurrent && "bg-primary/15 text-primary ring-2 ring-primary",
                    !isComplete && !isCurrent && "bg-muted text-muted-foreground"
                  )}
                >
                  {isComplete ? <Check className="h-3.5 w-3.5" /> : index + 1}
                </span>
                <span className={cn("max-w-[5.5rem] text-center text-[11px] font-medium leading-tight", isCurrent ? "text-foreground" : "text-muted-foreground")}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <span className={cn("mx-1.5 h-0.5 flex-1 rounded-full transition-colors duration-300", isComplete ? "bg-primary" : "bg-muted")} />
              )}
            </li>
          );
        })}
      </ol>

      {/* Mobile: compact "Step X of Y" with a single progress bar */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>
            Step {currentIndex + 1} of {steps.length}
          </span>
          <span className="text-foreground">{current?.label}</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
