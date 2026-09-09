import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { OnboardingStepCard } from "@/features/onboarding/components/OnboardingStepCard";
import { OnboardingStepFooter } from "@/features/onboarding/components/OnboardingStepFooter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { useAuth } from "@/hooks/useAuth";
import { useStudentOnboardingStore } from "@/features/onboarding/student/store";
import { COUNTRIES, TIMEZONES } from "@/constants/tutoring";
import { initials } from "@/utils/formatters";
import { studentStepPath } from "./steps";

const schema = z.object({
  firstName: z.string().min(1, "Enter your first name"),
  lastName: z.string().min(1, "Enter your last name"),
  dateOfBirth: z.string().min(1, "Enter your date of birth"),
  country: z.string().min(1, "Select your country"),
  timezone: z.string().min(1, "Select your timezone"),
});
type FormInput = z.infer<typeof schema>;

export function StudentBasicInfoStep() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { draft, updateDraft } = useStudentOnboardingStore();
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string | undefined>(draft.avatarUrl);

  const [firstName = "", ...rest] = (draft.fullName ?? user?.fullName ?? "").split(" ");
  const lastName = rest.join(" ");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName,
      lastName,
      dateOfBirth: draft.dateOfBirth ?? "",
      country: draft.country ?? "United Kingdom",
      timezone: draft.timezone ?? "Europe/London",
    },
  });

  function handlePhotoChange(files: File[]) {
    setPhotoFiles(files);
    const file = files[0];
    if (!file) {
      setPhotoPreview(undefined);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  const onSubmit = handleSubmit((values) => {
    updateDraft({
      fullName: `${values.firstName} ${values.lastName}`.trim(),
      dateOfBirth: values.dateOfBirth,
      country: values.country,
      timezone: values.timezone,
      avatarUrl: photoPreview,
    });
    navigate(studentStepPath("education"));
  });

  return (
    <OnboardingStepCard title="Let's get to know you" description="This helps tutors and your parent (if linked) recognise your profile.">
      <form onSubmit={onSubmit} noValidate>
        <div className="mb-6 flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={photoPreview} alt="" />
            <AvatarFallback>{initials(`${firstName} ${lastName}`.trim() || "You")}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <FileUpload accept="image/*" files={photoFiles} onFilesChange={handlePhotoChange} maxSizeMb={5} />
            {photoPreview && (
              <Button type="button" variant="ghost" size="sm" className="mt-1" onClick={() => handlePhotoChange([])}>
                Remove photo
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" {...register("firstName")} aria-invalid={Boolean(errors.firstName)} />
            {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" {...register("lastName")} aria-invalid={Boolean(errors.lastName)} />
            {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dateOfBirth">Date of birth</Label>
            <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} aria-invalid={Boolean(errors.dateOfBirth)} />
            {errors.dateOfBirth && <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>}
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
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Timezone</Label>
            <Controller
              control={control}
              name="timezone"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <OnboardingStepFooter continueLabel="Continue" />
      </form>
    </OnboardingStepCard>
  );
}
