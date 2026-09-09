import { useState } from "react";
import { toast } from "sonner";
import type { TutorApplication } from "@myt/shared";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useApproveTutor } from "../hooks/useApproveTutor";

export interface ApproveTutorDialogProps {
  application: TutorApplication | null;
  onOpenChange: (open: boolean) => void;
  onApproved?: () => void;
}

export function ApproveTutorDialog({ application, onOpenChange, onApproved }: ApproveTutorDialogProps) {
  const [notes, setNotes] = useState("");
  const approveTutor = useApproveTutor();

  if (!application) return null;

  async function handleConfirm() {
    if (!application) return;
    try {
      await approveTutor.mutateAsync({ applicationId: application.id, input: { notes: notes.trim() || undefined } });
      toast.success("Tutor approved and published to the marketplace");
      setNotes("");
      onOpenChange(false);
      onApproved?.();
    } catch {
      toast.error("We couldn't approve this tutor. Please try again.");
    }
  }

  return (
    <Dialog open={Boolean(application)} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve this tutor?</DialogTitle>
          <DialogDescription>
            {application.headline} will go live on the marketplace immediately and can start receiving bookings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label htmlFor="approve-notes">Internal notes (optional)</Label>
          <Textarea id="approve-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Not shown to the tutor" />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button isLoading={approveTutor.isPending} onClick={handleConfirm}>
            Approve tutor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
