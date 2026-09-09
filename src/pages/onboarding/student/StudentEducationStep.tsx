import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { OnboardingStepCard } from "@/features/onboarding/components/OnboardingStepCard";
import { OnboardingStepFooter } from "@/features/onboarding/components/OnboardingStepFooter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStudentOnboardingStore } from "@/features/onboarding/student/store";
import { YEAR_GROUPS, CURRICULA, COUNTRIES } from "@/constants/tutoring";
import { studentStepPath } from "./steps";

const schema = z.object({
  yearGroup: z.string().min(1, "Select your year group"),
  schoolName: z.string().optional(),
  curriculum: z.string().min(1, "Select your curriculum"),
  country: z.string().min(1),
});
type FormInput = z.infer<typeof schema>;

export function StudentEducationStep() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useStudentOnboardingStore();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      yearGroup: draft.yearGroup ?? "",
      schoolName: draft.schoolName ?? "",
      curriculum: draft.curriculum ?? "AQA",
      country: draft.country ?? "United Kingdom",
    },
  });

  const onSubmit = handleSubmit((values) => {
    updateDraft(values);
    navigate(studentStepPath("subjects"));
  });

  return (
    <OnboardingStepCard title="Tell us about your education" description="This helps us match you with tutors who know your syllabus.">
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <div className="space-y-1.5">
          <Label>Year / Grade</Label>
          <Controller
            control={control}
            name="yearGroup"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger aria-invalid={Boolean(errors.yearGroup)}>
                  <SelectValue placeholder="Select your year group" />
                </SelectTrigger>
                <SelectContent>
                  {YEAR_GROUPS.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.yearGroup && <p className="text-sm text-destructive">{errors.yearGroup.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="schoolName">School / Institution</Label>
          <Input id="schoolName" placeholder="e.g. Riverside Academy" {...register("schoolName")} />
        </div>

        <div className="space-y-1.5">
          <Label>Curriculum</Label>
          <Controller
            control={control}
            name="curriculum"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger aria-invalid={Boolean(errors.curriculum)}>
                  <SelectValue placeholder="Select curriculum" />
                </SelectTrigger>
                <SelectContent>
                  {CURRICULA.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.curriculum && <p className="text-sm text-destructive">{errors.curriculum.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Country</Label>
          <Controller
            control={control}
            name="country"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <OnboardingStepFooter onBack={() => navigate(studentStepPath("basic-info"))} />
      </form>
    </OnboardingStepCard>
  );
}
