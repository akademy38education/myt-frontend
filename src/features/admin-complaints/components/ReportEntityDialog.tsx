import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { ReportSeverity, ReportableEntityType } from "@myt/shared";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateComplaint } from "../hooks/useCreateComplaint";

export interface ReportEntityDialogProps {
  entityType: ReportableEntityType;
  entityId: string;
  entityLabel?: string;
  /** Custom trigger element (e.g. a "Report" link) — falls back to a plain outline button. */
  trigger?: ReactNode;
}

const SEVERITY_LABELS: Record<ReportSeverity, string> = {
  [ReportSeverity.LOW]: "Low",
  [ReportSeverity.MEDIUM]: "Medium",
  [ReportSeverity.HIGH]: "High",
  [ReportSeverity.CRITICAL]: "Critical",
};

/** Standalone "Report this" dialog, reusable from any page — see PERMISSIONS/schema note: `POST /complaints` is open to any authenticated user, not just admins. */
export function ReportEntityDialog({ entityType, entityId, entityLabel, trigger }: ReportEntityDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [severity, setSeverity] = useState<ReportSeverity>(ReportSeverity.MEDIUM);
  const createComplaint = useCreateComplaint();

  async function handleSubmit() {
    if (!reason.trim()) {
      toast.error("Please describe the issue.");
      return;
    }
    try {
      await createComplaint.mutateAsync({ entityType, entityId, entityLabel, reason, details: details.trim() || undefined, severity });
      toast.success("Report submitted");
      setOpen(false);
      setReason("");
      setDetails("");
      setSeverity(ReportSeverity.MEDIUM);
    } catch {
      toast.error("We couldn't submit your report. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm">
            Report
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report {entityLabel ?? entityType.toLowerCase()}</DialogTitle>
          <DialogDescription>Let our moderation team know what's wrong. They'll review it shortly.</DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label htmlFor="report-entity-reason">Reason</Label>
          <Input
            id="report-entity-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="e.g. Inappropriate content"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="report-entity-details">Details (optional)</Label>
          <Textarea id="report-entity-details" value={details} onChange={(event) => setDetails(event.target.value)} />
        </div>

        <div className="space-y-1.5">
          <Label>Severity</Label>
          <Select value={severity} onValueChange={(value) => setSeverity(value as ReportSeverity)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ReportSeverity).map((value) => (
                <SelectItem key={value} value={value}>
                  {SEVERITY_LABELS[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button isLoading={createComplaint.isPending} onClick={handleSubmit}>
            Submit report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
