import { useEffect, useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/ui/progress";
import { toast } from "sonner";
import { useCurrentTutorProfile, useUpdateTutorProfile } from "@/features/tutors";
import { TutorVerificationStatus } from "@myt/shared";

const VERIFICATION_LABEL: Record<TutorVerificationStatus, string> = {
  [TutorVerificationStatus.APPROVED]: "Verified",
  [TutorVerificationStatus.PENDING]: "Pending verification",
  [TutorVerificationStatus.IN_REVIEW]: "In review",
  [TutorVerificationStatus.REJECTED]: "Action required",
  [TutorVerificationStatus.UNSUBMITTED]: "Not submitted",
};

function verificationVariant(status: TutorVerificationStatus): "success" | "warning" | "destructive" | "muted" {
  if (status === TutorVerificationStatus.APPROVED) return "success";
  if (status === TutorVerificationStatus.REJECTED) return "destructive";
  if (status === TutorVerificationStatus.PENDING || status === TutorVerificationStatus.IN_REVIEW) return "warning";
  return "muted";
}

export function TutorProfilePage() {
  const { tutorId, data: tutor, isLoading, isError, refetch } = useCurrentTutorProfile();
  const updateProfile = useUpdateTutorProfile(tutorId);

  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [lessonApproach, setLessonApproach] = useState("");
  const [teachingStyle, setTeachingStyle] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [subjects, setSubjects] = useState("");
  const [languages, setLanguages] = useState("");

  useEffect(() => {
    if (!tutor) return;
    setHeadline(tutor.headline);
    setBio(tutor.bio);
    setLessonApproach(tutor.lessonApproach ?? "");
    setTeachingStyle(tutor.teachingStyle);
    setHourlyRate(String(tutor.hourlyRate));
    setYearsExperience(String(tutor.yearsExperience));
    setSubjects(tutor.subjects.join(", "));
    setLanguages(tutor.languages.join(", "));
  }, [tutor]);

  const completeness = useMemo(() => {
    if (!tutor) return { percent: 0, missing: [] as string[] };
    const checks: Array<[boolean, string]> = [
      [Boolean(tutor.avatarUrl), "Add a profile photo"],
      [tutor.bio.length > 40, "Write a fuller bio"],
      [Boolean(tutor.lessonApproach), "Describe your teaching style"],
      [(tutor.qualifications ?? []).length > 0, "Add qualifications"],
      [tutor.subjects.length > 0, "Add subjects you teach"],
      [tutor.languages.length > 0, "Add languages you speak"],
      [tutor.hourlyRate > 0, "Set your hourly rate"],
    ];
    const met = checks.filter(([ok]) => ok).length;
    return { percent: Math.round((met / checks.length) * 100), missing: checks.filter(([ok]) => !ok).map(([, label]) => label) };
  }, [tutor]);

  function handleSave() {
    updateProfile.mutate(
      {
        headline: headline.trim(),
        bio: bio.trim(),
        lessonApproach: lessonApproach.trim() || undefined,
        teachingStyle: teachingStyle.trim(),
        hourlyRate: Number(hourlyRate) || tutor?.hourlyRate,
        yearsExperience: Number(yearsExperience) || tutor?.yearsExperience,
        subjects: subjects.split(",").map((s) => s.trim()).filter(Boolean),
        languages: languages.split(",").map((s) => s.trim()).filter(Boolean),
      },
      { onSuccess: () => toast.success("Profile updated") }
    );
  }

  if (!tutorId || isLoading) return <LoadingState label="Loading your profile..." />;
  if (isError || !tutor) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="My Profile"
        description="How students see you on MyT."
        actions={
          <Button variant="outline" asChild>
            <a href={`/tutors/${tutor.id}`} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4" />
              Preview public profile
            </a>
          </Button>
        }
      />

      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-4">
            <ProgressRing value={completeness.percent} />
            <div>
              <p className="font-semibold">Profile completeness</p>
              {completeness.missing.length > 0 ? (
                <p className="text-sm text-muted-foreground">{completeness.missing[0]}</p>
              ) : (
                <p className="text-sm text-success">Your profile is complete!</p>
              )}
            </div>
          </div>
          <Badge variant={verificationVariant(tutor.verificationStatus)}>{VERIFICATION_LABEL[tutor.verificationStatus]}</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="headline">Headline</Label>
            <Input id="headline" value={headline} onChange={(e) => setHeadline(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={5} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="approach">Teaching approach</Label>
            <Textarea id="approach" value={lessonApproach} onChange={(e) => setLessonApproach(e.target.value)} rows={3} className="mt-1.5" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="teachingStyle">Teaching style</Label>
              <Input id="teachingStyle" value={teachingStyle} onChange={(e) => setTeachingStyle(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="rate">Hourly rate ({tutor.currency})</Label>
              <Input id="rate" type="number" min={0} value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="experience">Years of experience</Label>
              <Input id="experience" type="number" min={0} value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)} className="mt-1.5" />
            </div>
          </div>
          <div>
            <Label htmlFor="subjects">Subjects (comma-separated ids)</Label>
            <Input id="subjects" value={subjects} onChange={(e) => setSubjects(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="languages">Languages</Label>
            <Input id="languages" value={languages} onChange={(e) => setLanguages(e.target.value)} className="mt-1.5" />
          </div>

          {tutor.qualifications && tutor.qualifications.length > 0 && (
            <div>
              <Label>Qualifications</Label>
              <div className="mt-1.5 space-y-1.5">
                {tutor.qualifications.map((q) => (
                  <div key={q.id} className="rounded-md border border-border p-2.5 text-sm">
                    <p className="font-medium">{q.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {q.institution} · {q.year}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button onClick={handleSave} disabled={updateProfile.isPending}>
            Save changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
