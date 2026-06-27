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

async function gscQuery(dimensions, { start = START, end = END, rowLimit = 1000 } = {}) {
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
    SITE,
  )}/searchAnalytics/query`;
  const body = { startDate: start, endDate: end, dimensions, rowLimit };
  if (COUNTRY) body.dimensionFilterGroups = [{ filters: [{ dimension: 'country', expression: COUNTRY }] }];
  const data = await api(url, body);
  return data.rows || [];
}

// Rough "expected CTR by position" curve — flags titles that underperform
// for where they actually rank. Industry-typical desktop+mobile blend.
function expectedCtr(pos) {
  const table = [0, 0.28, 0.15, 0.1, 0.07, 0.05, 0.04, 0.033, 0.028, 0.024, 0.021];
  if (pos <= 10) return table[Math.round(pos)] ?? 0.02;
  if (pos <= 20) return 0.012;
  return 0.006;
}

async function analyzeGsc() {
  const [queries, pages, prevQueries] = await Promise.all([
    gscQuery(['query']),
    gscQuery(['page']),
    gscQuery(['query'], { start: PREV_START, end: PREV_END }),
  ]);

  const prevByQuery = new Map(prevQueries.map((r) => [r.keys[0], r]));

  // Striking distance: ranking 5–20 with real impressions → small push = page 1.
  const striking = queries
    .filter((r) => r.position >= 4.5 && r.position <= 20 && r.impressions >= 30)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 40);

  // Title/meta opportunities: enough impressions, CTR well below expected for position.
  const lowCtr = queries
    .filter((r) => r.impressions >= 100 && r.position <= 15 && r.ctr < expectedCtr(r.position) * 0.6)
    .map((r) => ({ ...r, gap: expectedCtr(r.position) - r.ctr }))
    .sort((a, b) => b.impressions * b.gap - a.impressions * a.gap)
    .slice(0, 30);

  // Movers: biggest click swings vs the previous equal-length window.
  const movers = queries
    .map((r) => {
      const prev = prevByQuery.get(r.keys[0]);
      return { ...r, delta: r.clicks - (prev?.clicks || 0), prevClicks: prev?.clicks || 0 };
    })
    .filter((r) => Math.abs(r.delta) >= 3)
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .slice(0, 25);

  return {
    totals: queries.reduce(
      (t, r) => ({ clicks: t.clicks + r.clicks, impressions: t.impressions + r.impressions }),
      { clicks: 0, impressions: 0 },
    ),
    topQueries: queries.sort((a, b) => b.clicks - a.clicks).slice(0, 25),
    topPages: pages.sort((a, b) => b.clicks - a.clicks).slice(0, 25),
    striking,
    lowCtr,
    movers,
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

function table(headers, rows) {
  const head = `| ${headers.join(' | ')} |`;
  const sep = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((r) => `| ${r.join(' | ')} |`).join('\n');
  return `${head}\n${sep}\n${body}`;
}

function buildReport(gsc, ga4) {
  const lines = [];
  lines.push(`# SEO report — ${START} → ${END} (${DAYS}d${COUNTRY ? `, ${COUNTRY.toUpperCase()}` : ''})`);
  lines.push('');

  if (gsc) {
    lines.push('## Search Console');
    lines.push('');
    lines.push(
      `**Totals:** ${num(gsc.totals.clicks)} clicks · ${num(gsc.totals.impressions)} impressions · ` +
        `${pct(gsc.totals.clicks / Math.max(1, gsc.totals.impressions))} CTR`,
    );
    lines.push('');

    lines.push('### 🎯 Striking distance (rank 5–20 — push these to page 1)');
    lines.push('Closest wins: already visible, small ranking gains convert to real traffic.');
    lines.push('');
    lines.push(
      table(
        ['Query', 'Pos', 'Impr', 'Clicks', 'CTR'],
        gsc.striking.map((r) => [r.keys[0], pos(r.position), num(r.impressions), num(r.clicks), pct(r.ctr)]),
      ),
    );
    lines.push('');

    lines.push('### ✍️ Title/meta rewrites (high impressions, CTR below expected for position)');
    lines.push('You already rank — a better title/description steals clicks without new content.');
    lines.push('');
    lines.push(
      table(
        ['Query', 'Pos', 'Impr', 'CTR', 'Expected'],
        gsc.lowCtr.map((r) => [r.keys[0], pos(r.position), num(r.impressions), pct(r.ctr), pct(expectedCtr(r.position))]),
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
        ['Query', 'Clicks', 'Impr', 'CTR', 'Pos'],
        gsc.topQueries.map((r) => [r.keys[0], num(r.clicks), num(r.impressions), pct(r.ctr), pos(r.position)]),
      ),
    );
    lines.push('');

    lines.push('### Top pages');
    lines.push('');
    lines.push(
      table(
        ['Page', 'Clicks', 'Impr', 'CTR', 'Pos'],
        gsc.topPages.map((r) => [r.keys[0].replace(/^https?:\/\/[^/]+/, ''), num(r.clicks), num(r.impressions), pct(r.ctr), pos(r.position)]),
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
    if (gsc) console.log(`  ${gsc.striking.length} striking-distance queries · ${gsc.lowCtr.length} CTR opportunities`);
  } catch (err) {
    fail(err.message || String(err));
  }
})();
