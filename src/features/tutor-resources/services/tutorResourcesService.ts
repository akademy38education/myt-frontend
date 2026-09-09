import type { CreateResourceInput, Resource } from "@myt/shared";
import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import type { ResourceWithShares } from "../types";

/** Mock-mode store — no seed data, matching the honest "empty library until you upload something" state a fresh tutor genuinely sees. */
let mockResources: ResourceWithShares[] = [];

export const tutorResourcesService = {
  async list(tutorId: string): Promise<ResourceWithShares[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return mockResources.filter((r) => r.tutorId === tutorId);
    }
    return apiRequest<ResourceWithShares[]>(ENDPOINTS.resources.list(tutorId));
  },

  async create(tutorId: string, input: CreateResourceInput): Promise<Resource> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const now = new Date().toISOString();
      const resource: ResourceWithShares = { id: `resource-${Date.now()}`, tutorId, ...input, sharedWith: [], createdAt: now, updatedAt: now };
      mockResources = [resource, ...mockResources];
      return resource;
    }
    return apiRequest<Resource>(ENDPOINTS.resources.list(tutorId), { method: "POST", body: input });
  },

  async remove(tutorId: string, resourceId: string): Promise<void> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      mockResources = mockResources.filter((r) => r.id !== resourceId);
      return;
    }
    await apiRequest(ENDPOINTS.resources.byId(tutorId, resourceId), { method: "DELETE" });
  },

  async share(tutorId: string, resourceId: string, studentIds: string[]): Promise<void> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const resource = mockResources.find((r) => r.id === resourceId);
      if (resource) resource.sharedWith = Array.from(new Set([...resource.sharedWith, ...studentIds]));
      return;
    }
    await apiRequest(ENDPOINTS.resources.share(tutorId, resourceId), { method: "POST", body: { studentIds } });
  },

  async unshare(tutorId: string, resourceId: string, studentId: string): Promise<void> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const resource = mockResources.find((r) => r.id === resourceId);
      if (resource) resource.sharedWith = resource.sharedWith.filter((id) => id !== studentId);
      return;
    }
    await apiRequest(ENDPOINTS.resources.unshare(tutorId, resourceId, studentId), { method: "DELETE" });
  },
};
