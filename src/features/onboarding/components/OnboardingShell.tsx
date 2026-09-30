import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/shared/Logo";
import { ProgressIndicator, type OnboardingStepMeta } from "./ProgressIndicator";

export interface OnboardingShellProps {
  roleLabel: string;
  steps: OnboardingStepMeta[];
  currentIndex: number;
  onSaveExit: () => void;
  children: ReactNode;
}

/**
 * The chrome every onboarding step renders inside: logo + "Save & exit",
 * the step progress indicator, and a centered content card. Individual
 * steps are responsible for their own form + Back/Continue footer (via
 * `OnboardingStepFooter`) since only the step knows how to validate itself
 * before advancing.
 */
export function OnboardingShell({ roleLabel, steps, currentIndex, onSaveExit, children }: OnboardingShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-warm to-background">
      <div className="flex min-h-screen flex-col">
        <header className="border-b border-border/60 bg-background/80 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <Logo className="h-8 w-8" />
              <span>
                MyT <span className="font-normal text-muted-foreground">· {roleLabel} setup</span>
              </span>
            </Link>
            <button type="button" onClick={onSaveExit} className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Save &amp; exit
            </button>
          </div>
        </header>

        <div className="mx-auto w-full max-w-3xl px-4 pt-6">
          <ProgressIndicator steps={steps} currentIndex={currentIndex} />
        </div>

        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
          <div key={steps[currentIndex]?.slug} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
