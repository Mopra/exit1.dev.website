// Index-coverage puller: which of our pages is Google actually indexing?
//
// `pull-seo.mjs` answers "how do the pages we rank with perform". It cannot answer
// "is this page indexed at all", because Search Analytics only ever returns pages
// that earned an impression. A page Google has never crawled, or crawled and
// dropped, is simply absent from that dataset and therefore invisible in that
// report.
//
// So this script joins three sources:
//   1. the live sitemap  -> every URL we ask Google to index
//   2. GSC Search Analytics (16 months, `page` dimension) -> URLs that ever got seen
//   3. the URL Inspection API -> the actual per-URL index state, straight from
//      Google's index (coverageState, canonical, robots, last crawl)
//
// Run: npm run seo:index
//   or: node --env-file=.env.local scripts/seo/pull-index-coverage.mjs
//
// Required env (same as pull-seo.mjs):
//   GOOGLE_APPLICATION_CREDENTIALS  path to the service-account JSON key
//   GSC_SITE_URL                    e.g. "sc-domain:exit1.dev"
// Optional env:
//   SITEMAP_URL     default https://exit1.dev/sitemap.xml
//   INDEX_MAX_AGE   hours before a cached inspection is refetched (default 24)
//   INDEX_LIMIT     cap on live inspections this run (default 1800)
//
// Quota, which is why the cache exists: the URL Inspection API allows 2,000
// inspections per property per day and 600 per minute. The sitemap is ~510 URLs,
// so a full sweep fits in one day's quota with room to re-run, but not
// repeatedly. Results are cached in output/index-cache.json; pass --refresh to
// ignore the cache.
//
// One permission note: URL Inspection requires the service account to be an
// owner or *full* user on the property. "Restricted" is enough for Search
// Analytics but returns 403 here.

import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';
import { GoogleAuth } from 'google-auth-library';

const __dirname = dirname(fileURLToPath(import.meta.url));

// The sitemap deliberately re-advertises recently moved URLs so Google recrawls
// them (see src/content/contentMoves.js). Those sources are 308s, so they must
// never be counted as "pages we failed to get indexed". For them, *falling out*
// of the index is the goal. Split them out and judge them on their own terms.
const require_ = createRequire(import.meta.url);
const { CONTENT_MOVES } = require_(join(__dirname, '..', '..', 'src', 'content', 'contentMoves.js'));

const SITE = process.env.GSC_SITE_URL;
const KEY = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const SITEMAP_URL = process.env.SITEMAP_URL || 'https://exit1.dev/sitemap.xml';
const MAX_AGE_H = Number(process.env.INDEX_MAX_AGE || 24);
const LIMIT = Number(process.env.INDEX_LIMIT || 1800);
const REFRESH = process.argv.includes('--refresh');

function fail(msg) {
  console.error(`\n[x] ${msg}\n`);
  process.exit(1);
}

if (!KEY) fail('GOOGLE_APPLICATION_CREDENTIALS is not set (path to service-account JSON key).');
if (!SITE) fail('GSC_SITE_URL is not set.');

const auth = new GoogleAuth({
  keyFile: KEY,
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
});
async function token() {
  const client = await auth.getClient();
  const { token } = await client.getAccessToken();
  return token;
}

function isoDaysAgo(n) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}
const TODAY = new Date().toISOString().slice(0, 10);
const NOW = Date.now();

// ------------------------------- sitemap -------------------------------

// Next emits a single flat sitemap here, but handle a sitemap index too so this
// keeps working if the site ever splits it (Google's 50k/50MB limit).
async function fetchSitemapUrls(url, seen = new Set()) {
  if (seen.has(url)) return [];
  seen.add(url);
  const res = await fetch(url, { headers: { 'User-Agent': 'exit1-seo-script' } });
  if (!res.ok) fail(`sitemap fetch failed: ${res.status} ${res.statusText} on ${url}`);
  const xml = await res.text();

  const isIndex = /<sitemapindex/i.test(xml);
  const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) =>
    m[1].replace(/&amp;/g, '&'),
  );
  if (!isIndex) return locs;

  const out = [];
  for (const child of locs) out.push(...(await fetchSitemapUrls(child, seen)));
  return out;
}

// --------------------------- Search Analytics ---------------------------

// 16 months is the full GSC retention window. A shorter one would flag pages as
// "never seen" when they simply had a quiet month, which is the whole distinction
// this report turns on.
async function gscPages() {
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
    SITE,
  )}/searchAnalytics/query`;
  const PAGE = 25000;
  const out = [];
  for (let startRow = 0; ; startRow += PAGE) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${await token()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startDate: isoDaysAgo(480),
        endDate: isoDaysAgo(2),
        dimensions: ['page'],
        rowLimit: PAGE,
        startRow,
        dataState: 'all',
      }),
    });
    if (!res.ok) fail(`GSC ${res.status} ${res.statusText}\n${await res.text()}`);
    const rows = (await res.json()).rows || [];
    out.push(...rows);
    if (rows.length < PAGE) break;
  }
  return new Map(
    out.map((r) => [
      normalize(r.keys[0]),
      { clicks: r.clicks, impressions: r.impressions, position: r.position },
    ]),
  );
}

/** Trailing slashes and fragments differ between sitemap, GSC and canonicals. */
function normalize(u) {
  try {
    const url = new URL(u);
    url.hash = '';
    let p = url.pathname;
    if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
    return `${url.origin}${p}${url.search}`;
  } catch {
    return u;
  }
}

// --------------------------- URL Inspection ---------------------------

const CACHE_PATH = join(__dirname, 'output', 'index-cache.json');
function loadCache() {
  if (REFRESH || !existsSync(CACHE_PATH)) return {};
  try {
    return JSON.parse(readFileSync(CACHE_PATH, 'utf8'));
  } catch {
    return {};
  }
}

let inspected = 0;
let quotaExhausted = false;

async function inspect(inspectionUrl) {
  const res = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
    method: 'POST',
    headers: { Authorization: `Bearer ${await token()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ inspectionUrl, siteUrl: SITE, languageCode: 'en-US' }),
  });
  if (res.status === 429) {
    quotaExhausted = true;
    return null;
  }
  if (res.status === 403) {
    const body = await res.text();
    fail(
      `URL Inspection returned 403. The service account needs owner or *full* user\n` +
        `permission on ${SITE} (Restricted is not enough).\n${body}`,
    );
  }
  if (!res.ok) {
    console.error(`  ! ${res.status} on ${inspectionUrl}`);
    return null;
  }
  inspected++;
  const json = await res.json();
  const r = json.inspectionResult?.indexStatusResult || {};
  return {
    fetchedAt: new Date().toISOString(),
    verdict: r.verdict || 'UNKNOWN',
    coverageState: r.coverageState || 'unknown',
    robotsTxtState: r.robotsTxtState || null,
    indexingState: r.indexingState || null,
    pageFetchState: r.pageFetchState || null,
    lastCrawlTime: r.lastCrawlTime || null,
    googleCanonical: r.googleCanonical || null,
    userCanonical: r.userCanonical || null,
    referringUrls: r.referringUrls || [],
    sitemaps: r.sitemap || [],
    crawledAs: r.crawledAs || null,
  };
}

/** Bounded concurrency, well under the 600/min ceiling. */
async function inspectAll(urls, cache) {
  const CONCURRENCY = 5;
  const results = {};
  let cursor = 0;
  let hits = 0;

  async function worker() {
    while (cursor < urls.length) {
      const url = urls[cursor++];
      const cached = cache[url];
      const fresh = cached && NOW - new Date(cached.fetchedAt).getTime() < MAX_AGE_H * 3600 * 1000;
      if (fresh) {
        results[url] = cached;
        hits++;
        continue;
      }
      if (quotaExhausted || inspected >= LIMIT) {
        if (cached) results[url] = cached; // stale beats nothing
        continue;
      }
      const r = await inspect(url);
      if (r) results[url] = r;
      else if (cached) results[url] = cached;
      if (inspected && inspected % 25 === 0) {
        process.stdout.write(`\r  inspected ${inspected}...   `);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  process.stdout.write('\r                        \r');
  return { results, hits };
}

// ------------------------------- report -------------------------------

function pct(n, d) {
  return d ? `${((n / d) * 100).toFixed(1)}%` : '0%';
}
function ageDays(iso) {
  if (!iso) return null;
  return Math.round((NOW - new Date(iso).getTime()) / 86400000);
}
function pathOf(u) {
  try {
    return new URL(u).pathname || '/';
  } catch {
    return u;
  }
}
function hostOf(u) {
  try {
    return new URL(u).host;
  } catch {
    return '';
  }
}
// Path *with* the query kept, plus the scheme when it is not https. Both matter:
// `/?ref=trustmrr` is a distinct URL to Google, and `http://exit1.dev/` is a
// separate row from the https homepage. Stripping either makes a table where the
// same path appears several times with no visible difference.
function refOf(u) {
  try {
    const x = new URL(u);
    const prefix = x.protocol === 'https:' ? '' : `${x.protocol}//`;
    return `${prefix}${x.pathname || '/'}${x.search}`;
  } catch {
    return u;
  }
}
function table(headers, rows) {
  if (!rows.length) return '_none_\n';
  const head = `| ${headers.join(' | ')} |\n|${headers.map(() => '---').join('|')}|\n`;
  return head + rows.map((r) => `| ${r.join(' | ')} |`).join('\n') + '\n';
}

/** Group a URL by the template that renders it. */
function sectionOf(u) {
  const p = pathOf(u);
  if (p.startsWith('/blog/page/')) return 'blog pagination';
  if (p.startsWith('/blog/category/')) return 'blog category';
  if (p.startsWith('/blog/')) return 'blog post';
  if (p.startsWith('/status/')) return 'status page';
  if (p.startsWith('/tools/')) return 'tool page';
  if (p.startsWith('/compare/')) return 'compare page';
  return 'other top-level';
}

/** Google's coverageState strings that mean "this URL is in the index". */
function isIndexed(r) {
  return (
    r.verdict === 'PASS' && /indexed/i.test(r.coverageState) && !/not indexed/i.test(r.coverageState)
  );
}

async function main() {
  console.log(`\nIndex coverage for ${SITE}`);
  console.log(`  sitemap: ${SITEMAP_URL}`);

  const [rawSitemap, pages] = await Promise.all([fetchSitemapUrls(SITEMAP_URL), gscPages()]);

  const sitemapUrls = [...new Set(rawSitemap.map(normalize))];
  console.log(`  sitemap URLs: ${sitemapUrls.length}`);
  console.log(`  URLs with GSC impressions (16 mo): ${pages.size}`);

  const cache = loadCache();
  console.log(`  cache: ${Object.keys(cache).length} entries (max age ${MAX_AGE_H}h)\n`);

  // Inspect the sitemap *plus* the highest-traffic URLs we no longer advertise.
  // Those are the ones where "is this still indexed" actually changes a decision:
  // a delinked redirect stub that Google still serves is competing with its own
  // destination, and it is invisible in a sitemap-only sweep.
  const SITE_HOST = new URL(SITEMAP_URL).host;
  const sitemapSet0 = new Set(sitemapUrls);
  const orphanCandidates = [...pages.entries()]
    .filter(([u]) => hostOf(u) === SITE_HOST && !sitemapSet0.has(u))
    .sort((a, b) => b[1].impressions - a[1].impressions)
    .slice(0, 25)
    .map(([u]) => u);

  const { results, hits } = await inspectAll([...sitemapUrls, ...orphanCandidates], cache);
  console.log(`  inspected ${inspected} live, ${hits} from cache`);
  if (quotaExhausted) console.log('  ! daily inspection quota hit - report is partial');

  writeFileSync(CACHE_PATH, JSON.stringify({ ...cache, ...results }));

  // ---- buckets ----
  const rows = sitemapUrls.map((url) => {
    const r = results[url];
    const seen = pages.get(url);
    return {
      url,
      p: pathOf(url),
      r,
      impressions: seen?.impressions || 0,
      clicks: seen?.clicks || 0,
      position: seen?.position,
    };
  });

  const moveSources = new Map(CONTENT_MOVES.map((m) => [normalize(`https://exit1.dev${m.from}`), m]));

  const missing = rows.filter((x) => !x.r);
  const inspectedRows = rows.filter((x) => x.r);
  // Moved URLs are graded separately: for them, leaving the index is success.
  const moved = inspectedRows.filter((x) => moveSources.has(x.url));
  const known = inspectedRows.filter((x) => !moveSources.has(x.url));

  const indexed = known.filter((x) => isIndexed(x.r));
  const notIndexed = known.filter((x) => !isIndexed(x.r));

  const byState = new Map();
  for (const x of known) {
    const k = x.r.coverageState;
    if (!byState.has(k)) byState.set(k, []);
    byState.get(k).push(x);
  }

  const neverCrawled = known.filter((x) => !x.r.lastCrawlTime);

  // A moved URL that is still indexed under its own address means Google has not
  // processed the 308 yet, so the old and new URL are splitting the same signals.
  const moveStalled = moved.filter((x) => isIndexed(x.r));
  const moveDone = moved.filter((x) => !isIndexed(x.r));

  // `userCanonical` is what the *served* response declares. On a real page a
  // mismatch means Google overruled us; on a 308 source it is simply the redirect
  // target, which is why moves are excluded here.
  const canonicalConflict = known.filter(
    (x) =>
      x.r.googleCanonical &&
      x.r.userCanonical &&
      normalize(x.r.googleCanonical) !== normalize(x.r.userCanonical),
  );
  const indexedNoImpressions = indexed.filter((x) => x.impressions === 0);
  const blocked = known.filter(
    (x) => x.r.robotsTxtState === 'DISALLOWED' || x.r.indexingState === 'BLOCKED_BY_META_TAG',
  );
  const fetchProblems = known.filter(
    (x) =>
      x.r.pageFetchState &&
      !['SUCCESSFUL', 'PAGE_FETCH_STATE_UNSPECIFIED'].includes(x.r.pageFetchState),
  );

  // URLs Google has impressions for that we no longer advertise. Orphans, or
  // consolidated URLs still being served.
  //
  // GSC_SITE_URL is a *domain* property, so these rows cover every subdomain:
  // docs.exit1.dev and app.exit1.dev show up alongside the marketing site, and
  // their paths collide with ours (both have a `/`). Filter to this site's host,
  // or every docs page reads as an orphaned marketing page.
  const sitemapSet = new Set(sitemapUrls);
  const offSite = [...pages.entries()].filter(([u]) => hostOf(u) !== SITE_HOST);
  const orphans = [...pages.entries()]
    .filter(([u]) => hostOf(u) === SITE_HOST && !sitemapSet.has(u))
    .sort((a, b) => b[1].impressions - a[1].impressions);

  // ---- markdown ----
  const L = [];
  L.push(`# Index coverage - ${SITE}`);
  L.push('');
  L.push(`Generated ${TODAY}. Sitemap: ${SITEMAP_URL}`);
  L.push('');
  L.push(
    `Source of truth is the URL Inspection API (Google's own index state per URL), ` +
      `joined against 16 months of Search Analytics \`page\` rows. Sitemap URLs: ` +
      `**${sitemapUrls.length}**, of which **${moved.length}** are content-move sources ` +
      `the sitemap re-advertises on purpose. Those are graded separately, leaving ` +
      `**${known.length}** real pages.`,
  );
  L.push('');

  L.push('## Headline');
  L.push('');
  L.push(`Real pages only (${known.length}). Content-move sources excluded.`);
  L.push('');
  L.push(
    table(
      ['', 'URLs', 'Share'],
      [
        ['Indexed', indexed.length, pct(indexed.length, known.length)],
        ['**Not indexed**', `**${notIndexed.length}**`, pct(notIndexed.length, known.length)],
        ['Never crawled', neverCrawled.length, pct(neverCrawled.length, known.length)],
        [
          'Canonical overruled by Google',
          canonicalConflict.length,
          pct(canonicalConflict.length, known.length),
        ],
        [
          'Indexed but 0 impressions / 16 mo',
          indexedNoImpressions.length,
          pct(indexedNoImpressions.length, known.length),
        ],
        ['Not inspected (quota / error)', missing.length, pct(missing.length, sitemapUrls.length)],
      ],
    ),
  );

  L.push('## Content moves');
  L.push('');
  L.push(
    'These 308 to a destination. Dropping out of the index is the goal, so ' +
      '"Page with redirect" and "unknown to Google" are both successes. Still ' +
      'indexed under its own address means Google has not processed the move and ' +
      'the two URLs are splitting the same signals.',
  );
  L.push('');
  L.push(
    table(
      ['', 'URLs'],
      [
        ['Move processed', moveDone.length],
        ['**Still indexed at the old URL**', `**${moveStalled.length}**`],
      ],
    ),
  );
  L.push('');
  if (moveStalled.length) {
    L.push(
      table(
        ['Page', 'Should be', 'Moved on', 'Last crawl', 'Impr 16mo'],
        moveStalled
          .sort((a, b) => b.impressions - a.impressions)
          .map((x) => [
            x.p,
            moveSources.get(x.url).to,
            moveSources.get(x.url).since,
            x.r.lastCrawlTime ? `${ageDays(x.r.lastCrawlTime)}d ago` : 'never',
            x.impressions,
          ]),
      ),
    );
  }

  L.push('## By section');
  L.push('');
  L.push(
    'The number that localises the problem. A sitewide indexing rate hides which ' +
      'template Google is refusing.',
  );
  L.push('');
  const bySection = new Map();
  for (const x of known) {
    const k = sectionOf(x.url);
    if (!bySection.has(k)) bySection.set(k, []);
    bySection.get(k).push(x);
  }
  L.push(
    table(
      ['Section', 'Indexed', 'Not indexed', 'Rate'],
      [...bySection.entries()]
        .map(([k, v]) => {
          const ok = v.filter((x) => isIndexed(x.r)).length;
          return [k, ok, v.length - ok, pct(ok, v.length), v.length - ok];
        })
        .sort((a, b) => b[4] - a[4])
        .map((r) => r.slice(0, 4)),
    ),
  );

  L.push('## Coverage states');
  L.push('');
  L.push(
    table(
      ['coverageState', 'URLs', 'Verdict'],
      [...byState.entries()]
        .sort((a, b) => b[1].length - a[1].length)
        .map(([k, v]) => [k, v.length, [...new Set(v.map((x) => x.r.verdict))].join(', ')]),
    ),
  );

  L.push('## Not indexed');
  L.push('');
  L.push('Every sitemap URL Google is not currently serving, longest-uncrawled first.');
  L.push('');
  L.push(
    table(
      ['Page', 'coverageState', 'Last crawl', 'Google canonical', 'Impr 16mo'],
      notIndexed
        .sort((a, b) => (ageDays(b.r.lastCrawlTime) ?? 1e9) - (ageDays(a.r.lastCrawlTime) ?? 1e9))
        .map((x) => [
          x.p,
          x.r.coverageState,
          x.r.lastCrawlTime ? `${ageDays(x.r.lastCrawlTime)}d ago` : '**never**',
          x.r.googleCanonical && normalize(x.r.googleCanonical) !== x.url
            ? pathOf(x.r.googleCanonical)
            : '-',
          x.impressions,
        ]),
    ),
  );

  if (canonicalConflict.length) {
    L.push('## Canonical overruled by Google');
    L.push('');
    L.push(
      'The page declares one canonical and Google uses another. Whichever way it ' +
        'points, the declared consolidation is not happening.',
    );
    L.push('');
    L.push(
      table(
        ['Page', 'We declare', 'Google uses', 'coverageState', 'Impr 16mo'],
        canonicalConflict.map((x) => [
          x.p,
          pathOf(x.r.userCanonical),
          pathOf(x.r.googleCanonical),
          x.r.coverageState,
          x.impressions,
        ]),
      ),
    );
  }

  if (blocked.length) {
    L.push('## Blocked from indexing');
    L.push('');
    L.push(
      table(
        ['Page', 'robots.txt', 'indexingState', 'coverageState'],
        blocked.map((x) => [x.p, x.r.robotsTxtState, x.r.indexingState, x.r.coverageState]),
      ),
    );
  }

  if (fetchProblems.length) {
    L.push('## Fetch problems');
    L.push('');
    L.push(
      table(
        ['Page', 'pageFetchState', 'Last crawl'],
        fetchProblems.map((x) => [
          x.p,
          x.r.pageFetchState,
          x.r.lastCrawlTime ? `${ageDays(x.r.lastCrawlTime)}d ago` : 'never',
        ]),
      ),
    );
  }

  L.push('## Indexed but invisible');
  L.push('');
  L.push(
    'Indexed, zero impressions in 16 months. Not a crawling problem: Google has the ' +
      'page and never finds a query it deserves to appear for.',
  );
  L.push('');
  L.push(
    table(
      ['Page', 'Last crawl'],
      indexedNoImpressions
        .sort((a, b) => a.p.localeCompare(b.p))
        .map((x) => [x.p, x.r.lastCrawlTime ? `${ageDays(x.r.lastCrawlTime)}d ago` : 'never']),
    ),
  );

  L.push('## Crawl staleness');
  L.push('');
  L.push('The 30 sitemap URLs Google has looked at least recently.');
  L.push('');
  const stale = known
    .filter((x) => x.r.lastCrawlTime)
    .sort((a, b) => ageDays(b.r.lastCrawlTime) - ageDays(a.r.lastCrawlTime))
    .slice(0, 30);
  L.push(
    table(
      ['Page', 'Last crawl', 'Indexed', 'Impr 16mo'],
      stale.map((x) => [
        x.p,
        `${ageDays(x.r.lastCrawlTime)}d ago`,
        isIndexed(x.r) ? 'yes' : 'no',
        x.impressions,
      ]),
    ),
  );

  L.push(`## Getting impressions but not in the sitemap (${SITE_HOST} only)`);
  L.push('');
  L.push(
    'Google is serving these and we no longer advertise them. Expected for URLs mid-' +
      `consolidation. Anything else is an orphan. ${offSite.length} rows on other ` +
      'subdomains (docs, app) are excluded: this is a domain property, so they share ' +
      'the same GSC dataset.',
  );
  L.push('');
  L.push(
    table(
      ['Page', 'Clicks', 'Impr', 'Avg pos', 'Index state'],
      orphans.slice(0, 40).map(([u, v]) => {
        const r = results[u];
        return [
          refOf(u),
          v.clicks,
          v.impressions,
          v.position.toFixed(1),
          r ? r.coverageState : '(not inspected)',
        ];
      }),
    ),
  );

  if (missing.length) {
    L.push('## Not inspected');
    L.push('');
    L.push(
      table(
        ['Page'],
        missing.map((x) => [x.p]),
      ),
    );
  }

  const out = join(__dirname, 'output', `index-coverage-${TODAY}.md`);
  writeFileSync(out, L.join('\n'));

  console.log(
    `\n  real pages indexed: ${indexed.length}/${known.length} (${pct(indexed.length, known.length)})`,
  );
  console.log(`  NOT indexed:   ${notIndexed.length}`);
  console.log(`  never crawled: ${neverCrawled.length}`);
  console.log(`  canonical overruled: ${canonicalConflict.length}`);
  console.log(`  indexed, 0 impressions: ${indexedNoImpressions.length}`);
  console.log(`  moves: ${moveDone.length} processed, ${moveStalled.length} still indexed`);
  console.log(`\n  -> ${out}\n`);
}

main().catch((e) => fail(e.stack || e.message));
