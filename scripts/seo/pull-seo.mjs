// SEO data puller — Google Search Console + GA4, via a service account.
//
// Reads from both REST APIs, then surfaces *actionable* opportunities
// (striking-distance queries, low-CTR titles, content gaps, page trends)
// rather than dumping raw rows. Writes a markdown report to ./output/.
//
// Run: npm run seo            (loads vars from .env.local via package.json)
//   or: node --env-file=.env.local scripts/seo/pull-seo.mjs
//
// Required env:
//   GOOGLE_APPLICATION_CREDENTIALS  path to the service-account JSON key
//   GSC_SITE_URL                    e.g. "sc-domain:exit1.dev" or "https://exit1.dev/"
//   GA4_PROPERTY_ID                 numeric GA4 property id (NOT the G-XXXX measurement id)
// Optional env:
//   SEO_DAYS        lookback window in days (default 28)
//   SEO_COUNTRY     ISO-3 filter for GSC, e.g. "usa" (default: all)
//   SEO_TIER1       comma-separated ISO-3 list overriding the tier-1 market set
//
// A note on GSC data fidelity, because it changes how you read this report.
// Google drops low-volume queries from any result set that includes the `query`
// dimension, and the same filter applies to `page` + `country` together. Measured
// on this property: dimensionless = 678 clicks, `country` = 678, `page` = 678, but
// `query` = 200 and `page`+`country` = 200. So:
//   - Site totals and the geography split use dimensionless / `country` -> exact.
//   - Everything query-level covers only the non-anonymized subset (~30% of clicks
//     here). Use it for ranking work, never as a site total.
//   - `query`+`country` costs nothing extra over `query` alone, so the tier-1 split
//     of the query tables is free and internally consistent.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { GoogleAuth } from 'google-auth-library';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SITE = process.env.GSC_SITE_URL;
const GA4 = process.env.GA4_PROPERTY_ID;
const KEY = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const DAYS = Number(process.env.SEO_DAYS || 28);
const COUNTRY = process.env.SEO_COUNTRY?.toLowerCase();

// Markets worth optimising for: high purchasing power, plausible buyers of a paid
// monitoring plan. The split matters because ranking page-1 in a low-CPC market and
// page-3 in the US reads as "good average position" while earning nothing. It also
// stops a query whose impressions are 90% one cheap market from being scored as a
// CTR problem, because the position-to-CTR curve below only holds in tier-1 SERPs.
const TIER1 = new Set(
  (process.env.SEO_TIER1 ||
    'usa,gbr,can,aus,nzl,irl,deu,nld,swe,dnk,nor,fin,fra,che,aut,bel,isl,lux')
    .split(',')
    .map((c) => c.trim().toLowerCase())
    .filter(Boolean),
);

if (!KEY) fail('GOOGLE_APPLICATION_CREDENTIALS is not set (path to service-account JSON key).');
if (!SITE && !GA4) fail('Set GSC_SITE_URL and/or GA4_PROPERTY_ID — nothing to pull.');

function fail(msg) {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
}

// --- date helpers (no Date.now in module scope is fine here; this is a CLI) ---
function isoDaysAgo(n) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}
const END = isoDaysAgo(2); // GSC data lags ~2 days
const START = isoDaysAgo(2 + DAYS);
const PREV_END = isoDaysAgo(2 + DAYS);
const PREV_START = isoDaysAgo(2 + DAYS * 2);

const auth = new GoogleAuth({
  keyFile: KEY,
  scopes: [
    'https://www.googleapis.com/auth/webmasters.readonly',
    'https://www.googleapis.com/auth/analytics.readonly',
  ],
});

async function token() {
  const client = await auth.getClient();
  const { token } = await client.getAccessToken();
  return token;
}

async function api(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${await token()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText} on ${url}\n${text}`);
  }
  return res.json();
}

// --------------------------- Search Console ---------------------------

// GSC returns rows ordered by clicks descending and caps a single response at
// 25,000 rows, so a bare request silently truncates. That truncation is not
// uniform: it eats the zero-click tail first, which is exactly the population the
// content-gap and impression-pollution analyses need. This property has ~5,000
// query rows, and the single largest impression polluter on the site (924
// impressions, zero clicks) sat outside the old 1,000-row window. Paginate.
async function gscQuery(dimensions, { start = START, end = END, rowLimit = 25000 } = {}) {
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
    SITE,
  )}/searchAnalytics/query`;
  const PAGE = 25000;
  const out = [];
  for (let startRow = 0; out.length < rowLimit; startRow += PAGE) {
    // An empty `dimensions` array is rejected; omit the key entirely to get the
    // single unsegmented row, which is the only exact total GSC will give us.
    const body = { startDate: start, endDate: end, rowLimit: Math.min(PAGE, rowLimit - out.length), startRow };
    if (dimensions.length) body.dimensions = dimensions;
    if (COUNTRY) body.dimensionFilterGroups = [{ filters: [{ dimension: 'country', expression: COUNTRY }] }];
    const rows = (await api(url, body)).rows || [];
    out.push(...rows);
    if (rows.length < PAGE || !dimensions.length) break;
  }
  return out;
}

// Expected CTR by position: flags titles that underperform for where they rank.
// Industry-typical desktop+mobile blend, and only meaningful within a single
// market (see the TIER1 note), which is why callers pass a tier-1 position.
//
// The old curve flattened everything from 11 to 20 to 1.2% and everything past 20
// to 0.6%, which over-promised badly on page 2: an average position of 14 usually
// means the result is rarely on screen at all. Interpolating a decay through page 2
// and 3 stops "0% CTR at position 14.5" reading as a fixable title.
function expectedCtr(pos) {
  const table = [0, 0.28, 0.15, 0.1, 0.07, 0.05, 0.04, 0.033, 0.028, 0.024, 0.021];
  if (pos <= 10) return table[Math.round(pos)] ?? 0.02;
  if (pos <= 20) return 0.012 - ((pos - 10) / 10) * 0.007; // 1.2% at #10 down to 0.5% at #20
  if (pos <= 30) return 0.005 - ((pos - 20) / 10) * 0.003; // 0.5% down to 0.2%
  return 0.002;
}

// Sum a row set into a totals object, with an impression-weighted mean position.
function rollup(rows) {
  const t = rows.reduce(
    (a, r) => ({
      clicks: a.clicks + r.clicks,
      impressions: a.impressions + r.impressions,
      posWeight: a.posWeight + (r.position || 0) * r.impressions,
    }),
    { clicks: 0, impressions: 0, posWeight: 0 },
  );
  return {
    clicks: t.clicks,
    impressions: t.impressions,
    ctr: t.clicks / Math.max(1, t.impressions),
    position: t.posWeight / Math.max(1, t.impressions),
  };
}

async function analyzeGsc() {
  const [
    totals,
    prevTotals,
    queries,
    pages,
    prevQueries,
    prevPages,
    queryPages,
    queryCountries,
    countries,
    prevCountries,
  ] = await Promise.all([
    // Dimensionless: the only exact site total. Anything with `query` in it is a
    // subset, which is what made the old Totals line read ~3.4x low.
    gscQuery([]),
    gscQuery([], { start: PREV_START, end: PREV_END }),
    gscQuery(['query']),
    gscQuery(['page']),
    gscQuery(['query'], { start: PREV_START, end: PREV_END }),
    gscQuery(['page'], { start: PREV_START, end: PREV_END }),
    gscQuery(['query', 'page']),
    gscQuery(['query', 'country'], { rowLimit: 25000 }),
    gscQuery(['country'], { rowLimit: 300 }),
    gscQuery(['country'], { start: PREV_START, end: PREV_END, rowLimit: 300 }),
  ]);

  const prevByQuery = new Map(prevQueries.map((r) => [r.keys[0], r]));
  const prevByPage = new Map(prevPages.map((r) => [r.keys[0], r]));

  // Per-query tier-1 slice. Free of extra anonymization cost (see the header note),
  // so every query table can be read in tier-1 terms rather than global averages.
  const tier1ByQuery = new Map();
  const geoTotalByQuery = new Map();
  for (const r of queryCountries) {
    const [q, country] = r.keys;
    geoTotalByQuery.set(q, (geoTotalByQuery.get(q) || 0) + r.impressions);
    if (!TIER1.has(country)) continue;
    const cur = tier1ByQuery.get(q) || { clicks: 0, impressions: 0, posWeight: 0 };
    cur.clicks += r.clicks;
    cur.impressions += r.impressions;
    cur.posWeight += (r.position || 0) * r.impressions;
    tier1ByQuery.set(q, cur);
  }
  const tier1Of = (q) => {
    const t = tier1ByQuery.get(q);
    if (!t) return { clicks: 0, impressions: 0, ctr: 0, position: 0, share: 0 };
    return {
      clicks: t.clicks,
      impressions: t.impressions,
      ctr: t.clicks / Math.max(1, t.impressions),
      position: t.posWeight / Math.max(1, t.impressions),
      share: t.impressions / Math.max(1, geoTotalByQuery.get(q) || 1),
    };
  };

  // Geography rollup, exact (country dimension keeps full fidelity).
  const geoSplit = (rows) => {
    const t1 = rows.filter((r) => TIER1.has(r.keys[0]));
    const rest = rows.filter((r) => !TIER1.has(r.keys[0]));
    return { tier1: rollup(t1), rest: rollup(rest), all: rollup(rows) };
  };
  const geoNow = geoSplit(countries);
  const geoPrev = geoSplit(prevCountries);
  const topCountries = countries
    .slice()
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 12)
    .map((r) => {
      const prev = prevCountries.find((p) => p.keys[0] === r.keys[0]);
      return { ...r, tier1: TIER1.has(r.keys[0]), prevClicks: prev?.clicks || 0 };
    });

  // Striking distance: ranking 5–20 with real impressions → small push = page 1.
  const striking = queries
    .filter((r) => r.position >= 4.5 && r.position <= 20 && r.impressions >= 30)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 40);

  // Title/meta opportunities, scored on TIER-1 impressions only.
  //
  // Judged globally this list is worthless. The worked example: "domain expiry
  // checker" showed 6,954 impressions at 0.6% CTR against a 2.8% expectation, which
  // reads as the biggest title opportunity on the site. 4,165 of those impressions
  // were Bangladesh and 594 Pakistan; in NL/IT/RO/LV the same page at the same
  // position earned 6-11%. There was no title problem, only a geography mix the
  // expected-CTR curve does not model. Requiring real tier-1 volume removes the
  // whole class of phantom opportunity.
  const lowCtrAll = queries
    .map((r) => ({ r, t1: tier1Of(r.keys[0]) }))
    .filter(
      ({ t1 }) =>
        t1.impressions >= 100 && t1.position <= 15 && t1.ctr < expectedCtr(t1.position) * 0.6,
    )
    .map(({ r, t1 }) => ({ ...r, t1, gap: expectedCtr(t1.position) - t1.ctr }))
    .sort((a, b) => b.t1.impressions * b.gap - a.t1.impressions * a.gap);

  // Position distortion per page.
  //
  // A page's average position is impression-weighted across every query it surfaces
  // for, so one high-volume zero-click query can sink it while the queries that
  // actually earn are fine. Worked example: /tools/ping-test looked like it fell
  // from position 10 to 38 over seven weeks. The cause was a single misspelling,
  // "jitter ping mesurer", going from 99 to 924 impressions at position 32 with
  // zero clicks, a quarter of the page's impressions. Its real queries held or
  // improved, and its clicks were flat. Reporting raw position alone turns that
  // into a false alarm, so show position with the dead weight removed beside it.
  const byPageQueries = new Map();
  for (const r of queryPages) {
    const p = r.keys[1];
    if (!byPageQueries.has(p)) byPageQueries.set(p, []);
    byPageQueries.get(p).push({ query: r.keys[0], ...r });
  }
  //
  // Two honesty constraints on this metric, both learned the hard way:
  //
  // 1. Do NOT report position with zero-click queries simply removed. That was the
  //    first attempt and it lies in the flattering direction: /tools/ssl-checker
  //    went from a raw 45.3 to a "real" 13.5, but 99.8% of its impressions were
  //    excluded and the excluded set was headed by "ssl checker" and "ssl
  //    certificate checker". Those are the page's target terms ranking badly, not
  //    noise. Dropping them measures survivorship, not position.
  // 2. Click-weighted position answers the useful question instead ("where do I
  //    rank on the queries that actually earn?") without pretending the deep tail
  //    is not there. It needs a click floor to mean anything, hence MIN_CLICKS.
  //
  // A wide Raw-to-Click gap says the page earns from a narrow good subset while
  // accumulating deep impressions. Whether that tail is junk or untapped demand is
  // a judgement call, and the content-gaps section is where it gets made.
  const MIN_CLICKS = 10;
  const clickWeightedPos = (rows) => {
    const clicks = rows.reduce((a, r) => a + r.clicks, 0);
    if (clicks < MIN_CLICKS) return null;
    return rows.reduce((a, r) => a + (r.position || 0) * r.clicks, 0) / clicks;
  };
  const distortion = pages
    .slice()
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 15)
    .map((p) => {
      const rows = byPageQueries.get(p.keys[0]) || [];
      const subsetImpr = rows.reduce((a, r) => a + r.impressions, 0);
      const deep = rows.filter((r) => r.position > 20);
      return {
        page: p.keys[0],
        clicks: p.clicks,
        impressions: p.impressions,
        rawPosition: p.position,
        clickPosition: clickWeightedPos(rows),
        deepShare: deep.reduce((a, r) => a + r.impressions, 0) / Math.max(1, subsetImpr),
        worst: deep
          .filter((r) => r.clicks === 0)
          .sort((a, b) => b.impressions - a.impressions)
          .slice(0, 2)
          .map((r) => r.query),
      };
    })
    .filter((d) => d.clickPosition !== null && d.rawPosition - d.clickPosition >= 3)
    .sort((a, b) => b.rawPosition - b.clickPosition - (a.rawPosition - a.clickPosition));

  // Movers: biggest click swings vs the previous equal-length window.
  const movers = queries
    .map((r) => {
      const prev = prevByQuery.get(r.keys[0]);
      return { ...r, delta: r.clicks - (prev?.clicks || 0), prevClicks: prev?.clicks || 0 };
    })
    .filter((r) => Math.abs(r.delta) >= 3)
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .slice(0, 25);

  // Content gaps: demand exists but coverage is weak. A query is a gap when it
  // pulls real impressions yet either (a) only the homepage/root ranks for it —
  // no dedicated page — or (b) its best page sits past position 15. These are
  // candidates for a *new* page or a serious strengthening of the matched one.
  const bestPageByQuery = new Map();
  for (const r of queryPages) {
    const [q, page] = r.keys;
    const prev = bestPageByQuery.get(q);
    if (!prev || r.position < prev.position) bestPageByQuery.set(q, { ...r, page });
  }
  const path = (u) => u.replace(/^https?:\/\/[^/]+/, '') || '/';
  const isRoot = (u) => path(u) === '/' || /^\/\?/.test(path(u));
  const gaps = [...bestPageByQuery.values()]
    .filter((r) => r.impressions >= 50 && (isRoot(r.page) || r.position > 15) && r.clicks <= 2)
    .map((r) => ({
      query: r.keys[0],
      impressions: r.impressions,
      position: r.position,
      page: path(r.page),
      reason: isRoot(r.page) ? 'no dedicated page (only root ranks)' : 'weak coverage (rank > 15)',
    }))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 30);

  // Split the CTR list by whether a /status/ page serves the query.
  //
  // "is ahrefs down", "ahrefs status", "anthropic uptime", "figma status" and the
  // rest rank 8 to 14 in tier-1 and earn ~0%, which the curve reads as a title
  // problem. It is not: those SERPs put the vendor's own status page and
  // DownDetector above us, so the CTR is structurally capped no matter what the
  // title says. Same for competitor-brand queries ("uptimerobot free plan 2026",
  // "domain expiry checker regalseo"). Keeping them in the main list buries the
  // handful of queries a rewrite could actually move, so they get their own table
  // rather than being silently dropped.
  const servedBy = (q) => path(bestPageByQuery.get(q)?.page || '');
  const isStatusQuery = (q) => servedBy(q).startsWith('/status/');
  const withPage = (r) => ({ ...r, serves: servedBy(r.keys[0]) || '-' });
  const lowCtr = lowCtrAll.filter((r) => !isStatusQuery(r.keys[0])).slice(0, 25).map(withPage);
  const lowCtrStatus = lowCtrAll.filter((r) => isStatusQuery(r.keys[0])).slice(0, 15).map(withPage);

  return {
    totals: totals[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 },
    prevTotals: prevTotals[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 },
    querySubset: rollup(queries),
    geoNow,
    geoPrev,
    topCountries,
    topQueries: queries
      .slice()
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 25)
      .map((r) => ({ ...r, t1: tier1Of(r.keys[0]) })),
    topPages: pages
      .slice()
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 25)
      .map((r) => ({ ...r, prevClicks: prevByPage.get(r.keys[0])?.clicks || 0 })),
    striking: striking.map((r) => ({ ...r, t1: tier1Of(r.keys[0]) })),
    lowCtr,
    lowCtrStatus,
    movers,
    gaps,
    distortion,
  };
}

// ------------------------------- GA4 ----------------------------------

async function ga4Report(body) {
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${GA4}:runReport`;
  return api(url, body);
}

function ga4Rows(report, metricNames) {
  return (report.rows || []).map((row) => {
    const o = { dim: row.dimensionValues.map((d) => d.value) };
    metricNames.forEach((m, i) => (o[m] = Number(row.metricValues[i]?.value || 0)));
    return o;
  });
}

async function analyzeGa4() {
  const range = [{ startDate: START, endDate: END }];

  const [landing, channels] = await Promise.all([
    ga4Report({
      dateRanges: range,
      dimensions: [{ name: 'landingPagePlusQueryString' }],
      metrics: [
        { name: 'sessions' },
        { name: 'engagementRate' },
        { name: 'averageSessionDuration' },
        { name: 'keyEvents' },
      ],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 30,
    }),
    ga4Report({
      dateRanges: range,
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }, { name: 'engagementRate' }, { name: 'keyEvents' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 15,
    }),
  ]);

  return {
    landing: ga4Rows(landing, ['sessions', 'engagementRate', 'avgDuration', 'keyEvents']),
    channels: ga4Rows(channels, ['sessions', 'engagementRate', 'keyEvents']),
  };
}

// ----------------------------- reporting ------------------------------

const pct = (n) => `${(n * 100).toFixed(1)}%`;
const pos = (n) => n.toFixed(1);
const num = (n) => Math.round(n).toLocaleString('en-US');
const signed = (n) => (n > 0 ? `+${num(n)}` : num(n));
const delta = (now, prev) => {
  if (!prev) return '';
  const d = ((now - prev) / prev) * 100;
  return `(${d >= 0 ? '+' : ''}${d.toFixed(0)}% vs prev ${num(prev)})`;
};

function table(headers, rows) {
  const head = `| ${headers.join(' | ')} |`;
  const sep = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((r) => `| ${r.join(' | ')} |`).join('\n');
  return `${head}\n${sep}\n${body}`;
}

function buildReport(gsc, ga4) {
  const lines = [];
  lines.push(`# SEO report: ${START} → ${END} (${DAYS}d${COUNTRY ? `, ${COUNTRY.toUpperCase()}` : ''})`);
  lines.push('');

  if (gsc) {
    lines.push('## Search Console');
    lines.push('');
    const dc = delta(gsc.totals.clicks, gsc.prevTotals.clicks);
    const di = delta(gsc.totals.impressions, gsc.prevTotals.impressions);
    lines.push(
      `**Totals (exact):** ${num(gsc.totals.clicks)} clicks ${dc} · ` +
        `${num(gsc.totals.impressions)} impressions ${di} · ` +
        `${pct(gsc.totals.ctr)} CTR · avg pos ${pos(gsc.totals.position)}`,
    );
    lines.push('');
    lines.push(
      `> Query-level tables below cover the **${pct(
        gsc.querySubset.clicks / Math.max(1, gsc.totals.clicks),
      )} of clicks** Google will attribute to a named query ` +
        `(${num(gsc.querySubset.clicks)} of ${num(gsc.totals.clicks)}). ` +
        `The rest is withheld as low-volume. Read those tables for ranking work, never as site totals.`,
    );
    lines.push('');

    lines.push('### 🌍 Geography (exact: tier-1 markets vs the rest)');
    lines.push(
      'Ranking page-1 in a low-value market while sitting on page 3 in tier-1 shows up as a healthy average position and earns nothing. This split is the one that tracks revenue.',
    );
    lines.push('');
    lines.push(
      table(
        ['Segment', 'Clicks', 'Prev', 'Δ', 'Impr', 'CTR', 'Pos', 'Prev pos'],
        [
          ['**Tier-1**', 'tier1'],
          ['Rest of world', 'rest'],
          ['All', 'all'],
        ].map(([label, key]) => {
          const n = gsc.geoNow[key];
          const p = gsc.geoPrev[key];
          return [
            label,
            num(n.clicks),
            num(p.clicks),
            signed(n.clicks - p.clicks),
            num(n.impressions),
            pct(n.ctr),
            pos(n.position),
            pos(p.position),
          ];
        }),
      ),
    );
    lines.push('');
    lines.push(
      table(
        ['Country', 'Tier-1', 'Clicks', 'Prev', 'Impr', 'CTR', 'Pos'],
        gsc.topCountries.map((r) => [
          r.keys[0].toUpperCase(),
          r.tier1 ? '✓' : '',
          num(r.clicks),
          num(r.prevClicks),
          num(r.impressions),
          pct(r.ctr),
          pos(r.position),
        ]),
      ),
    );
    lines.push('');

    lines.push('### 🎯 Striking distance (rank 5 to 20, push these to page 1)');
    lines.push(
      'Closest wins: already visible, small ranking gains convert to real traffic. `T1 impr` is the tier-1 slice; a low share means the global position is being set by markets you do not sell into.',
    );
    lines.push('');
    lines.push(
      table(
        ['Query', 'Pos', 'Impr', 'Clicks', 'CTR', 'T1 impr', 'T1 share', 'T1 pos'],
        gsc.striking.map((r) => [
          r.keys[0],
          pos(r.position),
          num(r.impressions),
          num(r.clicks),
          pct(r.ctr),
          num(r.t1.impressions),
          pct(r.t1.share),
          r.t1.impressions ? pos(r.t1.position) : '-',
        ]),
      ),
    );
    lines.push('');

    lines.push('### ✍️ Title/meta rewrites (tier-1 CTR below expected for tier-1 position)');
    lines.push(
      'Scored on tier-1 impressions only, because the position-to-CTR curve does not hold across markets. A query needs 100+ tier-1 impressions to appear, which filters out the phantom opportunities the global view produces.',
    );
    lines.push('');
    lines.push(
      gsc.lowCtr.length
        ? table(
            ['Query', 'Serves', 'T1 pos', 'T1 impr', 'T1 CTR', 'Expected', 'Global impr', 'T1 share'],
            gsc.lowCtr.map((r) => [
              r.keys[0],
              r.serves,
              pos(r.t1.position),
              num(r.t1.impressions),
              pct(r.t1.ctr),
              pct(expectedCtr(r.t1.position)),
              num(r.impressions),
              pct(r.t1.share),
            ]),
          )
        : '_No query clears 100 tier-1 impressions with CTR below expectation. Any low global CTR you see is a geography mix, not a title problem._',
    );
    lines.push('');

    if (gsc.lowCtrStatus.length) {
      lines.push('#### Structurally capped: brand-status queries (not title problems)');
      lines.push(
        'These rank in tier-1 and earn nothing because the SERP puts the vendor own status page and DownDetector above us. Listed separately so they stop crowding out rewritable queries. A title change will not move them; only a different SERP feature or a genuinely better answer would.',
      );
      lines.push('');
      lines.push(
        table(
          ['Query', 'Serves', 'T1 pos', 'T1 impr', 'T1 CTR'],
          gsc.lowCtrStatus.map((r) => [
            r.keys[0],
            r.serves,
            pos(r.t1.position),
            num(r.t1.impressions),
            pct(r.t1.ctr),
          ]),
        ),
      );
      lines.push('');
    }

    lines.push('### 🗑️ Position distortion (raw page position vs where the page actually earns)');
    lines.push(
      'Page position is impression-weighted across every query the page surfaces for, so a deep zero-click tail sinks it even when the earning queries are fine. `Click pos` re-weights by clicks: where the page ranks on queries that convert. A wide gap means do not read the raw number as a ranking collapse. `Deep impr` is the share of impressions sitting past #20, which is either junk or untapped demand, and only reading the queries tells you which.',
    );
    lines.push('');
    lines.push(
      gsc.distortion.length
        ? table(
            ['Page', 'Clicks', 'Raw pos', 'Click pos', 'Deep impr', 'Biggest zero-click deep queries'],
            gsc.distortion.map((d) => [
              d.page.replace(/^https?:\/\/[^/]+/, ''),
              num(d.clicks),
              pos(d.rawPosition),
              pos(d.clickPosition),
              pct(d.deepShare),
              d.worst.join(', ') || '-',
            ]),
          )
        : `_No page with ${10}+ clicks shows a 3-position gap between raw and click-weighted position._`,
    );
    lines.push('');

    lines.push('### 🧩 Content gaps (demand exists, coverage is weak)');
    lines.push('Real impressions, but only the homepage ranks or the best page sits past #15. Candidates for a new page or a serious rewrite of the matched one.');
    lines.push('');
    lines.push(
      table(
        ['Query', 'Impr', 'Pos', 'Best page', 'Why'],
        gsc.gaps.map((r) => [r.query, num(r.impressions), pos(r.position), r.page, r.reason]),
      ),
    );
    lines.push('');

    lines.push(`### 📈 Movers vs previous ${DAYS}d`);
    lines.push('');
    lines.push(
      table(
        ['Query', 'Δ Clicks', 'Now', 'Before', 'Pos'],
        gsc.movers.map((r) => [r.keys[0], (r.delta > 0 ? '+' : '') + r.delta, num(r.clicks), num(r.prevClicks), pos(r.position)]),
      ),
    );
    lines.push('');

    lines.push('### Top queries');
    lines.push('');
    lines.push(
      table(
        ['Query', 'Clicks', 'Impr', 'CTR', 'Pos', 'T1 share'],
        gsc.topQueries.map((r) => [
          r.keys[0],
          num(r.clicks),
          num(r.impressions),
          pct(r.ctr),
          pos(r.position),
          pct(r.t1.share),
        ]),
      ),
    );
    lines.push('');

    lines.push('### Top pages (exact: the page dimension keeps full fidelity)');
    lines.push('');
    lines.push(
      table(
        ['Page', 'Clicks', 'Prev', 'Δ', 'Impr', 'CTR', 'Pos'],
        gsc.topPages.map((r) => [
          r.keys[0].replace(/^https?:\/\/[^/]+/, ''),
          num(r.clicks),
          num(r.prevClicks),
          signed(r.clicks - r.prevClicks),
          num(r.impressions),
          pct(r.ctr),
          pos(r.position),
        ]),
      ),
    );
    lines.push('');
  }

  if (ga4) {
    lines.push('## GA4');
    lines.push('');
    lines.push('### Channels');
    lines.push('');
    lines.push(
      table(
        ['Channel', 'Sessions', 'Engagement', 'Key events'],
        ga4.channels.map((r) => [r.dim[0], num(r.sessions), pct(r.engagementRate), num(r.keyEvents)]),
      ),
    );
    lines.push('');
    lines.push('### Top landing pages');
    lines.push('');
    lines.push(
      table(
        ['Landing page', 'Sessions', 'Engagement', 'Avg dur (s)', 'Key events'],
        ga4.landing.map((r) => [r.dim[0], num(r.sessions), pct(r.engagementRate), Math.round(r.avgDuration), num(r.keyEvents)]),
      ),
    );
    lines.push('');
  }

  return lines.join('\n');
}

// ------------------------------- main ---------------------------------

(async () => {
  try {
    const gsc = SITE ? await analyzeGsc() : null;
    const ga4 = GA4 ? await analyzeGa4() : null;

    const report = buildReport(gsc, ga4);
    const out = join(__dirname, 'output', `seo-${END}.md`);
    writeFileSync(out, report, 'utf8');

    console.log(report.split('\n').slice(0, 6).join('\n'));
    console.log(`\n✔ Full report written to ${out}`);
    if (gsc)
      console.log(
        `  ${gsc.striking.length} striking-distance · ${gsc.lowCtr.length} CTR opportunities · ${gsc.gaps.length} content gaps`,
      );
  } catch (err) {
    fail(err.message || String(err));
  }
})();
