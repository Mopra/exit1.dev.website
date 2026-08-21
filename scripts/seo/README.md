# SEO data puller

Pulls **Google Search Console** + **GA4** data via a service account and writes an
opportunities report to `scripts/seo/output/` (gitignored).

The report is built around *what to do*, not raw rows:

- **Geography** (exact) tier-1 markets vs the rest, this window against the last
- **Striking distance** queries ranking 5 to 20 with real impressions, each with its tier-1 slice
- **Title/meta rewrites** tier-1 CTR below what the tier-1 position should earn, with brand-status queries split off
- **Position distortion** raw page position against click-weighted position
- **Content gaps** demand exists but only the homepage ranks, or the best page sits past #15
- **Movers** biggest click swings vs the previous equal window
- **Top queries / pages** and **GA4 channels / landing pages** for context

## Reading the numbers

Two things will mislead you if you forget them. Both cost real decisions before they were understood.

**1. Only some rows are exact.** Google withholds low-volume queries from any result
set containing the `query` dimension, and the same filter hits `page` + `country`
together. Measured on this property in the same 28 days:

| Request | Clicks reported |
|---|---|
| no dimensions | 678 |
| `country` | 678 |
| `page` | 678 |
| `query` | 200 |
| `query` + `country` | 200 |
| `page` + `country` | 200 |

So site totals, the geography split and the page tables are exact, and every
query-level table covers only the ~30% of clicks Google will name. The header line
prints that coverage ratio each run. The old `Totals` line summed the `query`
dimension and therefore under-reported clicks by about 3.4x for months.

Usefully, `query` + `country` costs nothing beyond `query` alone, which is why the
tier-1 split is available on every query table for free.

**2. Averages hide geography, and the CTR curve only holds within one market.**
`domain expiry checker` once looked like the biggest title opportunity on the site:
6,954 impressions, position 8.4, 0.6% CTR against a 2.8% expectation. Of those
impressions 4,165 were Bangladesh and 594 Pakistan, while the same page at the same
position earned 6 to 11% in NL, IT, RO and LV. There was no title problem. The CTR
section is now scored on tier-1 impressions only, with a 100-impression floor, and
`SEO_TIER1` overrides the market list.

The same trap works on page position. `/tools/ping-test` appeared to fall from
position 10 to 38 across seven weeks. One misspelling, `jitter ping mesurer`, had
grown from 99 to 924 zero-click impressions, and the page's real queries and clicks
were flat. Hence the click-weighted position column. Note that it deliberately does
*not* just drop zero-click queries: doing that flattered `/tools/ssl-checker` from
45.3 to 13.5 by excluding 99.8% of its impressions, including its actual target
terms, which is survivorship rather than measurement.

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
# override the tier-1 market set used by the geography and CTR sections
SEO_TIER1=usa,gbr,can,aus,deu,nld,swe,dnk
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
