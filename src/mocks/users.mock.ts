import { AdminRole, UserRole, UserAccountStatus, type User } from "@myt/shared";

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();
const now = new Date().toISOString();

/**
 * Mirrors `backend/src/models/seedData.ts`'s `HAND_WRITTEN_USERS` field-for-
 * field (same ids, same names/emails/roles) — the same principle as
 * `tutors.mock.ts`: switching `VITE_USE_MOCK_API` never changes who these
 * people are, only whether the data comes from `fetch` or this file. Used
 * by the demo login roster (`authService.ts`) and by
 * `admin-users`/`admin-tutor-verification`/`admin-support`'s mock branches
 * so the admin area has a real, connected roster to search/suspend/verify
 * against instead of an honestly-empty stub.
 */
export const mockUsers: User[] = [
  { id: "user-student-1", email: "amelia.student@myt.dev", fullName: "Amelia Carter", role: UserRole.STUDENT, isActive: true, accountStatus: UserAccountStatus.ACTIVE, createdAt: now, updatedAt: now },
  { id: "user-parent-1", email: "james.parent@myt.dev", fullName: "James Carter", role: UserRole.PARENT, isActive: true, accountStatus: UserAccountStatus.ACTIVE, createdAt: now, updatedAt: now },
  { id: "user-tutor-1", email: "sofia.tutor@myt.dev", fullName: "Dr. Sofia Reyes", role: UserRole.TUTOR, isActive: true, accountStatus: UserAccountStatus.ACTIVE, createdAt: now, updatedAt: now },
  { id: "user-tutor-2", email: "daniel.tutor@myt.dev", fullName: "Daniel Osei", role: UserRole.TUTOR, isActive: true, accountStatus: UserAccountStatus.ACTIVE, createdAt: now, updatedAt: now },
  { id: "user-admin-1", email: "priya.admin@myt.dev", fullName: "Priya Nair", role: UserRole.ADMIN, adminRole: AdminRole.SUPER_ADMIN, isActive: true, accountStatus: UserAccountStatus.ACTIVE, createdAt: now, updatedAt: now },
  { id: "user-student-2", email: "noah.bennett@myt.dev", fullName: "Noah Bennett", role: UserRole.STUDENT, isActive: true, accountStatus: UserAccountStatus.ACTIVE, createdAt: now, updatedAt: now },
  { id: "user-student-3", email: "olivia.hughes@myt.dev", fullName: "Olivia Hughes", role: UserRole.STUDENT, isActive: true, accountStatus: UserAccountStatus.ACTIVE, createdAt: now, updatedAt: now },
  { id: "user-student-4", email: "ethan.wallace@myt.dev", fullName: "Ethan Wallace", role: UserRole.STUDENT, isActive: true, accountStatus: UserAccountStatus.ACTIVE, createdAt: now, updatedAt: now },
  { id: "user-parent-2", email: "grace.whitfield@myt.dev", fullName: "Grace Whitfield", role: UserRole.PARENT, isActive: true, accountStatus: UserAccountStatus.ACTIVE, createdAt: now, updatedAt: now },
  { id: "user-admin-2", email: "marcus.admin@myt.dev", fullName: "Marcus Webb", role: UserRole.ADMIN, adminRole: AdminRole.ADMIN, isActive: true, accountStatus: UserAccountStatus.ACTIVE, createdAt: now, updatedAt: now },
  { id: "user-admin-mod", email: "lena.moderator@myt.dev", fullName: "Lena Kowalski", role: UserRole.ADMIN, adminRole: AdminRole.MODERATOR, isActive: true, accountStatus: UserAccountStatus.ACTIVE, createdAt: now, updatedAt: now },
  { id: "user-admin-support", email: "tariq.support@myt.dev", fullName: "Tariq Hassan", role: UserRole.ADMIN, adminRole: AdminRole.SUPPORT, isActive: true, accountStatus: UserAccountStatus.ACTIVE, createdAt: now, updatedAt: now },
  { id: "user-admin-finance", email: "yuki.finance@myt.dev", fullName: "Yuki Tanaka", role: UserRole.ADMIN, adminRole: AdminRole.FINANCE, isActive: true, accountStatus: UserAccountStatus.ACTIVE, createdAt: now, updatedAt: now },
  { id: "user-admin-content", email: "chloe.content@myt.dev", fullName: "Chloe Bennett", role: UserRole.ADMIN, adminRole: AdminRole.CONTENT_MANAGER, isActive: true, accountStatus: UserAccountStatus.ACTIVE, createdAt: now, updatedAt: now },
  { id: "user-tutor-pending", email: "nadia.applicant@myt.dev", fullName: "Nadia Farouk", role: UserRole.TUTOR, isActive: true, accountStatus: UserAccountStatus.ACTIVE, createdAt: daysAgo(1), updatedAt: daysAgo(1) },
  {
    id: "user-student-suspended",
    email: "liam.suspended@myt.dev",
    fullName: "Liam Foster",
    role: UserRole.STUDENT,
    isActive: true,
    accountStatus: UserAccountStatus.SUSPENDED,
    suspensionReason: "Policy violation",
    suspendedAt: daysAgo(3),
    suspendedByAdminId: "user-admin-1",
    createdAt: daysAgo(120),
    updatedAt: daysAgo(3),
  },
];
