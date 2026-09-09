import { ErrorState } from "@/components/shared/ErrorState";

export function MarketplaceError({ onRetry }: { onRetry: () => void }) {
  return (
    <ErrorState
      title="We couldn't load tutors right now"
      description="Your search hasn't been lost — this is likely a temporary connection issue. Try again in a moment."
      onRetry={onRetry}
    />
  );
}
