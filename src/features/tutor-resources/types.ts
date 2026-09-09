import type { CreateResourceInput, Resource } from "@myt/shared";

export interface ResourceWithShares extends Resource {
  sharedWith: string[];
}

export type { CreateResourceInput };
