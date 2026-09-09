import { z } from "zod";

export const tutorStudentNoteSchema = z.object({
  body: z.string().min(1).max(5000),
});
export type TutorStudentNoteInput = z.infer<typeof tutorStudentNoteSchema>;
