import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";

type AnalyticsPropertyValue = string | number | boolean | null;

/**
 * Fire-and-forget usage tracking. Never blocks or throws for the caller —
 * failures (including a 503 during maintenance mode) are swallowed
 * silently. Only structured, minimal properties (ids/counts) belong here;
 * never passwords, message bodies, or payment details (Phase 11 spec §42).
 *
 * This is a plain utility, not a feature service, so it doesn't follow the
 * usual "service checks VITE_USE_MOCK_API and returns mock data" pattern —
 * there's no mock *response* to return since nothing reads one back. In
 * demo mode there's simply nothing useful to do here (no real backend to
 * receive it), so this exits before ever calling `apiRequest`, rather than
 * being the one place in the app that still fires a real network request
 * at a (possibly nonexistent) backend regardless of the mock flag.
 */
export function trackEvent(name: string, properties?: Record<string, AnalyticsPropertyValue>): void {
  if (env.VITE_USE_MOCK_API) return;
  void apiRequest(ENDPOINTS.analyticsEvents.record, {
    method: "POST",
    body: { name, properties },
  }).catch(() => {});
}
