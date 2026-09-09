import { SupportTicketPriority, SupportTicketStatus, UserRole, type SupportTicket, type SupportTicketMessage } from "@myt/shared";

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();

/** Mirrors `backend/src/models/seedData.ts`'s `HAND_WRITTEN_SUPPORT_TICKETS` field-for-field. */
export const mockSupportTickets: SupportTicket[] = [
  {
    id: "ticket-1",
    requesterId: "user-parent-1",
    requesterRole: UserRole.PARENT,
    requesterName: "James Carter",
    subject: "Unable to reschedule a lesson",
    category: "Bookings",
    status: SupportTicketStatus.OPEN,
    priority: SupportTicketPriority.MEDIUM,
    lastMessageAt: daysAgo(1),
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  {
    id: "ticket-2",
    requesterId: "user-tutor-2",
    requesterRole: UserRole.TUTOR,
    requesterName: "Daniel Osei",
    subject: "Payout didn't arrive on schedule",
    category: "Payments",
    status: SupportTicketStatus.IN_PROGRESS,
    priority: SupportTicketPriority.HIGH,
    assignedAdminId: "user-admin-support",
    lastMessageAt: daysAgo(2),
    createdAt: daysAgo(4),
    updatedAt: daysAgo(2),
  },
  {
    id: "ticket-3",
    requesterId: "user-student-1",
    requesterRole: UserRole.STUDENT,
    requesterName: "Amelia Carter",
    subject: "How do I change my learning goals?",
    category: "Account",
    status: SupportTicketStatus.RESOLVED,
    priority: SupportTicketPriority.LOW,
    assignedAdminId: "user-admin-support",
    lastMessageAt: daysAgo(15),
    createdAt: daysAgo(16),
    updatedAt: daysAgo(15),
  },
];

/** Mirrors `backend/src/models/seedData.ts`'s `seedSupportTicketMessages` field-for-field. */
export const mockSupportTicketMessages: SupportTicketMessage[] = [
  {
    id: "ticket-msg-1",
    ticketId: "ticket-1",
    authorId: "user-parent-1",
    authorIsAdmin: false,
    authorName: "James Carter",
    body: "I'm trying to reschedule Amelia's Tuesday lesson but the reschedule button isn't responding.",
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  {
    id: "ticket-msg-2",
    ticketId: "ticket-2",
    authorId: "user-tutor-2",
    authorIsAdmin: false,
    authorName: "Daniel Osei",
    body: "My payout for last week was marked paid but I haven't received it in my bank account.",
    createdAt: daysAgo(4),
    updatedAt: daysAgo(4),
  },
  {
    id: "ticket-msg-3",
    ticketId: "ticket-2",
    authorId: "user-admin-support",
    authorIsAdmin: true,
    authorName: "Tariq Hassan",
    body: "Thanks for flagging this, Daniel — I'm checking with the payments team and will follow up within 24 hours.",
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
];
