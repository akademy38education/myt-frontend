import { z } from "zod";

const tutorPreferenceSchema = z
  .object({
    teachingStyle: z.string().optional(),
    lessonFormat: z.enum(["online", "in-person", "either"]).optional(),
    preferredAvailability: z.array(z.string()).optional(),
    budgetPerHour: z.number().positive().optional(),
    tutorGenderPreference: z.enum(["male", "female", "no-preference"]).optional(),
    languagePreferences: z.array(z.string()).optional(),
  })
  .optional();

export const studentOnboardingSchema = z.object({
  fullName: z.string().min(2).optional(),
  dateOfBirth: z.string().optional(),
  avatarUrl: z.string().optional(),
  country: z.string().optional(),
  timezone: z.string().optional(),
  yearGroup: z.string().min(1).optional(),
  schoolName: z.string().optional(),
  curriculum: z.string().optional(),
  subjects: z.array(z.string()).optional(),
  learningGoals: z.array(z.string()).optional(),
  tutorPreference: tutorPreferenceSchema,
});
export type StudentOnboardingInput = z.infer<typeof studentOnboardingSchema>;

export const parentOnboardingSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().optional(),
  timezone: z.string().optional(),
  billingEmail: z.string().email().optional(),
});
export type ParentOnboardingInput = z.infer<typeof parentOnboardingSchema>;

export const createChildSchema = z.object({
  fullName: z.string().min(2),
  dateOfBirth: z.string().optional(),
  yearGroup: z.string().min(1),
  schoolName: z.string().optional(),
  curriculum: z.string().optional(),
  country: z.string().optional(),
  subjects: z.array(z.string()).default([]),
  learningGoals: z.array(z.string()).default([]),
});
export type CreateChildInput = z.infer<typeof createChildSchema>;

const qualificationSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  institution: z.string().optional(),
  year: z.number().int(),
  subject: z.string().optional(),
  documentName: z.string().optional(),
});

const availabilitySlotSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string(),
  endTime: z.string(),
});

export const tutorApplicationSchema = z.object({
  headline: z.string().min(5),
  bio: z.string().min(20),
  location: z.string().optional(),
  languages: z.array(z.string()).min(1),
  subjects: z.array(z.string()).min(1),
  yearLevels: z.array(z.string()).default([]),
  curricula: z.array(z.string()).default([]),
  yearsExperience: z.number().min(0),
  ageGroups: z.array(z.string()).default([]),
  qualifications: z.array(qualificationSchema).default([]),
  teachingStyle: z.string().min(1),
  lessonApproach: z.string().optional(),
  hourlyRate: z.number().positive(),
  currency: z.string().default("GBP"),
  trialLessonEnabled: z.boolean().default(false),
  trialLessonPrice: z.number().positive().optional(),
  availability: z.array(availabilitySlotSchema).default([]),
});
export type TutorApplicationInput = z.infer<typeof tutorApplicationSchema>;
