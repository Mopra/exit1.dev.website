// Recrawl nudge: tell Google the pages we just corrected have changed.
//
// Run this after deploying a batch of content corrections. It does the two
// things that actually work, and deliberately does not attempt the one that
// looks like it should work but doesn't.
//
//   1. Resubmits the sitemap through the Search Console API.
//      Google removed the old `google.com/ping?sitemap=` endpoint in January
//      2024 (announced June 2023). It now returns 404, and every "just ping the
//      sitemap" snippet on the web is dead. `sitemaps.submit` is the supported
//      replacement, and it is the same call the "Submit" button in Search
//      Console makes.
//
//   2. Prints the URLs whose <lastmod> is within the freshness window, ranked,
//      so a human can spend the small daily "Request indexing" quota in the URL
//      Inspection tool on the pages that matter most. That button is manual by
//      design; there is no API behind it.
//
// What this does NOT do, on purpose: Google's Indexing API. It is scoped to
// JobPosting and BroadcastEvent structured data only. Pointing it at ordinary
// marketing pages is a terms violation, it is widely reported to be ignored for
// non-qualifying URLs, and it risks the property. Do not add it here.
//
// Nothing here forces a recrawl. `lastmod` is a hint, not an instruction. What
// it buys is that when Googlebot next evaluates the sitemap, the corrected pages
// look changed instead of looking identical to the version already in the index.
//
// Run: npm run seo:recrawl
//   or: node --env-file=.env.local scripts/seo/request-recrawl.mjs
//
// Required env (same service account as the other two scripts):
//   GOOGLE_APPLICATION_CREDENTIALS  path to the service-account JSON key
//   GSC_SITE_URL                    e.g. "sc-domain:exit1.dev"
// Optional env:
//   SITEMAP_URL       default https://exit1.dev/sitemap.xml
//   RECRAWL_SINCE     ISO day; only list URLs with lastmod >= this
//                     (default: 7 days ago)
// Flags:
//   --dry-run   list the changed URLs, skip the sitemap submission
//   --stalled   cross-check every content move against the URL Inspection API and
//               report only the ones Google still has not recrawled, ranked by the
//               impressions stranded on the old URL. This is the list to spend the
//               manual Request-indexing quota on. Skips the sitemap submission.
//
// Permission note: submitting a sitemap needs the read-write `webmasters`
// scope and an owner/full user on the property. `webmasters.readonly`, which
// the other two scripts use, returns 403 here.

import { GoogleAuth } from 'google-auth-library';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

const SITE = process.env.GSC_SITE_URL;
const KEY = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const SITEMAP_URL = process.env.SITEMAP_URL || 'https://exit1.dev/sitemap.xml';
const DRY_RUN = process.argv.includes('--dry-run');
const STALLED = process.argv.includes('--stalled');

function fail(msg) {
  console.error(`\n[x] ${msg}\n`);
  process.exit(1);
}

if (!KEY) fail('GOOGLE_APPLICATION_CREDENTIALS is not set (path to service-account JSON key).');
if (!SITE) fail('GSC_SITE_URL is not set.');

function isoDaysAgo(n) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}
const SINCE = process.env.RECRAWL_SINCE || isoDaysAgo(7);

const auth = new GoogleAuth({
  keyFile: KEY,
  scopes: ['https://www.googleapis.com/auth/webmasters'],
});
async function token() {
  const client = await auth.getClient();
  const { token } = await client.getAccessToken();
  return token;
}

// ------------------------------- sitemap -------------------------------

// Mirrors fetchSitemapUrls in pull-index-coverage.mjs, but keeps <lastmod>
// alongside each <loc>, because that pairing is the whole point of this script.
async function fetchSitemapEntries(url, seen = new Set()) {
  if (seen.has(url)) return [];
  seen.add(url);
  const res = await fetch(url, { headers: { 'User-Agent': 'exit1-seo-script' } });
  if (!res.ok) fail(`sitemap fetch failed: ${res.status} ${res.statusText} on ${url}`);
  const xml = await res.text();

  if (/<sitemapindex/i.test(xml)) {
    const children = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) =>
      m[1].replace(/&amp;/g, '&'),
    );
    const nested = await Promise.all(children.map((c) => fetchSitemapEntries(c, seen)));
    return nested.flat();
  }

  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/gi)].map((block) => {
    const loc = /<loc>\s*([^<\s]+)\s*<\/loc>/i.exec(block[1]);
    const lastmod = /<lastmod>\s*([^<\s]+)\s*<\/lastmod>/i.exec(block[1]);
    return {
      url: loc ? loc[1].replace(/&amp;/g, '&') : null,
      lastmod: lastmod ? lastmod[1].slice(0, 10) : null,
    };
  }).filter((e) => e.url);
}

// Status pages carry a genuine daily lastmod (last recorded check), so they are
// always "fresh" and would drown out the actual edits. They are not what anyone
// is nudging a recrawl for.
const isDailyChurn = (u) => /\/status\/[^/]+$/.test(new URL(u).pathname);

// Rough ordering for the manual Request-indexing quota: commercial intent and
// hub pages first, long-tail posts last.
function rank(u) {
  const p = new URL(u).pathname;
  if (p === '/') return 0;
  if (p === '/pricing' || p === '/compare') return 1;
  if (p.startsWith('/compare/')) return 2;
  if (p.startsWith('/free-') || p.startsWith('/tools/')) return 3;
  if (p.startsWith('/blog/')) return 5;
  return 4;
}

// ---------------------------- stalled moves ----------------------------

// A 301 does nothing until Google recrawls the old URL, and consolidation removes
// every path by which that normally happens: the post leaves the sitemap and every
// internal link gets repointed at the destination. Re-advertising with a fresh
// `lastmod` is the documented nudge, but it is only a hint. Measured on this
// property, the 2026-08-02 batch was still unrecrawled 38 days later, with
// /blog/free-nameserver-lookup holding position 10 on 3,811 impressions while its
// destination sat at position 48 and the signals stayed split.
//
// So the useful question is not "what changed recently" — the default listing,
// which buries three stalled URLs among fifty ordinary edits — but "which moves has
// Google still not seen, and how much traffic is stranded on each". That is a short,
// ranked worklist, which is what a quota of roughly a dozen clicks a day needs.
async function reportStalledMoves() {
  const { movesAwaitingRecrawl } = require(join(__dirname, '../../src/content/contentMoves.js'));
  const today = new Date().toISOString().slice(0, 10);
  const moves = movesAwaitingRecrawl(today);

  console.log('');
  console.log(`Checking ${moves.length} content move(s) still inside the recrawl window.`);
  console.log('');

  // Impressions stranded on each old URL. The `page` dimension keeps full click
  // fidelity, so this is exact, and it is what ranks the list: a stalled move
  // nobody searches for is not worth a click of the quota.
  const stranded = new Map();
  const gscRes = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${await token()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startDate: isoDaysAgo(30),
        endDate: isoDaysAgo(2),
        dimensions: ['page'],
        rowLimit: 25000,
      }),
    },
  );
  if (gscRes.ok) {
    for (const row of (await gscRes.json()).rows || []) {
      stranded.set(new URL(row.keys[0]).pathname, {
        impressions: row.impressions,
        clicks: row.clicks,
        position: row.position,
      });
    }
  }

  const stalled = [];
  const applied = [];
  for (const m of moves) {
    const r = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
      method: 'POST',
      headers: { Authorization: `Bearer ${await token()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inspectionUrl: `https://exit1.dev${m.from}`, siteUrl: SITE }),
    });
    if (r.status === 403)
      fail('URL Inspection returned 403. The service account needs owner or full access on the property.');
    if (!r.ok) {
      console.log(`  ?  ${m.from} — inspection failed (${r.status})`);
      continue;
    }
    const st = (await r.json()).inspectionResult?.indexStatusResult || {};
    const lastCrawl = (st.lastCrawlTime || '').slice(0, 10);
    const g = stranded.get(m.from) || { impressions: 0, clicks: 0, position: 0 };
    const row = { ...m, lastCrawl, coverage: st.coverageState || '-', ...g };
    // The move has landed once Google recrawled at or after the deploy date. Coverage
    // then reads "Page with redirect", which is the intended end state, not an error.
    if (lastCrawl && lastCrawl >= m.since) applied.push(row);
    else stalled.push(row);
  }

  stalled.sort((a, b) => b.impressions - a.impressions);

  console.log(`${applied.length} move(s) recrawled and applied. ${stalled.length} still stalled.`);
  console.log('');

  if (stalled.length) {
    console.log('  STALLED — Google has not recrawled since the redirect deployed.');
    console.log('  Ranked by impressions stranded on the old URL (last 28d).');
    console.log('');
    console.log('    impr  clicks    pos  crawled      deployed     URL');
    for (const r of stalled) {
      console.log(
        `  ${String(r.impressions).padStart(6)}  ${String(r.clicks).padStart(6)}  ` +
          `${r.position ? r.position.toFixed(1).padStart(5) : '    -'}  ` +
          `${(r.lastCrawl || 'never').padEnd(11)}  ${r.since.padEnd(11)}  ${r.from}`,
      );
    }
    console.log('');
    console.log('  Spend the manual quota top-down:');
    console.log('    Search Console -> URL Inspection -> paste the URL -> Request indexing');
    console.log('  There is no API behind that button, and the Indexing API does not apply');
    console.log('  to these URLs (it is scoped to JobPosting and BroadcastEvent only).');
    console.log('');
  }

  if (applied.length) {
    console.log('  APPLIED (no action needed):');
    for (const r of applied) console.log(`    ${r.from}  crawled ${r.lastCrawl}  ${r.coverage}`);
    console.log('');
  }
}

// ------------------------------- run -------------------------------

if (STALLED) {
  await reportStalledMoves();
} else {

const entries = await fetchSitemapEntries(SITEMAP_URL);
const changed = entries
  .filter((e) => e.lastmod && e.lastmod >= SINCE && !isDailyChurn(e.url))
  .sort((a, b) => rank(a.url) - rank(b.url) || a.url.localeCompare(b.url));

console.log(`\nSitemap:  ${SITEMAP_URL}`);
console.log(`Property: ${SITE}`);
console.log(`Window:   lastmod >= ${SINCE}`);
console.log(`\n${changed.length} changed page(s), excluding daily-churn status pages:\n`);
for (const e of changed) {
  console.log(`  ${e.lastmod}  ${new URL(e.url).pathname}`);
}

if (!changed.length) {
  console.log('  (none. Did the deploy land? The sitemap is fetched live, not from disk.)');
}

// Deliberately not `process.exit()`: on Windows, exiting while the auth
// library still holds an open handle trips a libuv assertion that prints after
// the report and looks like a crash. Falling off the end lets Node drain.
if (DRY_RUN) {
  console.log('\n--dry-run: sitemap not submitted.\n');
} else {
  const feedpath = encodeURIComponent(SITEMAP_URL);
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/sitemaps/${feedpath}`;
  const res = await fetch(endpoint, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${await token()}` },
  });

  if (res.status === 403) {
    fail(
      'Sitemap submit returned 403. The service account needs to be an owner or full user on ' +
        `${SITE}, and the key must be authorised for the read-write webmasters scope.`,
    );
  }
  if (!res.ok) {
    fail(`Sitemap submit failed: ${res.status} ${res.statusText}\n${await res.text()}`);
  }

  console.log('\n[ok] Sitemap resubmitted to Search Console.');
  console.log('\nNext, by hand, highest-value first:');
  console.log('  Search Console -> URL Inspection -> paste URL -> Request indexing');
  console.log('  Quota is roughly a dozen URLs per property per day, so work down the list above.');
  console.log('\nRecrawl is a hint, not a guarantee. Expect days to weeks, not hours.\n');
}

}
