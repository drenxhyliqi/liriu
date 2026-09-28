# NSH LIRIU — backend

FastAPI + PostgreSQL (Docker). It is the source of truth for the product
catalog, quote requests (orders), contact messages and admin accounts. The
Next.js app talks to it server-side only - the browser never calls this API
directly.

## Stack

- **FastAPI** - REST API, interactive docs at `/docs`
- **PostgreSQL 16** - `docker compose`'s `db` service
- **SQLAlchemy 2.0 + Alembic** - ORM and migrations
- **Pillow** - uploaded images are converted to compressed WebP (max 1600px,
  transparency kept) and stored on disk under `MEDIA_DIR`, served at `/media/...`
- **JWT + bcrypt** - admin auth. No public signup: the first owner is created
  from a shell, then owners add admins from the dashboard.

## Running it

```bash
cp backend/.env.example backend/.env     # then set a real SECRET_KEY
docker compose up -d --build
docker compose exec api alembic upgrade head
docker compose exec api python -m scripts.seed_catalog          # starter catalog (empty DB only)
docker compose exec api python -m scripts.create_admin you@example.com "strong-password" "Emri Mbiemri"
```

API at `http://localhost:8000` (`/docs`), Postgres at `localhost:5432`. In
dev the compose file runs uvicorn with `--reload`.

The frontend reads `API_URL` (default `http://localhost:8000`, see the root
`.env.example`).

## Data model

| Table | What it is |
|---|---|
| `categories` | Catalog tree, any depth (`parent_id`). Inactive hides the whole branch from the site. |
| `products` | Anything that can go in a quote request - a sign, a cone, a pole. |
| `product_categories` | Product <-> category links with a per-category `position`. A product can be in several categories (e.g. "Vendparkim" in both Lajmërimit and Parkim). |
| `orders` + `order_items` | Quote requests from `/porosia`. Items are a snapshot (name, category, image, quantity), not FKs, so later catalog edits never rewrite what a customer asked for. `status`: new → contacted → quoted → closed, plus an internal `admin_note`. |
| `contact_messages` | `/contact` form submissions, with `is_read`. |
| `admin_users` | Dashboard logins. `role`: `owner` (can manage users) or `admin`. |

Category and product slugs share one namespace, because the site serves both
at `/products/[slug]` (see `services/slugs.py`).

JSON is camelCase on the wire (`imageUrl`, `categoryIds`, `pageSize`), query
parameters included.

## API surface (`/api/v1`)

| Endpoint | Access |
|---|---|
| `POST /auth/login`, `GET/PATCH /auth/me`, `POST /auth/me/password` | login is public, the rest need a token |
| `GET /catalog` | public - active categories + products in one response, cached by the frontend |
| `POST /orders`, `POST /contact` | public - the site's forms |
| `GET/PATCH/DELETE /orders[/id]`, `GET/PATCH/DELETE /contact[/id]` | admin; lists are paginated and filterable |
| `GET/POST/PATCH/DELETE /categories[/id]` | admin |
| `GET/POST/PATCH/DELETE /products[/id]` | admin; list supports `q`, `categoryId`, `uncategorized`, `active`, paging |
| `POST /uploads` | admin - multipart image, returns `{url}` (a `/media/...` path) |
| `GET /stats` | admin - dashboard counts and recent activity |
| `GET/POST/PATCH/DELETE /users[/id]` | owner only |

Safeguards: category cycles are rejected; a category with subcategories can't
be deleted; the last active owner can't be demoted, deactivated or deleted;
public orders take product names and images from the database, not the
client; uploaded files are deleted once nothing (product, category or order
item) references them.

## New-order emails

Every quote request is saved first, then emailed to `ORDER_NOTIFY_EMAILS`
through [Resend](https://resend.com) as a background task
(`services/email.py`), so a mail problem never loses or delays an order. The
email lists the customer, their note and every item with its image, links to
the order in the dashboard, and uses the customer's address as Reply-To.

Settings (`backend/.env`, then `docker compose up -d --force-recreate api`):
- `RESEND_API_KEY` - without it, orders are saved and the email is skipped (logged).
- `ORDER_NOTIFY_EMAILS` - comma-separated recipients.
- `MAIL_FROM` - must be on a domain verified in Resend. The default
  `onboarding@resend.dev` only delivers to the Resend account's own address.
- `SITE_URL` - the public site address, used for links and images in the email.

## The starter catalog

`seed/catalog.json` is the catalog the site had before it moved to the
database - every category, sign and product image (image paths like
`/signs/...` are files in the Next.js `public/` folder). `scripts/seed_catalog.py`
loads it into an empty database and refuses to run otherwise; `--force` wipes
and reloads the catalog (not orders, messages or users).

## Not done yet

- **Email notifications for contact messages** (orders already notify - see below).
- **Rate limiting / spam protection** on the public `POST /orders` and
  `POST /contact`.
- **Password reset by email** - owners can reset a password from Përdoruesit instead.
- **Automated tests.** Verified end to end against a real database with a
  scripted smoke test during development, but there is no committed test suite.
- **Production deployment.** `MEDIA_DIR` must be on a persistent volume, and
  `SECRET_KEY` / `CORS_ORIGINS` / `DATABASE_URL` set for the environment.

## Project layout

```
backend/
  app/
    core/       # settings, JWT + bcrypt
    db/         # engine/session, declarative Base
    models/     # ORM models (source of truth for the schema)
    schemas/    # request/response shapes (camelCase on the wire)
    api/v1/     # routers, one file per resource
    services/   # slugs, image storage
  alembic/      # migrations
  seed/         # catalog.json - the starter catalog
  scripts/      # create_admin.py, seed_catalog.py
```

## Local (non-Docker) dev

Needs Python 3.12 (3.14 has no prebuilt wheels for the pinned pydantic-core):

```bash
cd backend
python3.12 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # point DATABASE_URL at a local Postgres
alembic upgrade head
uvicorn app.main:app --reload
```
