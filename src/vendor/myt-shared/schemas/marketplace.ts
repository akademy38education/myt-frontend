import { z } from "zod";

export const tutorSearchQuerySchema = z.object({
  query: z.string().optional(),
  subjectId: z.string().optional(),
  yearLevel: z.string().optional(),
  curriculum: z.string().optional(),
  teachingStyle: z.string().optional(),
  availability: z.string().optional(),
  language: z.string().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  verifiedOnly: z.coerce.boolean().optional(),
  trialAvailable: z.coerce.boolean().optional(),
  sort: z.enum(["recommended", "rating", "priceAsc", "priceDesc", "experience", "availability", "newest"]).optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(50).optional(),
});
export type TutorSearchQuery = z.infer<typeof tutorSearchQuerySchema>;

export const smartMatchRequestSchema = z.object({
  subjectId: z.string().min(1),
  goal: z.string().min(1),
  yearLevel: z.string().optional(),
  availability: z.array(z.string()).default([]),
  teachingStyle: z.string().optional(),
  budgetPerHour: z.number().min(0).optional(),
});
export type SmartMatchRequestInput = z.infer<typeof smartMatchRequestSchema>;
