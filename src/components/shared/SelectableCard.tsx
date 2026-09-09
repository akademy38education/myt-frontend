import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";
import { cn } from "@/utils/cn";

export interface SelectableCardProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  selected?: boolean;
  onSelect: () => void;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/**
 * A large, clearly-interactive selectable card — used anywhere a user picks
 * one option from a small set of meaningfully different choices (role
 * selection, lesson format, learning environment). For picking several
 * items from a longer list (subjects, goals, languages), use `ToggleChip`
 * instead — a big card per item doesn't scale past 3-4 options.
 *
 * Renders as a real `<button>` so it's keyboard-operable and announced
 * correctly by screen readers without extra ARIA wiring.
 */
export function SelectableCard({ icon: Icon, title, description, selected = false, onSelect, className, style, children }: SelectableCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      style={style}
      className={cn(
        "group relative flex w-full flex-col items-start gap-3 rounded-xl border-2 bg-card p-6 text-left shadow-sm transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        selected ? "border-primary bg-primary/5 shadow-md" : "border-border",
        className
      )}
    >
      {selected && (
        <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground animate-in zoom-in-50 duration-200">
          <Check className="h-3.5 w-3.5" />
        </span>
      )}
      {Icon && (
        <span
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-lg transition-colors",
            selected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary group-hover:bg-primary/20"
          )}
        >
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
      )}
      <div>
        <p className="text-lg font-semibold">{title}</p>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </button>
  );
}
