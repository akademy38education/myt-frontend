import type { ReportSeverity, ReportStatus } from "@myt/shared";

export interface ComplaintFilter {
  status?: ReportStatus;
  severity?: ReportSeverity;
  assignedAdminId?: string;
}
