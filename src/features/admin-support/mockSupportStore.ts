import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { SupportTicket, SupportTicketMessage } from "@myt/shared";
import { mockSupportTickets, mockSupportTicketMessages } from "@/mocks";
import { randomUUID } from "@/utils/uuid";

interface MockSupportState {
  tickets: SupportTicket[];
  messages: SupportTicketMessage[];
  updateTicket: (id: string, patch: Partial<SupportTicket>) => SupportTicket | undefined;
  addMessage: (ticketId: string, authorId: string, authorIsAdmin: boolean, authorName: string, body: string) => SupportTicketMessage;
}

/** Mock-mode-only mutable support desk — mirrors what `support.repository` does on the real backend, so ticket status/priority updates and new replies persist across refresh (see `admin-users`/`admin-tutor-verification`'s equivalent stores). */
export const useMockSupportStore = create<MockSupportState>()(
  persist(
    (set, get) => ({
      tickets: mockSupportTickets,
      messages: mockSupportTicketMessages,
      updateTicket: (id, patch) => {
        let updated: SupportTicket | undefined;
        set((state) => ({
          tickets: state.tickets.map((t) => {
            if (t.id !== id) return t;
            updated = { ...t, ...patch, updatedAt: new Date().toISOString() };
            return updated;
          }),
        }));
        return updated ?? get().tickets.find((t) => t.id === id);
      },
      addMessage: (ticketId, authorId, authorIsAdmin, authorName, body) => {
        const now = new Date().toISOString();
        const message: SupportTicketMessage = { id: randomUUID(), ticketId, authorId, authorIsAdmin, authorName, body, createdAt: now, updatedAt: now };
        set((state) => ({
          messages: [...state.messages, message],
          tickets: state.tickets.map((t) => (t.id === ticketId ? { ...t, lastMessageAt: now, updatedAt: now } : t)),
        }));
        return message;
      },
    }),
    { name: "myt-mock-support", storage: createJSONStorage(() => localStorage) }
  )
);
