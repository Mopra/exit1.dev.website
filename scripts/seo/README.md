# SEO data puller

Pulls **Google Search Console** + **GA4** data via a service account and writes an
opportunities report to `scripts/seo/output/` (gitignored).

The report is built around *what to do*, not raw rows:

- **Striking distance** — queries ranking 5–20 with real impressions (push to page 1)
- **Title/meta rewrites** — high impressions but CTR below what the position should earn
- **Content gaps** — demand exists but only the homepage ranks, or the best page sits past #15 (build/strengthen a page)
- **Movers** — biggest click swings vs the previous equal window
- **Top queries / pages** and **GA4 channels / landing pages** for context

## One-time setup

### 1. Create a service account + key

1. Google Cloud Console → the project that owns this site → **APIs & Services → Enabled APIs**.
   Enable **Google Search Console API** and **Google Analytics Data API**.
2. **IAM & Admin → Service Accounts → Create**. Name it e.g. `seo-reader`. No roles needed.
3. On the new account → **Keys → Add key → JSON**. Download it.
4. Save the JSON somewhere outside git, e.g. `scripts/seo/.keys/seo-reader.json`
   (the `.keys/` folder is gitignored). Note the service-account email — it looks like
   `seo-reader@PROJECT.iam.gserviceaccount.com`.

### 2. Grant the service account read access

- **Search Console** (search.google.com/search-console) → your property →
  **Settings → Users and permissions → Add user** → paste the SA email → **Restricted** (read) is enough.
- **GA4** (analytics.google.com) → **Admin → Property → Property access management → +** →
  paste the SA email → **Viewer**.
- Get the **GA4 numeric property ID**: Admin → Property → **Property details** (a number like `123456789`).
  This is *not* the `G-TW8WXE2TZP` measurement id.

### 3. Add env vars to `.env.local`

```
GOOGLE_APPLICATION_CREDENTIALS=scripts/seo/.keys/seo-reader.json
GSC_SITE_URL=sc-domain:exit1.dev
GA4_PROPERTY_ID=123456789
# optional
SEO_DAYS=28
SEO_COUNTRY=usa
```

> `GSC_SITE_URL` is `sc-domain:exit1.dev` for a Domain property, or the exact URL-prefix
> (e.g. `https://exit1.dev/`) if that's how the property was added in Search Console.

### 4. Install the one dependency

```
npm install
```

## Run

```
npm run seo
```

Writes `scripts/seo/output/seo-YYYY-MM-DD.md` and prints a summary. Either source is optional —
set only `GSC_SITE_URL` or only `GA4_PROPERTY_ID` to pull just one.
