import { z } from "zod";

export const endLessonSchema = z.object({
  summary: z.string().max(2000).optional(),
  objectives: z.array(z.string().max(200)).max(20).optional(),
  nextSteps: z.array(z.string().max(200)).max(20).optional(),
});
export type EndLessonInput = z.infer<typeof endLessonSchema>;

export const startLessonSchema = z.object({
  objectives: z.array(z.string().max(200)).max(20).optional(),
});
export type StartLessonInput = z.infer<typeof startLessonSchema>;

export const lessonNoteSchema = z.object({
  visibility: z.enum(["private", "shared"]),
  body: z.string().max(5000),
});
export type LessonNoteInput = z.infer<typeof lessonNoteSchema>;

export const lessonMessageSchema = z.object({
  body: z.string().min(1).max(2000),
});
export type LessonMessageInput = z.infer<typeof lessonMessageSchema>;

export const lessonResourceSchema = z.object({
  title: z.string().min(1).max(200),
  type: z.enum(["worksheet", "video", "article", "link", "document"]),
  url: z.string().url().optional(),
});
export type LessonResourceInput = z.infer<typeof lessonResourceSchema>;

const whiteboardStrokeSchema = z.object({
  id: z.string(),
  tool: z.enum(["pen", "highlighter", "eraser", "rectangle", "ellipse", "text"]),
  color: z.string(),
  size: z.number().min(1).max(64),
  points: z.array(z.object({ x: z.number(), y: z.number() })),
  text: z.string().max(500).optional(),
  authorRole: z.enum(["student", "tutor"]),
});

export const whiteboardStateSchema = z.object({
  strokes: z.array(whiteboardStrokeSchema).max(5000),
});
export type WhiteboardStateInput = z.infer<typeof whiteboardStateSchema>;

export const submitLessonFeedbackSchema = z.object({
  bookingId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});
export type SubmitLessonFeedbackInput = z.infer<typeof submitLessonFeedbackSchema>;
