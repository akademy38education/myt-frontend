import * as LucideIcons from "lucide-react";
import { Award, type LucideIcon } from "lucide-react";
import type { UnlockedAchievement } from "@myt/shared";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDate } from "@/utils/formatters";
import { cn } from "@/utils/cn";

/** Catalog `icon` values are Lucide icon names as plain strings (see `shared/constants/achievements.ts`); resolve to a real component here, falling back to a generic badge icon for any name that doesn't match. */
function resolveIcon(name: string): LucideIcon {
  const icons = LucideIcons as unknown as Record<string, LucideIcon>;
  return icons[name] ?? Award;
}

export function AchievementBadge({ achievement, className }: { achievement: UnlockedAchievement; className?: string }) {
  const Icon = resolveIcon(achievement.icon);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-4 text-center transition-colors hover:border-primary/40",
            className
          )}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="text-sm font-medium leading-tight">{achievement.title}</p>
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-[220px] text-center">
        <p>{achievement.description}</p>
        <p className="mt-1 text-[10px] uppercase tracking-wide opacity-70">Unlocked {formatDate(achievement.unlockedAt)}</p>
      </TooltipContent>
    </Tooltip>
  );
}
