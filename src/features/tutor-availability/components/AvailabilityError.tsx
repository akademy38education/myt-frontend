import { ErrorState } from "@/components/shared/ErrorState";

export function AvailabilityError({ onRetry }: { onRetry: () => void }) {
  return <ErrorState title="Couldn't load availability" description="We couldn't check this tutor's open slots. You can still message them directly." onRetry={onRetry} />;
}
