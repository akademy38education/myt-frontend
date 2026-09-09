import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MailCheck, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVerifyEmail } from "@/features/authentication";

export function VerifyPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const verifyEmail = useVerifyEmail();

  useEffect(() => {
    if (token) verifyEmail.mutate(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MailCheck className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Verify your email</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We've sent a verification link to your email address. Click the link to confirm your account.
          </p>
        </div>
      </div>
    );
  }

  if (verifyEmail.isPending || verifyEmail.isIdle) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center" role="status">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">Verifying your email...</p>
      </div>
    );
  }

  if (verifyEmail.isError) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <XCircle className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Verification failed</h1>
          <p className="mt-2 text-sm text-muted-foreground">This link is invalid or has expired.</p>
        </div>
        <Button variant="outline" asChild className="w-full">
          <Link to="/login">Back to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
        <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
      </div>
      <div>
        <h1 className="text-xl font-semibold">Email verified</h1>
        <p className="mt-2 text-sm text-muted-foreground">Your email has been confirmed.</p>
      </div>
      <Button asChild className="w-full">
        <Link to="/login">Continue to sign in</Link>
      </Button>
    </div>
  );
}
