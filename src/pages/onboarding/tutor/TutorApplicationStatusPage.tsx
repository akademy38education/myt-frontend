import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Clock, CheckCircle2, XCircle, IdCard, BookOpen, UserCheck } from "lucide-react";
import { TutorVerificationStatus } from "@myt/shared";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTutorApplicationStatus } from "@/features/tutor-verification";

const STATUS_META: Record<TutorVerificationStatus, { label: string; icon: typeof Clock; variant: "muted" | "warning" | "success" | "destructive" }> = {
  [TutorVerificationStatus.UNSUBMITTED]: { label: "Not submitted", icon: Clock, variant: "muted" },
  [TutorVerificationStatus.PENDING]: { label: "Under review", icon: Clock, variant: "warning" },
  [TutorVerificationStatus.IN_REVIEW]: { label: "Under review", icon: Clock, variant: "warning" },
  [TutorVerificationStatus.APPROVED]: { label: "Approved", icon: CheckCircle2, variant: "success" },
  [TutorVerificationStatus.REJECTED]: { label: "Needs changes", icon: XCircle, variant: "destructive" },
};

export function TutorApplicationStatusPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: application, isLoading } = useTutorApplicationStatus(user?.id ?? "");

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 py-12">
      <Link to="/" className="mx-auto flex items-center gap-2 font-semibold">
        <GraduationCap className="h-7 w-7 text-primary" aria-hidden="true" />
        <span className="text-lg">MyT</span>
      </Link>

      <div className="mt-8">
        {isLoading ? (
          <LoadingState label="Checking your application status..." />
        ) : !application ? (
          <EmptyState title="No application found" description="Start your tutor application to appear in student searches." actionLabel="Start application" onAction={() => navigate("/onboarding/tutor")} />
        ) : (
          <Card>
            <CardContent className="p-6 sm:p-8">
              <div className="text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Application submitted</h1>
                <p className="mt-2 text-muted-foreground">Our team will review your tutor profile.</p>
                <Badge variant={STATUS_META[application.status].variant} className="mt-4 gap-1.5 text-sm">
                  {(() => {
                    const Icon = STATUS_META[application.status].icon;
                    return <Icon className="h-3.5 w-3.5" />;
                  })()}
                  {STATUS_META[application.status].label}
                </Badge>
              </div>

              <ul className="mt-8 space-y-3">
                {[
                  { icon: IdCard, label: "Identity verification" },
                  { icon: BookOpen, label: "Qualification verification" },
                  { icon: UserCheck, label: "Profile review" },
                ].map((check) => (
                  <li key={check.label} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <span className="flex items-center gap-2.5 text-sm font-medium">
                      <check.icon className="h-4 w-4 text-muted-foreground" />
                      {check.label}
                    </span>
                    <Badge variant={STATUS_META[application.status].variant}>{STATUS_META[application.status].label}</Badge>
                  </li>
                ))}
              </ul>

              <div className="mt-8 text-center">
                <Button asChild>
                  <Link to="/tutor">Go to my dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
