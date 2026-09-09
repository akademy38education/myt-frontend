import { useState } from "react";
import { toast } from "sonner";
import type { TutorApplication } from "@myt/shared";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRejectTutor } from "../hooks/useRejectTutor";

export interface RejectTutorDialogProps {
  application: TutorApplication | null;
  onOpenChange: (open: boolean) => void;
  onRejected?: () => void;
}

export function RejectTutorDialog({ application, onOpenChange, onRejected }: RejectTutorDialogProps) {
  const [notes, setNotes] = useState("");
  const rejectTutor = useRejectTutor();

  if (!application) return null;

  async function handleConfirm() {
    if (!application) return;
    try {
      await rejectTutor.mutateAsync({ applicationId: application.id, input: { notes: notes.trim() || undefined } });
      toast.success("Application rejected");
      setNotes("");
      onOpenChange(false);
      onRejected?.();
    } catch {
      toast.error("We couldn't reject this application. Please try again.");
    }
  }

  return (
    <Dialog open={Boolean(application)} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject this application?</DialogTitle>
          <DialogDescription>{application.headline} will not be published to the marketplace.</DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label htmlFor="reject-notes">Reason (optional)</Label>
          <Textarea id="reject-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Not shown to the tutor" />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Keep in queue
          </Button>
          <Button variant="destructive" isLoading={rejectTutor.isPending} onClick={handleConfirm}>
            Reject application
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
