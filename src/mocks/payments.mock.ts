import { PaymentStatus, type Payment } from "@myt/shared";

export const mockPayments: Payment[] = [
  {
    id: "payment-1",
    bookingId: "booking-0",
    payerId: "user-parent-1",
    amount: 42,
    currency: "GBP",
    status: PaymentStatus.PAID,
    studentId: "student-1",
    subjectId: "subject-maths",
    lessonDate: "2026-09-01T17:00:00.000Z",
    description: "60-minute lesson",
    reference: "INV-BOOKING-0",
    createdAt: "2026-09-01T17:00:00.000Z",
    updatedAt: "2026-09-01T17:00:00.000Z",
  },
  {
    id: "payment-2",
    bookingId: "booking-2",
    payerId: "user-parent-1",
    amount: 35,
    currency: "GBP",
    status: PaymentStatus.PENDING,
    studentId: "student-1",
    subjectId: "subject-english",
    lessonDate: "2026-09-01T09:00:00.000Z",
    description: "60-minute lesson",
    reference: "INV-BOOKING-2",
    createdAt: "2026-09-01T09:00:00.000Z",
    updatedAt: "2026-09-01T09:00:00.000Z",
  },
];
