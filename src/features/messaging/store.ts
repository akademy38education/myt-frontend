import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MessageType, type Message } from "@myt/shared";
import { mockMessages } from "@/mocks";
import { randomUUID } from "@/utils/uuid";

interface MessagingState {
  messages: Message[];
  readConversationIds: string[];
  sendMessage: (conversationId: string, senderId: string, body: string) => void;
  markConversationRead: (conversationId: string) => void;
}

/**
 * Real-time messaging is a future capability (see docs/architecture/README.md's
 * real-time foundation) — this store is the honest stand-in: sending a
 * message really appends it and persists locally, but there's no other
 * party actually receiving it yet.
 */
export const useMessagingStore = create<MessagingState>()(
  persist(
    (set, get) => ({
      messages: mockMessages,
      readConversationIds: [],
      sendMessage: (conversationId, senderId, body) => {
        const now = new Date().toISOString();
        const message: Message = { id: randomUUID(), conversationId, senderId, type: MessageType.TEXT, body, createdAt: now, updatedAt: now };
        set({ messages: [...get().messages, message] });
      },
      markConversationRead: (conversationId) =>
        set((state) => ({ readConversationIds: Array.from(new Set([...state.readConversationIds, conversationId])) })),
    }),
    { name: "myt-messages" }
  )
);
