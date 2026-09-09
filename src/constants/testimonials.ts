export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  rating: number;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "My daughter's Maths mock grade went from a 5 to a 7 in one term. The lesson summaries let me actually see what they worked on, not just a receipt.",
    name: "Fatima R.",
    role: "Parent of a Year 11 student",
    rating: 5,
  },
  {
    quote:
      "SmartMatch put me with a Physics tutor who already knew my exam board and my weak topics before our first lesson. That never happened on other platforms.",
    name: "Daniel K.",
    role: "A-Level student",
    rating: 5,
  },
  {
    quote:
      "The AI lesson summaries save me at least 20 minutes after every session, and the homework it suggests actually matches what we covered.",
    name: "Dr. Sofia Reyes",
    role: "MyT Tutor, Maths & Physics",
    rating: 5,
  },
];
