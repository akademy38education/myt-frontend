import { MessageType, type Message } from "@myt/shared";

/**
 * `participantId`/`participantName`/`participantRole` describe the tutor
 * side (this is what the STUDENT sees as "who I'm talking to") — kept as
 * the original field names since student-side code already reads them.
 * `studentUserId`/`studentName` are the Phase 8 addition, letting the TUTOR
 * side of the same conversation resolve "who I'm talking to" too (see
 * `messagingService.listConversationsForTutor`), without a second
 * conversation/message dataset.
 */
export interface ConversationMock {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: "TUTOR";
  subjectId?: string;
  studentUserId: string;
  studentName: string;
  /**
   * Phase 9 addition — the child's `StudentProfile` id, always present even
   * for a parent-managed child with no login of their own (unlike
   * `studentUserId`, which such a child doesn't have). This is what lets a
   * parent's family inbox resolve "which of my children is this
   * conversation about" (see `messagingService.listConversationsForParent`).
   */
  childId: string;
}

export const mockConversations: ConversationMock[] = [
  { id: "conversation-1", participantId: "user-tutor-1", participantName: "Dr. Sofia Reyes", participantRole: "TUTOR", subjectId: "subject-maths", studentUserId: "user-student-1", studentName: "Amelia Carter", childId: "student-1" },
  { id: "conversation-2", participantId: "user-tutor-2", participantName: "Daniel Osei", participantRole: "TUTOR", subjectId: "subject-english", studentUserId: "user-student-1", studentName: "Amelia Carter", childId: "student-1" },
];

export const mockMessages: Message[] = [
  { id: "message-1", conversationId: "conversation-1", senderId: "user-tutor-1", type: MessageType.TEXT, body: "Hi Amelia, great progress today — see the homework I've set for Tuesday.", createdAt: "2026-09-01T17:12:00.000Z", updatedAt: "2026-09-01T17:12:00.000Z" },
  { id: "message-2", conversationId: "conversation-1", senderId: "user-student-1", type: MessageType.TEXT, body: "Thank you! I'll get started this evening.", createdAt: "2026-09-01T18:00:00.000Z", updatedAt: "2026-09-01T18:00:00.000Z" },
  { id: "message-3", conversationId: "conversation-1", senderId: "user-tutor-1", type: MessageType.TEXT, body: "Sounds good. Let me know if question 5 gives you trouble — it's a tricky one.", createdAt: "2026-09-02T08:30:00.000Z", updatedAt: "2026-09-02T08:30:00.000Z" },
  { id: "message-4", conversationId: "conversation-2", senderId: "user-tutor-2", type: MessageType.TEXT, body: "I've marked your Macbeth essay — really strong opening paragraph!", createdAt: "2026-09-03T20:05:00.000Z", updatedAt: "2026-09-03T20:05:00.000Z" },
];
