# Blog & Tool-Page Authority Plan (Phase 5)

> Companion to the in-repo SEO work (consolidation, hubs, internal linking).
> This phase is **not code** — it's the off-page work that lifts the pages the
> blog can't lift on its own.

## The problem this solves

After de-cannibalization (142 → 125 posts) and internal-linking, the remaining
ceiling is **domain authority**. The data proves it: our money/tool pages rank
where backlinks — not content — decide the winner:

| Page | Query | Pos | Impr/28d | Diagnosis |
| --- | --- | --- | --- | --- |
| /tools/ssl-checker | "check ssl certificate" | ~40 | 5,145 | content is rich (500+ lines); stuck on authority |
| /tools/dns-checker | "dns checker" / "dns lookup" | ~35 | 7,797 | same |
| /tools/domain-expiration-checker | "domain expiry check" | ~15–25 | 9,699 | closest; a few links push it to page 1 |
| /tools/api-status-checker | "api uptime checker" | ~9–27 | 5,526 | within reach |

More blog posts will **not** move these. Referring domains will.

## Tactics, ranked by ROI for a small SaaS

### 1. Turn the free tools into link magnets (highest ROI)
The `/tools/*` pages are genuinely useful, free, no-signup utilities — exactly
what people link to. We just need them seen.
- Submit each tool to "best free [SSL/DNS/domain] checker" roundups (outreach to
  the authors of articles already ranking page 1 for those terms).
- Post to relevant communities when contextually appropriate: r/webdev,
  r/sysadmin, r/selfhosted, Hacker News ("Show HN"), Indie Hackers, lobste.rs.
- Add each tool to free-tool directories: AlternativeTo, SaaSHub, Product Hunt,
  toolfinder-style lists, awesome-* GitHub lists (PRs).

### 2. Digital PR from our own data (our moat)
We have something competitors don't: real uptime/outage data (status pages +
BigQuery, in the app repo).
- Publish periodic **outage reports / "state of uptime"** studies on the
  cloud/SaaS services we monitor. Original data earns journalist + blog links.
- When a major provider has an outage, publish a fast, factual timeline page —
  these attract links during the news cycle (the `/status/*` pages already seed
  this; promote them).

### 3. Listing-site & directory backlinks
- Product directories: G2, Capterra, GetApp, SaaSHub, AlternativeTo, Product Hunt.
- Integration directories: Slack App Directory, Discord, PagerDuty/Opsgenie
  marketplaces, Zapier — each is a backlink + a distribution channel.

### 4. Leverage the "alternative to X" pages we already rank for
We rank for `uptimerobot alternative`, `pingdom alternative`, `freshping`, etc.
Get these posts cited on competitor-comparison aggregators and "X alternatives"
listicles — they pass topical links to the canonical pages we just consolidated.

### 5. Developer-community content
- Cross-post pillar content (with canonical link back) to dev.to and Hashnode.
- Answer monitoring/SSL/DNS questions on Stack Overflow / Reddit with a genuine,
  non-spammy link to the relevant tool or guide when it actually helps.

### 6. HARO / journalist requests
Respond to reporter queries on reliability, incident response, and SRE topics —
high-authority publication links.

## In-repo support already shipped
- Posts link heavily to tool pages (domain-expiration 22, ssl-checker 15,
  dns-checker 12, api-status-checker 10). Gap: `uptime-checker` and
  `redirect-checker` have 0 inbound post links — add contextual links when
  editing relevant posts.
- Category hubs + related-posts now distribute internal authority to canonicals.

## Measurement
- Monthly: `npm run seo` — watch tool-page positions for the queries above.
- Track **referring domains** (GSC "Links" report, or Ahrefs/Moz if available) —
  this is the leading indicator for tool-page rank, not impressions.
- Target: domain-expiration-checker to page 1 first (it's closest), then
  api-status-checker, then dns-checker, then ssl-checker.
