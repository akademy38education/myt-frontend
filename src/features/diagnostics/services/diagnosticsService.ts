import { delay } from "@/utils/delay";
import type { QuickDiagnosticQuestion } from "../types";

/**
 * The full adaptive diagnostic engine is a future MyT Intelligence
 * capability (see ai-services/src/diagnostics and the scaffolded backend
 * `diagnostics` module) — this service is the stable seam onboarding calls
 * today with a handful of representative sample questions, so swapping in
 * the real engine later means changing this file only. It does not score
 * or generate insights yet; it only records that an attempt happened.
 */
const SAMPLE_QUESTIONS: QuickDiagnosticQuestion[] = [
  { id: "q1", prompt: "Solve for x: 2x + 6 = 14", choices: ["x = 2", "x = 4", "x = 8", "x = 10"] },
  { id: "q2", prompt: "Which of these is a prime number?", choices: ["21", "27", "29", "33"] },
  { id: "q3", prompt: "What is the value of 3² + 4²?", choices: ["7", "12", "25", "49"] },
];

export const diagnosticsService = {
  async getQuickDiagnostic(): Promise<QuickDiagnosticQuestion[]> {
    await delay(300);
    return SAMPLE_QUESTIONS;
  },

  async submitQuickDiagnostic(_answers: Record<string, string>): Promise<{ received: true }> {
    await delay(500);
    return { received: true };
  },
};
