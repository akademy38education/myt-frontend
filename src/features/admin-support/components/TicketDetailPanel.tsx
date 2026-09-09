import { useState } from "react";
import { PERMISSIONS, SupportTicketPriority, SupportTicketStatus } from "@myt/shared";
import { DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { usePermission } from "@/hooks/usePermission";
import { useAuth } from "@/hooks/useAuth";
import { formatDateTime } from "@/utils/formatters";
import { cn } from "@/utils/cn";
import { useSupportTicket } from "../hooks/useSupportTicket";
import { useSendSupportMessage } from "../hooks/useSendSupportMessage";
import { useUpdateSupportTicket } from "../hooks/useUpdateSupportTicket";

const STATUS_LABELS: Record<SupportTicketStatus, string> = {
  [SupportTicketStatus.OPEN]: "Open",
  [SupportTicketStatus.IN_PROGRESS]: "In progress",
  [SupportTicketStatus.WAITING_ON_USER]: "Waiting on user",
  [SupportTicketStatus.RESOLVED]: "Resolved",
  [SupportTicketStatus.CLOSED]: "Closed",
};

const PRIORITY_LABELS: Record<SupportTicketPriority, string> = {
  [SupportTicketPriority.LOW]: "Low",
  [SupportTicketPriority.MEDIUM]: "Medium",
  [SupportTicketPriority.HIGH]: "High",
  [SupportTicketPriority.URGENT]: "Urgent",
};

export interface TicketDetailPanelProps {
  ticketId: string;
}

/**
 * Self-contained ticket view for use inside a Drawer/Dialog — renders its
 * own Drawer title/description so the caller only needs to manage which
 * ticket id (if any) is currently open.
 */
export function TicketDetailPanel({ ticketId }: TicketDetailPanelProps) {
  const { data, isLoading, isError, refetch } = useSupportTicket(ticketId);
  const { user } = useAuth();
  const canManage = usePermission(PERMISSIONS.SUPPORT_MANAGE);
  const sendMessage = useSendSupportMessage(ticketId);
  const updateTicket = useUpdateSupportTicket(ticketId);
  const [reply, setReply] = useState("");

  if (isLoading) return <LoadingState label="Loading ticket..." />;
  if (isError || !data) return <ErrorState onRetry={() => refetch()} />;

  const { ticket, messages } = data;
  const isAssignedToMe = Boolean(user) && ticket.assignedAdminId === user?.id;

  async function handleSend() {
    const body = reply.trim();
    if (!body) return;
    try {
      await sendMessage.mutateAsync({ body });
      setReply("");
    } catch {
      // Toast already surfaced by useSendSupportMessage's onError.
    }
  }

  function handleAssignToggle() {
    if (!user) return;
    updateTicket.mutate({ assignedAdminId: isAssignedToMe ? null : user.id });
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <DrawerTitle>{ticket.subject}</DrawerTitle>
        <DrawerDescription>
          {ticket.requesterName} ({ticket.requesterRole.toLowerCase()}) · {ticket.category}
        </DrawerDescription>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">{PRIORITY_LABELS[ticket.priority]} priority</Badge>
        <Badge variant="secondary">{STATUS_LABELS[ticket.status]}</Badge>
        {ticket.assignedAdminId && <Badge variant="muted">{isAssignedToMe ? "Assigned to you" : "Assigned"}</Badge>}
      </div>

      {canManage && (
        <div className="grid grid-cols-2 gap-3 rounded-md border border-border p-3">
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={ticket.status} onValueChange={(v) => updateTicket.mutate({ status: v as SupportTicketStatus })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(SupportTicketStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Priority</Label>
            <Select value={ticket.priority} onValueChange={(v) => updateTicket.mutate({ priority: v as SupportTicketPriority })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(SupportTicketPriority).map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {PRIORITY_LABELS[priority]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2">
            <Button type="button" variant="outline" size="sm" isLoading={updateTicket.isPending} onClick={handleAssignToggle}>
              {isAssignedToMe ? "Unassign from me" : "Assign to me"}
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 space-y-3 overflow-y-auto">
        {messages.length === 0 && <p className="text-sm text-muted-foreground">No messages yet.</p>}
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn("rounded-md border p-3 text-sm", message.authorIsAdmin ? "border-primary/30 bg-primary/5" : "border-border")}
          >
            <div className="mb-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                {message.authorName}
                {message.authorIsAdmin && <Badge variant="default">Admin</Badge>}
              </span>
              <span>{formatDateTime(message.createdAt)}</span>
            </div>
            <p className="whitespace-pre-wrap">{message.body}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2 border-t border-border pt-3">
        <Label htmlFor="ticket-reply">Reply</Label>
        <Textarea
          id="ticket-reply"
          rows={3}
          placeholder="Write a reply..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />
        <div className="flex justify-end">
          <Button size="sm" isLoading={sendMessage.isPending} disabled={!reply.trim()} onClick={handleSend}>
            Send reply
          </Button>
        </div>
      </div>
    </div>
  );
}
