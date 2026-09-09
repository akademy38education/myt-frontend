import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { SUBJECTS } from "@/constants/subjects";
import { YEAR_LEVELS, CURRICULA, TEACHING_STYLES, LANGUAGES, AVAILABILITY_OPTIONS } from "@/constants/tutoring";
import type { TutorSearchFilter } from "../types";

const RATINGS = [4.5, 4.0, 3.5];
const PRICE_MIN = 0;
const PRICE_MAX = 100;

export interface MarketplaceFiltersProps {
  filter: TutorSearchFilter;
  onChange: (patch: Partial<TutorSearchFilter>) => void;
  onClearAll: () => void;
  activeFilterCount: number;
}

/**
 * The full filter control set, shared verbatim between the desktop sidebar
 * and the mobile filter drawer (Phase 5 spec §3/§18) — one implementation,
 * two containers, so the two surfaces can never drift out of sync.
 */
export function MarketplaceFilters({ filter, onChange, onClearAll, activeFilterCount }: MarketplaceFiltersProps) {
  const priceRange: [number, number] = [filter.minPrice ?? PRICE_MIN, filter.maxPrice ?? PRICE_MAX];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Filters</h2>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            Clear all
          </Button>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>Subject</Label>
        <Select value={filter.subjectId} onValueChange={(v) => onChange({ subjectId: v })}>
          <SelectTrigger>
            <SelectValue placeholder="All subjects" />
          </SelectTrigger>
          <SelectContent>
            {SUBJECTS.map((subject) => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Year level</Label>
        <Select value={filter.yearLevel} onValueChange={(v) => onChange({ yearLevel: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Any year level" />
          </SelectTrigger>
          <SelectContent>
            {YEAR_LEVELS.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Curriculum</Label>
        <Select value={filter.curriculum} onValueChange={(v) => onChange({ curriculum: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Any curriculum" />
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

      <div className="space-y-1.5">
        <Label>Availability</Label>
        <Select value={filter.availability} onValueChange={(v) => onChange({ availability: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Any availability" />
          </SelectTrigger>
          <SelectContent>
            {AVAILABILITY_OPTIONS.map((slot) => (
              <SelectItem key={slot} value={slot}>
                {slot}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Hourly rate</Label>
          <span className="text-sm text-muted-foreground">
            £{priceRange[0]} – £{priceRange[1]}
            {priceRange[1] >= PRICE_MAX ? "+" : ""}
          </span>
        </div>
        <Slider
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={5}
          value={priceRange}
          onValueChange={(value) => {
            const [min, max] = value as [number, number];
            onChange({ minPrice: min > PRICE_MIN ? min : undefined, maxPrice: max < PRICE_MAX ? max : undefined });
          }}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Minimum rating</Label>
        <Select value={filter.minRating ? String(filter.minRating) : undefined} onValueChange={(v) => onChange({ minRating: Number(v) })}>
          <SelectTrigger>
            <SelectValue placeholder="Any rating" />
          </SelectTrigger>
          <SelectContent>
            {RATINGS.map((r) => (
              <SelectItem key={r} value={String(r)}>
                {r}+ stars
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Teaching style</Label>
        <Select value={filter.teachingStyle} onValueChange={(v) => onChange({ teachingStyle: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Any style" />
          </SelectTrigger>
          <SelectContent>
            {TEACHING_STYLES.map((style) => (
              <SelectItem key={style} value={style}>
                {style}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Language</Label>
        <Select value={filter.language} onValueChange={(v) => onChange({ language: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Any language" />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        <label className="flex items-center gap-2.5 text-sm">
          <Checkbox checked={filter.verifiedOnly ?? false} onCheckedChange={(checked) => onChange({ verifiedOnly: checked === true })} />
          Verified tutors only
        </label>
        <label className="flex items-center gap-2.5 text-sm">
          <Checkbox checked={filter.trialAvailable ?? false} onCheckedChange={(checked) => onChange({ trialAvailable: checked === true })} />
          Trial lesson available
        </label>
      </div>
    </div>
  );
}
