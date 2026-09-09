import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { OnboardingShell } from "@/features/onboarding/components/OnboardingShell";
import { STUDENT_ONBOARDING_STEPS } from "./steps";

export function StudentOnboardingLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const slug = location.pathname.split("/").pop();
  const currentIndex = Math.max(0, STUDENT_ONBOARDING_STEPS.findIndex((step) => step.slug === slug));

  return (
    <OnboardingShell roleLabel="Student" steps={STUDENT_ONBOARDING_STEPS} currentIndex={currentIndex} onSaveExit={() => navigate("/")}>
      <Outlet />
    </OnboardingShell>
  );
}
