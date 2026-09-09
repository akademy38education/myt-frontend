import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import type { TutorProfile } from "@myt/shared";
import { Star, X } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { tutorsService } from "@/features/tutors";
import { getMarketplaceContext, tutorProfilePath, findTutorPath, getTrustBadges } from "@/features/tutor-search";
import { useTutorCompareStore } from "@/features/tutor-compare";
import { SUBJECTS } from "@/constants/subjects";
import { initials, formatCurrency } from "@/utils/formatters";

const ROWS: Array<{ label: string; render: (tutor: TutorProfile) => ReactNode }> = [
  { label: "Rating", render: (t) => (
    <span className="flex items-center justify-center gap-1">
      <Star className="h-3.5 w-3.5 fill-warning text-warning" />
      {t.rating.toFixed(1)} ({t.reviewCount})
    </span>
  ) },
  { label: "Experience", render: (t) => `${t.yearsExperience} years` },
  { label: "Subjects", render: (t) => t.subjects.map((id) => SUBJECTS.find((s) => s.id === id)?.name ?? id).join(", ") },
  { label: "Teaching style", render: (t) => t.teachingStyle },
  { label: "Price", render: (t) => `${formatCurrency(t.hourlyRate, t.currency)}/hr` },
  { label: "Availability", render: (t) => t.availabilitySlots.join(", ") || "—" },
  { label: "Trial lesson", render: (t) => (t.trialLessonEnabled ? `Yes, from ${formatCurrency(t.trialLessonPrice ?? 0, t.currency)}` : "No") },
  { label: "Verification", render: (t) => getTrustBadges(t).map((b) => b.label).join(", ") || "Not yet verified" },
];

export function CompareTutorsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const context = getMarketplaceContext(location.pathname);
  const { tutorIds, toggle, clear } = useTutorCompareStore();

  const queries = useQueries({
    queries: tutorIds.map((id) => ({ queryKey: ["tutors", id], queryFn: () => tutorsService.getById(id) })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const tutors = queries.map((q) => q.data).filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <PageHeader title="Compare tutors" description="Compare up to 3 tutors side by side." actions={tutors.length > 0 ? <Button variant="outline" onClick={clear}>Clear all</Button> : undefined} />

      {isLoading && <LoadingState label="Loading tutors..." />}

      {!isLoading && tutors.length === 0 && (
        <EmptyState
          title="No tutors selected to compare"
          description="Select up to 3 tutors from search results using the Compare checkbox, then come back here."
          actionLabel="Find tutors"
          onAction={() => navigate(findTutorPath(context))}
        />
      )}

      {tutors.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[36rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="w-40 p-4 text-left font-medium text-muted-foreground">Tutor</th>
                {tutors.map((tutor) => (
                  <th key={tutor.id} className="p-4 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <button type="button" onClick={() => toggle(tutor.id)} className="self-end text-muted-foreground hover:text-destructive" aria-label={`Remove ${tutor.headline} from comparison`}>
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>{initials(tutor.headline)}</AvatarFallback>
                      </Avatar>
                      <p className="font-semibold leading-tight">{tutor.headline}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => navigate(tutorProfilePath(context, tutor.id))}>
                          View profile
                        </Button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label} className="border-b border-border last:border-0">
                  <td className="p-4 font-medium text-muted-foreground">{row.label}</td>
                  {tutors.map((tutor) => (
                    <td key={tutor.id} className="p-4 text-center">
                      {row.render(tutor)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tutors.length > 0 && tutors.length < 3 && (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          You can compare up to 3 tutors —{" "}
          <Badge variant="outline" className="cursor-pointer" onClick={() => navigate(findTutorPath(context))}>
            add another
          </Badge>
        </p>
      )}
    </div>
  );
}
