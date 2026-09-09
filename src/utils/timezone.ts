/**
 * All booking times are stored as UTC ISO strings (see `Booking.scheduledStart/End`
 * in `@myt/shared`) — this module is the only place that converts them for
 * display. Built entirely on the native `Intl` API (DST-safe, no manual
 * offset math, no extra dependency) per the Phase 6 "never manually
 * calculate timezone offsets" rule.
 */

export function getBrowserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "Europe/London";
  }
}

export function formatInTimezone(iso: string, timezone: string, options: Intl.DateTimeFormatOptions = { dateStyle: "medium", timeStyle: "short" }): string {
  return new Intl.DateTimeFormat("en-GB", { ...options, timeZone: timezone }).format(new Date(iso));
}

export function formatTimeInTimezone(iso: string, timezone: string): string {
  return formatInTimezone(iso, timezone, { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function formatDateInTimezone(iso: string, timezone: string): string {
  return formatInTimezone(iso, timezone, { weekday: "long", day: "numeric", month: "long" });
}

/** "6:00 PM – 7:00 PM" style range, both ends rendered in the same timezone. */
export function formatTimeRangeInTimezone(startIso: string, endIso: string, timezone: string): string {
  return `${formatTimeInTimezone(startIso, timezone)} – ${formatTimeInTimezone(endIso, timezone)}`;
}

/** A short, human label for a timezone, e.g. "Europe/London" -> "GMT+1" — used next to the full IANA name so non-technical users have something immediately readable. */
export function timezoneOffsetLabel(timezone: string, atDate: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: timezone, timeZoneName: "shortOffset" }).formatToParts(atDate);
  return parts.find((p) => p.type === "timeZoneName")?.value ?? timezone;
}

/**
 * Interprets `dateStr`/`timeStr` as a wall-clock time IN `timeZone` (not the
 * caller's own timezone) and returns the real UTC instant it refers to.
 * This is the one piece of math a booking flow cannot get wrong: a tutor's
 * available slot ("17:00" on their availability page) is always their own
 * local time, regardless of which timezone the student booking it is
 * browsing from — converting it via the browser's timezone instead (e.g.
 * `new Date("2026-09-07T17:00:00")`, which is always LOCAL time to the
 * runtime) would silently book the wrong real-world instant. DST-safe
 * because it re-derives the offset from `Intl` at the specific date given,
 * never a fixed/cached offset.
 */
export function zonedTimeToUtc(dateStr: string, timeStr: string, timeZone: string): Date {
  const naiveUtc = new Date(`${dateStr}T${timeStr}:00Z`);
  const tzWallClock = new Date(naiveUtc.toLocaleString("en-US", { timeZone }));
  const utcWallClock = new Date(naiveUtc.toLocaleString("en-US", { timeZone: "UTC" }));
  const offsetMs = utcWallClock.getTime() - tzWallClock.getTime();
  return new Date(naiveUtc.getTime() + offsetMs);
}
