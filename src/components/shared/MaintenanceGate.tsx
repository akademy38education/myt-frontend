import { useEffect } from "react";
import { Wrench } from "lucide-react";
import { env } from "@/config/env";
import { ENDPOINTS } from "@/api/endpoints";
import { useMaintenanceStore } from "@/stores/maintenanceStore";

const RETRY_INTERVAL_MS = 15_000;

/**
 * Probes `/feature-flags` directly with `fetch` rather than `apiRequest` —
 * that route sits behind the backend's maintenance gate (unlike `/health`,
 * which is deliberately exempt so ops tooling keeps working, and would
 * therefore always succeed and prematurely clear the flag). A 503 with
 * `MAINTENANCE_MODE` means maintenance is still on; any other response
 * (200 once authenticated, 401 for a logged-out visitor, etc.) means the
 * gate in front of it already lifted.
 */
async function probeMaintenanceLifted(): Promise<boolean> {
  try {
    const response = await fetch(`${env.VITE_API_BASE_URL}${ENDPOINTS.featureFlags.get}`);
    if (response.status !== 503) return true;
    const body = (await response.json().catch(() => undefined)) as { error?: { code?: string } } | undefined;
    return body?.error?.code !== "MAINTENANCE_MODE";
  } catch {
    return false;
  }
}

/** Renders instead of the whole app for a non-admin while `useMaintenanceStore` says the backend is in maintenance mode. */
export function MaintenanceGate() {
  const setActive = useMaintenanceStore((state) => state.setActive);

  useEffect(() => {
    const interval = setInterval(() => {
      void probeMaintenanceLifted().then((lifted) => {
        if (lifted) setActive(false);
      });
    }, RETRY_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [setActive]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <Wrench className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
      <div className="space-y-1.5">
        <p className="text-lg font-semibold">We'll be back shortly</p>
        <p className="max-w-sm text-sm text-muted-foreground">MyT is temporarily unavailable while we perform maintenance.</p>
      </div>
      <p className="text-xs text-muted-foreground">Checking again automatically...</p>
    </div>
  );
}
