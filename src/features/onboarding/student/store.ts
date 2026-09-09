import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StudentOnboardingInput } from "@myt/shared";

interface StudentOnboardingState {
  draft: StudentOnboardingInput;
  diagnosticChoice: "taken" | "skipped" | null;
  updateDraft: (patch: Partial<StudentOnboardingInput>) => void;
  setDiagnosticChoice: (choice: "taken" | "skipped") => void;
  reset: () => void;
}

/**
 * Client-side draft for the student onboarding wizard — explicitly allowed
 * to be local/mock persistence during this phase (see rule 35 in the
 * product brief); the real, durable write happens once, via
 * `studentsService.saveOnboardingStep`, when the final step completes.
 * Persisted to localStorage so refreshing mid-flow never loses answers.
 */
export const useStudentOnboardingStore = create<StudentOnboardingState>()(
  persist(
    (set) => ({
      draft: { subjects: [], learningGoals: [] },
      diagnosticChoice: null,
      updateDraft: (patch) => set((state) => ({ draft: { ...state.draft, ...patch } })),
      setDiagnosticChoice: (choice) => set({ diagnosticChoice: choice }),
      reset: () => set({ draft: { subjects: [], learningGoals: [] }, diagnosticChoice: null }),
    }),
    { name: "myt-onboarding-student" }
  )
);
