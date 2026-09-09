import { ErrorState } from "@/components/shared/ErrorState";

export function TutorProfileError({ onRetry }: { onRetry: () => void }) {
  return <ErrorState title="We couldn't load this tutor's profile" description="Please check your connection and try again." onRetry={onRetry} />;
}
