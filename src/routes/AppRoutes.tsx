import { Suspense, lazy, type ComponentType } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { UserRole, PERMISSIONS } from "@myt/shared";

import { LoadingState } from "@/components/shared/LoadingState";

import { PublicLayout } from "@/layouts/public/PublicLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { StudentLayout } from "@/layouts/student/StudentLayout";
import { ParentLayout } from "@/layouts/parent/ParentLayout";
import { TutorLayout } from "@/layouts/tutor/TutorLayout";
import { AdminLayout } from "@/layouts/admin/AdminLayout";

import { HomePage } from "@/pages/public/HomePage";
import { HowItWorksPage } from "@/pages/public/HowItWorksPage";
import { ForStudentsPage } from "@/pages/public/ForStudentsPage";
import { ForParentsPage } from "@/pages/public/ForParentsPage";
import { ForTutorsPage } from "@/pages/public/ForTutorsPage";
import { SubjectsPage } from "@/pages/public/SubjectsPage";
import { PricingPage } from "@/pages/public/PricingPage";
import { AboutPage } from "@/pages/public/AboutPage";
import { HelpPage } from "@/pages/public/HelpPage";
import { PrivacyPolicyPage } from "@/pages/public/PrivacyPolicyPage";
import { TermsOfServicePage } from "@/pages/public/TermsOfServicePage";
import { FindTutorPage } from "@/pages/tutors/FindTutorPage";
import { TutorProfilePage } from "@/pages/tutors/TutorProfilePage";
import { SavedTutorsPage } from "@/pages/tutors/SavedTutorsPage";
import { CompareTutorsPage } from "@/pages/tutors/CompareTutorsPage";
import { BookTutorPage } from "@/pages/tutors/BookTutorPage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { SelectRolePage } from "@/pages/auth/SelectRolePage";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "@/pages/auth/ResetPasswordPage";
import { VerifyPage } from "@/pages/auth/VerifyPage";
import { StudentDashboardPage } from "@/pages/student/StudentDashboardPage";
import { StudentLessonsPage } from "@/pages/student/StudentLessonsPage";
import { LessonDetailPage } from "@/pages/student/LessonDetailPage";
import { StudentHomeworkPage } from "@/pages/student/StudentHomeworkPage";
import { HomeworkDetailPage } from "@/pages/student/HomeworkDetailPage";
import { StudentLibraryPage } from "@/pages/student/StudentLibraryPage";
import { LibraryResourceDetailPage } from "@/pages/student/LibraryResourceDetailPage";
import { StudentProgressPage } from "@/pages/student/StudentProgressPage";
import { MyLearningPage } from "@/pages/student/learning/MyLearningPage";
import { SubjectDetailPage } from "@/pages/student/learning/SubjectDetailPage";
import { TopicDetailPage } from "@/pages/student/learning/TopicDetailPage";
import { RevisionPage } from "@/pages/student/learning/RevisionPage";
import { StudyPlannerPage } from "@/pages/student/learning/StudyPlannerPage";
import { StudentGoalsPage } from "@/pages/student/StudentGoalsPage";
import { StudentExamsPage } from "@/pages/student/StudentExamsPage";
import { StudentCalendarPage } from "@/pages/student/StudentCalendarPage";
import { StudentMessagesPage } from "@/pages/student/StudentMessagesPage";
import { StudentProfilePage } from "@/pages/student/StudentProfilePage";
import { StudentSettingsPage } from "@/pages/student/StudentSettingsPage";
import { SmartMatchPage } from "@/pages/student/SmartMatchPage";
import { BookingConfirmationPage } from "@/pages/student/BookingConfirmationPage";
const StudentClassroomPage = lazyPage(() => import("@/pages/student/StudentClassroomPage"), "StudentClassroomPage");
import { StudentLessonSummaryPage } from "@/pages/student/StudentLessonSummaryPage";
import { ParentDashboardPage } from "@/pages/parent/ParentDashboardPage";
import { ParentBookingsPage } from "@/pages/parent/ParentBookingsPage";
import { ParentBookingDetailPage } from "@/pages/parent/ParentBookingDetailPage";
import { ParentCalendarPage } from "@/pages/parent/ParentCalendarPage";
import { ParentChildrenPage } from "@/pages/parent/ParentChildrenPage";
import { ParentChildLayout } from "@/pages/parent/child/ParentChildLayout";
import { ParentChildOverviewPage } from "@/pages/parent/child/ParentChildOverviewPage";
import { ParentChildProgressPage } from "@/pages/parent/child/ParentChildProgressPage";
import { ParentChildLessonsPage } from "@/pages/parent/child/ParentChildLessonsPage";
import { ParentChildHomeworkPage } from "@/pages/parent/child/ParentChildHomeworkPage";
import { ParentChildReportsPage } from "@/pages/parent/child/ParentChildReportsPage";
import { ParentChildTutorsPage } from "@/pages/parent/child/ParentChildTutorsPage";
import { ParentLessonsPage } from "@/pages/parent/ParentLessonsPage";
import { ParentProgressPage } from "@/pages/parent/ParentProgressPage";
import { ParentReportsPage } from "@/pages/parent/ParentReportsPage";
import { ParentReportDetailPage } from "@/pages/parent/ParentReportDetailPage";
import { ParentPaymentsPage } from "@/pages/parent/ParentPaymentsPage";
import { ParentMessagesPage } from "@/pages/parent/ParentMessagesPage";
import { ParentSettingsPage } from "@/pages/parent/ParentSettingsPage";
import { ParentBookTutorPage } from "@/pages/parent/ParentBookTutorPage";
const TutorDashboardPage = lazyPage(() => import("@/pages/tutor/TutorDashboardPage"), "TutorDashboardPage");
const TutorCalendarPage = lazyPage(() => import("@/pages/tutor/TutorCalendarPage"), "TutorCalendarPage");
const TutorAvailabilityPage = lazyPage(() => import("@/pages/tutor/TutorAvailabilityPage"), "TutorAvailabilityPage");
const TutorBookingsPage = lazyPage(() => import("@/pages/tutor/TutorBookingsPage"), "TutorBookingsPage");
const TutorBookingDetailPage = lazyPage(() => import("@/pages/tutor/TutorBookingDetailPage"), "TutorBookingDetailPage");
const TutorClassroomPage = lazyPage(() => import("@/pages/tutor/TutorClassroomPage"), "TutorClassroomPage");
const TutorLessonSummaryPage = lazyPage(() => import("@/pages/tutor/TutorLessonSummaryPage"), "TutorLessonSummaryPage");
const TutorLessonsPage = lazyPage(() => import("@/pages/tutor/TutorLessonsPage"), "TutorLessonsPage");
const TutorStudentsPage = lazyPage(() => import("@/pages/tutor/TutorStudentsPage"), "TutorStudentsPage");
const TutorStudentDetailPage = lazyPage(() => import("@/pages/tutor/TutorStudentDetailPage"), "TutorStudentDetailPage");
const TutorEarningsPage = lazyPage(() => import("@/pages/tutor/TutorEarningsPage"), "TutorEarningsPage");
const TutorPerformancePage = lazyPage(() => import("@/pages/tutor/TutorPerformancePage"), "TutorPerformancePage");
const TutorReviewsPage = lazyPage(() => import("@/pages/tutor/TutorReviewsPage"), "TutorReviewsPage");
const TutorResourcesPage = lazyPage(() => import("@/pages/tutor/TutorResourcesPage"), "TutorResourcesPage");
const TutorMessagesPage = lazyPage(() => import("@/pages/tutor/TutorMessagesPage"), "TutorMessagesPage");
const TutorHomeworkPage = lazyPage(() => import("@/pages/tutor/TutorHomeworkPage"), "TutorHomeworkPage");
const TutorOwnProfilePage = lazyPage(() => import("@/pages/tutor/TutorProfilePage"), "TutorProfilePage");
const TutorSettingsPage = lazyPage(() => import("@/pages/tutor/TutorSettingsPage"), "TutorSettingsPage");
const AdminDashboardPage = lazyPage(() => import("@/pages/admin/AdminDashboardPage"), "AdminDashboardPage");
const AdminUsersPage = lazyPage(() => import("@/pages/admin/AdminUsersPage"), "AdminUsersPage");
const AdminTutorVerificationPage = lazyPage(() => import("@/pages/admin/AdminTutorVerificationPage"), "AdminTutorVerificationPage");
const AdminTutorsPage = lazyPage(() => import("@/pages/admin/AdminTutorsPage"), "AdminTutorsPage");
const AdminStudentsPage = lazyPage(() => import("@/pages/admin/AdminStudentsPage"), "AdminStudentsPage");
const AdminParentsPage = lazyPage(() => import("@/pages/admin/AdminParentsPage"), "AdminParentsPage");
const AdminBookingsPage = lazyPage(() => import("@/pages/admin/AdminBookingsPage"), "AdminBookingsPage");
const AdminLessonsPage = lazyPage(() => import("@/pages/admin/AdminLessonsPage"), "AdminLessonsPage");
const AdminPaymentsPage = lazyPage(() => import("@/pages/admin/AdminPaymentsPage"), "AdminPaymentsPage");
const AdminPayoutsPage = lazyPage(() => import("@/pages/admin/AdminPayoutsPage"), "AdminPayoutsPage");
const AdminReviewsPage = lazyPage(() => import("@/pages/admin/AdminReviewsPage"), "AdminReviewsPage");
const AdminReportsPage = lazyPage(() => import("@/pages/admin/AdminReportsPage"), "AdminReportsPage");
const AdminSupportPage = lazyPage(() => import("@/pages/admin/AdminSupportPage"), "AdminSupportPage");
const AdminContentPage = lazyPage(() => import("@/pages/admin/AdminContentPage"), "AdminContentPage");
const AdminAnalyticsPage = lazyPage(() => import("@/pages/admin/AdminAnalyticsPage"), "AdminAnalyticsPage");
const AdminAuditLogPage = lazyPage(() => import("@/pages/admin/AdminAuditLogPage"), "AdminAuditLogPage");
const AdminSettingsPage = lazyPage(() => import("@/pages/admin/AdminSettingsPage"), "AdminSettingsPage");
const AdminAnnouncementsPage = lazyPage(() => import("@/pages/admin/AdminAnnouncementsPage"), "AdminAnnouncementsPage");
import { ComingSoonPage } from "@/pages/ComingSoonPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

import { StudentOnboardingLayout } from "@/pages/onboarding/student/StudentOnboardingLayout";
import { StudentBasicInfoStep } from "@/pages/onboarding/student/StudentBasicInfoStep";
import { StudentEducationStep } from "@/pages/onboarding/student/StudentEducationStep";
import { StudentSubjectsStep } from "@/pages/onboarding/student/StudentSubjectsStep";
import { StudentGoalsStep } from "@/pages/onboarding/student/StudentGoalsStep";
import { StudentPreferencesStep } from "@/pages/onboarding/student/StudentPreferencesStep";
import { StudentDiagnosticStep } from "@/pages/onboarding/student/StudentDiagnosticStep";
import { StudentCompleteStep } from "@/pages/onboarding/student/StudentCompleteStep";

import { ParentOnboardingLayout } from "@/pages/onboarding/parent/ParentOnboardingLayout";
import { ParentAccountStep } from "@/pages/onboarding/parent/ParentAccountStep";
import { ParentChildrenStep } from "@/pages/onboarding/parent/ParentChildrenStep";
import { ParentGoalsStep } from "@/pages/onboarding/parent/ParentGoalsStep";
import { ParentPermissionsStep } from "@/pages/onboarding/parent/ParentPermissionsStep";
import { ParentCompleteStep } from "@/pages/onboarding/parent/ParentCompleteStep";

import { TutorOnboardingLayout } from "@/pages/onboarding/tutor/TutorOnboardingLayout";
import { TutorProfileStep } from "@/pages/onboarding/tutor/TutorProfileStep";
import { TutorSubjectsStep } from "@/pages/onboarding/tutor/TutorSubjectsStep";
import { TutorExperienceStep } from "@/pages/onboarding/tutor/TutorExperienceStep";
import { TutorQualificationsStep } from "@/pages/onboarding/tutor/TutorQualificationsStep";
import { TutorVerificationStep } from "@/pages/onboarding/tutor/TutorVerificationStep";
import { TutorTeachingStyleStep } from "@/pages/onboarding/tutor/TutorTeachingStyleStep";
import { TutorPricingStep } from "@/pages/onboarding/tutor/TutorPricingStep";
import { TutorAvailabilityStep } from "@/pages/onboarding/tutor/TutorAvailabilityStep";
import { TutorReviewStep } from "@/pages/onboarding/tutor/TutorReviewStep";
import { TutorApplicationStatusPage } from "@/pages/onboarding/tutor/TutorApplicationStatusPage";

import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { RoleGuard } from "@/routes/RoleGuard";
import { PermissionGuard } from "@/routes/PermissionGuard";

// Wraps a code-split page module's named export so React.lazy (which expects a
// default export) can resolve it. Keeps the rest of the file's named-export
// import style intact for lazy-loaded pages.
function lazyPage<T extends ComponentType>(factory: () => Promise<Record<string, T>>, exportName: string) {
  return lazy(() =>
    factory().then((module) => ({ default: module[exportName] as T }))
  );
}

const STUDENT_SUBROUTES = ["mastery"];
// Genuinely out of scope for Phase 10 (no backend module exists yet) — left
// as a placeholder rather than a dead nav link with no route at all.
const ADMIN_COMING_SOON_SUBROUTES = ["disputes", "curriculum", "question-bank", "recordings"];
export function AppRoutes() {
  return (
    <Routes>
      {/* ---- Public marketing site ---- */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/find-tutor" element={<FindTutorPage />} />
        <Route path="/tutors/:id" element={<TutorProfilePage />} />
        <Route path="/tutors/:id/reviews" element={<TutorProfilePage />} />
        <Route path="/tutors/:id/availability" element={<TutorProfilePage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/for-students" element={<ForStudentsPage />} />
        <Route path="/for-parents" element={<ForParentsPage />} />
        <Route path="/for-tutors" element={<ForTutorsPage />} />
        <Route path="/subjects" element={<SubjectsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
      </Route>

      {/* ---- Role selection (its own full-page shell, not the narrow auth card) ---- */}
      <Route path="/select-role" element={<SelectRolePage />} />

      {/* ---- Authentication ---- */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify" element={<VerifyPage />} />
      </Route>

      {/* ---- Student ---- */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleGuard allow={[UserRole.STUDENT]} />}>
          <Route path="/onboarding/student" element={<StudentOnboardingLayout />}>
            <Route index element={<Navigate to="basic-info" replace />} />
            <Route path="basic-info" element={<StudentBasicInfoStep />} />
            <Route path="education" element={<StudentEducationStep />} />
            <Route path="subjects" element={<StudentSubjectsStep />} />
            <Route path="goals" element={<StudentGoalsStep />} />
            <Route path="preferences" element={<StudentPreferencesStep />} />
            <Route path="diagnostic" element={<StudentDiagnosticStep />} />
            <Route path="complete" element={<StudentCompleteStep />} />
          </Route>

          {/* The live classroom is deliberately NOT nested inside StudentLayout — it owns its own full-screen header/controls (Phase 7 spec §7), not the app's sidebar/topbar chrome. */}
          <Route
            path="/student/classroom/:id"
            element={
              <Suspense fallback={<LoadingState label="Loading..." />}>
                <StudentClassroomPage />
              </Suspense>
            }
          />

          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<StudentDashboardPage />} />
            <Route path="find-tutor" element={<FindTutorPage />} />
            <Route path="smart-match" element={<SmartMatchPage />} />
            <Route path="tutors/saved" element={<SavedTutorsPage />} />
            <Route path="tutors/compare" element={<CompareTutorsPage />} />
            <Route path="tutors/:id" element={<TutorProfilePage />} />
            <Route path="tutors/:id/reviews" element={<TutorProfilePage />} />
            <Route path="tutors/:id/availability" element={<TutorProfilePage />} />
            <Route path="tutors/:id/book" element={<BookTutorPage />} />
            <Route path="lessons" element={<StudentLessonsPage />} />
            <Route path="lessons/:id" element={<LessonDetailPage />} />
            <Route path="lessons/:id/summary" element={<StudentLessonSummaryPage />} />
            {/* "Bookings" and "My Lessons" are the same booking data from two entry points named in the Phase 6 spec — same pages, no duplicated feature. */}
            <Route path="bookings" element={<StudentLessonsPage />} />
            <Route path="bookings/:id" element={<LessonDetailPage />} />
            <Route path="bookings/:id/confirmation" element={<BookingConfirmationPage />} />
            <Route path="homework" element={<StudentHomeworkPage />} />
            <Route path="homework/:id" element={<HomeworkDetailPage />} />
            <Route path="library" element={<StudentLibraryPage />} />
            <Route path="library/:id" element={<LibraryResourceDetailPage />} />
            <Route path="progress" element={<StudentProgressPage />} />
            <Route path="learning" element={<MyLearningPage />} />
            <Route path="learning/subjects/:subjectId" element={<SubjectDetailPage />} />
            <Route path="learning/topics/:topicId" element={<TopicDetailPage />} />
            <Route path="learning/revision" element={<RevisionPage />} />
            <Route path="learning/study-plan" element={<StudyPlannerPage />} />
            <Route path="goals" element={<StudentGoalsPage />} />
            <Route path="exams" element={<StudentExamsPage />} />
            <Route path="calendar" element={<StudentCalendarPage />} />
            <Route path="messages" element={<StudentMessagesPage />} />
            <Route path="profile" element={<StudentProfilePage />} />
            <Route path="settings" element={<StudentSettingsPage />} />
            {STUDENT_SUBROUTES.map((path) => (
              <Route key={path} path={path} element={<ComingSoonPage />} />
            ))}
          </Route>
        </Route>

        {/* ---- Parent ---- */}
        <Route element={<RoleGuard allow={[UserRole.PARENT]} />}>
          <Route path="/onboarding/parent" element={<ParentOnboardingLayout />}>
            <Route index element={<Navigate to="account" replace />} />
            <Route path="account" element={<ParentAccountStep />} />
            <Route path="children" element={<ParentChildrenStep />} />
            <Route path="goals" element={<ParentGoalsStep />} />
            <Route path="permissions" element={<ParentPermissionsStep />} />
            <Route path="complete" element={<ParentCompleteStep />} />
          </Route>

          <Route path="/parent" element={<ParentLayout />}>
            <Route index element={<ParentDashboardPage />} />
            <Route path="find-tutor" element={<FindTutorPage />} />
            <Route path="tutors" element={<FindTutorPage />} />
            <Route path="tutors/saved" element={<SavedTutorsPage />} />
            <Route path="tutors/compare" element={<CompareTutorsPage />} />
            <Route path="tutors/:id" element={<TutorProfilePage />} />
            <Route path="tutors/:id/reviews" element={<TutorProfilePage />} />
            <Route path="tutors/:id/availability" element={<TutorProfilePage />} />
            <Route path="tutors/:id/book" element={<ParentBookTutorPage />} />
            <Route path="bookings" element={<ParentBookingsPage />} />
            <Route path="bookings/:id" element={<ParentBookingDetailPage />} />
            <Route path="calendar" element={<ParentCalendarPage />} />
            <Route path="lessons" element={<ParentLessonsPage />} />
            <Route path="progress" element={<ParentProgressPage />} />
            <Route path="reports" element={<ParentReportsPage />} />
            <Route path="reports/:id" element={<ParentReportDetailPage />} />
            <Route path="payments" element={<ParentPaymentsPage />} />
            <Route path="messages" element={<ParentMessagesPage />} />
            <Route path="settings" element={<ParentSettingsPage />} />
            <Route path="children" element={<ParentChildrenPage />} />
            <Route path="children/:id" element={<ParentChildLayout />}>
              <Route index element={<ParentChildOverviewPage />} />
              <Route path="progress" element={<ParentChildProgressPage />} />
              <Route path="lessons" element={<ParentChildLessonsPage />} />
              <Route path="homework" element={<ParentChildHomeworkPage />} />
              <Route path="reports" element={<ParentChildReportsPage />} />
              <Route path="tutors" element={<ParentChildTutorsPage />} />
            </Route>
          </Route>
        </Route>

        {/* ---- Tutor ---- */}
        <Route element={<RoleGuard allow={[UserRole.TUTOR]} />}>
          <Route path="/onboarding/tutor" element={<TutorOnboardingLayout />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<TutorProfileStep />} />
            <Route path="subjects" element={<TutorSubjectsStep />} />
            <Route path="experience" element={<TutorExperienceStep />} />
            <Route path="qualifications" element={<TutorQualificationsStep />} />
            <Route path="verification" element={<TutorVerificationStep />} />
            <Route path="teaching-style" element={<TutorTeachingStyleStep />} />
            <Route path="pricing" element={<TutorPricingStep />} />
            <Route path="availability" element={<TutorAvailabilityStep />} />
            <Route path="review" element={<TutorReviewStep />} />
          </Route>
          <Route path="/onboarding/tutor/status" element={<TutorApplicationStatusPage />} />

          <Route
            path="/tutor/classroom/:id"
            element={
              <Suspense fallback={<LoadingState label="Loading..." />}>
                <TutorClassroomPage />
              </Suspense>
            }
          />

          <Route path="/tutor" element={<TutorLayout />}>
            <Route
              element={
                <Suspense fallback={<LoadingState label="Loading..." />}>
                  <Outlet />
                </Suspense>
              }
            >
              <Route index element={<TutorDashboardPage />} />
              <Route path="calendar" element={<TutorCalendarPage />} />
              <Route path="availability" element={<TutorAvailabilityPage />} />
              <Route path="bookings" element={<TutorBookingsPage />} />
              <Route path="bookings/:id" element={<TutorBookingDetailPage />} />
              <Route path="lessons" element={<TutorLessonsPage />} />
              {/* "/tutor/lessons/:id" is the spec's named route for the same booking detail — one page, two entry points, matching the student-side "bookings"/"lessons" pattern. */}
              <Route path="lessons/:id" element={<TutorBookingDetailPage />} />
              <Route path="lessons/:id/summary" element={<TutorLessonSummaryPage />} />
              <Route path="students" element={<TutorStudentsPage />} />
              <Route path="students/:id" element={<TutorStudentDetailPage />} />
              <Route path="homework" element={<TutorHomeworkPage />} />
              <Route path="messages" element={<TutorMessagesPage />} />
              <Route path="earnings" element={<TutorEarningsPage />} />
              <Route path="performance" element={<TutorPerformancePage />} />
              <Route path="reviews" element={<TutorReviewsPage />} />
              <Route path="resources" element={<TutorResourcesPage />} />
              <Route path="profile" element={<TutorOwnProfilePage />} />
              <Route path="settings" element={<TutorSettingsPage />} />
            </Route>
          </Route>
        </Route>

        {/* ---- Admin ---- */}
        <Route element={<RoleGuard allow={[UserRole.ADMIN]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route
              element={
                <Suspense fallback={<LoadingState label="Loading..." />}>
                  <Outlet />
                </Suspense>
              }
            >
              <Route index element={<AdminDashboardPage />} />

              <Route element={<PermissionGuard require={PERMISSIONS.USERS_VIEW} />}>
                <Route path="users" element={<AdminUsersPage />} />
              </Route>

              <Route element={<PermissionGuard require={PERMISSIONS.TUTORS_VIEW} />}>
                <Route path="tutors" element={<AdminTutorsPage />} />
              </Route>
              <Route element={<PermissionGuard require={PERMISSIONS.TUTORS_VERIFY} />}>
                <Route path="tutors/verification" element={<AdminTutorVerificationPage />} />
              </Route>

              <Route element={<PermissionGuard require={PERMISSIONS.STUDENTS_VIEW} />}>
                <Route path="students" element={<AdminStudentsPage />} />
              </Route>
              <Route element={<PermissionGuard require={PERMISSIONS.PARENTS_VIEW} />}>
                <Route path="parents" element={<AdminParentsPage />} />
              </Route>

              <Route element={<PermissionGuard require={PERMISSIONS.BOOKINGS_VIEW} />}>
                <Route path="bookings" element={<AdminBookingsPage />} />
                <Route path="sessions" element={<AdminLessonsPage />} />
              </Route>

              <Route element={<PermissionGuard require={PERMISSIONS.PAYMENTS_VIEW} />}>
                <Route path="payments" element={<AdminPaymentsPage />} />
              </Route>
              <Route element={<PermissionGuard require={PERMISSIONS.PAYOUTS_VIEW} />}>
                <Route path="payouts" element={<AdminPayoutsPage />} />
              </Route>

              <Route element={<PermissionGuard require={PERMISSIONS.REVIEWS_MODERATE} />}>
                <Route path="reviews" element={<AdminReviewsPage />} />
              </Route>
              <Route element={<PermissionGuard require={PERMISSIONS.REPORTS_VIEW} />}>
                <Route path="reports" element={<AdminReportsPage />} />
              </Route>

              <Route element={<PermissionGuard require={PERMISSIONS.SUPPORT_VIEW} />}>
                <Route path="support" element={<AdminSupportPage />} />
              </Route>
              <Route element={<PermissionGuard require={PERMISSIONS.CONTENT_VIEW} />}>
                <Route path="content" element={<AdminContentPage />} />
              </Route>

              <Route element={<PermissionGuard require={PERMISSIONS.ANALYTICS_VIEW} />}>
                <Route path="analytics" element={<AdminAnalyticsPage />} />
              </Route>
              <Route element={<PermissionGuard require={PERMISSIONS.AUDIT_VIEW} />}>
                <Route path="audit-logs" element={<AdminAuditLogPage />} />
              </Route>
              <Route element={<PermissionGuard require={PERMISSIONS.NOTIFICATIONS_MANAGE} />}>
                <Route path="announcements" element={<AdminAnnouncementsPage />} />
              </Route>
              <Route element={<PermissionGuard require={PERMISSIONS.SETTINGS_VIEW} />}>
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>

              {ADMIN_COMING_SOON_SUBROUTES.map((path) => (
                <Route key={path} path={path} element={<ComingSoonPage />} />
              ))}
            </Route>
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
