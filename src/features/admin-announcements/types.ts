import type { PlatformAnnouncement, CreateAnnouncementInput } from "@myt/shared";
import { UserRole } from "@myt/shared";

export type { PlatformAnnouncement, CreateAnnouncementInput };
export { UserRole };

export interface CreateAnnouncementResult {
  announcement: PlatformAnnouncement;
  recipientCount: number;
}
