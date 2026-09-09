import type { SupportTicket, SupportTicketMessage, SupportTicketPriority, SupportTicketStatus } from "@myt/shared";

export interface SupportTicketFilter {
  status?: SupportTicketStatus;
  priority?: SupportTicketPriority;
  assignedAdminId?: string;
}

export interface SupportTicketDetail {
  ticket: SupportTicket;
  messages: SupportTicketMessage[];
}
