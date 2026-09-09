import { z } from "zod";

export const createResourceSchema = z.object({
  title: z.string().min(1).max(200),
  type: z.enum(["worksheet", "video", "article", "link", "document", "presentation"]),
  url: z.string().url().optional(),
  subjectId: z.string().optional(),
  tags: z.array(z.string().max(40)).max(10).default([]),
});
export type CreateResourceInput = z.infer<typeof createResourceSchema>;

export const shareResourceSchema = z.object({
  studentIds: z.array(z.string().min(1)).min(1).max(50),
});
export type ShareResourceInput = z.infer<typeof shareResourceSchema>;
