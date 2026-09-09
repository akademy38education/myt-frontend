# diagnostics feature

**Status:** partially implemented — a "quick diagnostic" sample used by student onboarding (see `pages/onboarding/student/StudentDiagnosticStep.tsx`). The full adaptive diagnostic engine (subject-wide, AI-scored) described in the product blueprint is not implemented — see `ai-services/src/diagnostics` and the scaffolded backend `diagnostics` module for where that lands later.

**Responsibility:** Initial and periodic diagnostic assessments a student takes to identify strengths/gaps before matching and lesson planning.

`services/diagnosticsService.ts` returns a small set of representative sample questions and records that an attempt happened — it does not score answers or generate insights. Swapping in the real engine means changing this service only; `StudentDiagnosticStep` and the barrel export shape stay the same.
