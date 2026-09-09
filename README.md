# MyT — Frontend Demo

A standalone, frontend-only build of the MyT tutoring platform. No backend, database, or server is required — every feature runs on in-memory/localStorage-backed demo data.

## Stack

React 18 + TypeScript + Vite, React Router, TanStack Query, Zustand (persisted to `localStorage`), Tailwind CSS, Vanta.js (Clouds/Rings/Fog/Topology backgrounds via Three.js/p5.js).

## Running locally

```bash
npm install
npm run dev       # http://localhost:5173, mock API mode (see .env.production)
npm run build     # production build into dist/
npm run preview   # serve the production build locally
```

The app always runs in mock-data mode for this build (`VITE_USE_MOCK_API=true`, set in `.env.production`, which Vite layers on top of `.env` automatically during `npm run build`). No API URL, database, or secret is required.

## Demo login

Use the one-click buttons on the login page, or sign in manually with password `Password123!`:

| Role | Email |
|---|---|
| Student | `amelia.student@myt.dev` |
| Tutor | `sofia.tutor@myt.dev` |
| Parent | `james.parent@myt.dev` |
| Admin | `priya.admin@myt.dev` |

Demo data is connected across roles — e.g. a booking made as the Student is immediately visible in the Parent's and Tutor's views, and an Admin action (approve tutor, suspend user) updates in real time. Session and demo state persist in `localStorage`; use **Admin → Settings → Demo → Reset demo data** to wipe it back to the seeded state.

## Deployment

See `DEPLOYMENT.md` for step-by-step Vercel instructions.
