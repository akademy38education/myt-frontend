import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingStepCard } from "@/features/onboarding/components/OnboardingStepCard";
import { OnboardingStepFooter } from "@/features/onboarding/components/OnboardingStepFooter";
import { ToggleChip } from "@/components/shared/ToggleChip";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStudentOnboardingStore } from "@/features/onboarding/student/store";
import { TEACHING_STYLES, AVAILABILITY_OPTIONS, LANGUAGES } from "@/constants/tutoring";
import { studentStepPath } from "./steps";

export function StudentPreferencesStep() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useStudentOnboardingStore();
  const pref = draft.tutorPreference ?? {};

  const [teachingStyle, setTeachingStyle] = useState(pref.teachingStyle ?? "");
  const [lessonFormat, setLessonFormat] = useState<"online" | "in-person" | "either">(pref.lessonFormat ?? "either");
  const [availability, setAvailability] = useState<string[]>(pref.preferredAvailability ?? []);
  const [budget, setBudget] = useState(pref.budgetPerHour?.toString() ?? "");
  const [genderPreference, setGenderPreference] = useState<"male" | "female" | "no-preference">(pref.tutorGenderPreference ?? "no-preference");
  const [languages, setLanguages] = useState<string[]>(pref.languagePreferences ?? ["English"]);

  function toggleAvailability(option: string) {
    setAvailability((current) => (current.includes(option) ? current.filter((o) => o !== option) : [...current, option]));
  }

  function toggleLanguage(lang: string) {
    setLanguages((current) => (current.includes(lang) ? current.filter((l) => l !== lang) : [...current, lang]));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateDraft({
      tutorPreference: {
        teachingStyle: teachingStyle || undefined,
        lessonFormat,
        preferredAvailability: availability,
        budgetPerHour: budget ? Number(budget) : undefined,
        tutorGenderPreference: genderPreference,
        languagePreferences: languages,
      },
    });
    navigate(studentStepPath("diagnostic"));
  }

  return (
    <OnboardingStepCard title="What kind of tutor works best for you?" description="This is just a starting point — you can always change your mind later.">
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div className="space-y-1.5">
          <Label>Preferred tutor style</Label>
          <Select value={teachingStyle} onValueChange={setTeachingStyle}>
            <SelectTrigger>
              <SelectValue placeholder="No strong preference" />
            </SelectTrigger>
            <SelectContent>
              {TEACHING_STYLES.map((style) => (
                <SelectItem key={style} value={style}>
                  {style}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Preferred lesson format</Label>
          <RadioGroup value={lessonFormat} onValueChange={(v) => setLessonFormat(v as typeof lessonFormat)} className="grid grid-cols-3 gap-3">
            {[
              { value: "online", label: "Online" },
              { value: "in-person", label: "In person" },
              { value: "either", label: "Either" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-border p-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <RadioGroupItem value={option.value} />
                {option.label}
              </label>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Preferred availability</Label>
          <div className="flex flex-wrap gap-2.5">
            {AVAILABILITY_OPTIONS.map((option) => (
              <ToggleChip key={option} label={option} selected={availability.includes(option)} onToggle={() => toggleAvailability(option)} />
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="budget">Budget (£ per hour)</Label>
          <Input id="budget" type="number" min={0} placeholder="e.g. 35" value={budget} onChange={(e) => setBudget(e.target.value)} className="max-w-[10rem]" />
        </div>

        <div className="space-y-2">
          <Label>Tutor gender preference</Label>
          <RadioGroup value={genderPreference} onValueChange={(v) => setGenderPreference(v as typeof genderPreference)} className="grid grid-cols-3 gap-3">
            {[
              { value: "no-preference", label: "No preference" },
              { value: "female", label: "Female" },
              { value: "male", label: "Male" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-border p-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <RadioGroupItem value={option.value} />
                {option.label}
              </label>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Languages you're comfortable learning in</Label>
          <div className="flex flex-wrap gap-2.5">
            {LANGUAGES.map((lang) => (
              <ToggleChip key={lang} label={lang} selected={languages.includes(lang)} onToggle={() => toggleLanguage(lang)} />
            ))}
          </div>
        </div>

        <OnboardingStepFooter onBack={() => navigate(studentStepPath("goals"))} />
      </form>
    </OnboardingStepCard>
  );
}
