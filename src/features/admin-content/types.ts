import type { ContentStatus, ContentType } from "@myt/shared";

export interface ContentItemFilter {
  type?: ContentType;
  status?: ContentStatus;
}
