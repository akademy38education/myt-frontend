/**
 * Shared vocabulary used by both tutor search filters and onboarding
 * (student subject/preference selection, tutor application) — centralized
 * so the two never drift apart (e.g. a tutor picking a teaching style that
 * a student could never filter by).
 */
export const YEAR_LEVELS = ["Key Stage 3", "GCSE", "A-Level"];
export const YEAR_GROUPS = ["Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12", "Year 13"];
export const CURRICULA = ["AQA", "Edexcel", "OCR"];
export const TEACHING_STYLES = ["Structured", "Exam-focused", "Interactive", "Patient & supportive"];
export const LANGUAGES = ["English", "Spanish", "French", "Mandarin", "Arabic", "Portuguese"];
export const AGE_GROUPS = ["Primary (5-11)", "Key Stage 3 (11-14)", "GCSE (14-16)", "A-Level (16-18)", "Adult learners"];
export const LESSON_FORMATS: Array<{ value: "online" | "in-person" | "either"; label: string }> = [
  { value: "online", label: "Online" },
  { value: "in-person", label: "In person" },
  { value: "either", label: "Either" },
];

export const LEARNING_GOALS = [
  "Improve my grades",
  "Prepare for an exam",
  "Understand difficult topics",
  "Build confidence",
  "Complete homework",
  "Catch up",
  "Get ahead",
  "Other",
];

export const AVAILABILITY_OPTIONS = ["Weekday mornings", "Weekday afternoons", "Weekday evenings", "Weekends"];

export const COUNTRIES =["United Kingdom", "Ireland", "United States", "Canada", "Australia", "United Arab Emirates", "Singapore"];

export const TIMEZONES = [
  "Europe/London",
  "Europe/Dublin",
  "America/New_York",
  "America/Los_Angeles",
  "America/Toronto",
  "Australia/Sydney",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Kolkata",
];
