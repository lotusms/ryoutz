# RYoutz Asphalt Maintenance

> **Project root:** This folder (`ryoutz/`) is the Next.js app root.

Storefront app built with [Next.js](https://nextjs.org), React, Tailwind CSS, and Firebase using `pnpm`.

## Getting Started

Install dependencies if needed and start the development server:

```bash
pnpm install
pnpm dev
```

Run `pnpm run dev` — the dev script picks the first free port starting at **3003** (or `PORT` if set) and opens that URL in your browser. If the page looks broken after switching projects, run `pnpm run dev:clean` and hard-refresh the browser.

## Environment & Firebase

1. Copy the example env file:

```bash
cp .env.local.example .env.local
cp .env.example .env.local   # merge Firebase / Mapbox keys as needed
```

2. Create a Firebase project (suggested project ID: `ryoutz`) and point `.firebaserc` / `NEXT_PUBLIC_FIREBASE_*` vars at it. Do **not** reuse service account keys from other brands—download new credentials for this project only.
3. Paste Firebase web app config and secrets into `.env.local`.
4. **Server / Admin SDK:** pick one — `FIREBASE_SERVICE_ACCOUNT_JSON` (single-line JSON, best for Vercel), `FIREBASE_SERVICE_ACCOUNT_PATH=./your-key.json` (file at repo root or any path), or `GOOGLE_APPLICATION_CREDENTIALS` (standard GCP path). Never commit the JSON file; `.gitignore` already ignores `*firebase-adminsdk*.json`.

## Available Scripts

- `pnpm run dev` starts the local development server.
- `pnpm build` creates the production build.
- `pnpm start` runs the production server.
- `pnpm lint` runs ESLint.

## Stack

- Next.js App Router
- React
- Tailwind CSS v4
- Firebase Web SDK

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)

## Deploy on Vercel

1. Import this repo in [Vercel](https://vercel.com/new).
2. **Framework:** Next.js (auto-detected). **Install command:** `pnpm install`.
3. Add every required key from `.env.example` under Project → Settings → Environment Variables.
4. Deploy (`pnpm build`).

This repo pins Node `>=20.9.0` and `pnpm` via `packageManager` in `package.json`.

- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
