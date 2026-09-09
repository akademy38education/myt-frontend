import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PartyPopper, Check } from "lucide-react";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useParentOnboardingStore } from "@/features/onboarding/parent/store";
import { useSaveParentOnboarding } from "@/features/parents";

export function ParentCompleteStep() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { account, savedChildren, reset } = useParentOnboardingStore();
  const saveOnboarding = useSaveParentOnboarding();

  useEffect(() => {
    if (!user) return;
    saveOnboarding.mutate({ parentUserId: user.id, input: account, completeOnboarding: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (saveOnboarding.isPending || saveOnboarding.isIdle) {
    return (
      <Card>
        <CardContent className="p-8">
          <LoadingState label="Setting up your family learning space..." />
        </CardContent>
      </Card>
    );
  }

  if (saveOnboarding.isError) {
    return (
      <Card>
        <CardContent className="p-8">
          <ErrorState
            title="We couldn't finish setting up your account"
            onRetry={() => user && saveOnboarding.mutate({ parentUserId: user.id, input: account, completeOnboarding: true })}
          />
        </CardContent>
      </Card>
    );
  }

  const firstChildName = savedChildren[0]?.fullName;

  return (
    <Card>
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col items-center py-4 text-center">
          <div className="flex h-16 w-16 animate-in zoom-in-50 items-center justify-center rounded-full bg-gradient-brand text-white duration-500">
            <PartyPopper className="h-8 w-8" aria-hidden="true" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight">Your family learning space is ready</h1>
          <p className="mt-2 max-w-sm text-muted-foreground">
            {firstChildName ? `${firstChildName}'s profile is complete.` : "Your children's profiles are complete."}
          </p>

          <ul className="mt-6 w-full max-w-xs space-y-2 text-left">
            {savedChildren.map((child) => (
              <li key={child.id} className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2 text-sm">
                <Check className="h-4 w-4 text-success" aria-hidden="true" />
                {child.fullName || "Child"} — {child.yearGroup}
              </li>
            ))}
          </ul>

          <div className="mt-8 w-full max-w-xs space-y-2">
            <p className="text-sm font-medium">Next: find the right tutor{firstChildName ? ` for ${firstChildName}` : ""}.</p>
            <Button
              size="lg"
              className="w-full"
              onClick={() => {
                reset();
                navigate("/parent", { replace: true });
              }}
            >
              Go to my dashboard
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
