import { useState } from "react";
import { toast } from "sonner";
import { Megaphone } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAnnouncements, useCreateAnnouncement, UserRole } from "@/features/admin-announcements";
import { formatDateTime } from "@/utils/formatters";

function roleLabel(role: string): string {
  return role.charAt(0) + role.slice(1).toLowerCase();
}

function audienceLabel(audience: "all" | UserRole[]): string {
  return audience === "all" ? "All users" : audience.map(roleLabel).join(", ");
}

export function AdminAnnouncementsPage() {
  const { data: history, isLoading, isError, refetch } = useAnnouncements();
  const createAnnouncement = useCreateAnnouncement();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audienceMode, setAudienceMode] = useState<"all" | "roles">("all");
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const canSend = title.trim().length > 0 && body.trim().length > 0 && (audienceMode === "all" || selectedRoles.length > 0);

  function toggleRole(role: UserRole, checked: boolean) {
    setSelectedRoles((current) => (checked ? [...current, role] : current.filter((r) => r !== role)));
  }

  function resetForm() {
    setTitle("");
    setBody("");
    setAudienceMode("all");
    setSelectedRoles([]);
  }

  async function handleConfirmSend() {
    try {
      const result = await createAnnouncement.mutateAsync({
        title: title.trim(),
        body: body.trim(),
        audience: audienceMode === "all" ? "all" : selectedRoles,
      });
      toast.success(`Announcement sent to ${result.recipientCount} recipient${result.recipientCount === 1 ? "" : "s"}`);
      setConfirmOpen(false);
      resetForm();
    } catch {
      toast.error("We couldn't send this announcement. Please try again.");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Announcements" description="Broadcast a message to every user, or to specific roles." />

      <Card>
        <CardHeader>
          <CardTitle>Compose announcement</CardTitle>
          <CardDescription>This reaches real users — review carefully before sending.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="announcement-title">Title</Label>
            <Input id="announcement-title" value={title} maxLength={200} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Scheduled maintenance this weekend" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="announcement-body">Message</Label>
            <Textarea id="announcement-body" value={body} maxLength={2000} onChange={(e) => setBody(e.target.value)} rows={5} placeholder="What do you want to tell them?" />
          </div>
          <div className="space-y-2">
            <Label>Audience</Label>
            <RadioGroup value={audienceMode} onValueChange={(v) => setAudienceMode(v as "all" | "roles")}>
              <label className="flex cursor-pointer items-center gap-2.5 rounded-md border border-border p-2.5 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <RadioGroupItem value="all" id="audience-all" />
                All users
              </label>
              <label className="flex cursor-pointer items-center gap-2.5 rounded-md border border-border p-2.5 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <RadioGroupItem value="roles" id="audience-roles" />
                Specific roles
              </label>
            </RadioGroup>
            {audienceMode === "roles" && (
              <div className="grid grid-cols-2 gap-2 pl-1 pt-1 sm:grid-cols-4">
                {Object.values(UserRole).map((role) => (
                  <label key={role} className="flex cursor-pointer items-center gap-2 text-sm">
                    <Checkbox checked={selectedRoles.includes(role)} onCheckedChange={(checked) => toggleRole(role, Boolean(checked))} />
                    {roleLabel(role)}
                  </label>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        <div className="flex justify-end p-6 pt-0">
          <Button disabled={!canSend} onClick={() => setConfirmOpen(true)}>
            Review and send
          </Button>
        </div>
      </Card>

      <div>
        <h2 className="mb-3 text-lg font-semibold">History</h2>
        {isLoading && <LoadingState label="Loading announcement history..." />}
        {isError && <ErrorState onRetry={() => refetch()} />}
        {history && history.length === 0 && (
          <EmptyState icon={Megaphone} title="No announcements sent yet" description="Announcements you send will appear here." />
        )}
        {history && history.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Recipients</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((announcement) => (
                <TableRow key={announcement.id}>
                  <TableCell className="font-medium">{announcement.title}</TableCell>
                  <TableCell>{audienceLabel(announcement.audience)}</TableCell>
                  <TableCell>{announcement.sentAt ? formatDateTime(announcement.sentAt) : formatDateTime(announcement.createdAt)}</TableCell>
                  <TableCell>{announcement.recipientCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send this announcement?</DialogTitle>
            <DialogDescription>
              "{title}" will be delivered to {audienceMode === "all" ? "all users" : selectedRoles.length > 0 ? selectedRoles.map(roleLabel).join(", ") : "the selected roles"}. This
              cannot be recalled once sent.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button isLoading={createAnnouncement.isPending} onClick={handleConfirmSend}>
              Send announcement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
