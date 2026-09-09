import { useNavigate } from "react-router-dom";
import { ShieldCheck, User } from "lucide-react";
import { OnboardingStepCard } from "@/features/onboarding/components/OnboardingStepCard";
import { OnboardingStepFooter } from "@/features/onboarding/components/OnboardingStepFooter";
import { Checkbox } from "@/components/ui/checkbox";
import { useParentOnboardingStore } from "@/features/onboarding/parent/store";
import { parentStepPath } from "./steps";

const PARENT_CONTROLS = ["Book, reschedule and cancel lessons", "View recordings, summaries and reports", "Manage payments and see billing history", "Add or remove children from the account"];
const STUDENT_CONTROLS = ["Chat with their tutor during lessons", "Submit homework and see their own mastery progress", "Set personal learning goals", "Choose their preferred learning style"];

export function ParentPermissionsStep() {
  const navigate = useNavigate();
  const { permissionsAcknowledged, setPermissionsAcknowledged } = useParentOnboardingStore();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate(parentStepPath("complete"));
  }

  return (
    <OnboardingStepCard title="Who controls what" description="A quick, plain-English overview — no legal jargon.">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="rounded-lg border border-border p-4">
          <div className="mb-3 flex items-center gap-2 font-medium">
            <ShieldCheck className="h-4 w-4 text-primary" />
            You (the parent) can:
          </div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {PARENT_CONTROLS.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-border p-4">
          <div className="mb-3 flex items-center gap-2 font-medium">
            <User className="h-4 w-4 text-secondary" />
            Your child can:
          </div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {STUDENT_CONTROLS.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <label className="flex items-start gap-2.5 text-sm">
          <Checkbox checked={permissionsAcknowledged} onCheckedChange={(checked) => setPermissionsAcknowledged(checked === true)} className="mt-0.5" />
          <span className="text-muted-foreground">I understand how account permissions work between parents and children on MyT.</span>
        </label>

        <OnboardingStepFooter onBack={() => navigate(parentStepPath("goals"))} continueDisabled={!permissionsAcknowledged} />
      </form>
    </OnboardingStepCard>
  );
}
