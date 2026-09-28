# Domain launch checklist — nshliriu.com

Work to do as soon as **nshliriu.com** is bought. Until then the site runs on
`https://liriu.vercel.app` (frontend, Vercel) and
`https://liriu-production.up.railway.app` (backend, Railway project
`truthful-delight`, service `liriu`).

Client contact details (confirmed, already live on the site in
`src/lib/constants.ts`):

- Email: **nsh.liriu@gmail.com**
- Phone: **049 502 555** (`+38349502555`)

## Order matters

Do the steps in this order. Step 1 comes before any traffic hits the new
domain: the Turnstile CAPTCHA only runs on hostnames listed in its widget.
On any other hostname it fails, and the contact and order forms reject
every submission.

### 1. Cloudflare Turnstile — add the new hostnames
Cloudflare dashboard → Turnstile → widget **nshliriu** → Hostnames → add
`nshliriu.com` and `www.nshliriu.com`. Keep `liriu.vercel.app`. The site key and
secret key do **not** change.

### 2. Vercel — connect the domain
- Project → Settings → Domains → add `nshliriu.com` and `www.nshliriu.com`
  (redirect `www` → apex, or the other way; pick one as primary).
- Add the DNS records Vercel shows at the domain registrar and wait for them
  to verify.
- Settings → Environment Variables → set `SITE_URL=https://nshliriu.com`
  (Production). This feeds the sitemap, robots.txt and the homepage
  LocalBusiness JSON-LD (`src/lib/site-url.ts`).
- Redeploy (env changes only apply to a new build).
- `API_URL` does **not** change.

### 3. Railway — point the backend at the new domain
`liriu` service → Variables:
- `SITE_URL=https://nshliriu.com` (links and images in the order emails)
- `CORS_ORIGINS=https://nshliriu.com,https://www.nshliriu.com,https://liriu.vercel.app`

Railway usually redeploys on variable changes, but **it did not once
before**. The process kept the old env. Confirm with
`railway ssh --service liriu` → `env | grep SITE_URL`, and run
`railway redeploy --service liriu` if it's stale.

### 4. Email — switch notifications to the client
New quote requests are emailed via Resend (`backend/app/services/email.py`).
Right now `MAIL_FROM` is `onboarding@resend.dev`, which Resend only delivers
to the Resend account owner's own address. That's why the notifications
can't go to the client yet.

1. Resend dashboard → Domains → add `nshliriu.com` → add the DNS records it
   shows (SPF/DKIM) at the registrar → wait for "Verified".
2. Railway `liriu` Variables:
   - `MAIL_FROM=NSH LIRIU <porosi@nshliriu.com>` (any address @nshliriu.com works)
   - `ORDER_NOTIFY_EMAILS=nsh.liriu@gmail.com` (comma-separated if more)
3. Also update the code default in `backend/app/core/config.py`
   (`ORDER_NOTIFY_EMAILS`, currently the developer's address) to
   `nsh.liriu@gmail.com`, so a fresh deploy without the variable is still right.
4. Test: submit a real order on `/porosia` and confirm the email arrives at
   nsh.liriu@gmail.com, and that "Reply" goes to the customer.

Optional follow-up once Resend is verified: email the admin for new
**contact messages** too (not built yet; see HANDOFF.md next steps) and
send customers a "we received your request" confirmation.

### 5. Search engines
- Google Search Console → add property `nshliriu.com` → submit
  `https://nshliriu.com/sitemap.xml`.
- If `liriu.vercel.app` was submitted earlier, the domain redirect from step
  2 handles it. Nothing to remove.

### 6. Verify
```
curl -s https://nshliriu.com/robots.txt            # Sitemap: line shows nshliriu.com
curl -s https://nshliriu.com/sitemap.xml | head    # <loc> URLs use nshliriu.com
curl -s https://nshliriu.com/ | grep -o '"url":"[^"]*"'   # JSON-LD url is nshliriu.com
```
Then submit the contact form and an order on the new domain (the Turnstile
widget must appear and pass), and log in to `/admin`.

## Still open (not domain-related)
- **WhatsApp**: the WhatsApp icons (footer + mobile menu) now open a chat
  with 049 502 555. Confirm with the client that this number is on WhatsApp.
  If not, remove the icon or point it at the right number.
- **Facebook**: `src/lib/social-placeholder.ts` still holds a guessed page URL
  (`facebook.com/nshliriu`). Replace it with the real page or remove the icon.
- **About timeline**: the 2017 and 2022 entries are placeholder copy
  (`placeholder: true` in `src/app/(site)/about/page.tsx`).
- **Vercel Analytics**: enable it in the Vercel project → Analytics tab
  (the code is in place, gated by cookie consent).
