import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { NextBestActionDescriptor } from "../nextBestAction";

/** Purely presentational — see nextBestAction.ts for the priority logic that decides what to show. */
export function NextBestAction({ action }: { action: NextBestActionDescriptor }) {
  return (
    <div className="relative flex flex-col items-start gap-5 overflow-hidden rounded-2xl bg-gradient-brand p-7 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between">
      <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
      <div className="relative flex items-start gap-4">
        <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20">
          <Sparkles className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/70">Ready to continue?</p>
          <p className="mt-1 text-xl font-semibold tracking-tight">{action.headline}</p>
          <p className="mt-1 text-sm text-white/85">{action.detail}</p>
        </div>
      </div>
      <Button variant="secondary" size="lg" asChild className="relative shrink-0">
        <Link to={action.ctaTo}>
          {action.ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
