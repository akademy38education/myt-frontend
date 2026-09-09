import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Check, CircleAlert } from "lucide-react";
import { OnboardingStepCard } from "@/features/onboarding/components/OnboardingStepCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useTutorOnboardingStore } from "@/features/onboarding/tutor/store";
import { useSaveTutorApplication } from "@/features/tutor-verification";
import { tutorStepPath } from "./steps";

export function TutorReviewStep() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { draft, reset } = useTutorOnboardingStore();
  const saveApplication = useSaveTutorApplication();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const sections = [
    { label: "Account", complete: Boolean(user), editPath: undefined },
    { label: "Profile", complete: Boolean(draft.headline && draft.bio && (draft.languages?.length ?? 0) > 0), editPath: "profile" },
    { label: "Subjects", complete: (draft.subjects?.length ?? 0) > 0, editPath: "subjects" },
    { label: "Experience", complete: draft.yearsExperience !== undefined, editPath: "experience" },
    { label: "Qualifications", complete: (draft.qualifications?.length ?? 0) > 0, editPath: "qualifications", optional: true },
    { label: "Teaching style", complete: Boolean(draft.teachingStyle), editPath: "teaching-style" },
    { label: "Pricing", complete: Boolean(draft.hourlyRate), editPath: "pricing" },
    { label: "Availability", complete: (draft.availability?.length ?? 0) > 0, editPath: "availability", optional: true },
  ];

  const requiredSections = sections.filter((s) => !s.optional);
  const completedRequired = requiredSections.filter((s) => s.complete).length;
  const percentage = Math.round((sections.filter((s) => s.complete).length / sections.length) * 100);
  const canSubmit = completedRequired === requiredSections.length;
  const missing = sections.find((s) => !s.complete);

  const hasEvidence = (draft.qualifications ?? []).some((q) => q.documentName);

  async function handleSubmit() {
    setConfirmOpen(false);
    try {
      await saveApplication.mutateAsync({ input: draft, submit: true });
      toast.success("Application submitted for review");
      reset();
      navigate("/onboarding/tutor/status", { replace: true });
    } catch {
      toast.error("We couldn't submit your application. Please try again.");
    }
  }

  return (
    <OnboardingStepCard title="Review your application" description="Make sure everything looks right before you submit.">
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Your profile is {percentage}% complete</span>
        </div>
        <Progress value={percentage} />
        {!canSubmit && missing && (
          <p className="flex items-center gap-1.5 text-sm text-warning-foreground">
            <CircleAlert className="h-4 w-4" />
            One thing left: finish the <span className="font-medium">{missing.label}</span> section.
          </p>
        )}
        {canSubmit && !hasEvidence && (
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CircleAlert className="h-4 w-4" />
            Tip: applications with qualification evidence are usually reviewed faster.
          </p>
        )}
      </div>

      <ul className="divide-y divide-border rounded-lg border border-border">
        {sections.map((section) => (
          <li key={section.label} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full ${section.complete ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}
              >
                <Check className="h-3 w-3" />
              </span>
              <span className="text-sm font-medium">{section.label}</span>
              {section.optional && !section.complete && <Badge variant="muted">Optional</Badge>}
            </div>
            {section.editPath && (
              <Button variant="ghost" size="sm" onClick={() => navigate(tutorStepPath(section.editPath!))}>
                Edit
              </Button>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
        <Button type="button" variant="ghost" onClick={() => navigate(tutorStepPath("availability"))}>
          Back
        </Button>
        <Button disabled={!canSubmit} isLoading={saveApplication.isPending} onClick={() => setConfirmOpen(true)}>
          {canSubmit ? "Complete Profile & Submit" : "Complete required sections"}
        </Button>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit your tutor application?</DialogTitle>
            <DialogDescription>Our team will review your profile, subjects and qualifications. This usually takes up to 2 business days.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={saveApplication.isPending}>
              Submit application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </OnboardingStepCard>
  );
}
