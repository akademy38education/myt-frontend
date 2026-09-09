import { useState } from "react";
import type { EndLessonInput } from "@myt/shared";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface EndLessonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (input: EndLessonInput) => void;
  isEnding?: boolean;
}

/** Capturing the summary right here (rather than a separate post-lesson step) means it's never skipped — see Phase 7 spec §40/§56. */
export function EndLessonDialog({ open, onOpenChange, onConfirm, isEnding }: EndLessonDialogProps) {
  const [summary, setSummary] = useState("");
  const [nextSteps, setNextSteps] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>End this lesson?</DialogTitle>
          <DialogDescription>You won't be able to rejoin as an active session. Add a quick summary for your student below (optional).</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>What did you cover today?</Label>
            <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} placeholder="Great progress on quadratic equations…" />
          </div>
          <div className="space-y-1.5">
            <Label>Next steps</Label>
            <Textarea value={nextSteps} onChange={(e) => setNextSteps(e.target.value)} rows={2} placeholder="Practise factorising before next lesson" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Continue Lesson
          </Button>
          <Button
            variant="destructive"
            isLoading={isEnding}
            onClick={() => onConfirm({ summary: summary.trim() || undefined, nextSteps: nextSteps.trim() ? [nextSteps.trim()] : undefined })}
          >
            End Lesson
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export interface LeaveLessonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function LeaveLessonDialog({ open, onOpenChange, onConfirm }: LeaveLessonDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave lesson?</DialogTitle>
          <DialogDescription>The lesson will continue for your tutor. You can rejoin any time before it ends.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Stay
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Leave Lesson
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
