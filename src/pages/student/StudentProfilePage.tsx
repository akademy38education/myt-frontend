import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileUpload } from "@/components/ui/file-upload";
import { ToggleChip } from "@/components/shared/ToggleChip";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentStudentProfile, useSaveStudentOnboarding } from "@/features/students";
import { SUBJECTS } from "@/constants/subjects";
import { LEARNING_GOALS, COUNTRIES, TIMEZONES, YEAR_GROUPS, CURRICULA } from "@/constants/tutoring";
import { initials } from "@/utils/formatters";

export function StudentProfilePage() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useCurrentStudentProfile();
  const saveProfile = useSaveStudentOnboarding();

  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("United Kingdom");
  const [timezone, setTimezone] = useState("Europe/London");
  const [yearGroup, setYearGroup] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [curriculum, setCurriculum] = useState("AQA");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!profile) return;
    setFullName(profile.fullName ?? user?.fullName ?? "");
    setCountry(profile.country ?? "United Kingdom");
    setTimezone(profile.timezone ?? "Europe/London");
    setYearGroup(profile.yearGroup ?? "");
    setSchoolName(profile.schoolName ?? "");
    setCurriculum(profile.curriculum ?? "AQA");
    setSubjects(profile.subjects ?? []);
    setGoals(profile.learningGoals ?? []);
    setPhotoPreview(profile.avatarUrl);
  }, [profile, user]);

  function handlePhotoChange(files: File[]) {
    setPhotoFiles(files);
    const file = files[0];
    if (!file) return setPhotoPreview(undefined);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  async function handleSave() {
    if (!user) return;
    try {
      await saveProfile.mutateAsync({
        studentUserId: user.id,
        input: { fullName, country, timezone, yearGroup, schoolName, curriculum, subjects, learningGoals: goals, avatarUrl: photoPreview },
        completeOnboarding: true,
      });
      toast.success("Profile updated");
    } catch {
      toast.error("We couldn't save your profile. Please try again.");
    }
  }

  if (isLoading) return <LoadingState label="Loading your profile..." />;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="My Profile" description="Keep your details up to date so tutors and lessons fit you well." />

      <Card>
        <CardContent className="space-y-6 p-6">
          <div>
            <h2 className="mb-3 font-semibold">Personal information</h2>
            <div className="mb-4 flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={photoPreview} alt="" />
                <AvatarFallback>{initials(fullName || "You")}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <FileUpload accept="image/*" files={photoFiles} onFilesChange={handlePhotoChange} maxSizeMb={5} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user?.email ?? ""} disabled />
              </div>
              <div className="space-y-1.5">
                <Label>Country</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-3 font-semibold">Education</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Year group</Label>
                <Select value={yearGroup} onValueChange={setYearGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year group" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEAR_GROUPS.map((y) => (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="schoolName">School</Label>
                <Input id="schoolName" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Curriculum</Label>
                <Select value={curriculum} onValueChange={setCurriculum}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRICULA.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-3 font-semibold">Subjects</h2>
            <div className="flex flex-wrap gap-2.5">
              {SUBJECTS.map((s) => (
                <ToggleChip key={s.id} label={s.name} selected={subjects.includes(s.id)} onToggle={() => toggle(subjects, setSubjects, s.id)} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-3 font-semibold">Goals</h2>
            <div className="flex flex-wrap gap-2.5">
              {LEARNING_GOALS.map((g) => (
                <ToggleChip key={g} label={g} selected={goals.includes(g)} onToggle={() => toggle(goals, setGoals, g)} />
              ))}
            </div>
          </div>

          <div className="flex justify-end border-t border-border pt-4">
            <Button onClick={handleSave} isLoading={saveProfile.isPending}>
              <Save className="h-4 w-4" />
              Save changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
