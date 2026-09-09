/**
 * Structured mock policy — no real payments/refunds engine exists yet, but
 * `CancellationPolicy` and `CancelBookingModal` both read from this
 * (never a hardcoded string in either component), so switching to a
 * per-tutor or per-plan policy later means changing this file only.
 */
export interface CancellationPolicyData {
  freeCancellationHours: number;
  lateFeePercent: number;
}

export const DEFAULT_CANCELLATION_POLICY: CancellationPolicyData = {
  freeCancellationHours: 24,
  lateFeePercent: 50,
};

export function hoursUntil(iso: string): number {
  return (new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60);
}

export function isWithinFreeCancellationWindow(scheduledStart: string, policy: CancellationPolicyData = DEFAULT_CANCELLATION_POLICY): boolean {
  return hoursUntil(scheduledStart) >= policy.freeCancellationHours;
}
