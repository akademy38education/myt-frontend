/**
 * Clears every persisted demo/mock store (session, bookings, homework
 * answers, goals, messages, notifications, saved tutors, settings,
 * onboarding progress, admin mock stores, ...) and reloads the app so they
 * all re-initialize from their original seed data.
 *
 * Deliberately generic — every persisted store in this app is namespaced
 * "myt-<name>" (see each feature store's `persist(..., { name: "myt-..." })`)
 * — rather than hardcoding an enumerable list of keys that would silently go
 * stale the next time a new persisted store is added.
 */
export function resetDemoData(): void {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("myt-")) keysToRemove.push(key);
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
  window.location.href = "/";
}
