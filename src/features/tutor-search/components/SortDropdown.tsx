import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TutorSortOrder } from "../types";

const SORT_OPTIONS: Array<{ value: TutorSortOrder; label: string }> = [
  { value: "recommended", label: "Recommended" },
  { value: "rating", label: "Highest rated" },
  { value: "priceAsc", label: "Lowest price" },
  { value: "priceDesc", label: "Highest price" },
  { value: "experience", label: "Most experienced" },
  { value: "availability", label: "Earliest availability" },
  { value: "newest", label: "Newest tutors" },
];

export function SortDropdown({ value, onChange }: { value: TutorSortOrder | undefined; onChange: (sort: TutorSortOrder) => void }) {
  return (
    <Select value={value ?? "recommended"} onValueChange={(v) => onChange(v as TutorSortOrder)}>
      <SelectTrigger className="w-[13rem]" aria-label="Sort tutors">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
