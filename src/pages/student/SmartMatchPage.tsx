import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectableCard } from "@/components/shared/SelectableCard";
import { ToggleChip } from "@/components/shared/ToggleChip";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { TutorCard, MatchScore, MatchReasonsList, getMarketplaceContext, tutorProfilePath } from "@/features/tutor-search";
import { BookingDialog } from "@/features/bookings";
import { useSmartMatchRecommendations } from "@/features/smart-match";
import { useCurrentStudentProfile } from "@/features/students";
import { SUBJECTS } from "@/constants/subjects";
import { LEARNING_GOALS, AVAILABILITY_OPTIONS, TEACHING_STYLES, YEAR_LEVELS } from "@/constants/tutoring";
import type { TutorProfile } from "@myt/shared";

const STEPS = ["subject", "goal", "level", "availability", "style", "budget", "results"] as const;
type Step = (typeof STEPS)[number];
const STEP_LABELS: Record<Exclude<Step, "results">, string> = {
  subject: "Subject",
  goal: "Goal",
  level: "Level",
  availability: "Availability",
  style: "Preferences",
  budget: "Budget",
};

const FACTORS = ["Subject compatibility", "Year level", "Teaching style", "Availability", "Learning goals", "Budget"];

export function SmartMatchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const context = getMarketplaceContext(location.pathname);
  const { data: studentProfile } = useCurrentStudentProfile();

  const [step, setStep] = useState<Step>("subject");
  const [subjectId, setSubjectId] = useState<string | undefined>();
  const [goal, setGoal] = useState<string | undefined>();
  const [yearLevel, setYearLevel] = useState<string | undefined>();
  const [availability, setAvailability] = useState<string[]>([]);
  const [teachingStyle, setTeachingStyle] = useState<string | undefined>();
  const [budget, setBudget] = useState("");
  const [bookingTutor, setBookingTutor] = useState<TutorProfile | null>(null);

  // Personalisation (Phase 5 spec §24) — prefill from the student's own
  // saved onboarding preferences rather than duplicating that data here.
  useEffect(() => {
    if (!studentProfile) return;
    if (!subjectId && studentProfile.subjects[0]) setSubjectId(studentProfile.subjects[0]);
    if (!teachingStyle && studentProfile.tutorPreference?.teachingStyle) setTeachingStyle(studentProfile.tutorPreference.teachingStyle);
    if (availability.length === 0 && studentProfile.tutorPreference?.preferredAvailability?.length) {
      setAvailability(studentProfile.tutorPreference.preferredAvailability);
    }
    if (!budget && studentProfile.tutorPreference?.budgetPerHour) setBudget(String(studentProfile.tutorPreference.budgetPerHour));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentProfile]);

  const recommendations = useSmartMatchRecommendations();
  const stepIndex = STEPS.indexOf(step);
  const subjectName = SUBJECTS.find((s) => s.id === subjectId)?.name;

  function goNext(next: Step) {
    setStep(next);
  }

  async function handleFindMatches() {
    setStep("results");
    await recommendations.mutateAsync({
      subjectId: subjectId!,
      goal: goal ?? "",
      yearLevel,
      availability,
      teachingStyle,
      budgetPerHour: budget ? Number(budget) : undefined,
    });
  }

  function toggleAvailability(option: string) {
    setAvailability((current) => (current.includes(option) ? current.filter((o) => o !== option) : [...current, option]));
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate(context === "public" ? "/find-tutor" : `/${context}/find-tutor`)}>
        <ArrowLeft className="h-4 w-4" />
        Back to search
      </Button>

      {step !== "results" && (
        <div className="mb-6">
          <div className="flex items-center gap-1.5">
            {STEPS.slice(0, -1).map((s, i) => (
              <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= stepIndex ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
          <p className="mt-2 text-xs font-medium text-muted-foreground">
            Step {stepIndex + 1} of {STEPS.length - 1} · {STEP_LABELS[step as Exclude<Step, "results">]}
          </p>
        </div>
      )}

      <div key={step} className="animate-in fade-in slide-in-from-right-2 duration-300">
        {step === "subject" && (
          <Card>
            <CardContent className="p-6">
              <h1 className="mb-4 text-xl font-semibold">What would you like help with?</h1>
              <div className="grid gap-3 sm:grid-cols-2">
                {SUBJECTS.slice(0, 6).map((subject) => (
                  <SelectableCard key={subject.id} icon={subject.icon} title={subject.name} selected={subjectId === subject.id} onSelect={() => setSubjectId(subject.id)} />
                ))}
              </div>
              <Button className="mt-6 w-full" disabled={!subjectId} onClick={() => goNext("goal")}>
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "goal" && (
          <Card>
            <CardContent className="p-6">
              <h1 className="mb-1 text-xl font-semibold">Great choice.</h1>
              <p className="mb-4 text-sm text-muted-foreground">{subjectName} is selected. What are you trying to achieve?</p>
              <div className="flex flex-wrap gap-2.5">
                {LEARNING_GOALS.map((g) => (
                  <ToggleChip key={g} label={g} selected={goal === g} onToggle={() => setGoal(g)} />
                ))}
              </div>
              <Button className="mt-6 w-full" disabled={!goal} onClick={() => goNext("level")}>
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "level" && (
          <Card>
            <CardContent className="p-6">
              <h1 className="mb-4 text-xl font-semibold">What level are you studying?</h1>
              <div className="flex flex-wrap gap-2.5">
                {YEAR_LEVELS.map((level) => (
                  <ToggleChip key={level} label={level} selected={yearLevel === level} onToggle={() => setYearLevel(level)} />
                ))}
              </div>
              <Button className="mt-6 w-full" disabled={!yearLevel} onClick={() => goNext("availability")}>
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "availability" && (
          <Card>
            <CardContent className="p-6">
              <h1 className="mb-4 text-xl font-semibold">When would you like lessons?</h1>
              <div className="flex flex-wrap gap-2.5">
                {AVAILABILITY_OPTIONS.map((option) => (
                  <ToggleChip key={option} label={option} selected={availability.includes(option)} onToggle={() => toggleAvailability(option)} />
                ))}
              </div>
              <Button className="mt-6 w-full" disabled={availability.length === 0} onClick={() => goNext("style")}>
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "style" && (
          <Card>
            <CardContent className="p-6">
              <h1 className="mb-4 text-xl font-semibold">What kind of tutor works best for you?</h1>
              <div className="grid gap-3 sm:grid-cols-2">
                {TEACHING_STYLES.map((style) => (
                  <SelectableCard key={style} title={style} selected={teachingStyle === style} onSelect={() => setTeachingStyle(style)} />
                ))}
              </div>
              <Button className="mt-6 w-full" disabled={!teachingStyle} onClick={() => goNext("budget")}>
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "budget" && (
          <Card>
            <CardContent className="p-6">
              <h1 className="mb-4 text-xl font-semibold">What's your preferred budget?</h1>
              <p className="mb-3 text-sm text-muted-foreground">Maximum hourly rate you'd like to pay (optional).</p>
              <Input type="number" min={0} placeholder="e.g. 40" value={budget} onChange={(e) => setBudget(e.target.value)} className="max-w-[10rem]" />
              <Button className="mt-6 w-full" onClick={handleFindMatches}>
                <Sparkles className="h-4 w-4" />
                Find My Match
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "results" && (
          <div>
            {recommendations.isPending && (
              <Card>
                <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
                  <Sparkles className="h-8 w-8 animate-pulse text-primary" />
                  <p className="font-semibold">Finding your best matches...</p>
                  <ul className="w-full max-w-xs space-y-2 text-left text-sm">
                    {FACTORS.map((factor, i) => (
                      <li
                        key={factor}
                        className="flex items-center gap-2 text-muted-foreground opacity-0 animate-in fade-in slide-in-from-left-1"
                        style={{ animationDelay: `${i * 200}ms`, animationFillMode: "forwards", animationDuration: "400ms" }}
                      >
                        <Check className="h-4 w-4 shrink-0 text-success" />
                        {factor}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {recommendations.isError && (
              <ErrorState title="Couldn't find matches" description="Something went wrong finding tutors for you." onRetry={handleFindMatches} />
            )}

            {recommendations.data && (
              <>
                <h1 className="text-xl font-semibold">Your best matches</h1>
                <p className="mb-4 mt-1 text-sm text-muted-foreground">
                  Based on what you told us, these tutors look like a strong fit. {recommendations.data.length} tutor{recommendations.data.length === 1 ? "" : "s"} matched your preferences.
                </p>
                {recommendations.data.length === 0 ? (
                  <EmptyState title="No matches found" description="Try a different subject or a higher budget." actionLabel="Start again" onAction={() => setStep("subject")} />
                ) : (
                  <div className="space-y-5">
                    {recommendations.data.map(({ tutor, matchScore, matchReasons }, index) => (
                      <Card key={tutor.id}>
                        <CardContent className="space-y-3 p-5">
                          <div className="flex items-center justify-between">
                            {index === 0 && <span className="text-xs font-semibold uppercase tracking-wide text-primary">Best match</span>}
                            <MatchScore score={matchScore} size="lg" className={index === 0 ? "" : "ml-auto"} />
                          </div>
                          <TutorCard tutor={tutor} onViewProfile={(t) => navigate(tutorProfilePath(context, t.id))} onBook={setBookingTutor} />
                          <div>
                            <p className="mb-1.5 text-sm font-medium">Why {tutor.headline.split(/[—,]/)[0]} matches:</p>
                            <MatchReasonsList reasons={matchReasons} />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <BookingDialog tutor={bookingTutor} onOpenChange={(open) => !open && setBookingTutor(null)} />
    </div>
  );
}
