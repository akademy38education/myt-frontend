import type { LucideIcon } from "lucide-react";
import {
  Home,
  Search,
  BookOpen,
  ClipboardList,
  Library,
  LineChart,
  Target,
  MessageSquare,
  Calendar,
  User,
  Users,
  GraduationCap,
  Wallet,
  Star,
  Clock,
  Settings,
  ShieldCheck,
  CreditCard,
  Flag,
  FileBarChart,
  BookMarked,
  HelpCircle,
  Video,
  LifeBuoy,
  FileText,
  ScrollText,
  Brain,
  Megaphone,
  ClipboardCheck,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
}

export const STUDENT_NAV: NavItem[] = [
  { label: "Home", to: "/student", icon: Home, end: true },
  { label: "Find Tutor", to: "/student/find-tutor", icon: Search },
  { label: "My Lessons", to: "/student/lessons", icon: Video },
  { label: "My Learning", to: "/student/learning", icon: Brain },
  { label: "Homework", to: "/student/homework", icon: ClipboardList },
  { label: "Learning Library", to: "/student/library", icon: Library },
  { label: "Progress", to: "/student/progress", icon: LineChart },
  { label: "Goals", to: "/student/goals", icon: Target },
  { label: "Messages", to: "/student/messages", icon: MessageSquare },
  { label: "Calendar", to: "/student/calendar", icon: Calendar },
  { label: "Profile", to: "/student/profile", icon: User },
];

export const TUTOR_NAV: NavItem[] = [
  { label: "Dashboard", to: "/tutor", icon: Home, end: true },
  { label: "Calendar", to: "/tutor/calendar", icon: Calendar },
  { label: "Lessons", to: "/tutor/lessons", icon: Video },
  { label: "Students", to: "/tutor/students", icon: Users },
  { label: "Bookings", to: "/tutor/bookings", icon: BookOpen },
  { label: "Homework", to: "/tutor/homework", icon: ClipboardList },
  { label: "Messages", to: "/tutor/messages", icon: MessageSquare },
  { label: "Earnings", to: "/tutor/earnings", icon: Wallet },
  { label: "Performance", to: "/tutor/performance", icon: LineChart },
  { label: "Reviews", to: "/tutor/reviews", icon: Star },
  { label: "Resources", to: "/tutor/resources", icon: Library },
  { label: "Availability", to: "/tutor/availability", icon: Clock },
  { label: "Tutor Profile", to: "/tutor/profile", icon: GraduationCap },
  { label: "Settings", to: "/tutor/settings", icon: Settings },
];

export const PARENT_NAV: NavItem[] = [
  { label: "Home", to: "/parent", icon: Home, end: true },
  { label: "My Children", to: "/parent/children", icon: Users },
  { label: "Calendar", to: "/parent/calendar", icon: Calendar },
  { label: "Progress", to: "/parent/progress", icon: LineChart },
  { label: "Reports", to: "/parent/reports", icon: FileBarChart },
  { label: "Tutors", to: "/parent/tutors", icon: GraduationCap },
  { label: "Lessons", to: "/parent/lessons", icon: Video },
  { label: "Bookings", to: "/parent/bookings", icon: BookOpen },
  { label: "Messages", to: "/parent/messages", icon: MessageSquare },
  { label: "Payments", to: "/parent/payments", icon: CreditCard },
  { label: "Settings", to: "/parent/settings", icon: Settings },
];

export const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", to: "/admin", icon: Home, end: true },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Tutors", to: "/admin/tutors", icon: GraduationCap },
  { label: "Verification Queue", to: "/admin/tutors/verification", icon: ClipboardCheck },
  { label: "Students", to: "/admin/students", icon: BookOpen },
  { label: "Parents", to: "/admin/parents", icon: User },
  { label: "Bookings", to: "/admin/bookings", icon: Calendar },
  { label: "Sessions", to: "/admin/sessions", icon: Video },
  { label: "Payments", to: "/admin/payments", icon: CreditCard },
  { label: "Payouts", to: "/admin/payouts", icon: Wallet },
  { label: "Disputes", to: "/admin/disputes", icon: Flag },
  { label: "Reviews", to: "/admin/reviews", icon: Star },
  { label: "Reports & Moderation", to: "/admin/reports", icon: FileBarChart },
  { label: "Support", to: "/admin/support", icon: LifeBuoy },
  { label: "Content", to: "/admin/content", icon: FileText },
  { label: "Curriculum", to: "/admin/curriculum", icon: BookMarked },
  { label: "Question Bank", to: "/admin/question-bank", icon: HelpCircle },
  { label: "Recordings", to: "/admin/recordings", icon: Video },
  { label: "Analytics", to: "/admin/analytics", icon: LineChart },
  { label: "Audit Log", to: "/admin/audit-logs", icon: ScrollText },
  { label: "Announcements", to: "/admin/announcements", icon: Megaphone },
  { label: "Platform Settings", to: "/admin/settings", icon: ShieldCheck },
];
