import { NotificationType, type Notification } from "@myt/shared";

export const mockNotifications: Notification[] = [
  { id: "notification-1", userId: "user-student-1", type: NotificationType.HOMEWORK, title: "Homework due tomorrow", body: "Quadratic equations practice set is due at 6:00pm.", link: "/student/homework/homework-1", createdAt: "2026-09-07T08:00:00.000Z", updatedAt: "2026-09-07T08:00:00.000Z" },
  { id: "notification-2", userId: "user-student-1", type: NotificationType.BOOKING, title: "Upcoming lesson confirmed", body: "Your Maths lesson with Dr. Sofia Reyes is confirmed for Tuesday at 5:00pm.", link: "/student/lessons", readAt: "2026-09-06T09:00:00.000Z", createdAt: "2026-09-06T08:00:00.000Z", updatedAt: "2026-09-06T08:00:00.000Z" },
  { id: "notification-3", userId: "user-student-1", type: NotificationType.MESSAGE, title: "New message from Dr. Sofia Reyes", body: "Great progress today — see the homework I've set for Tuesday.", link: "/student/messages", createdAt: "2026-09-01T17:12:00.000Z", updatedAt: "2026-09-01T17:12:00.000Z" },
  { id: "notification-4", userId: "user-student-1", type: NotificationType.ACHIEVEMENT, title: "Mastery milestone reached", body: "You've reached Mastered level in Algebra basics — great work!", readAt: "2026-07-02T09:00:00.000Z", createdAt: "2026-07-01T18:00:00.000Z", updatedAt: "2026-07-01T18:00:00.000Z" },
  { id: "notification-5", userId: "user-student-1", type: NotificationType.HOMEWORK, title: "Homework overdue", body: "Simultaneous equations warm-up was due on 30 August.", link: "/student/homework/homework-4", createdAt: "2026-08-31T08:00:00.000Z", updatedAt: "2026-08-31T08:00:00.000Z" },
];
