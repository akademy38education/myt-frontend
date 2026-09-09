import { z } from "zod";

const notificationPreferencesSchema = z.object({
  lessonReminders: z.boolean(),
  homeworkReminders: z.boolean(),
  progressReports: z.boolean(),
  tutorMessages: z.boolean(),
  paymentNotifications: z.boolean(),
  marketing: z.boolean(),
});

export const parentSettingsSchema = z.object({
  notificationPreferences: notificationPreferencesSchema,
});
export type ParentSettingsInput = z.infer<typeof parentSettingsSchema>;
