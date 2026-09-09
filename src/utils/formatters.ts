/** Strips a common title prefix, e.g. "Dr. Sofia Reyes" -> "Sofia Reyes". */
function withoutTitle(name: string): string {
  return name.replace(/^(dr|mr|mrs|ms|miss)\.?\s+/i, "");
}

/** Initials for an avatar fallback, e.g. "Dr. Sofia Reyes" -> "SR". */
export function initials(name: string): string {
  const words = withoutTitle(name).split(" ").filter(Boolean);
  return words.slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
}

/** First given name for a greeting, e.g. "Dr. Sofia Reyes" -> "Sofia". */
export function firstName(name: string): string {
  return withoutTitle(name).split(" ")[0] ?? name;
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(amount);
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(iso));
}

export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", { timeStyle: "short" }).format(new Date(iso));
}

export function formatRelativeToNow(iso: string): string {
  const diffMs = new Date(iso).getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  const rtf = new Intl.RelativeTimeFormat("en-GB", { numeric: "auto" });

  if (Math.abs(diffMinutes) < 60) return rtf.format(diffMinutes, "minute");
  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) return rtf.format(diffHours, "hour");
  const diffDays = Math.round(diffHours / 24);
  return rtf.format(diffDays, "day");
}
