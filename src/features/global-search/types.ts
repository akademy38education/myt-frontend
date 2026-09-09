import type { SearchResultType } from "@myt/shared";

export type { SearchResultItem, SearchResultType, SearchResponse } from "@myt/shared";

/** Plural section headers for grouping mixed search results in the command palette. */
export const SEARCH_RESULT_GROUP_LABELS: Record<SearchResultType, string> = {
  student: "Students",
  parent: "Parents",
  tutor: "Tutors",
  booking: "Bookings",
  resource: "Resources",
  report: "Reports",
  user: "Users",
  "support-ticket": "Support tickets",
  complaint: "Complaints",
};

/** Singular labels for a single result row's type badge. */
export const SEARCH_RESULT_TYPE_LABELS: Record<SearchResultType, string> = {
  student: "Student",
  parent: "Parent",
  tutor: "Tutor",
  booking: "Booking",
  resource: "Resource",
  report: "Report",
  user: "User",
  "support-ticket": "Support ticket",
  complaint: "Complaint",
};

/** Order in which result groups are rendered, regardless of the order the backend returns them in. */
export const SEARCH_RESULT_GROUP_ORDER: SearchResultType[] = [
  "student",
  "parent",
  "tutor",
  "booking",
  "resource",
  "report",
  "user",
  "support-ticket",
  "complaint",
];
