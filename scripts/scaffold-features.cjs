// Codegen for frontend features that are architecturally reserved but not
// implemented in this phase. Mirrors backend/scripts/scaffold-modules.js.
// Safe to re-run — skips any feature that already has an index.ts.
const fs = require("fs");
const path = require("path");

const FEATURES = {
  onboarding: "Guided first-run flow: role confirmation, subject/goal capture for students, child linking for parents, and tutor profile setup.",
  "smart-match": "Student-facing surface for MyT Intelligence tutor recommendations, consuming the backend `smart-match` module.",
  diagnostics: "Initial and periodic diagnostic assessments a student takes to identify strengths/gaps before matching and lesson planning.",
  calendar: "Unified calendar view across bookings, lessons and tutor availability, with day/week/month layouts.",
  lessons: "Lesson detail view: status, summary, linked recording and follow-up homework, distinct from the Booking that scheduled it.",
  classroom: "The live virtual classroom UI (video/audio, shared workspace, in-session chat). Real-time events via the socket client in `services/socket.ts`.",
  recordings: "Lesson recording playback with AI-generated chapters, bookmarks and transcript search.",
  homework: "Assigning (tutor), submitting (student) and reviewing homework, including file upload via components/ui/file-upload.",
  "question-bank": "Authoring and browsing the question bank behind homework, diagnostics and exam mode.",
  "learning-library": "Browsable library of learning resources recommended to students based on mastery gaps.",
  mastery: "Per-student, per-topic mastery visualization (radar/heatmap views) feeding goals and tutor lesson prep.",
  goals: "Student-defined or tutor-suggested learning goals with progress tracking.",
  "exam-mode": "Timed, exam-condition assessment UI drawing question sets from the question bank.",
  messaging: "Direct messaging UI between students/parents and tutors, backed by the real-time socket client.",
  notifications: "Notification center (bell dropdown + full list) for booking, lesson, homework, message and payment events.",
  payments: "Payment methods, invoices and checkout UI for a booking, delegating to the pluggable backend payment provider.",
  reviews: "Leaving and browsing tutor reviews/ratings after a completed lesson.",
  earnings: "Tutor earnings ledger and payout history view.",
  reports: "Parent/admin-facing progress and performance report viewer, generated from mastery and lesson data.",
  "tutor-copilot": "In-session and pre-lesson AI assistant for tutors (lesson prep suggestions, live prompts), consuming the ai-services `tutor-copilot` capability.",
  settings: "Account, notification and privacy settings shared across all four roles.",
};

const root = path.resolve(__dirname, "..", "src", "features");

for (const [name, description] of Object.entries(FEATURES)) {
  const dir = path.join(root, name);
  fs.mkdirSync(dir, { recursive: true });

  const indexFile = path.join(dir, "index.ts");
  if (fs.existsSync(indexFile)) {
    console.log(`skip (already implemented): ${name}`);
    continue;
  }

  fs.writeFileSync(
    path.join(dir, "README.md"),
    `# ${name} feature\n\n` +
      `**Status:** scaffolded foundation — not yet implemented.\n\n` +
      `**Responsibility:** ${description}\n\n` +
      `When implementing, follow the pattern used by the reference features (\`students\`, ` +
      `\`tutor-search\`, \`bookings\`): a \`services/*Service.ts\` with a mock/real-API switch on ` +
      `\`env.VITE_USE_MOCK_API\`, TanStack Query hooks in \`hooks/\`, presentational pieces in ` +
      `\`components/\`, and a single \`index.ts\` barrel export. Pages import only from the barrel.\n`
  );

  fs.writeFileSync(
    path.join(dir, "types.ts"),
    `/**\n * DTOs specific to the "${name}" feature go here once implemented.\n` +
      ` * Cross-cutting entity shapes belong in \`@myt/shared\`, not here.\n */\nexport {};\n`
  );

  console.log(`scaffolded: ${name}`);
}
