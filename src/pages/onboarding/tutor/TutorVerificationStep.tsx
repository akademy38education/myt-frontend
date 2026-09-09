import { useNavigate } from "react-router-dom";
import { IdCard, GraduationCap, UserCheck } from "lucide-react";
import { OnboardingStepCard } from "@/features/onboarding/components/OnboardingStepCard";
import { OnboardingStepFooter } from "@/features/onboarding/components/OnboardingStepFooter";
import { Badge } from "@/components/ui/badge";
import { tutorStepPath } from "./steps";

const CHECKS = [
  { icon: IdCard, title: "Identity verification", description: "We'll confirm your identity once your application is submitted." },
  { icon: GraduationCap, title: "Qualification verification", description: "Our team reviews the qualifications and evidence you provide." },
  { icon: UserCheck, title: "Profile review", description: "We check your profile reads clearly for students and parents." },
];

export function TutorVerificationStep() {
  const navigate = useNavigate();

  return (
    <OnboardingStepCard title="How verification works" description="MyT reviews every tutor before they appear in search — here's what that involves.">
      <div className="space-y-3">
        {CHECKS.map((check) => (
          <div key={check.title} className="flex items-start gap-4 rounded-lg border border-border p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <check.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="flex-1">
              <p className="font-medium">{check.title}</p>
              <p className="text-sm text-muted-foreground">{check.description}</p>
            </div>
            <Badge variant="muted">Not started</Badge>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Verification begins automatically once you submit your application at the end of this wizard — usually reviewed within 2 business days.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate(tutorStepPath("teaching-style"));
        }}
      >
        <OnboardingStepFooter onBack={() => navigate(tutorStepPath("qualifications"))} />
      </form>
    </OnboardingStepCard>
  );
}
