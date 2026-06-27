# R. Youtz Asphalt Maintenance

Marketing website for **R. Youtz Asphalt Maintenance** — sealcoating, crack filling, line painting, and pavement maintenance in Dauphin, Lancaster, and Lebanon counties, Pennsylvania.

Built with [Next.js](https://nextjs.org) (App Router), React, and Tailwind CSS v4. Package manager: **pnpm**.

> **Project root:** this folder (`ryoutz/`) is the Next.js app root.

---

## Important links (bookmarks)

Use this table when you need to find a dashboard or doc quickly.

| What | Where |
|------|--------|
| **Production site (Vercel)** | Your Vercel project → Deployments |
| **Vercel dashboard** | [vercel.com/dashboard](https://vercel.com/dashboard) |
| **Vercel env variables** | Project → Settings → Environment Variables |
| **Vercel custom domain** | Project → Settings → Domains |
| **Domain registrar (GoDaddy)** | [godaddy.com](https://www.godaddy.com/) → My Products → Domains |
| **Email (Google Workspace)** | [admin.google.com](https://admin.google.com/) |
| **Google App Passwords** | [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) |
| **Cloudflare Turnstile (contact form bots)** | [dash.cloudflare.com → Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile) |
| **Adobe Fonts (Typekit)** | [fonts.adobe.com](https://fonts.adobe.com/) — kit `tbw7ovt` |
| **Facebook page** | [facebook.com/RYoutzasphalt](https://www.facebook.com/RYoutzasphalt) |
| **GitHub repo** | `lotusms/ryoutz` (if deployed from GitHub) |
| **Next.js docs** | [nextjs.org/docs](https://nextjs.org/docs) |
| **Next.js on Vercel** | [vercel.com/docs/frameworks/nextjs](https://vercel.com/docs/frameworks/nextjs) |

---

## Where settings live

Not everything is in `.env.local`. Use this map when changing business info or behavior.

| Setting | File / location | Notes |
|---------|-----------------|--------|
| Business name, phone, service area | `src/config/config.js` | Single source for nav, footer, meta, contact |
| Contact form recipients (info / Tyler / Rick) | `src/config/config.js` → `contactRecipients` | Override delivery addresses with `CONTACT_RECIPIENT_*` env vars |
| Main navigation | `src/config/config.js` → `mainNav` | Add pages under `src/app/(main)/` |
| Social links (Facebook) | `src/components/SocialMediaLinks.js` | Footer and anywhere `SocialMediaLinks` is used |
| Contact form UI + Turnstile widget | `src/components/contact/ContactInquiryForm.js` | |
| Contact form API + spam checks | `src/app/api/contact/inquiry/route.js` | |
| Spam / rate limit logic | `src/lib/contact-spam-guard.mjs` | |
| Email sending (SMTP) | `src/lib/email/smtp.mjs`, `src/lib/email/contact-inquiry.mjs` | |
| Security HTTP headers | `next.config.mjs` → `headers()` | |
| Gallery images | `public/images/gallery/work/` | Auto-discovered; optional `manifest.json` |
| Before/after pairs | `public/images/before-after/` | `beforeN` + `afterN` image pairs |
| Testimonial photos | `public/images/testimonials/` | Used on home testimonial wheel |
| About page hero / portraits | `public/images/Owners.jpeg`, gallery work folder | See `AboutStudioCards.js` |
| Home hero lens images | `public/images/home-lens-hero-images/` | Filenames in `config.js` → `homeLensHeroFilenames` |
| Favicons | `public/favicon/` | |
| Secrets (SMTP, Turnstile, etc.) | `.env.local` (local) / Vercel env (production) | **Never commit** `.env.local` |
| Env variable reference (template) | `.env.example` | Copy keys from here when setting up |

---

## Local development

### Install and run

```bash
pnpm install
pnpm dev
```

- Dev starts on the first free port from **3003** (or `PORT` if set) and opens the browser.
- If the page looks broken after switching projects: `pnpm run dev:clean` and hard-refresh.

### Environment file

1. Copy the template:

```bash
cp .env.example .env.local
```

2. Fill in the values you need (SMTP, Turnstile, etc.).
3. **Restart `pnpm dev` after any change to `.env.local`.** Next.js reads env vars at startup.

SMTP **does work on localhost** — the contact form uses the same `/api/contact/inquiry` route in dev and production.

---

## Environment variables

Full template with comments: **`.env.example`**.

### Required for contact form email (production + local testing)

Mail is hosted on **Google Workspace** (domain registered at GoDaddy). Use **Google SMTP**, not GoDaddy’s `smtpout.secureserver.net`.

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info@ryoutzsealing.com
SMTP_PASS=your_google_app_password
SMTP_FROM_EMAIL=info@ryoutzsealing.com
SMTP_FROM_NAME=R. Youtz Asphalt Maintenance
```

| Variable | Purpose |
|----------|---------|
| `SMTP_HOST` | `smtp.gmail.com` for Google Workspace |
| `SMTP_PORT` | `587` (STARTTLS) or `465` (SSL with `SMTP_SECURE=true`) |
| `SMTP_SECURE` | `false` for port 587, `true` for port 465 |
| `SMTP_USER` | Workspace mailbox used to authenticate (usually `info@`) |
| `SMTP_PASS` or `SMTP_PASSWORD` | **Google App Password** — not your normal login password |
| `SMTP_FROM_EMAIL` | Should match `SMTP_USER` for Google |
| `SMTP_FROM_NAME` | Display name on outbound mail |
| `SMTP_FROM` | Optional single-line alternative: `Name <email@domain.com>` |

**Google App Password:** [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) (requires 2-Step Verification).

One SMTP login sends to all contact recipients (general, Tyler, Rick). Each `To` address must exist in Google Admin as a user, alias, or forwarder.

Optional overrides for delivery addresses:

```env
CONTACT_RECIPIENT_GENERAL=info@ryoutzsealing.com
CONTACT_RECIPIENT_TYLER=tyler@ryoutzsealing.com
CONTACT_RECIPIENT_RICK=rick@ryoutzsealing.com
```

### Recommended for production (bot protection)

```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...
```

Create keys at [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile). Add **production domain** and **`localhost`** for local dev. Copy both keys to `.env.local` and Vercel, then redeploy.

Without Turnstile keys, the form still uses honeypots, timing checks, and rate limits (see [Bot protection](#bot-protection-contact-form) below).

### Optional

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_ADOBE_FONTS_KIT_ID` | Adobe Fonts kit (default `tbw7ovt`) |
| `GALLERY_SOURCE` | `local`, `stock`, `firestore`, or `auto` — see `.env.example` |
| `PEXELS_API_KEY` | Stock placeholder images if gallery folder is empty |

Legacy Firebase / shop env vars in `.env.example` are from an older storefront build. The live site is marketing-only and reads gallery images from `public/images/` by default.

---

## Contact form

**Page:** `/contact`  
**API:** `POST /api/contact/inquiry`  
**Code:** `src/components/contact/ContactInquiryForm.js`, `src/app/api/contact/inquiry/route.js`

Visitors choose who receives the message:

| Option | Delivers to |
|--------|-------------|
| General inquiry | `info@ryoutzsealing.com` |
| Tyler | `tyler@ryoutzsealing.com` |
| Rick | `rick@ryoutzsealing.com` |

Outbound mail uses your SMTP credentials. **Reply-To** is set to the visitor’s email so you can reply directly from Gmail.

### Troubleshooting contact email

| Symptom | Likely cause |
|---------|----------------|
| “SMTP is not configured (missing: …)” | Vars missing from `.env.local` or Vercel, or dev server not restarted |
| Auth / login failed | Wrong password — use a Google **App Password** |
| Mail to Tyler/Rick bounces | Address not set up in [Google Admin](https://admin.google.com/) |
| Works locally, not on Vercel | SMTP vars not added in Vercel or deploy needed after adding them |

In **development**, the API shows detailed SMTP errors. In **production**, visitors see a generic message.

---

## Bot protection (contact form)

Implemented in `src/lib/contact-spam-guard.mjs` and enforced in `/api/contact/inquiry`.

### Always active (no extra setup)

| Layer | Behavior |
|-------|----------|
| **Honeypots** | Hidden `website` and `company` fields. If filled → fake success, no email. |
| **Timing** | Rejects submits under **3 seconds** or older than **1 hour** (silent fake success). |
| **Rate limit** | **5 submissions per IP per 15 minutes** → HTTP 429 with retry message. |
| **Field limits** | Name 120, email 254, phone 24, comments 4000 characters. |
| **Payload cap** | JSON body over **32 KB** rejected. |
| **Validation** | Server-side email, phone, date, and recipient checks. |

### With Turnstile keys configured

| Layer | Behavior |
|-------|----------|
| **Cloudflare Turnstile** | Widget on form; server verifies token with Cloudflare before sending email. **Primary defense against automated bots.** |

Turnstile setup: [Cloudflare Turnstile dashboard](https://dash.cloudflare.com/?to=/:account/turnstile)

**Rate limit note:** On Vercel, IP limits are best-effort per server instance. Turnstile is the reliable protection for scaled bot traffic.

---

## Site-wide security

| Item | Details |
|------|---------|
| **HTTP headers** | Set in `next.config.mjs`: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` |
| **API surface** | Only `POST /api/contact/inquiry` and `GET /api/catalog/products` |
| **Secrets** | SMTP and Turnstile secret keys are server-only (never `NEXT_PUBLIC_*` except Turnstile site key) |
| **Removed attack surface** | Old checkout, PayPal, dashboard, and account routes were removed |

---

## Performance

| Area | What the site does |
|------|---------------------|
| **Images** | `next/image` with AVIF/WebP; quality allow-list in `next.config.mjs` |
| **Gallery pages** | Static generation with revalidation (`revalidate: 120`) |
| **Catalog API** | 5-minute edge cache (`/api/catalog/products`) |
| **Above-the-fold gallery** | Priority / eager loading on first row |

**Optional improvements (not required):**

- Compress large PNGs in `public/images/gallery/work/` and testimonial photos
- Remove unused npm packages left from the old shop (`firebase`, PayPal, `recharts`)

---

## Hosting, domain, and email

Typical setup for this project:

| Role | Provider |
|------|----------|
| **Website hosting** | [Vercel](https://vercel.com) |
| **Domain DNS** | [GoDaddy](https://www.godaddy.com/) (registrar) |
| **Business email** | [Google Workspace](https://workspace.google.com/) |

### Point domain to Vercel

1. Vercel project → **Settings → Domains** → add `ryoutzsealing.com` (and `www`).
2. In GoDaddy DNS, set records Vercel shows (usually `A` to `76.76.21.21` or `CNAME` to `cname.vercel-dns.com`).
3. **Do not remove MX records** when changing web DNS — email stays on Google.

### Email vs website DNS

| Purpose | DNS records | Points to |
|---------|-------------|-----------|
| Website | `A` / `CNAME` | Vercel |
| Email | `MX`, SPF, DKIM | Google Workspace |

Vercel does **not** host mailboxes. SMTP in this app sends through Google using your Workspace credentials.

---

## Content management

### Gallery

- **Work photos:** `public/images/gallery/work/` — files are auto-discovered.
- **Optional metadata:** `public/images/gallery/work/manifest.json` (titles, order).
- **Rebuild script:** `scripts/build-gallery-work-images.mjs` (if batch-processing images).

### Before & after

- **Folder:** `public/images/before-after/`
- **Pairs:** `before1` + `after1`, `before2` + `after2`, etc.
- **Page:** `/gallery/before-after`

### Testimonials

- **Photos:** `public/images/testimonials/` (e.g. `greg.png`, `damian.jpeg`)
- **Copy / order:** `src/components/home/HomeTestimonialWheel.js`

### About page

- **Hero:** `public/images/Owners.jpeg`
- **Story text:** `src/components/about/AboutStudioCards.js`

### Service pages

- **Routes:** `src/app/(main)/services/*/page.js`
- **Nav blurbs:** `src/config/config.js` → `mainNav` Services children

---

## Deploy on Vercel

1. Import repo: [vercel.com/new](https://vercel.com/new)
2. **Framework:** Next.js (auto-detected)
3. **Install command:** `pnpm install`
4. Add env vars from [Environment variables](#environment-variables) (at minimum **SMTP** and **Turnstile**)
5. Deploy (`pnpm build` runs on Vercel)

After changing env vars on Vercel, **redeploy** for them to take effect.

Node `>=20.9.0` and pnpm are pinned in `package.json`.

---

## NPM scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Local dev server (port 3003+) |
| `pnpm dev:clean` | Clear `.next` cache and restart dev |
| `pnpm build` | Production build |
| `pnpm start` | Run production server locally |
| `pnpm lint` | ESLint |

Legacy Firebase/shop scripts in `package.json` are from the old storefront and are not required for the marketing site.

---

## API routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/contact/inquiry` | POST | Contact form → SMTP email |
| `/api/catalog/products` | GET | Gallery/home product JSON (cached 5 min) |

---

## Business defaults (in code)

From `src/config/config.js` (change there unless overridden by env):

- **Phone:** (717) 304-5772
- **General email:** info@ryoutzsealing.com
- **Service area:** Dauphin, Lancaster, and Lebanon counties, PA
- **Facebook:** [facebook.com/RYoutzasphalt](https://www.facebook.com/RYoutzasphalt) (no Instagram)

---

## SEO

| Item | Location |
|------|----------|
| **Page titles & meta descriptions** | Each page exports `metadata` via `buildPageMetadata()` from `src/lib/seo.js` |
| **Canonical URLs & Open Graph** | Same helper; uses `NEXT_PUBLIC_SITE_URL` or `siteDefaultUrl` in `src/config/config.js` |
| **Sitemap** | Auto-generated at `/sitemap.xml` (`src/app/sitemap.js`) |
| **Robots** | Auto-generated at `/robots.txt` (`src/app/robots.js`) |
| **Structured data (JSON-LD)** | `LocalBusiness` + `WebSite` on all main pages; breadcrumbs on gallery detail pages |
| **Legacy URL redirects** | Photography/shop routes in `next.config.mjs` → asphalt pages |

**After deploying to production:**

1. Set `NEXT_PUBLIC_SITE_URL=https://www.ryoutzsealing.com` in Vercel and redeploy.
2. Submit `https://www.ryoutzsealing.com/sitemap.xml` in [Google Search Console](https://search.google.com/search-console).
3. Verify Open Graph previews with [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) or similar.

---

## Support checklist

When something breaks, work through this list:

1. **Contact form not sending?** Check SMTP vars in `.env.local` or Vercel → restart dev / redeploy.
2. **Spam flooding inbox?** Add or verify [Turnstile](#recommended-for-production-bot-protection) keys on Vercel.
3. **Domain not loading?** Vercel Domains + GoDaddy DNS records.
4. **Email not receiving?** Google Admin → users/aliases; MX records still point to Google.
5. **Gallery missing images?** Files in `public/images/gallery/work/`; run `pnpm build` locally to test.
6. **Wrong phone or business name?** Edit `src/config/config.js`.

---

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Nodemailer](https://nodemailer.com/)
- [Cloudflare Turnstile docs](https://developers.cloudflare.com/turnstile/)
- [Google Workspace SMTP](https://support.google.com/a/answer/176600)
