/**
 * Content moves: permanent redirects where a page's content was folded into
 * another URL. Single source of truth, consumed by two places:
 *
 *   - next.config.js turns every entry into a permanent redirect.
 *   - src/app/sitemap.ts re-advertises recent sources so Google recrawls them.
 *
 * Campaign aliases and off-site bounces do NOT belong here. They are not content
 * moves, they never need recrawling, and /cli is deliberately temporary.
 *
 * ── Why the sitemap re-advertises these, and why `since` exists ──────────────
 *
 * A 301 only takes effect when Google recrawls the old URL, and consolidation
 * removes every path by which that happens: the post is deleted from the sitemap
 * and every internal link is repointed at the destination. Google's only route
 * left is its own slow revisit schedule.
 *
 * Measured on 2026-08-21 against the 2026-08-02 batch, via the URL Inspection
 * API. Where Google had recrawled, the redirect had worked perfectly:
 *
 *   /blog/free-cname-lookup-tool          crawled 08-17  canonical moved ✅
 *   /blog/free-website-monitoring-tools-2025  crawled 07-22  canonical moved ✅
 *
 * Where it had not, the old URL was still indexed and still ranking:
 *
 *   /blog/free-nameserver-lookup          crawled 08-01  still indexed ❌
 *   /blog/free-a-record-lookup            crawled 07-03  still indexed ❌
 *   /blog/free-mx-record-lookup           crawled 07-26  still indexed ❌
 *
 * free-nameserver-lookup missed the deploy by a single day, and three weeks later
 * it still held position 10 on ~1,400 tier-1 impressions a week while its
 * destination sat at position 42 with both URLs indexed and the signals split.
 *
 * So the fix is to keep the old URL discoverable for as long as it takes Google
 * to notice, which is what Google's own site-move guidance recommends, then stop.
 * A sitemap entry carrying `lastModified: since` is the signal that the URL
 * changed on that date, which is the thing that prompts the recrawl.
 *
 * Search Console will list these under "Page with redirect". That is the intended
 * end state, not an error: it means Google has processed the move.
 *
 * `since` is the deploy date of the redirect, and entries age out of the sitemap
 * after RECRAWL_WINDOW_DAYS. Past that, an un-recrawled URL has too little left
 * to be worth the crawl budget.
 */

/** How long a moved URL keeps its sitemap entry, in days. */
const RECRAWL_WINDOW_DAYS = 90;

/** @typedef {{ from: string, to: string, since: string }} ContentMove */

/** @type {ContentMove[]} */
const CONTENT_MOVES = [
  // Removed guide URLs, pre-dating the consolidation rounds.
  { from: '/blog/get-started', to: '/blog', since: '2025-08-27' },
  { from: '/blog/webhook-alerts-slack-discord', to: '/blog', since: '2025-08-27' },
  { from: '/blog/downtime-alerts-guide', to: '/blog', since: '2025-08-27' },
  { from: '/blog/beyond-uptime-monitoring-guide', to: '/blog', since: '2025-08-27' },

  // Route renames.
  { from: '/real-time-monitoring', to: '/live-checks', since: '2026-05-22' },
  // /why-nano reframed as /why-upgrade to cover Indie, Nano and Pro.
  { from: '/why-nano', to: '/why-upgrade', since: '2026-06-05' },

  // ── Consolidation round 1 (June 2026) ───────────────────────────────
  // Thin duplicate competitor pages folded into their richer canonical post.
  { from: '/blog/uptimerobot-alternatives', to: '/blog/uptimerobot-alternative-free-unlimited', since: '2026-06-27' },
  { from: '/blog/pingdom-free-alternative', to: '/blog/pingdom-alternative-free-unlimited-monitoring', since: '2026-06-27' },
  // "Best free monitoring tools" mega-cluster -> single canonical.
  { from: '/blog/free-website-monitoring-tools-2025', to: '/blog/best-free-uptime-monitoring-tools', since: '2026-06-27' },
  { from: '/blog/best-free-website-monitoring-tool-2025', to: '/blog/best-free-uptime-monitoring-tools', since: '2026-06-27' },
  { from: '/blog/best-website-monitoring-service-2025', to: '/blog/best-free-uptime-monitoring-tools', since: '2026-06-27' },
  { from: '/blog/free-uptime-monitors-no-limits-2025', to: '/blog/best-free-uptime-monitoring-tools', since: '2026-06-27' },
  // Freshping cluster -> canonical replacement (migration checklist kept separate).
  { from: '/blog/free-freshping-alternative', to: '/blog/freshping-replacement-uptime-monitoring', since: '2026-06-27' },
  { from: '/blog/freshping-alternative-for-teams', to: '/blog/freshping-replacement-uptime-monitoring', since: '2026-06-27' },
  // Free vs paid pair -> canonical.
  { from: '/blog/free-vs-paid-website-monitoring', to: '/blog/free-uptime-monitor-vs-paid', since: '2026-06-27' },
  // SSL monitoring: per-channel variants folded into one canonical.
  { from: '/blog/free-ssl-monitoring-discord-alerts', to: '/blog/free-ssl-certificate-monitoring', since: '2026-06-27' },
  { from: '/blog/free-ssl-monitoring-email-alerts', to: '/blog/free-ssl-certificate-monitoring', since: '2026-06-27' },
  { from: '/blog/free-ssl-monitoring-slack-alerts', to: '/blog/free-ssl-certificate-monitoring', since: '2026-06-27' },
  { from: '/blog/ssl-certificate-monitoring-alerts-made-easy-and-why-it-matters', to: '/blog/free-ssl-certificate-monitoring', since: '2026-06-27' },
  // SLA cluster -> strategy pillar + reporting playbook.
  { from: '/blog/free-sla-monitoring-guide', to: '/blog/free-sla-monitoring-strategy', since: '2026-06-27' },
  { from: '/blog/free-sla-monitoring-checklist', to: '/blog/free-sla-monitoring-strategy', since: '2026-06-27' },
  { from: '/blog/sla-reporting-free-uptime-stack', to: '/blog/free-sla-monitoring-reporting-playbook', since: '2026-06-27' },
  // Intro/101 -> single beginner pillar.
  { from: '/blog/website-monitoring-101', to: '/blog/intro-to-website-monitoring', since: '2026-06-27' },

  // ── Consolidation round 2 (July 2026, deployed 2026-08-02) ──────────
  // See scripts/seo/consolidation-plan-2026-07.md. 126 -> 103 posts.

  // Tool-intent posts -> the actual tool pages. These were thin articles whose
  // meta descriptions promised a "free X lookup tool" while the real tool page
  // competed against them for the same query.
  { from: '/blog/free-nameserver-lookup', to: '/tools/nameserver-lookup', since: '2026-08-02' },
  { from: '/blog/free-a-record-lookup', to: '/tools/dns-checker', since: '2026-08-02' },
  { from: '/blog/free-mx-record-lookup', to: '/tools/dns-checker', since: '2026-08-02' },
  { from: '/blog/free-txt-record-lookup', to: '/tools/dns-checker', since: '2026-08-02' },
  { from: '/blog/free-cname-lookup-tool', to: '/tools/dns-checker', since: '2026-08-02' },
  { from: '/blog/free-caa-record-check', to: '/tools/dns-checker', since: '2026-08-02' },
  { from: '/blog/free-spf-record-checker', to: '/tools/dns-checker', since: '2026-08-02' },
  { from: '/blog/free-dmarc-checker', to: '/tools/dns-checker', since: '2026-08-02' },

  // Incident management: 4 near-identical ~440-word posts -> one runbook.
  { from: '/blog/free-incident-management-toolkit', to: '/blog/free-incident-management-runbook', since: '2026-08-02' },
  { from: '/blog/free-incident-management-war-room', to: '/blog/free-incident-management-runbook', since: '2026-08-02' },
  { from: '/blog/free-incident-management-with-exit1', to: '/blog/free-incident-management-runbook', since: '2026-08-02' },

  // Infrastructure monitoring -> single checklist (comparison post kept).
  { from: '/blog/free-infrastructure-monitoring-stack', to: '/blog/free-server-monitoring-checklist-2025', since: '2026-08-02' },
  { from: '/blog/sre-playbook-free-infrastructure-monitoring', to: '/blog/free-server-monitoring-checklist-2025', since: '2026-08-02' },

  // Cronjob monitoring: 5 posts sharing one skeleton -> one playbook.
  { from: '/blog/cronjob-monitoring-metrics-that-matter', to: '/blog/cronjob-monitoring-playbook-free-scheduled-task-observability', since: '2026-08-02' },
  { from: '/blog/free-cronjob-monitor-setup-serverless-schedules', to: '/blog/cronjob-monitoring-playbook-free-scheduled-task-observability', since: '2026-08-02' },
  { from: '/blog/scheduled-task-monitoring-checklist-heartbeats-retries-alerts', to: '/blog/cronjob-monitoring-playbook-free-scheduled-task-observability', since: '2026-08-02' },
  { from: '/blog/cron-job-worker-monitoring-http-hooks', to: '/blog/cronjob-monitoring-playbook-free-scheduled-task-observability', since: '2026-08-02' },

  // API monitoring playbooks -> single playbook.
  { from: '/blog/api-observability-automation-toolkit', to: '/blog/api-endpoint-monitoring-playbook-2025', since: '2026-08-02' },
  { from: '/blog/platform-api-monitoring-operations-guide', to: '/blog/api-endpoint-monitoring-playbook-2025', since: '2026-08-02' },

  // Straight duplicate pairs.
  { from: '/blog/free-uptime-monitor-ecommerce-guide', to: '/blog/free-website-monitoring-shopify-woocommerce', since: '2026-08-02' },
  { from: '/blog/jamstack-github-pages-uptime-monitoring', to: '/blog/free-uptime-monitor-static-sites-jamstack', since: '2026-08-02' },
  { from: '/blog/free-website-monitoring-beyond-uptime-checklist', to: '/blog/free-uptime-monitor-checklist', since: '2026-08-02' },
  { from: '/blog/free-website-monitoring-audit-sla-evidence', to: '/blog/soc2-iso-website-monitoring-prep-guide', since: '2026-08-02' },

  // Pagination shrank from 11 to 9 pages (126 -> 103 posts at 12/page). These
  // were indexed, so send them to the index rather than 404.
  { from: '/blog/page/10', to: '/blog', since: '2026-08-02' },
  { from: '/blog/page/11', to: '/blog', since: '2026-08-02' },

  // ── Live 404s that Google was still serving (found 2026-08-25) ───────
  //
  // These were deleted rather than redirected, so Google held an indexed URL
  // that returned 404. Found by the URL Inspection sweep in
  // `scripts/seo/pull-index-coverage.mjs`, which is the only report that can see
  // them: a 404 earns no impressions once it drops, so Search Analytics alone
  // shows a page fading out with no reason attached.
  //
  // free-domain-monitoring-discord-alerts was the expensive one. Despite being a
  // 404 since at least 2026-03-11 it still held 509 impressions at position 7.6,
  // and its named queries were all Discord alerting ("discord uptime alerts",
  // "lagnis free uptime monitoring discord webhook"), not domain monitoring.
  // Hence the destination is the Discord post, not a domain one.
  {
    from: '/blog/free-domain-monitoring-discord-alerts',
    to: '/blog/free-website-monitor-discord-integration',
    since: '2026-08-25',
  },
  // Pagination went past 12 pages before the consolidation rounds. page/10 and
  // page/11 were caught above; page/12 was indexed too and was missed.
  { from: '/blog/page/12', to: '/blog', since: '2026-08-25' },
  // Old onboarding URL, superseded by /getting-started.
  { from: '/quick-start', to: '/getting-started', since: '2026-08-25' },
];

/**
 * Moves still inside the recrawl window, for the sitemap to re-advertise.
 *
 * `today` is injected rather than read from the clock so the sitemap route stays
 * deterministic per data snapshot: it is ISR'd, and Vercel only charges write
 * units when the output actually changes. Day granularity means this set shifts
 * at most once a day, and in practice only when a move ages out.
 *
 * @param {string} today ISO day, e.g. "2026-08-21"
 * @returns {ContentMove[]}
 */
function movesAwaitingRecrawl(today) {
  const cutoff = Date.parse(today) - RECRAWL_WINDOW_DAYS * 86400000;
  return CONTENT_MOVES.filter((m) => Date.parse(m.since) >= cutoff);
}

module.exports = { CONTENT_MOVES, RECRAWL_WINDOW_DAYS, movesAwaitingRecrawl };
