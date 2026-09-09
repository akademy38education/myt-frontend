import type { Message } from "@myt/shared";
import { mockConversations } from "@/mocks";
import { delay } from "@/utils/delay";
import { useMessagingStore } from "../store";

/** Generalized over `ConversationMock` — the underlying record always names both sides, but a conversation "summary" is always framed from whichever role is viewing it (see `listConversations` vs `listConversationsForTutor` vs `listConversationsForParent`). */
export interface ConversationSummary {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: "TUTOR" | "STUDENT";
  subjectId?: string;
  lastMessage?: Message;
  isUnread: boolean;
  /** Set only in the parent's family inbox — which child this conversation is about, so managing several children never gets confusing (Phase 9 spec §35). */
  childId?: string;
  childName?: string;
}

function lastMessageFor(conversationId: string, messages: Message[]): Message | undefined {
  return messages
    .filter((m) => m.conversationId === conversationId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .at(-1);
}

export const messagingService = {
  async listConversations(): Promise<ConversationSummary[]> {
    await delay(150);
    const { messages, readConversationIds } = useMessagingStore.getState();
    return mockConversations
      .map((conversation) => {
        const lastMessage = lastMessageFor(conversation.id, messages);
        return {
          id: conversation.id,
          participantId: conversation.participantId,
          participantName: conversation.participantName,
          participantRole: conversation.participantRole,
          subjectId: conversation.subjectId,
          lastMessage,
          isUnread: !readConversationIds.includes(conversation.id) && Boolean(lastMessage),
        };
      })
      .sort((a, b) => (b.lastMessage?.createdAt ?? "").localeCompare(a.lastMessage?.createdAt ?? ""));
  },

  /** The tutor-side view of the same conversations — "participant" here is the student, not the tutor (Phase 8's `/tutor/messages`). */
  async listConversationsForTutor(tutorUserId: string): Promise<ConversationSummary[]> {
    await delay(150);
    const { messages, readConversationIds } = useMessagingStore.getState();
    return mockConversations
      .filter((conversation) => conversation.participantId === tutorUserId)
      .map((conversation) => {
        const lastMessage = lastMessageFor(conversation.id, messages);
        return {
          id: conversation.id,
          participantId: conversation.studentUserId,
          participantName: conversation.studentName,
          participantRole: "STUDENT" as const,
          subjectId: conversation.subjectId,
          lastMessage,
          isUnread: !readConversationIds.includes(conversation.id) && Boolean(lastMessage),
        };
      })
      .sort((a, b) => (b.lastMessage?.createdAt ?? "").localeCompare(a.lastMessage?.createdAt ?? ""));
  },

  /**
   * A parent's family inbox — every conversation about any of their
   * children, tagged with which child it's about. Matched by `childId`
   * (the `StudentProfile` id) rather than `studentUserId`, so this also
   * works for a parent-managed child who has no login of their own.
   */
  async listConversationsForParent(children: Array<{ id: string; name: string }>): Promise<ConversationSummary[]> {
    await delay(150);
    const { messages, readConversationIds } = useMessagingStore.getState();
    const childNameById = new Map(children.map((c) => [c.id, c.name]));
    return mockConversations
      .filter((conversation) => childNameById.has(conversation.childId))
      .map((conversation) => {
        const lastMessage = lastMessageFor(conversation.id, messages);
        return {
          id: conversation.id,
          participantId: conversation.participantId,
          participantName: conversation.participantName,
          participantRole: conversation.participantRole,
          subjectId: conversation.subjectId,
          lastMessage,
          isUnread: !readConversationIds.includes(conversation.id) && Boolean(lastMessage),
          childId: conversation.childId,
          childName: childNameById.get(conversation.childId),
        };
      })
      .sort((a, b) => (b.lastMessage?.createdAt ?? "").localeCompare(a.lastMessage?.createdAt ?? ""));
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    await delay(150);
    return useMessagingStore
      .getState()
      .messages.filter((m) => m.conversationId === conversationId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  },

  async sendMessage(conversationId: string, senderId: string, body: string): Promise<void> {
    await delay(200);
    useMessagingStore.getState().sendMessage(conversationId, senderId, body);
  },

  markRead(conversationId: string): void {
    useMessagingStore.getState().markConversationRead(conversationId);
  },
};
