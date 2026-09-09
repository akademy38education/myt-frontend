import { Star, Clock, Briefcase, Heart } from "lucide-react";
import type { TutorProfile } from "@myt/shared";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { initials } from "@/utils/formatters";
import { cn } from "@/utils/cn";
import { getTrustBadges } from "../trustBadges";
import { MatchScore } from "./MatchScore";
import { MatchReasonsList } from "./MatchReasonsList";

export interface TutorCardProps {
  tutor: TutorProfile;
  matchScore?: number | null;
  matchReasons?: string[];
  onBook?: (tutor: TutorProfile) => void;
  onViewProfile?: (tutor: TutorProfile) => void;
  isSaved?: boolean;
  onToggleSave?: (tutor: TutorProfile) => void;
  isComparing?: boolean;
  onToggleCompare?: (tutor: TutorProfile) => void;
  compareDisabled?: boolean;
}

const BADGE_VARIANT: Record<string, "success" | "secondary" | "outline" | "warning"> = {
  verified: "success",
  "qualifications-verified": "outline",
  "fast-responder": "secondary",
  "highly-rated": "warning",
  popular: "secondary",
  new: "outline",
};

export function TutorCard({ tutor, matchScore, matchReasons, onBook, onViewProfile, isSaved, onToggleSave, isComparing, onToggleCompare, compareDisabled }: TutorCardProps) {
  const badges = getTrustBadges(tutor);

  return (
    <Card className="group relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-1 gap-4">
          <Avatar className="h-14 w-14 shrink-0 transition-transform duration-200 group-hover:scale-105">
            <AvatarFallback className="text-base">{initials(tutor.headline)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="font-semibold leading-tight">{tutor.headline}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {badges.map((badge) => (
                <Badge key={badge.key} variant={BADGE_VARIANT[badge.key] ?? "outline"}>
                  {badge.label}
                </Badge>
              ))}
              {typeof matchScore === "number" && matchScore !== null && !matchReasons && <Badge variant={matchScore >= 75 ? "default" : "outline"}>{matchScore}% match to your filters</Badge>}
              {tutor.trialLessonEnabled && <Badge variant="outline">Trial lesson available</Badge>}
            </div>
            <p className="line-clamp-2 text-sm text-muted-foreground">{tutor.bio}</p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                {tutor.rating.toFixed(1)} ({tutor.reviewCount})
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5" />
                {tutor.yearsExperience} yrs experience
              </span>
              {tutor.responseTimeMinutes && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Responds in ~{tutor.responseTimeMinutes}m
                </span>
              )}
            </div>
            {typeof matchScore === "number" && matchReasons && matchReasons.length > 0 && (
              <div className="pt-1">
                <MatchReasonsList reasons={matchReasons.slice(0, 3)} />
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-row items-center gap-3 sm:flex-col sm:items-end">
          {onToggleSave && (
            <button
              type="button"
              onClick={() => onToggleSave(tutor)}
              aria-label={isSaved ? "Remove from saved tutors" : "Save tutor"}
              aria-pressed={isSaved}
              className="text-muted-foreground transition-colors hover:text-destructive"
            >
              <Heart className={cn("h-5 w-5", isSaved && "fill-destructive text-destructive")} />
            </button>
          )}

          {typeof matchScore === "number" && matchReasons && <MatchScore score={matchScore} />}

          <Badge variant="secondary">
            {tutor.currency === "GBP" ? "£" : tutor.currency}
            {tutor.hourlyRate}/hr
          </Badge>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onViewProfile?.(tutor)}>
              View profile
            </Button>
            <Button size="sm" onClick={() => onBook?.(tutor)}>
              Book a lesson
            </Button>
          </div>

          {onToggleCompare && (
            <label className={cn("flex items-center gap-1.5 text-xs text-muted-foreground", compareDisabled && !isComparing && "opacity-50")}>
              <Checkbox checked={isComparing ?? false} disabled={compareDisabled && !isComparing} onCheckedChange={() => onToggleCompare(tutor)} />
              Compare
            </label>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
