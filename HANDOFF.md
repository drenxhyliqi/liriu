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

**Two pieces, currently disconnected:**
1. **Frontend** (repo root) — Next.js 16 site. Fully built, real pages,
   real interactions. Currently uses static local data (`src/lib/data/*.ts`)
   and two Next.js route handlers that log-and-discard (`/api/orders`,
   `/api/contact`).
2. **Backend** (`backend/`) — FastAPI + Postgres + Cloudinary, added
   2026-08-31. Fully scaffolded and verified working in isolation (see
   `backend/README.md`), but **not yet called by the frontend**. That
   wiring is the next real chunk of work — see "Next steps" below.

## The one rule that matters more than any other

**Never invent business facts.** No fabricated prices, specs, certifications,
client names, project details, phone numbers, addresses, or capabilities.
This has been enforced hard throughout the build:
- `src/lib/data/products.ts`, `services.ts`, `projects.ts`, `clients.ts` all
  have `CLIENT INFORMATION REQUIRED` / `STARTER STRUCTURE` comments marking
  exactly what's real (confirmed service names/order) vs. generic
  industry-standard placeholder (product/variant names, drawn from
  standard road-signage terminology, not real LIRIU SKUs) vs. missing
  entirely (real photography, project case studies, client logos, prices).
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

**Public site** (`src/app/(site)/`): home, about, services, products
(3-level catalog: category → product → variant, with a dropdown category
sidebar), projects, contact, `/porosia` (cart/quote request).

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

**Login page + admin dashboard** (`/login`, `/admin`): real UI, **fake
backend**. `/login` posts to `/api/auth/login`, which always returns 501
("sistemi ende nuk është aktivizuar"). `/admin`'s sidebar
(`dashboard-sidebar.tsx` — no dropdowns, larger icons, red accent-bar
active state, intentionally different from the public catalog sidebar
which *does* have dropdowns) has views for Paneli/Kategoritë/Produktet/
Dizajnet/Porosite/Mesazhet/Cilësimet. Porosite and Mesazhet currently
render an honest "not persisted yet" empty state instead of fake data.

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

## Backend — what's built (2026-08-31)

FastAPI + PostgreSQL 16 (Docker) + Alembic + Cloudinary. Full detail,
setup commands, and the exact "what's implemented vs. what's a stub" list
live in **`backend/README.md`** — read that before working on the backend,
this section is just the summary.

Verified for real, not just written: built the Docker images, ran the
Alembic migration against live Postgres, created an admin, logged in, and
exercised the full category → product → variant → order/contact flow with
curl. Caught and fixed one real bug in the process (passlib's bcrypt
backend is broken against modern bcrypt — swapped to bcrypt directly).

Data model deliberately mirrors `src/types/index.ts` field-for-field
(camelCase on the wire), and `orders`/`contact_messages` match the exact
payload shape the frontend's existing (currently no-op) API routes already
send — so wiring the frontend to this backend is a straight swap, not a
redesign. Images: the API never touches image bytes — it issues a signed
Cloudinary upload signature, the admin browser uploads directly, and the
resulting URL gets PATCHed onto the product/variant record.

Test data created during verification was wiped (`docker compose down -v`)
before this was committed — the repo has no fake persisted state.

## Next steps, roughly in order

1. **Wire the frontend to the backend.** Step-by-step plan already written
   in `backend/README.md` under "Wiring up the frontend" — swap the three
   Next.js route handlers to call the FastAPI endpoints, add the missing
   `productSlug`/`variantSlug` fields to `order-request.tsx`'s fetch body,
   replace the static `src/lib/data/*.ts` arrays with real fetches once
   there's real catalog data in Postgres.
2. **Build the admin CMS UI** for categories/products/variants (create/edit
   forms + the Cloudinary upload step) — the backend endpoints exist, the
   admin dashboard UI shell exists, they're just not connected yet.
3. **Get real content from the client**: product photography, verified
   specs/certifications if any exist, project case studies (with explicit
   publish permission — see `Project.publishApproved` in
   `src/types/index.ts`), client logos (same — `Client.publishApproved`),
   service page copy (`shortDescription`/`overview`/`capabilities`/
   `process` are all currently unset on purpose).
4. **Replace placeholder social/contact data** in
   `src/lib/social-placeholder.ts` with the real Facebook page, WhatsApp
   business number, and email once confirmed.
5. **Contact form email delivery** — currently receives and validates but
   doesn't send anywhere. Needs a confirmed destination address + a
   provider (e.g. Resend).
6. **Deploy.** Neither the frontend nor the backend has a real deployment
   target picked yet (Vercel is the obvious frontend fit given Next.js;
   the backend's Docker setup should run anywhere that runs containers).

## Where to look for more context

- `backend/README.md` — backend specifics, setup, API surface
- `src/lib/data/README.md` — why content data lives in static TS files and
  what's verified vs. placeholder in each one
- Git history — commit messages and diffs are the actual record of what
  changed and why for any given feature; this file is a snapshot, not a
  changelog
