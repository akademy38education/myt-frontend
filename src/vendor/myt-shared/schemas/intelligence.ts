import { z } from "zod";

export const recordAnalyticsEventSchema = z.object({
  name: z.string().min(1).max(100),
  properties: z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
});
export type RecordAnalyticsEventInput = z.infer<typeof recordAnalyticsEventSchema>;

export const updateFeatureFlagsSchema = z.record(z.boolean());
export type UpdateFeatureFlagsInput = z.infer<typeof updateFeatureFlagsSchema>;
