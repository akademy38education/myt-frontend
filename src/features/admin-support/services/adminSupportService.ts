import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import type { SupportTicket, SupportTicketMessage, SupportTicketMessageInput, UpdateSupportTicketInput } from "@myt/shared";
import { useAuthStore } from "@/stores/authStore";
import { useMockSupportStore } from "../mockSupportStore";
import type { SupportTicketDetail, SupportTicketFilter } from "../types";

export const adminSupportService = {
  async list(filter: SupportTicketFilter = {}): Promise<SupportTicket[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return useMockSupportStore
        .getState()
        .tickets.filter((t) => (!filter.status || t.status === filter.status) && (!filter.priority || t.priority === filter.priority) && (!filter.assignedAdminId || t.assignedAdminId === filter.assignedAdminId));
    }
    return apiRequest<SupportTicket[]>(ENDPOINTS.support.list, {
      query: { status: filter.status, priority: filter.priority, assignedAdminId: filter.assignedAdminId },
    });
  },

  async getOne(id: string): Promise<SupportTicketDetail> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const { tickets, messages } = useMockSupportStore.getState();
      const ticket = tickets.find((t) => t.id === id);
      if (!ticket) throw new Error("Support ticket not found");
      return { ticket, messages: messages.filter((m) => m.ticketId === id).sort((a, b) => a.createdAt.localeCompare(b.createdAt)) };
    }
    return apiRequest<SupportTicketDetail>(ENDPOINTS.support.byId(id));
  },

  async sendMessage(id: string, input: SupportTicketMessageInput): Promise<SupportTicketMessage> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const admin = useAuthStore.getState().user;
      return useMockSupportStore.getState().addMessage(id, admin?.id ?? "user-admin-1", true, admin?.fullName ?? "Admin", input.body);
    }
    return apiRequest<SupportTicketMessage>(ENDPOINTS.support.messages(id), { method: "POST", body: input });
  },

  async update(id: string, input: UpdateSupportTicketInput): Promise<SupportTicket> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      // `assignedAdminId` is `string | null | undefined` on the input (absent = don't
      // touch, null = unassign, string = assign) but `string | undefined` on the
      // entity — only include the key in the patch when the caller actually sent it,
      // so "don't touch" doesn't get conflated with "unassign".
      const { assignedAdminId, ...rest } = input;
      const patch: Partial<SupportTicket> = { ...rest };
      if (assignedAdminId !== undefined) patch.assignedAdminId = assignedAdminId ?? undefined;
      const updated = useMockSupportStore.getState().updateTicket(id, patch);
      if (!updated) throw new Error("Support ticket not found");
      return updated;
    }
    return apiRequest<SupportTicket>(ENDPOINTS.support.update(id), { method: "PATCH", body: input });
  },
};
