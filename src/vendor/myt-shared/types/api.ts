/**
 * Standard API envelope used by every backend response and consumed by the
 * frontend's HTTP client. Keeping this in `shared` guarantees both sides
 * agree on the exact shape.
 */

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error: {
    code: string;
    details?: unknown;
    /** Correlates this error with the backend's server-side logs for that request (see `backend/src/middleware/requestId.ts`) — surface it in support/bug-report flows rather than the raw error message. */
    requestId?: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}
