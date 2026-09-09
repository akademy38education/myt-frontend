import { ChevronsUpDown, Users } from "lucide-react";
import type { StudentProfile } from "@myt/shared";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { initials } from "@/utils/formatters";
import { useSelectedChildStore } from "../store";

export interface ChildSwitcherProps {
  children: StudentProfile[];
  className?: string;
}

/** The one place a parent picks "which child (or all of them) am I looking at" — persisted across navigation (see ../store.ts) so it never resets mid-task. */
export function ChildSwitcher({ children, className }: ChildSwitcherProps) {
  const { selectedChildId, setSelectedChildId } = useSelectedChildStore();
  const selectedChild = children.find((c) => c.id === selectedChildId);
  const label = selectedChild ? (selectedChild.fullName ?? "Student") : "All Children";

  if (children.length <= 1) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className} aria-label="Switch child">
          {selectedChild ? (
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-[10px]">{initials(selectedChild.fullName ?? "Student")}</AvatarFallback>
            </Avatar>
          ) : (
            <Users className="h-4 w-4" />
          )}
          {label}
          <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>My Children</DropdownMenuLabel>
        {children.map((child) => (
          <DropdownMenuItem key={child.id} onClick={() => setSelectedChildId(child.id)} className="gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">{initials(child.fullName ?? "Student")}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium leading-tight">{child.fullName}</p>
              <p className="text-xs leading-tight text-muted-foreground">{child.yearGroup}</p>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setSelectedChildId(null)} className="gap-2">
          <Users className="h-4 w-4" />
          All Children
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
