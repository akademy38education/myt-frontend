import { useCallback, useState } from "react";

const STORAGE_KEY = "myt.global-search.recent-queries";
const MAX_RECENT = 5;

function readRecent(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is string => typeof v === "string").slice(0, MAX_RECENT);
  } catch {
    return [];
  }
}

function writeRecent(values: string[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(values.slice(0, MAX_RECENT)));
  } catch {
    // localStorage unavailable (private browsing, quota) — recent searches just won't persist this session
  }
}

/** Per-browser (not per-user) history of the last few non-empty search queries, capped at MAX_RECENT. */
export function useRecentSearches() {
  const [recent, setRecent] = useState<string[]>(() => readRecent());

  const addRecent = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecent((prev) => {
      const next = [trimmed, ...prev.filter((v) => v.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX_RECENT);
      writeRecent(next);
      return next;
    });
  }, []);

  const clearRecent = useCallback(() => {
    setRecent([]);
    writeRecent([]);
  }, []);

  return { recent, addRecent, clearRecent };
}
