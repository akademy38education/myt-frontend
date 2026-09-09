import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Award, BookOpen, Briefcase, Clock, GraduationCap, Heart, Languages, MessageSquare, Star, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { TutorProfile } from "@myt/shared";
import { UserRole } from "@myt/shared";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/shared/StatCard";
import { LoadingState } from "@/components/shared/LoadingState";
import { NotFoundState } from "@/components/shared/NotFoundState";
import { tutorsService, TutorProfileError } from "@/features/tutors";
import { getTrustBadges, getMarketplaceContext, tutorProfilePath, findTutorPath } from "@/features/tutor-search";
import { ReviewsSection } from "@/features/tutor-reviews";
import { AvailabilityPicker, type SelectedSlot } from "@/features/tutor-availability";
import { useSavedTutors, useToggleSavedTutor } from "@/features/saved-tutors";
import { BookingDialog } from "@/features/bookings";
import { mockConversations } from "@/mocks";
import { SUBJECTS } from "@/constants/subjects";
import { initials, formatCurrency } from "@/utils/formatters";
import { trackEvent } from "@/utils/analytics";
import { useAuth } from "@/hooks/useAuth";

type Tab = "overview" | "reviews" | "availability";

export function TutorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const context = getMarketplaceContext(location.pathname);
  const isFullExperience = context !== "public";

  const [bookingTutor, setBookingTutor] = useState<TutorProfile | null>(null);
  const [bookingSlot, setBookingSlot] = useState<SelectedSlot | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | undefined>(undefined);

  const { data: tutor, isLoading, isError, refetch } = useQuery({
    queryKey: ["tutors", id],
    queryFn: () => tutorsService.getById(id!),
    enabled: Boolean(id),
  });

  const savedTutors = useSavedTutors();
  const toggleSaved = useToggleSavedTutor();

  useEffect(() => {
    if (tutor) trackEvent("tutor_profile_viewed", { tutorId: tutor.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutor?.id]);

  const activeTab: Tab = location.pathname.endsWith("/reviews") ? "reviews" : location.pathname.endsWith("/availability") ? "availability" : "overview";

  if (isLoading) return <LoadingState label="Loading tutor profile..." />;
  if (isError) return <TutorProfileError onRetry={() => refetch()} />;
  if (!tutor) return <NotFoundState />;

  const badges = getTrustBadges(tutor);
  const subjectNames = tutor.subjects.map((sid) => SUBJECTS.find((s) => s.id === sid)?.name ?? sid);
  const conversation = mockConversations.find((c) => c.participantId === tutor.userId);
  const isSaved = savedTutors.data?.some((t) => t.id === tutor.id) ?? false;
  const basePath = tutorProfilePath(context, tutor.id);

  function handleTabChange(tab: Tab) {
    navigate(tab === "overview" ? basePath : `${basePath}/${tab}`);
  }

  /**
   * The dedicated per-role booking pages (`BookTutorPage`/`ParentBookTutorPage`,
   * at `/student/tutors/:id/book` and `/parent/tutors/:id/book`) are what
   * actually carry the real payment step for a parent (and the correct,
   * honest no-in-app-payment-yet flow for a self-booking student) — this
   * profile page's "Book a Lesson" CTA previously opened a generic
   * `BookingDialog` instead, which skipped that entirely regardless of role.
   * Routing here instead of opening the dialog means every real booking now
   * goes through the same payment-aware wizard those pages already have.
   */
  function goToBookingPage(slot?: SelectedSlot) {
    if (!isAuthenticated) {
      setBookingSlot(slot);
      setBookingTutor(tutor ?? null);
      return;
    }
    const rolePrefix = user?.role === UserRole.PARENT ? "parent" : "student";
    const query = slot ? `?date=${encodeURIComponent(slot.date)}&time=${encodeURIComponent(slot.time)}` : "";
    navigate(`/${rolePrefix}/tutors/${tutor!.id}/book${query}`);
  }

  function handleBookSelectedSlot() {
    goToBookingPage(selectedSlot);
  }

  function handleBack() {
    if (context === "public") navigate(findTutorPath(context));
    else navigate(-1);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Button variant="ghost" size="sm" className="mb-4" onClick={handleBack}>
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <Card className="mb-6 overflow-hidden">
        <div className="bg-gradient-brand p-6 text-white">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <Avatar className="h-20 w-20 border-4 border-white/30">
              <AvatarFallback className="bg-white/20 text-lg text-white">{initials(tutor.headline)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-xl font-semibold">{tutor.headline}</h1>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                {badges.map((badge) => (
                  <Badge key={badge.key} className="border-white/30 bg-white/15 text-white">
                    {badge.label}
                  </Badge>
                ))}
                <span className="flex items-center gap-1 text-sm">
                  <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                  {tutor.rating.toFixed(1)} ({tutor.reviewCount} reviews)
                </span>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-2xl font-bold">{formatCurrency(tutor.hourlyRate, tutor.currency)}/hr</p>
              {tutor.trialLessonEnabled && <p className="text-xs text-white/85">Trial from {formatCurrency(tutor.trialLessonPrice ?? 0, tutor.currency)}</p>}
            </div>
          </div>
        </div>
        <CardContent className="flex flex-col gap-3 p-5 sm:flex-row">
          <Button className="flex-1" onClick={() => goToBookingPage()}>
            Book a Lesson
          </Button>
          {isFullExperience && (
            <>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => (conversation ? navigate(`/${context}/messages`) : toast.info("You'll be able to message this tutor once you've booked a lesson."))}
              >
                <MessageSquare className="h-4 w-4" />
                Message
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label={isSaved ? "Remove from saved tutors" : "Save tutor"}
                aria-pressed={isSaved}
                onClick={() => {
                  if (!isAuthenticated) {
                    toast.info("Sign in to save tutors.");
                    return;
                  }
                  toggleSaved.mutate({ tutorId: tutor.id, isSaved });
                }}
              >
                <Heart className={isSaved ? "h-4 w-4 fill-destructive text-destructive" : "h-4 w-4"} />
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={(v) => handleTabChange(v as Tab)}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({tutor.reviewCount})</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-2 font-semibold">About {tutor.headline.split(/[—,]/)[0]}</h2>
              <p className="text-sm text-muted-foreground">{tutor.bio}</p>
              {tutor.lessonApproach && (
                <>
                  <h3 className="mb-1.5 mt-4 text-sm font-medium">What to expect in a lesson</h3>
                  <p className="text-sm text-muted-foreground">{tutor.lessonApproach}</p>
                </>
              )}
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  {tutor.yearsExperience} yrs experience
                </span>
                {tutor.responseTimeMinutes && (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Responds in ~{tutor.responseTimeMinutes}m
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Languages className="h-4 w-4" />
                  {tutor.languages.join(", ")}
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-3">
            <StatCard label="Experience" value={`${tutor.yearsExperience} yrs`} icon={Briefcase} />
            <StatCard label="Students taught" value={tutor.studentsTaught ?? "—"} icon={Users} />
            <StatCard label="Lessons completed" value={tutor.lessonsCompleted ?? "—"} icon={BookOpen} />
          </div>

          <Card>
            <CardContent className="p-6">
              <h2 className="mb-3 font-semibold">Expertise</h2>
              <div className="space-y-3">
                <div>
                  <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">Subjects</p>
                  <div className="flex flex-wrap gap-2">
                    {subjectNames.map((name) => (
                      <Badge key={name} variant="outline">
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">Year levels</p>
                  <div className="flex flex-wrap gap-2">
                    {tutor.yearLevels.map((level) => (
                      <Badge key={level} variant="outline">
                        {level}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">Curricula</p>
                  <div className="flex flex-wrap gap-2">
                    {tutor.curricula.map((c) => (
                      <Badge key={c} variant="outline">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="mb-3 font-semibold">Teaching style</h2>
              <Badge className="mb-2">{tutor.teachingStyle}</Badge>
              <p className="text-sm text-muted-foreground">
                {tutor.availabilitySlots.length > 0 ? `Typically available ${tutor.availabilitySlots.join(" and ").toLowerCase()}.` : "Ask this tutor about their availability."}
              </p>
            </CardContent>
          </Card>

          {tutor.qualifications && tutor.qualifications.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-3 font-semibold">Qualifications</h2>
                <ul className="space-y-3">
                  {tutor.qualifications.map((q) => (
                    <li key={q.id} className="flex items-start gap-3 text-sm">
                      <Award className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      <div>
                        <p className="font-medium">{q.title}</p>
                        <p className="text-muted-foreground">
                          {q.institution}
                          {q.year ? ` · ${q.year}` : ""}
                        </p>
                      </div>
                      {badges.some((b) => b.key === "qualifications-verified") && (
                        <Badge variant="success" className="ml-auto shrink-0">
                          Verified
                        </Badge>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reviews">
          <ReviewsSection tutorId={tutor.id} />
        </TabsContent>

        <TabsContent value="availability">
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-semibold">Availability, next 7 days</h2>
              </div>
              <AvailabilityPicker tutorId={tutor.id} selected={selectedSlot} onSelect={setSelectedSlot} />
              {selectedSlot && (
                <Button className="mt-5 w-full" onClick={handleBookSelectedSlot}>
                  Book {selectedSlot.time} on {selectedSlot.date}
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <BookingDialog tutor={bookingTutor} initialSlot={bookingSlot} onOpenChange={(open) => !open && setBookingTutor(null)} />
    </div>
  );
}
