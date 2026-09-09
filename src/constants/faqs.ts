export interface Faq {
  question: string;
  answer: string;
  category: "Students" | "Parents" | "Tutors" | "Payments" | "Bookings" | "Technical";
}

export const FAQS: Faq[] = [
  {
    category: "Students",
    question: "How does SmartMatch choose a tutor for me?",
    answer:
      "SmartMatch looks at your subject, year group, learning goals and (once you've taken one) your diagnostic results to recommend tutors who fit your specific gaps — not just the highest-rated tutor overall.",
  },
  {
    category: "Bookings",
    question: "Can I reschedule or cancel a lesson?",
    answer: "Yes — from My Lessons you can cancel a booking, and rescheduling support is on our roadmap for tutor-approved time changes.",
  },
  {
    category: "Parents",
    question: "Can I see what happened in my child's lesson?",
    answer:
      "Every lesson is recorded and summarised automatically. Parents get an AI-generated summary, key points, and the homework that was set — visible from the parent dashboard.",
  },
  {
    category: "Payments",
    question: "How does payment work?",
    answer:
      "You pay your tutor's hourly rate per lesson — there's no MyT subscription fee for students or parents. Payment happens securely through the platform once a lesson is confirmed.",
  },
  {
    category: "Tutors",
    question: "How much can I earn as a MyT tutor?",
    answer: "You set your own hourly rate. During our beta, MyT takes 0% commission, so you keep what you charge.",
  },
  {
    category: "Technical",
    question: "What do I need to join a lesson?",
    answer: "Just a modern browser and a stable internet connection — the MyT classroom runs entirely in-browser, no downloads required.",
  },
];
