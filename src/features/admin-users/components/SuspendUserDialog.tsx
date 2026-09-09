import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSuspendUser } from "../hooks/useSuspendUser";
import { SUSPENSION_REASONS, type SuspendUserInput, type User } from "../types";

export interface SuspendUserDialogProps {
  user: User | null;
  onOpenChange: (open: boolean) => void;
}

/** Suspending an account is a high-impact, reversible-but-disruptive admin action — always gated behind this explicit confirmation, never a bare row button. */
export function SuspendUserDialog({ user, onOpenChange }: SuspendUserDialogProps) {
  const [reason, setReason] = useState<(typeof SUSPENSION_REASONS)[number] | undefined>(undefined);
  const [notes, setNotes] = useState("");
  const [suspendedUntil, setSuspendedUntil] = useState("");
  const suspendUser = useSuspendUser();

  if (!user) return null;

  function reset() {
    setReason(undefined);
    setNotes("");
    setSuspendedUntil("");
  }

  async function handleConfirm() {
    if (!user || !reason) return;
    const input: SuspendUserInput = { reason, notes: notes.trim() || undefined, suspendedUntil: suspendedUntil ? new Date(suspendedUntil).toISOString() : undefined };
    try {
      await suspendUser.mutateAsync({ userId: user.id, input });
      onOpenChange(false);
      reset();
    } catch {
      // Toast already surfaced by useSuspendUser's onError.
    }
  }

  return (
    <Dialog open={Boolean(user)} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Suspend {user.fullName}?</DialogTitle>
          <DialogDescription>{user.email} will lose access to their account until reactivated{suspendedUntil ? " or until the date below" : ""}.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Reason</Label>
            <Select value={reason} onValueChange={(v) => setReason(v as (typeof SUSPENSION_REASONS)[number])}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {SUSPENSION_REASONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="suspend-notes">Notes (optional)</Label>
            <Textarea id="suspend-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any additional context for the audit log" maxLength={1000} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="suspend-until">Suspend until (optional)</Label>
            <Input id="suspend-until" type="datetime-local" value={suspendedUntil} onChange={(e) => setSuspendedUntil(e.target.value)} />
            <p className="text-xs text-muted-foreground">Leave blank to suspend indefinitely, until an admin reactivates the account.</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" disabled={!reason} isLoading={suspendUser.isPending} onClick={handleConfirm}>
            Suspend user
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
