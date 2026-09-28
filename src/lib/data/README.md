# Content data

Static, type-checked content for the site — no CMS. Chosen because LIRIU's
content (services, projects, clients) changes rarely and is best reviewed and
versioned alongside the code, not editable by non-technical staff mid-flight.

- `services.ts` — the 7 verified service categories (names only; marketing
  copy still required, see brief section 27).
- `projects.ts` — case studies. Empty until real project data is collected
  (name, location, client, year, services, challenge/solution/results,
  approved photography).
- `clients.ts` — reference clients/logos. Empty until the client confirms
  names and grants permission to display logos.

Do not add placeholder/invented entries to these files — leave arrays empty
with a `// CLIENT INFORMATION REQUIRED` note until verified data exists.

The product catalog is **not** here any more - it lives in the backend
database, is managed from `/admin`, and its starter content is
`backend/seed/catalog.json`.
