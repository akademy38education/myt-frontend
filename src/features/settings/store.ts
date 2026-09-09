import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  emailNotifications: boolean;
  lessonReminders: boolean;
  homeworkReminders: boolean;
  marketingEmails: boolean;
  profileVisibleToTutors: boolean;
  setPreference: (key: keyof Omit<SettingsState, "setPreference">, value: boolean) => void;
}

/** Account preferences — there's no backend `settings` module yet, so these are real, just local to this browser for now. */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      emailNotifications: true,
      lessonReminders: true,
      homeworkReminders: true,
      marketingEmails: false,
      profileVisibleToTutors: true,
      setPreference: (key, value) => set({ [key]: value } as Partial<SettingsState>),
    }),
    { name: "myt-settings" }
  )
);
