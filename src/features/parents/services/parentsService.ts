import type { Booking, ChildProfile, CreateChildInput, ParentOnboardingInput, ParentProfile, ParentSettingsInput } from "@myt/shared";
import { BookingStatus } from "@myt/shared";
import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import { mockParents, mockStudents, mockBookings, mockTutors } from "@/mocks";
import type { FamilyNextLesson, FamilyScheduleItem, ParentDashboardSummary } from "../types";

function childName(studentId: string): string {
  return mockStudents.find((s) => s.id === studentId)?.fullName ?? "Student";
}

function tutorName(tutorId: string): string {
  return mockTutors.find((t) => t.id === tutorId)?.headline ?? "Tutor";
}

function mockDashboardSummary(profile: ParentProfile): ParentDashboardSummary {
  const children = mockStudents.filter((s) => profile.childrenIds.includes(s.id));
  const allBookings: Booking[] = children.flatMap((child) => mockBookings.filter((b) => b.studentId === child.id));
  const now = Date.now();

  const upcoming = allBookings
    .filter((b) => (b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.PENDING) && new Date(b.scheduledStart).getTime() > now)
    .sort((a, b) => a.scheduledStart.localeCompare(b.scheduledStart));

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  const isToday = (iso: string) => {
    const t = new Date(iso).getTime();
    return t >= todayStart.getTime() && t <= todayEnd.getTime();
  };

  const nextBooking = upcoming[0];
  const nextLesson: FamilyNextLesson | null = nextBooking
    ? {
        bookingId: nextBooking.id,
        childId: nextBooking.studentId,
        childName: childName(nextBooking.studentId),
        tutorId: nextBooking.tutorId,
        tutorName: tutorName(nextBooking.tutorId),
        subjectId: nextBooking.subjectId,
        scheduledStart: nextBooking.scheduledStart,
        scheduledEnd: nextBooking.scheduledEnd,
      }
    : null;

  const todaysSchedule: FamilyScheduleItem[] = allBookings
    .filter((b) => b.status !== BookingStatus.CANCELLED && isToday(b.scheduledStart))
    .sort((a, b) => a.scheduledStart.localeCompare(b.scheduledStart))
    .map((b) => ({
      bookingId: b.id,
      childId: b.studentId,
      childName: childName(b.studentId),
      tutorId: b.tutorId,
      tutorName: tutorName(b.tutorId),
      subjectId: b.subjectId,
      scheduledStart: b.scheduledStart,
      scheduledEnd: b.scheduledEnd,
      status: b.status,
    }));

  return {
    profile,
    children,
    upcomingSessionsCount: upcoming.length,
    nextLesson,
    todaysSchedule,
    thisMonthSpending: 0,
    currency: "GBP",
    attentionItems: allBookings.some((b) => b.status === BookingStatus.PENDING) ? ["You have bookings awaiting confirmation."] : [],
    recentReportsCount: 0,
  };
}

export const parentsService = {
  async getById(parentId: string): Promise<ParentProfile> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const profile = mockParents.find((p) => p.id === parentId || p.userId === parentId);
      if (!profile) throw new Error("Parent not found");
      return profile;
    }
    return apiRequest<ParentProfile>(ENDPOINTS.parents.byId(parentId));
  },

  async getChildren(parentId: string): Promise<ChildProfile[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const profile = mockParents.find((p) => p.id === parentId || p.userId === parentId);
      if (!profile) throw new Error("Parent not found");
      return mockStudents.filter((s) => profile.childrenIds.includes(s.id));
    }
    return apiRequest<ChildProfile[]>(ENDPOINTS.parents.children(parentId));
  },

  async getDashboardSummary(parentId: string): Promise<ParentDashboardSummary> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const profile = mockParents.find((p) => p.id === parentId || p.userId === parentId);
      if (!profile) throw new Error("Parent not found");
      return mockDashboardSummary(profile);
    }
    return apiRequest<ParentDashboardSummary>(ENDPOINTS.parents.dashboard(parentId));
  },

  async saveOnboardingStep(parentUserId: string, input: ParentOnboardingInput, completeOnboarding = false): Promise<ParentProfile> {
    if (env.VITE_USE_MOCK_API) {
      await delay(300);
      const base = mockParents.find((p) => p.userId === parentUserId) ?? mockParents[0];
      if (!base) throw new Error("No mock parent to update");
      return { ...base, ...input };
    }
    return apiRequest<ParentProfile>(ENDPOINTS.parents.onboarding(parentUserId), {
      method: "PATCH",
      body: { ...input, completeOnboarding },
    });
  },

  async updateSettings(parentId: string, input: ParentSettingsInput): Promise<ParentProfile> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const parent = mockParents.find((p) => p.id === parentId);
      if (!parent) throw new Error("Parent not found");
      parent.notificationPreferences = input.notificationPreferences;
      return parent;
    }
    return apiRequest<ParentProfile>(ENDPOINTS.parents.settings(parentId), { method: "PATCH", body: input });
  },

  async addChild(parentUserId: string, input: CreateChildInput): Promise<ChildProfile> {
    if (env.VITE_USE_MOCK_API) {
      await delay(300);
      return { id: `mock-child-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), timezone: "Europe/London", ...input };
    }
    return apiRequest<ChildProfile>(ENDPOINTS.parents.children(parentUserId), { method: "POST", body: input });
  },

  async updateChild(parentUserId: string, childId: string, input: Partial<CreateChildInput>): Promise<ChildProfile> {
    if (env.VITE_USE_MOCK_API) {
      await delay(300);
      const base = mockStudents.find((s) => s.id === childId);
      if (!base) throw new Error("Child not found");
      return { ...base, ...input };
    }
    return apiRequest<ChildProfile>(ENDPOINTS.parents.child(parentUserId, childId), { method: "PATCH", body: input });
  },
};
