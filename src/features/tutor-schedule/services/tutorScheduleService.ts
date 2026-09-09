import type { Availability, AvailabilityBlock } from "@myt/shared";
import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import type { AvailabilityRange } from "@/components/shared/AvailabilityEditor";
import { useMockScheduleStore } from "../mockScheduleStore";

export interface AvailabilityBlockDraft {
  date: string;
  startTime: string;
  endTime: string;
  type: "blocked" | "available-exception";
  reason?: string;
}

export const tutorScheduleService = {
  async getRules(tutorId: string): Promise<AvailabilityRange[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return useMockScheduleStore.getState().rules;
    }
    const rules = await apiRequest<Availability[]>(ENDPOINTS.tutors.availabilityRules(tutorId));
    return rules.map((r) => ({ dayOfWeek: r.dayOfWeek, startTime: r.startTime, endTime: r.endTime }));
  },

  async saveRules(tutorId: string, rules: AvailabilityRange[]): Promise<AvailabilityRange[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      useMockScheduleStore.getState().setRules(rules);
      return rules;
    }
    const saved = await apiRequest<Availability[]>(ENDPOINTS.tutors.availabilityRules(tutorId), { method: "PUT", body: { rules } });
    return saved.map((r) => ({ dayOfWeek: r.dayOfWeek, startTime: r.startTime, endTime: r.endTime }));
  },

  async getBlocks(tutorId: string, from?: string, to?: string): Promise<AvailabilityBlock[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return useMockScheduleStore.getState().blocks.filter((b) => (!from || b.date >= from) && (!to || b.date <= to));
    }
    return apiRequest<AvailabilityBlock[]>(ENDPOINTS.tutors.availabilityBlocks(tutorId), { query: { from, to } });
  },

  async createBlock(tutorId: string, block: AvailabilityBlockDraft): Promise<AvailabilityBlock> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return useMockScheduleStore.getState().addBlock(block);
    }
    return apiRequest<AvailabilityBlock>(ENDPOINTS.tutors.availabilityBlocks(tutorId), { method: "POST", body: block });
  },

  async deleteBlock(tutorId: string, blockId: string): Promise<void> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      useMockScheduleStore.getState().removeBlock(blockId);
      return;
    }
    await apiRequest(ENDPOINTS.tutors.availabilityBlock(tutorId, blockId), { method: "DELETE" });
  },
};
