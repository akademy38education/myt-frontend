import { useState } from "react";
import { toast } from "sonner";
import type { ModerateReviewInput, Review } from "@myt/shared";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useModerateReview } from "../hooks/useModerateReview";

export interface ModerateReviewDialogProps {
  review: Review | null;
  onOpenChange: (open: boolean) => void;
}

const ACTION_LABELS: Record<ModerateReviewInput["action"], string> = {
  approve: "Approve (publish)",
  flag: "Flag for follow-up",
  hide: "Hide from public",
  remove: "Remove permanently",
};

export function ModerateReviewDialog({ review, onOpenChange }: ModerateReviewDialogProps) {
  const [action, setAction] = useState<ModerateReviewInput["action"]>("approve");
  const [reason, setReason] = useState("");
  const moderateReview = useModerateReview();

  if (!review) return null;

  async function handleConfirm() {
    if (!review) return;
    try {
      await moderateReview.mutateAsync({ id: review.id, input: { action, reason: reason.trim() || undefined } });
      toast.success("Review moderated");
      onOpenChange(false);
      setAction("approve");
      setReason("");
    } catch {
      toast.error("We couldn't update this review. Please try again.");
    }
  }

  return (
    <Dialog open={Boolean(review)} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Moderate review</DialogTitle>
          <DialogDescription>{review.comment || "This review has no written comment."}</DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label>Action</Label>
          <Select value={action} onValueChange={(value) => setAction(value as ModerateReviewInput["action"])}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(ACTION_LABELS) as ModerateReviewInput["action"][]).map((key) => (
                <SelectItem key={key} value={key}>
                  {ACTION_LABELS[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="moderation-reason">Reason (optional)</Label>
          <Textarea
            id="moderation-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Internal note explaining this decision"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button isLoading={moderateReview.isPending} onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
