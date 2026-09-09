/**
 * Phase 11 — platform intelligence/search/notifications contracts shared
 * between frontend and backend. These are deliberately plain data shapes,
 * not AI outputs — every `RecommendationItem` is produced by deterministic
 * rules over real repository data (see backend/src/modules/recommendations),
 * never invented.
 */

export type RecommendationPriority = "low" | "medium" | "high";

export interface RecommendationItem {
  id: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
  priority: RecommendationPriority;
}

export type SearchResultType =
  | "student"
  | "parent"
  | "tutor"
  | "booking"
  | "resource"
  | "report"
  | "user"
  | "support-ticket"
  | "complaint";

export interface SearchResultItem {
  type: SearchResultType;
  id: string;
  title: string;
  subtitle?: string;
  link: string;
}

export interface SearchResponse {
  results: SearchResultItem[];
}

/** A flat set of on/off switches — see backend/src/modules/feature-flags. Deliberately not a rigid typed interface per flag, since flags are added/retired far more often than the rest of the schema. */
export type FeatureFlags = Record<string, boolean>;
