import { useState } from "react";
import { toast } from "sonner";
import type { TutorApplication } from "@myt/shared";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRequestTutorInfo } from "../hooks/useRequestTutorInfo";

export interface RequestInfoDialogProps {
  application: TutorApplication | null;
  onOpenChange: (open: boolean) => void;
  onRequested?: () => void;
}

export function RequestInfoDialog({ application, onOpenChange, onRequested }: RequestInfoDialogProps) {
  const [message, setMessage] = useState("");
  const requestInfo = useRequestTutorInfo();

  if (!application) return null;

  async function handleConfirm() {
    if (!application || !message.trim()) return;
    try {
      await requestInfo.mutateAsync({ applicationId: application.id, input: { message: message.trim() } });
      toast.success("Message sent — application moved to in review");
      setMessage("");
      onOpenChange(false);
      onRequested?.();
    } catch {
      toast.error("We couldn't send this request. Please try again.");
    }
  }

  return (
    <Dialog open={Boolean(application)} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request more information</DialogTitle>
          <DialogDescription>
            {application.headline} will be moved to "In review" and receive this message.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label htmlFor="request-info-message">Message to the tutor</Label>
          <Textarea
            id="request-info-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Let them know what's missing or needs clarifying"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button isLoading={requestInfo.isPending} disabled={!message.trim()} onClick={handleConfirm}>
            Send request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
