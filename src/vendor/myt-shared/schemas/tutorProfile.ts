import { z } from "zod";

const qualificationSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  institution: z.string().optional(),
  year: z.number().int(),
  subject: z.string().optional(),
  documentName: z.string().optional(),
});

/** All fields optional — a profile edit is always a partial patch, never a full replace. */
export const updateTutorProfileSchema = z.object({
  avatarUrl: z.string().optional(),
  headline: z.string().min(5).max(120).optional(),
  bio: z.string().min(20).max(2000).optional(),
  lessonApproach: z.string().max(1000).optional(),
  location: z.string().max(120).optional(),
  timezone: z.string().optional(),
  subjects: z.array(z.string()).optional(),
  yearLevels: z.array(z.string()).optional(),
  curricula: z.array(z.string()).optional(),
  teachingStyle: z.string().optional(),
  hourlyRate: z.number().positive().optional(),
  yearsExperience: z.number().min(0).optional(),
  languages: z.array(z.string()).optional(),
  trialLessonEnabled: z.boolean().optional(),
  trialLessonPrice: z.number().positive().optional(),
  qualifications: z.array(qualificationSchema).optional(),
});
export type UpdateTutorProfileInput = z.infer<typeof updateTutorProfileSchema>;

const notificationPreferencesSchema = z.object({
  bookingRequests: z.boolean(),
  lessonReminders: z.boolean(),
  messages: z.boolean(),
  reviews: z.boolean(),
  payouts: z.boolean(),
  marketing: z.boolean(),
});

export const tutorSettingsSchema = z.object({
  notificationPreferences: notificationPreferencesSchema,
});
export type TutorSettingsInput = z.infer<typeof tutorSettingsSchema>;
