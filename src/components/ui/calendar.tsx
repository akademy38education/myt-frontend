import type { ComponentProps } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { cn } from "@/utils/cn";

export type CalendarProps = ComponentProps<typeof DayPicker>;

export function Calendar({ className, ...props }: CalendarProps) {
  return (
    <DayPicker
      className={cn("rounded-md border border-border bg-card p-3", className)}
      classNames={{
        selected: "bg-primary text-primary-foreground rounded-md",
        today: "font-semibold text-primary",
      }}
      {...props}
    />
  );
}
