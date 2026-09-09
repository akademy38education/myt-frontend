import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { AvailabilityEditor, type AvailabilityRange } from "@/components/shared/AvailabilityEditor";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCurrentTutorProfile } from "@/features/tutors";
import { useAvailabilityRules, useSaveAvailabilityRules, useAvailabilityBlocks, useCreateAvailabilityBlock, useDeleteAvailabilityBlock } from "@/features/tutor-schedule";
import { formatDate } from "@/utils/formatters";

export function TutorAvailabilityPage() {
  const { tutorId, isLoading: isProfileLoading } = useCurrentTutorProfile();
  const { data: rules, isLoading: isRulesLoading, isError, refetch } = useAvailabilityRules(tutorId);
  const saveRules = useSaveAvailabilityRules(tutorId);
  const [draftRules, setDraftRules] = useState<AvailabilityRange[] | null>(null);

  const { data: blocks } = useAvailabilityBlocks(tutorId);
  const createBlock = useCreateAvailabilityBlock(tutorId);
  const deleteBlock = useDeleteAvailabilityBlock(tutorId);
  const [blockDate, setBlockDate] = useState("");
  const [blockStart, setBlockStart] = useState("14:00");
  const [blockEnd, setBlockEnd] = useState("16:00");
  const [blockType, setBlockType] = useState<"blocked" | "available-exception">("blocked");
  const [blockReason, setBlockReason] = useState("");

  const currentRules = draftRules ?? rules ?? [];
  const isDirty = draftRules !== null;

  if (isProfileLoading || isRulesLoading) return <LoadingState label="Loading your availability..." />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  async function handleSave() {
    try {
      await saveRules.mutateAsync(currentRules);
      setDraftRules(null);
      toast.success("Availability updated");
    } catch {
      toast.error("We couldn't save your availability. Please try again.");
    }
  }

  async function handleAddBlock() {
    if (!blockDate) {
      toast.error("Choose a date first.");
      return;
    }
    try {
      await createBlock.mutateAsync({ date: blockDate, startTime: blockStart, endTime: blockEnd, type: blockType, reason: blockReason || undefined });
      toast.success(blockType === "blocked" ? "Time blocked" : "One-time availability added");
      setBlockDate("");
      setBlockReason("");
    } catch {
      toast.error("Couldn't save that — please try again.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Availability" description="Set your regular weekly schedule, then block off or add one-time exceptions as needed." />

      <Card>
        <CardContent className="p-6">
          <h2 className="mb-4 font-semibold">Weekly schedule</h2>
          <AvailabilityEditor value={currentRules} onChange={setDraftRules} />
          {isDirty && (
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDraftRules(null)}>
                Discard changes
              </Button>
              <Button isLoading={saveRules.isPending} onClick={handleSave}>
                Save changes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="mb-4 font-semibold">Blocked time & one-time exceptions</h2>
          <div className="grid gap-3 rounded-lg border border-dashed border-border p-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input type="date" value={blockDate} onChange={(e) => setBlockDate(e.target.value)} min={new Date().toISOString().slice(0, 10)} />
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <RadioGroup value={blockType} onValueChange={(v) => setBlockType(v as typeof blockType)} className="flex gap-4 pt-2">
                <label className="flex items-center gap-1.5 text-sm">
                  <RadioGroupItem value="blocked" id="block-type-blocked" />
                  Blocked
                </label>
                <label className="flex items-center gap-1.5 text-sm">
                  <RadioGroupItem value="available-exception" id="block-type-exception" />
                  One-time available
                </label>
              </RadioGroup>
            </div>
            <div className="space-y-1.5">
              <Label>Start time</Label>
              <Input type="time" value={blockStart} onChange={(e) => setBlockStart(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>End time</Label>
              <Input type="time" value={blockEnd} onChange={(e) => setBlockEnd(e.target.value)} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Reason (optional)</Label>
              <Input value={blockReason} onChange={(e) => setBlockReason(e.target.value)} placeholder="e.g. Personal appointment" />
            </div>
            <Button className="sm:col-span-2" onClick={handleAddBlock} isLoading={createBlock.isPending}>
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>

          <div className="mt-5 space-y-2">
            {!blocks || blocks.length === 0 ? (
              <EmptyState title="No blocked time or exceptions" description="Anything you add above will show up here." className="py-6" />
            ) : (
              blocks
                .slice()
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((block) => (
                  <div key={block.id} className="flex items-center justify-between rounded-md border border-border p-3 text-sm">
                    <div>
                      <p className="font-medium">
                        {formatDate(new Date(`${block.date}T00:00:00`).toISOString())} · {block.startTime}–{block.endTime}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {block.type === "blocked" ? "Blocked" : "One-time available"}
                        {block.reason ? ` — ${block.reason}` : ""}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" aria-label="Remove" onClick={() => deleteBlock.mutate(block.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
