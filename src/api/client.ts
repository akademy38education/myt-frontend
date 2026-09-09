import type { ApiResponse, ApiSuccessResponse } from "@myt/shared";
import { env } from "@/config/env";
import { useAuthStore } from "@/stores/authStore";
import { useMaintenanceStore } from "@/stores/maintenanceStore";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = new URL(`${env.VITE_API_BASE_URL}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

async function request<T>(path: string, options: RequestOptions): Promise<ApiSuccessResponse<T>> {
  const token = useAuthStore.getState().accessToken;

  const response = await fetch(buildUrl(path, options.query), {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  });

  const payload = (await response.json().catch(() => undefined)) as ApiResponse<T> | undefined;

  if (!response.ok || !payload || payload.success === false) {
    const message = payload && "message" in payload ? payload.message : response.statusText;
    const code = payload && !payload.success ? payload.error.code : "UNKNOWN_ERROR";
    if (response.status === 401) useAuthStore.getState().logout();
    if (code === "MAINTENANCE_MODE") useMaintenanceStore.getState().setActive(true);
    throw new ApiError(message ?? "Request failed", response.status, code);
  }

  if (useMaintenanceStore.getState().active) useMaintenanceStore.getState().setActive(false);

  return payload;
}

/**
 * The single HTTP entry point for the whole frontend. Feature services call
 * this (never `fetch` directly), so auth headers, envelope unwrapping and
 * error normalization live in exactly one place.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  return (await request<T>(path, options)).data;
}

/** Like `apiRequest`, but keeps the `meta` block (pagination) alongside `data` — use for paginated list endpoints. */
export async function apiRequestWithMeta<T>(path: string, options: RequestOptions = {}): Promise<ApiSuccessResponse<T>> {
  return request<T>(path, options);
}

/**
 * Like `apiRequest`, but returns the raw response body as text instead of
 * unwrapping a JSON envelope — for the handful of endpoints (CSV export)
 * that intentionally don't return `{ success, data }`.
 */
export async function apiRequestText(path: string, options: RequestOptions = {}): Promise<string> {
  const token = useAuthStore.getState().accessToken;
  const response = await fetch(buildUrl(path, options.query), {
    method: options.method ?? "GET",
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    signal: options.signal,
  });
  if (!response.ok) throw new ApiError("Request failed", response.status, "UNKNOWN_ERROR");
  return response.text();
}
