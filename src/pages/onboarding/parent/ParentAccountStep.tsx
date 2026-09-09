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
import { useParentOnboardingStore } from "@/features/onboarding/parent/store";
import { TIMEZONES } from "@/constants/tutoring";
import { initials } from "@/utils/formatters";
import { parentStepPath } from "./steps";

const schema = z.object({
  firstName: z.string().min(1, "Enter your first name"),
  lastName: z.string().min(1, "Enter your last name"),
  phone: z.string().optional(),
  timezone: z.string().min(1),
});
type FormInput = z.infer<typeof schema>;

export function ParentAccountStep() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { account, updateAccount } = useParentOnboardingStore();
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string | undefined>(account.avatarUrl);

  const [firstName = "", ...rest] = (account.fullName ?? user?.fullName ?? "").split(" ");
  const lastName = rest.join(" ");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: { firstName, lastName, phone: account.phone ?? "", timezone: account.timezone ?? "Europe/London" },
  });

  function handlePhotoChange(files: File[]) {
    setPhotoFiles(files);
    const file = files[0];
    if (!file) return setPhotoPreview(undefined);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  const onSubmit = handleSubmit((values) => {
    updateAccount({
      fullName: `${values.firstName} ${values.lastName}`.trim(),
      phone: values.phone,
      timezone: values.timezone,
      avatarUrl: photoPreview,
      billingEmail: user?.email,
    });
    navigate(parentStepPath("children"));
  });

  return (
    <OnboardingStepCard title="Set up your family account" description="We'll use this to keep you updated on every child you add.">
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
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user?.email ?? ""} disabled />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" placeholder="Optional" {...register("phone")} />
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

        <OnboardingStepFooter />
      </form>
    </OnboardingStepCard>
  );
}
