import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { NextBestActionDescriptor } from "../nextBestAction";

/** Purely presentational — see nextBestAction.ts for the priority logic that decides what to show. */
export function NextBestAction({ action }: { action: NextBestActionDescriptor }) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-xl bg-gradient-brand p-6 text-white sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-lg font-semibold">{action.headline}</p>
          <p className="text-sm text-white/85">{action.detail}</p>
        </div>
      </div>
      <Button variant="secondary" asChild className="shrink-0">
        <Link to={action.ctaTo}>
          {action.ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
