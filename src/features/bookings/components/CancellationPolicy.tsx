import { ShieldCheck } from "lucide-react";
import { DEFAULT_CANCELLATION_POLICY, hoursUntil, isWithinFreeCancellationWindow } from "../cancellationPolicy";

export function CancellationPolicy({ scheduledStart }: { scheduledStart: string }) {
  const policy = DEFAULT_CANCELLATION_POLICY;
  const isFree = isWithinFreeCancellationWindow(scheduledStart, policy);
  const hours = Math.max(0, Math.round(hoursUntil(scheduledStart)));

  return (
    <div className="flex items-start gap-2.5 rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
      <div>
        <p className="font-medium text-foreground">Cancellation policy</p>
        {isFree ? (
          <p>
            Free cancellation up to {policy.freeCancellationHours}h before the lesson. This lesson is {hours}h away, so cancelling now is free.
          </p>
        ) : (
          <p>
            Cancellations within {policy.freeCancellationHours}h of the lesson may incur a {policy.lateFeePercent}% fee. This lesson is only {hours}h away.
          </p>
        )}
      </div>
    </div>
  );
}
