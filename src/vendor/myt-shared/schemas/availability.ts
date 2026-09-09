import { z } from "zod";

export const availabilityRuleSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
});
export type AvailabilityRuleInput = z.infer<typeof availabilityRuleSchema>;

export const saveAvailabilityRulesSchema = z.object({
  rules: z.array(availabilityRuleSchema),
});
export type SaveAvailabilityRulesInput = z.infer<typeof saveAvailabilityRulesSchema>;

export const availabilityBlockSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  type: z.enum(["blocked", "available-exception"]),
  reason: z.string().max(200).optional(),
});
export type AvailabilityBlockInput = z.infer<typeof availabilityBlockSchema>;
