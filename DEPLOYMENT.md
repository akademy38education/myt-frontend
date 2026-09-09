# Deploying to Vercel

This repository is a single, standalone Vite + React app at the repo root — no monorepo nesting, no backend, no database.

## Step 1 — Verify the GitHub repository

Confirm `myt-frontend` on GitHub contains this code at the root: `package.json`, `vite.config.ts`, `index.html`, `src/`, `public/` should all be directly at the repository root (not inside a subfolder).

## Step 2 — Open Vercel

Go to https://vercel.com and log in (or sign up) with your GitHub account.

## Step 3 — Import the repository

Click **Add New… → Project**, then select `akademy38education/myt-frontend` from the list (click **Import** next to it). If it isn't listed, click **Adjust GitHub App Permissions** and grant access to the repo.

## Step 4 — Framework

Vercel should auto-detect **Vite**. Confirm the "Framework Preset" dropdown shows **Vite**.

## Step 5 — Build settings

Use these exact values (Vercel usually fills them in automatically once it detects Vite — just confirm they match):

| Setting | Value |
|---|---|
| Framework Preset | `Vite` |
| Root Directory | `.` (leave as the repository root — do not set a subfolder) |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

## Step 6 — Environment Variables

**No environment variables are required.** The demo build already bakes in `VITE_USE_MOCK_API=true` via the committed `.env.production` file, so the deployed site needs no backend URL, API key, or secret of any kind.

## Step 7 — Deploy

Click **Deploy**. The build takes roughly 30–60 seconds. Vercel will give you a URL like `myt-frontend.vercel.app` (or `myt-frontend-<hash>.vercel.app` for preview deploys).

## Step 8 — Test the deployed site

Open the URL. You should see the MyT landing page with the Vanta Clouds background and the rotating "Learning Universe" orbit animation in front of it. Click **Sign in** to reach the login page.

## Step 9 — Test each role

On the login page, use the one-click demo buttons (or sign in manually — see credentials below) for each of:

- **Student** → lands on `/student`, try Find Tutor → book a lesson → Homework → submit an answer
- **Tutor** → lands on `/tutor`, check the dashboard and Verification/Bookings pages
- **Parent** → lands on `/parent`, confirm the booking made as Student appears here too
- **Admin** → lands on `/admin`, try approving the pending tutor application and searching Users

Confirm a hard refresh (F5) on any dashboard route keeps you logged in and doesn't 404.

## Step 10 — Fixing SPA route refresh issues

This repo already ships a `vercel.json` with the SPA rewrite Vercel needs:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

If a direct refresh on a route like `/student` or `/admin/users` ever 404s, it means this file didn't make it into the deployed build — check that `vercel.json` is present at the repository root and redeploy.

## Demo login credentials

Password for all accounts: `Password123!`

| Role | Email |
|---|---|
| Student | `amelia.student@myt.dev` |
| Tutor | `sofia.tutor@myt.dev` |
| Parent | `james.parent@myt.dev` |
| Admin | `priya.admin@myt.dev` |

## Custom domain (optional)

In the Vercel project → **Settings → Domains**, add your domain and follow the DNS instructions Vercel shows (usually a `CNAME` to `cname.vercel-dns.com`, or an `A` record it provides).
