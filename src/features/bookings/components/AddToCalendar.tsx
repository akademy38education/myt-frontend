import { useState } from "react";
import { CalendarPlus, Download, ExternalLink } from "lucide-react";
import type { Booking } from "@myt/shared";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { downloadIcs, generateIcs, googleCalendarUrl } from "@/utils/ics";

export interface AddToCalendarProps {
  booking: Booking;
  tutorName: string;
  subjectName: string;
}

/**
 * Google Calendar's quick-add link is genuinely functional (no OAuth
 * needed — it just opens Google's own prefilled event page). Outlook and
 * Apple Calendar have no equivalent public link scheme, so both of those
 * options honestly just hand over the same downloadable .ics file, which
 * both apps import natively — see Phase 6 spec §39: never fake a
 * successful external sync for an integration that doesn't exist yet.
 */
export function AddToCalendar({ booking, tutorName, subjectName }: AddToCalendarProps) {
  const [open, setOpen] = useState(false);

  const event = {
    uid: booking.id,
    title: `${subjectName} with ${tutorName}`,
    description: `MyT lesson${booking.meetingUrl ? ` — join at ${booking.meetingUrl}` : ""}`,
    location: booking.meetingUrl,
    startUTC: booking.scheduledStart,
    endUTC: booking.scheduledEnd,
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full">
          <CalendarPlus className="h-4 w-4" />
          Add to Calendar
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-1.5">
        <a
          href={googleCalendarUrl(event)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
          onClick={() => setOpen(false)}
        >
          <ExternalLink className="h-4 w-4" />
          Google Calendar
        </a>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
          onClick={() => {
            downloadIcs(`myt-lesson-${booking.id}`, generateIcs(event));
            setOpen(false);
          }}
        >
          <Download className="h-4 w-4" />
          Apple Calendar (.ics)
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
          onClick={() => {
            downloadIcs(`myt-lesson-${booking.id}`, generateIcs(event));
            setOpen(false);
          }}
        >
          <Download className="h-4 w-4" />
          Outlook (.ics)
        </button>
      </PopoverContent>
    </Popover>
  );
}
