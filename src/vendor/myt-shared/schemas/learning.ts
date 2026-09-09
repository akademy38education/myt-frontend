import { z } from "zod";

export const createGoalSchema = z.object({
  title: z.string().min(1).max(200),
  subjectId: z.string().min(1).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  targetDate: z.string().datetime(),
});
export type CreateGoalInput = z.infer<typeof createGoalSchema>;

export const updateGoalProgressSchema = z.object({
  progress: z.number().min(0).max(100),
});
export type UpdateGoalProgressInput = z.infer<typeof updateGoalProgressSchema>;

export const homeworkAnswerSchema = z.object({
  questionId: z.string().min(1),
  response: z.string().min(1).max(4000),
});

export const saveHomeworkAnswersSchema = z.object({
  answers: z.array(homeworkAnswerSchema).min(1),
});
export type SaveHomeworkAnswersInput = z.infer<typeof saveHomeworkAnswersSchema>;

export const reviewHomeworkSchema = z.object({
  feedback: z.string().min(1).max(2000),
});
export type ReviewHomeworkInput = z.infer<typeof reviewHomeworkSchema>;

export const createHomeworkSchema = z.object({
  studentId: z.string().min(1),
  lessonId: z.string().min(1).optional(),
  title: z.string().min(1).max(200),
  dueAt: z.string().datetime(),
  questionIds: z.array(z.string().min(1)).min(1),
});
export type CreateHomeworkInput = z.infer<typeof createHomeworkSchema>;
