import { Check } from "lucide-react";
import { cn } from "@/utils/cn";

export interface ToggleChipProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
  className?: string;
}

/** A compact toggle pill for multi-select lists (subjects, goals, languages). */
export function ToggleChip({ label, selected, onToggle, className }: ToggleChipProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-150",
        "hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        selected ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border bg-background text-foreground hover:border-primary/50",
        className
      )}
    >
      {selected && <Check className="h-3.5 w-3.5 animate-in zoom-in-50 duration-150" />}
      {label}
    </button>
  );
}
