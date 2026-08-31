# NSH LIRIU — backend

FastAPI + PostgreSQL (via Docker) + Cloudinary for images. This is the
service the `/admin` dashboard and the public catalog/order/contact pages
will eventually call instead of static data files and console.log.

**Status: scaffold, verified working, not yet wired to the frontend.**
Every endpoint below was actually run against a real Postgres in Docker
while building this (migration applied, admin created, full
category → product → variant → order/contact flow exercised with curl) —
it's not just code that looks right. What's *not* done is connecting the
Next.js app to it; that's the next phase, not part of this one.

## Stack

- **FastAPI** — REST API, `/docs` for interactive OpenAPI docs
- **PostgreSQL 16** — via `docker-compose`'s `db` service
- **SQLAlchemy 2.0 + Alembic** — ORM + migrations
- **Cloudinary** — product/variant images. The API never stores or proxies
  image bytes — it only issues a signed upload signature
  (`GET /api/v1/uploads/signature`), the admin browser uploads directly to
  Cloudinary, and the resulting URL gets PATCHed onto the product/variant.
- **JWT (python-jose) + bcrypt** — admin auth. No public signup — admins
  are provisioned via a CLI script (see below), since this is a
  single-team internal CMS, not a multi-tenant product.

## Data model → frontend mapping

| Table | Mirrors (frontend) | Notes |
|---|---|---|
| `categories` | `ProductGroup` (src/types/index.ts) | top-level catalog group |
| `products` | `Product` | now has `imageUrl`/`imagePublicId` — the static data doesn't yet |
| `product_variants` | `ProductVariant` | the "different designs" shown at `/products/[slug]/[variant]` |
| `orders` + `order_items` | `CartItem` submitted by order-request.tsx | `order_items` is a denormalized snapshot (name/groupName/quantity/slugs), not a live FK to `products` — a later catalog edit must never rewrite what a customer actually requested |
| `contact_messages` | the /contact form payload | mirrors /api/contact's shape exactly |
| `admin_users` | — | new; backs real admin login |

Every JSON field on the wire is **camelCase** (`groupName`, `productSlug`,
`createdAt`, ...) to match the conventions already used throughout the
Next.js types — see `app/schemas/base.py`.

## Running it

```bash
cp backend/.env.example backend/.env   # fill in real Cloudinary creds when you have them
docker compose up -d --build
docker compose exec api alembic upgrade head
docker compose exec api python -m scripts.create_admin you@example.com "some-strong-password"
```

API is then at `http://localhost:8000` (`/docs` for the interactive schema),
Postgres at `localhost:5432`.

## What's implemented vs. what's a stub

**Fully working**, verified end-to-end:
- Categories, products, variants — full CRUD (list/get public, write/delete
  admin-only)
- Orders — public create (matches `/api/orders`'s payload), admin list/get,
  status triage (`new` → `contacted` → `closed`)
- Contact messages — public create (matches `/api/contact`'s payload),
  admin list, mark-as-read
- Admin auth — JWT login, `/auth/me`, route guard
- Cloudinary upload signature endpoint

**Deliberately not done here** — next-phase work, not oversights:
- **Frontend integration.** The Next.js routes (`/api/orders`,
  `/api/contact`, `/api/auth/login`) still log-and-discard, same as before
  this backend existed. Swapping them to call this API is a separate pass —
  see "Wiring up the frontend" below.
- **Email delivery** on contact messages — see `[[contact_form_not_wired]]`
  memory: still needs a confirmed destination address and a provider (e.g.
  Resend), independent of this persistence layer.
- **Cloudinary asset cleanup.** `services/cloudinary.py::delete_asset` exists
  but isn't called from the product/variant endpoints yet — replacing or
  deleting an image currently orphans the old Cloudinary asset instead of
  removing it.
- **Refresh tokens / logout / password reset.** Login issues a 12-hour JWT
  and that's the whole session model for now.
- **Rate limiting, request logging, structured error responses beyond
  FastAPI's default `{"detail": ...}` shape.**
- **Tests.** Verified manually via curl during development (see git history
  around this file), not via an automated suite yet.

## Wiring up the frontend (the next phase, not done yet)

1. Point the three existing Next.js route handlers at this API instead of
   `console.log`:
   - `src/app/api/orders/route.ts` → `POST {API_URL}/api/v1/orders`
   - `src/app/api/contact/route.ts` → `POST {API_URL}/api/v1/contact`
   - `src/app/api/auth/login/route.ts` → `POST {API_URL}/api/v1/auth/login`
     (or have the login form call this API directly and skip the Next.js
     route entirely)
2. `order-request.tsx`'s fetch body currently sends `{name, groupName,
   quantity}` per item — add `productSlug`/`variantSlug` (already present
   on `CartItem`, just not included in that fetch call today) so
   `order_items` rows aren't missing that link.
3. Replace `src/lib/data/{products,services,...}.ts` static arrays with
   fetches against `GET /api/v1/categories` / `/products` / `/variants`
   once there's real catalog data in Postgres (via the admin dashboard, once
   *that's* wired to write here instead of just rendering "not built yet"
   empty states).
4. Admin dashboard views (`admin-dashboard.tsx`'s `OrdersView`/
   `MessagesView`, currently hardcoded empty states) start reading real data
   once they call `GET /api/v1/orders` / `/contact` with the admin's JWT.
5. Add an image upload step to the admin product/variant forms: call
   `GET /api/v1/uploads/signature?target=products`, upload directly to
   Cloudinary with that signature, then `PATCH` the returned `secure_url`/
   `public_id` onto the product/variant.

## Project layout

```
backend/
  app/
    core/       # settings (env), JWT + bcrypt helpers
    db/         # SQLAlchemy engine/session, declarative Base
    models/     # ORM models (source of truth for the schema)
    schemas/    # Pydantic request/response shapes (camelCase on the wire)
    api/v1/     # routers, one file per resource
    services/   # Cloudinary signing/deletion
  alembic/      # migrations (versions/f1a362fa1524_initial_schema.py is the first one)
  scripts/      # create_admin.py — the only way to provision an admin login
  Dockerfile
requirements.txt
```

## Local (non-Docker) dev

Needs Python 3.12 (3.13 untested, 3.14 doesn't have prebuilt wheels yet for
this pydantic-core pin — this bit the initial setup, see git history):

```bash
cd backend
python3.12 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # point DATABASE_URL at a local Postgres
alembic upgrade head
uvicorn app.main:app --reload
```
