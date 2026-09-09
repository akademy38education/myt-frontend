import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Star, BadgeCheck } from "lucide-react";
import { OnboardingStepFooter } from "@/features/onboarding/components/OnboardingStepFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileUpload } from "@/components/ui/file-upload";
import { ToggleChip } from "@/components/shared/ToggleChip";
import { useTutorOnboardingStore } from "@/features/onboarding/tutor/store";
import { COUNTRIES, TIMEZONES, LANGUAGES } from "@/constants/tutoring";
import { initials } from "@/utils/formatters";
import { tutorStepPath } from "./steps";

const schema = z.object({
  headline: z.string().min(5, "Write a short, specific headline"),
  bio: z.string().min(20, "Tell students a bit more about you (20+ characters)"),
  location: z.string().optional(),
  timezone: z.string().min(1),
});
type FormInput = z.infer<typeof schema>;

export function TutorProfileStep() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useTutorOnboardingStore();
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string | undefined>(undefined);
  const [languages, setLanguages] = useState<string[]>(draft.languages ?? []);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      headline: draft.headline ?? "",
      bio: draft.bio ?? "",
      location: draft.location ?? "",
      timezone: "Europe/London",
    },
  });

  const values = watch();

  function handlePhotoChange(files: File[]) {
    setPhotoFiles(files);
    const file = files[0];
    if (!file) return setPhotoPreview(undefined);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function toggleLanguage(lang: string) {
    setLanguages((current) => (current.includes(lang) ? current.filter((l) => l !== lang) : [...current, lang]));
  }

  const onSubmit = handleSubmit((formValues) => {
    updateDraft({ headline: formValues.headline, bio: formValues.bio, location: formValues.location, languages });
    navigate(tutorStepPath("subjects"));
  });

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <Card>
        <CardContent className="p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">Build your professional profile</h1>
            <p className="mt-2 text-muted-foreground">This is what students and parents see first — make it count.</p>
          </div>

          <form onSubmit={onSubmit} noValidate className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={photoPreview} alt="" />
                <AvatarFallback>TU</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <FileUpload accept="image/*" files={photoFiles} onFilesChange={handlePhotoChange} maxSizeMb={5} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="headline">Professional headline</Label>
              <Input id="headline" placeholder="e.g. GCSE & A-Level Maths specialist" {...register("headline")} aria-invalid={Boolean(errors.headline)} />
              {errors.headline && <p className="text-sm text-destructive">{errors.headline.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bio">Biography</Label>
              <Textarea id="bio" rows={5} placeholder="Tell students about your teaching background and approach..." {...register("bio")} aria-invalid={Boolean(errors.bio)} />
              {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Location</Label>
                <Controller
                  control={control}
                  name="location"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
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
              <div className="space-y-1.5">
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

            <div className="space-y-2">
              <Label>Languages you teach in</Label>
              <div className="flex flex-wrap gap-2.5">
                {LANGUAGES.map((lang) => (
                  <ToggleChip key={lang} label={lang} selected={languages.includes(lang)} onToggle={() => toggleLanguage(lang)} />
                ))}
              </div>
            </div>

            <OnboardingStepFooter continueDisabled={languages.length === 0} />
          </form>
        </CardContent>
      </Card>

      {/* Live preview — updates as the tutor types, per the premium-UX requirement */}
      <div className="lg:sticky lg:top-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tutor profile preview</p>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src={photoPreview} alt="" />
                <AvatarFallback>{initials(values.headline || "New Tutor")}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold leading-tight">{values.headline || "Your professional headline"}</p>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="gap-1">
                    <BadgeCheck className="h-3 w-3" />
                    New tutor
                  </Badge>
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5" /> No reviews yet
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">About</p>
              <p className="mt-1 text-sm text-muted-foreground">{values.bio || "Your biography will appear here as you type."}</p>
            </div>
            {(values.location || languages.length > 0) && (
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                {values.location && <span>{values.location}</span>}
                {languages.length > 0 && <span>· Speaks {languages.join(", ")}</span>}
              </div>
            )}
          </CardContent>
        </Card>
        <p className="mt-2 text-xs text-muted-foreground">This is a preview — your profile won't go live until your application is approved.</p>
      </div>
    </div>
  );
}
