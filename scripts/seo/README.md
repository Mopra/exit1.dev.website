# SEO data puller

Three scripts, same service account. The two pullers write to
`scripts/seo/output/` (gitignored); the third only prints.

| Command | Answers |
|---|---|
| `npm run seo` | How do the pages we already rank with perform? |
| `npm run seo:index` | Which of our pages is Google actually indexing? |
| `npm run seo:recrawl` | I just corrected a batch of pages. Now what? |

They do not overlap, because Search Analytics only ever returns pages that earned
an impression. A page Google never crawled, or crawled and dropped, is absent
from that dataset entirely, so `npm run seo` cannot see it at all. `seo:index`
reads the **URL Inspection API** instead, which reports Google's real per-URL
index state. See [Index coverage](#index-coverage) below.

## `npm run seo`

Pulls **Google Search Console** + **GA4** data via a service account and writes an
opportunities report.

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
   (the `.keys/` folder is gitignored). Note the service-account email, which looks like
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

Writes `scripts/seo/output/seo-YYYY-MM-DD.md` and prints a summary. Either source is optional:
set only `GSC_SITE_URL` or only `GA4_PROPERTY_ID` to pull just one.

## Index coverage

```
npm run seo:index            # uses cached inspections < 24h old
npm run seo:index -- --refresh   # force a full re-inspection
```

Writes `scripts/seo/output/index-coverage-YYYY-MM-DD.md`. Joins the live sitemap,
16 months of Search Analytics `page` rows, and the URL Inspection API.

**Permission.** URL Inspection needs the service account to be an owner or *full*
user on the property. "Restricted" is enough for Search Analytics but 403s here.

**Quota.** 2,000 inspections per property per day, 600 per minute. The sitemap is
~510 URLs, so a full sweep fits comfortably but not repeatedly, which is why
results are cached in `output/index-cache.json`. A full cold sweep takes ~10
minutes; a cached re-run is instant, so iterate on the report without spending
quota. `INDEX_MAX_AGE` (hours) and `INDEX_LIMIT` tune the cache and the ceiling.

### Reading this report

Three things will mislead you, and all three did on the first run.

**1. Content-move sources are not failures.** `src/content/contentMoves.js` 308s
old URLs to their destinations, and `sitemap.ts` deliberately re-advertises the
recent ones so Google recrawls them. Those sources appear as "Page with redirect"
or "URL is unknown to Google", which look like errors and are in fact the goal.
The report splits them into their own section and grades them backwards: for a
move, *still indexed under the old URL* is the failure, because it means Google
has not processed the 308 and the two URLs are splitting the same signals. Read
the headline table as real pages only.

**2. The property is a domain property, so it covers every subdomain.**
`docs.exit1.dev`, `app.exit1.dev` and `clerk.exit1.dev` land in the same
Search Analytics dataset, and their paths collide with ours: `/` exists on all of
them. Before this was filtered, 67 docs pages read as orphaned marketing pages.
The orphan section is restricted to the sitemap's own host.

**3. Query strings and schemes make distinct URLs.** `/?ref=trustmrr` and
`http://exit1.dev/` are separate rows from the https homepage, and rendering them
as bare paths produced four identical-looking `/` rows with different numbers.
The orphan table keeps both.

### The sections worth acting on

- **By section** the number that localises the problem. A sitewide rate hides
  which template Google is refusing.
- **Content moves / still indexed at the old URL** a 301 does nothing until
  Google recrawls, and consolidation removes every route by which that happens.
- **Not indexed** `Crawled - currently not indexed` is a quality judgement,
  `Discovered - currently not indexed` is a crawl-budget one, and they need
  opposite fixes. Never crawled with historical impressions means dropped, not new.
- **Indexed but invisible** indexed, zero impressions in 16 months. Not a
  crawling problem at all: Google has the page and finds no query it deserves.
- **Getting impressions but not in the sitemap** delinked URLs Google still
  serves. This is where a deleted page that was still ranking shows up as a 404.

## Recrawl after a content correction

```bash
npm run seo:recrawl -- --dry-run   # list the changed pages, submit nothing
npm run seo:recrawl                # also resubmit the sitemap
```

Run it **after the deploy lands**, because it reads the live sitemap, not the
working tree.

Two things make Google re-fetch a page it already has: a changed `<lastmod>` in
the sitemap, and a manual Request-indexing in the URL Inspection tool. This
script covers the first and hands you a ranked worklist for the second.

### Static pages need a date added by hand

Blog posts get `<lastmod>` from their `updated:` frontmatter, so correcting a
post means bumping that field. Static routes have no equivalent, so
`src/app/sitemap.ts` carries a `CONTENT_REVISIONS` map of route to ISO day.
**Edit a static page's copy, add or bump its entry there**, or the sitemap keeps
telling Google the page is unchanged and it will not be re-fetched on any useful
timescale. Routes absent from the map emit no `lastmod` at all, which is the
correct default: a fabricated "now" across every URL reads as "everything
changed" and invites a recrawl storm.

### Why there is no fully automated version

- **The sitemap ping endpoint is gone.** `google.com/ping?sitemap=` was retired
  in January 2024. Snippets recommending it are dead code.
- **The Indexing API does not apply.** It is scoped to `JobPosting` and
  `BroadcastEvent` only. Using it on marketing pages violates its terms and is
  ignored for non-qualifying URLs. The script deliberately omits it.
- **Request indexing has no API.** It is a button, roughly a dozen URLs per
  property per day. Spend it on commercial pages, not long-tail posts, which is
  the order the script prints.
- **IndexNow does not reach Google.** Bing, Yandex and Seznam consume it; Google
  has never adopted it. Worth doing for Bing, not a substitute here.

Recrawl is a hint, not an instruction. Expect days to weeks. Verify with
`npm run seo:index -- --refresh` and check `lastCrawlTime` moved.
