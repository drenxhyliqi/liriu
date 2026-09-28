# NSH LIRIU — project handoff

Read this before touching the code. It's the "what is this, what's real,
what's fake, what's next" doc for picking this project back up cold —
whether that's a future Claude session or the actual client.

## What this is

A marketing + product-catalog website for **NSH LIRIU**, a Kosovo company
doing road/traffic infrastructure: traffic engineering, road signage
(horizontal + vertical), construction/installation, consulting, accident
expertise, illuminated signage. Site is **Albanian-only** (`lang="sq"`).

Brand system is strict and deliberate: black / white / red only. Red is
`#c1121c` — RAL 3020 "Traffic Red", the actual European road-sign red
standard, chosen because it's a verifiable industry reference, not an
arbitrary pick. Sharp, architectural, no rounded-corner-heavy "generic
SaaS" look. See `src/app/globals.css` for the token definitions.

**Two pieces, connected:**
1. **Frontend** (repo root) — Next.js 16 site and admin dashboard. Reads the
   catalog from the backend and posts quote requests / contact messages to
   it. Talks to the API server-side only (`API_URL`, default
   `http://localhost:8000`).
2. **Backend** (`backend/`) — FastAPI + Postgres (Docker). Source of truth
   for the catalog, orders, messages and admin accounts. See
   `backend/README.md` for setup and the API surface.

To run everything locally: `docker compose up -d`, then `npm run dev`. A
fresh database needs `alembic upgrade head`, `scripts.seed_catalog` and
`scripts.create_admin` (commands in `backend/README.md`). The local test
login is noted in `backend/.env` (gitignored).

## The one rule that matters more than any other

**Never invent business facts.** No fabricated prices, specs, certifications,
client names, project details, phone numbers, addresses, or capabilities.
This has been enforced hard throughout the build:
- `services.ts`, `projects.ts`, `clients.ts` (in `src/lib/data/`) all
  have `CLIENT INFORMATION REQUIRED` / `STARTER STRUCTURE` comments marking
  exactly what's real (confirmed service names/order) vs. missing entirely
  (project case studies, client logos).
- The product catalog lives in the database. Its starter content
  (`backend/seed/catalog.json`) uses standard road-signage terminology and
  the sign images supplied during the build - not verified LIRIU SKUs, and
  there are no prices anywhere.
- `src/lib/social-placeholder.ts` holds **dummy** Facebook/WhatsApp/email
  values, explicitly flagged, explicitly separate from `constants.ts`
  (which is "verified facts only"). Swap before launch.
- The `/porosia` cart flow is a **quote request**, not checkout — there's
  no payment button anywhere on the site. This was an explicit decision
  after a pasted reference component included a fake "Checkout" button
  with invented dollar prices; building real payment would require prices
  that don't exist and haven't been confirmed by the client.

If you're extending this site and don't have a real value for something,
leave it out and mark it, the way the rest of the codebase does. Don't
guess to make a section "look done."

## Frontend — what's built

Route groups: `(site)` gets the public Navbar+Footer chrome; `/login` and
`/admin` deliberately sit outside it (bare layout).

**Public site** (`src/app/(site)/`): home, about, services, products,
projects, contact, `/porosia` (cart/quote request).

**Catalog** (`/products`, `/products/[...slug]`): a category tree of any
depth plus products, all from the API (`src/lib/catalog.ts`, fetched once and
cached under the `catalog` tag; admin edits invalidate it immediately).
Categories and products share one slug namespace, so every page lives at
`/products/[slug]`; older nested URLs and `?category=` redirect. Category
pages list subcategories, then products, with search once there are 10+
products underneath.

**Homepage**: one continuous GSAP ScrollTrigger sequence
(`src/components/ui/story-scroll.tsx` + `homepage-story.tsx`) — panels pin
and rotate into view on scroll, running on **every** breakpoint including
mobile (`ScrollTrigger.config({ ignoreMobileResize: true })` + `min-h-svh`
sizing keep the pins stable through mobile browser-chrome resize).

**Cart** (`src/lib/cart-context.tsx` + `cart-button.tsx`): localStorage-
persisted, portalled to `document.body` (the navbar has a
`backdrop-filter`/`transform` that creates a CSS containing block — a
`fixed` drawer rendered inside `<header>` gets trapped and collapses to
80px; portalling out fixes this permanently, see git history commit
around 2026-08-31 for the full diagnosis).

**Navbar/mobile menu**: solid white at every breakpoint on mobile
(including over the homepage hero, unlike desktop which stays transparent
there). Mobile menu link list has a staggered fade-up entrance animation
and no numbered rows (arrow-indicator design instead). Social icons
(Facebook/WhatsApp/email — dummy data) live in both the footer and the
mobile menu. The admin/login icon is **not** in the main nav — it only
appears bottom-right inside the opened mobile menu panel, and as a small
icon on desktop's top bar.

**Admin** (`/login`, `/admin/...`): real login (JWT from the API stored in
an httpOnly cookie, `src/lib/admin/session.ts`; `src/proxy.ts` bounces
signed-out visitors to `/login`). Routes: overview with stats, Porositë
(quote requests with product images, status + internal note), Mesazhet
(auto-marked read on open), Kategoritë (tree, create/edit/delete with
image), Produktet (search/filter/paginate, multi-category, image upload),
Profili (name/email/password), Përdoruesit (owners manage admins). All
mutations are server actions in `src/app/admin/actions.ts`. Forms submit via
`startTransition` instead of `<form action>` so a validation error doesn't
reset what the user typed. Image uploads go through
`/api/admin/upload` to the API, which stores WebP files served at `/media/*`
(proxied by `next.config.ts`).

Dates in client components use `formatDateTime` in `src/lib/admin/format.ts`
(assembled from parts) - locale-formatted dates differ between Node and
browsers and break hydration.

**Known cross-session gotcha**: files a user drops in chat land as 0-byte
stubs in the project directory; the real file is in `~/Downloads` (or
`~/Desktop` for screenshots) — search there instead of asking for a re-drop.

**Known tooling gotcha**: the Claude-in-Chrome automation tab runs
`document.hidden = true`, so `requestAnimationFrame` never fires there —
any framer-motion/GSAP animation will look permanently "stuck at initial
state" if you poll its style from that tab. This is a measurement
artifact, not a real bug — verify layout/DOM facts instead, or force the
animation's end-state styles manually before screenshotting, and trust
real device testing over what that tab shows mid-animation.

## Backend — what's built

FastAPI + PostgreSQL 16 (Docker) + Alembic. Full detail in
**`backend/README.md`**. Rebuilt on 2026-09-28 around a category tree and
many-to-many product placements to match how the site's catalog actually
works; the old category → product → variant model and the unused
Cloudinary integration are gone. Verified end to end against a real
database: a scripted smoke test covering auth, permissions, the tree,
uploads, products, orders, messages and users, plus the full admin flow in a
browser. The repo has no fake persisted state - test data was deleted
afterwards.

## Next steps, roughly in order

1. **Create the real owner account** and remove the test login, then load
   the client's real product data through the dashboard.
2. **Email notifications.** New quote requests already email the admin via
   Resend (see `backend/README.md`, "New-order emails"). Still to do: verify
   the company domain in Resend, point `MAIL_FROM` / `ORDER_NOTIFY_EMAILS`
   at it, and add the same for contact messages.
3. **Replace the placeholder About timeline entries.** `/about`'s history
   spine runs on a five-year cadence (2012, 2013, 2017, 2022, Sot). The
   2017 and 2022 entries are **written copy, not client-confirmed history**
   - added on request to fill the timeline until the real one arrives. They
   were deliberately written without checkable claims (no project or client
   names, no headcount, revenue, certifications or contract wins), but they
   still describe the company and must be replaced or removed before launch.
   Find them with `placeholder: true` in `src/app/(site)/about/page.tsx`, or
   in a rendered page via `[data-placeholder]`. 2012, 2013 and "Sot" are
   confirmed - leave those alone.
4. **Get real content from the client**: product photography, verified
   specs/certifications if any exist, project case studies (with explicit
   publish permission — see `Project.publishApproved` in
   `src/types/index.ts`), client logos (same — `Client.publishApproved`),
   service page copy (`shortDescription`/`overview`/`capabilities`/
   `process` are all currently unset on purpose).
5. **Replace placeholder social/contact data** in
   `src/lib/social-placeholder.ts` with the real Facebook page, WhatsApp
   business number, and email once confirmed.
6. **Spam protection** (rate limiting / captcha) on the public order and
   contact endpoints before launch.
7. **Deploy.** Frontend: any Next.js host with `API_URL` set. Backend:
   anywhere that runs containers, with Postgres, a persistent volume for
   `MEDIA_DIR`, and a real `SECRET_KEY`/`CORS_ORIGINS`.

## Where to look for more context

- `backend/README.md` — backend specifics, setup, API surface
- `src/lib/data/README.md` — the content that still lives in static TS
  files (services, projects, clients) and what's verified vs. placeholder
- Git history — commit messages and diffs are the actual record of what
  changed and why for any given feature; this file is a snapshot, not a
  changelog
