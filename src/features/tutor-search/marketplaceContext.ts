export type MarketplaceContext = "public" | "student" | "parent";

/** Which area of the app the marketplace is being viewed from — drives which features (SmartMatch, Save, Compare, full profile vs limited) are shown. */
export function getMarketplaceContext(pathname: string): MarketplaceContext {
  if (pathname.startsWith("/student")) return "student";
  if (pathname.startsWith("/parent")) return "parent";
  return "public";
}

export function tutorProfilePath(context: MarketplaceContext, tutorId: string): string {
  return context === "public" ? `/tutors/${tutorId}` : `/${context}/tutors/${tutorId}`;
}

export function findTutorPath(context: MarketplaceContext): string {
  return context === "public" ? "/find-tutor" : `/${context}/find-tutor`;
}
