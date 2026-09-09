import { useState } from "react";
import { toast } from "sonner";
import type { Report, ResolveReportInput } from "@myt/shared";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useResolveComplaint } from "../hooks/useResolveComplaint";

export interface ResolveComplaintDialogProps {
  report: Report | null;
  onOpenChange: (open: boolean) => void;
}

export function ResolveComplaintDialog({ report, onOpenChange }: ResolveComplaintDialogProps) {
  const [status, setStatus] = useState<ResolveReportInput["status"]>("RESOLVED");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const resolveComplaint = useResolveComplaint();

  if (!report) return null;

  async function handleConfirm() {
    if (!report) return;
    if (!resolutionNotes.trim()) {
      toast.error("Resolution notes are required.");
      return;
    }
    try {
      await resolveComplaint.mutateAsync({ id: report.id, input: { status, resolutionNotes } });
      toast.success(status === "RESOLVED" ? "Report resolved" : "Report dismissed");
      onOpenChange(false);
      setStatus("RESOLVED");
      setResolutionNotes("");
    } catch {
      toast.error("We couldn't update this report. Please try again.");
    }
  }

  return (
    <Dialog open={Boolean(report)} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resolve report</DialogTitle>
          <DialogDescription>{report.reason}</DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label>Outcome</Label>
          <Select value={status} onValueChange={(value) => setStatus(value as ResolveReportInput["status"])}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
              <SelectItem value="DISMISSED">Dismissed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="resolution-notes">Resolution notes</Label>
          <Textarea
            id="resolution-notes"
            value={resolutionNotes}
            onChange={(event) => setResolutionNotes(event.target.value)}
            placeholder="What action was taken?"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button isLoading={resolveComplaint.isPending} onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
