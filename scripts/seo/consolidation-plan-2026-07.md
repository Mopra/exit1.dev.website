# Blog consolidation plan — round 2 (July 2026)

Status: **EXECUTED 2026-07-29** — with one deliberate deviation. Signed off by Morten.

**Result: 126 → 103 posts, 25 × 301** (23 consolidation redirects + 2 pagination).
Build green, all 25 redirects verified against a running server, all 86 internal
links in blog content verified resolving.

## Deviation: cluster A (DNSSEC) was NOT merged

The plan called DNSSEC "8 near-duplicate posts". **On closer inspection that was
wrong, and merging was cancelled.** Measured verbatim prose overlap across all
15 pairs in the cluster came out at **0.3–1.0%** (8-gram shingle comparison),
and the posts are 1,400–1,900 words each covering genuinely distinct subtopics:
cryptographic mechanics, a decision framework, six failure modes, six real
case studies, and monitoring strategy. Different search intents, not duplicates.

The zero-GSC-impressions observation still holds, but the cause is low topical
demand plus missing authority — not cannibalization. Merging five substantive
articles into two bloated ones would have destroyed ~7,900 words of distinct
content to fix a problem that isn't there. Left in place.

The same measurement was run across every other cluster before deleting
anything. Those held up on the correct criterion — identical *keyword target*
and section skeleton, even where verbatim overlap was low (which is what
cannibalization actually is).

## Also fixed during execution

- **Internal link recovery.** 25 of 43 links to `/tools/dns-checker` lived inside the deleted posts. Replaced with contextual links from four substantive surviving posts (`domain-health-checklist`, `dns-provider-concentration-risk`, `catching-dns-hijacks`, `domain-hijacking-detection`), which are better link sources anyway. Those same posts now also link the new `/tools/nameserver-lookup`, which otherwise would have had zero inbound blog links.
- **Orphaned pagination.** 126 → 103 posts at 12/page took the blog from 11 pages to 9, leaving `/blog/page/10` and `/blog/page/11` as indexed 404s. Both now 301 to `/blog`.
- **Three genuinely broken internal links** found by crawling every link in the content: two used an invalid `/blog/<category>/<slug>` route shape, one pointed at a non-existent `/blog/getting-started`.

---

## Original plan below (for reference)

Follow-up to the June 2026 consolidation (142 → 125 posts, 24 × 301 in `next.config.js`).
Data source: `scripts/seo/output/seo-2026-07-27.md` (GSC 28d to 2026-07-27).

## Why round 2

Round 1 worked: **71 → 137 clicks (+93%)**, CTR 0.3% → 0.5%, and the 301s are
passing traffic correctly (`/blog/free-website-monitoring-tools-2025` still
reports 5,479 impressions under its old URL and forwards them to the canonical).

What round 1 did not touch is a second, larger layer of thin near-duplicate
posts. Each cluster below was verified by reading the posts, not inferred from
titles: they share a section skeleton, a metaDescription formula, and a word
count of roughly 400–900. This is the footprint that risks site-wide Helpful
Content suppression, and it is why authority is spread too thin for the tool
pages to break page 2.

**Proposed: 126 → 100 posts, 26 × 301.**

### Traffic risk

None of the posts marked for absorption appear in the GSC top-25 pages, i.e.
each earns **fewer than 2 clicks per 28 days**. The report truncates at 25 rows,
so this is "no measurable traffic", not a guarantee of exactly zero. The one
exception is called out explicitly in cluster B.

---

## Cluster A — DNSSEC: 8 posts → 4

The largest single topical pile-up in the blog. **8 posts, 12,399 words, and not
one DNSSEC query appears anywhere in the GSC report** — not in striking
distance, not in CTR opportunities, not in content gaps. Eight posts splitting
zero authority.

| Action | Slug |
|---|---|
| **Canonical (what/how/why)** | `dnssec-explained-what-it-is-why-you-need-it` |
| absorb → | `how-dnssec-works-keys-signatures-chain-of-trust` |
| absorb → | `dnssec-worth-the-complexity-analysis` |
| **Canonical (ops/breakage)** | `dnssec-misconfigurations-detection-guide` |
| absorb → | `dnssec-rollover-failures-case-studies` |
| absorb → | `monitoring-dnssec-set-and-forget-doesnt-work` |
| **Keep as-is** | `dnssec-vs-doh-vs-dot-modern-dns-security` (distinct comparison intent) |
| **Keep as-is** | `dnssec-implementation-guide-domain-portfolio` (distinct how-to intent) |

Net: −4 posts.

## Cluster B — "free record lookup" posts: 8 → 1

**This is the same defect just fixed for nameservers.** Seven 600–900 word
articles whose metaDescriptions all promise a "free X record lookup **tool**",
each linking to `/tools/dns-checker` 3–5 times. They are thin articles competing
against the exact tool page we need to rank — `/tools/dns-checker`, which has
**13,909 impressions at position 19.5 and 0.1% CTR**. Redirecting them puts
their signals into the tool page instead of against it.

301 → `/tools/dns-checker`:

- `free-a-record-lookup` (also serves the `a record lookup` gap: 107 impr, pos 27.7)
- `free-mx-record-lookup`
- `free-txt-record-lookup`
- `free-cname-lookup-tool`
- `free-caa-record-check`
- `free-spf-record-checker`
- `free-dmarc-checker`

**Exception — `free-nameserver-lookup` (already handled, not redirected).** It is
the only one with real traffic: **5,579 impressions, 16 clicks, position 10.7**.
It has been retitled to *"NS Records Explained — How DNS Delegation Actually
Works"* and repointed at the new `/tools/nameserver-lookup`, so it now supports
the tool instead of competing with it.

> **Open decision for cluster B.** The alternative for `free-nameserver-lookup`
> is to 301 it to `/tools/nameserver-lookup` outright, handing the new tool page
> an existing position-10.7 ranking rather than making it earn one from zero.
> That is the stronger SEO play and the fastest route to winning the ~2,100
> impression nameserver cluster — but it deletes a post that currently converts,
> and it is not reversible once Google has processed it. Recommend waiting one
> data pull: if the tool page has not started ranking by the next `npm run seo`,
> do the 301 then.

Net: −7 posts.

## Cluster C — incident management: 4 → 1

Verified duplicates. Four posts of 416–472 words, each with the same five-part
skeleton (roles → alerts → communication → evidence → closing pitch) and the
same metaDescription formula ("... using exit1.dev ... without paying
enterprise ..."). 1,772 words total across four URLs.

| Action | Slug |
|---|---|
| **Canonical** | `free-incident-management-runbook` (longest, most concrete) |
| absorb → | `free-incident-management-toolkit` |
| absorb → | `free-incident-management-war-room` |
| absorb → | `free-incident-management-with-exit1` |

Keep `alert-fatigue-starts-with-maintenance-process` and
`watch-ttfb-dns-tls-real-time` — both substantial and distinct.

Net: −3 posts.

## Cluster D — infrastructure monitoring: 3 → 1

| Action | Slug |
|---|---|
| **Canonical** | `free-server-monitoring-checklist-2025` |
| absorb → | `free-infrastructure-monitoring-stack` |
| absorb → | `sre-playbook-free-infrastructure-monitoring` |

**Keep `free-infrastructure-monitoring-tools-comparison-2025`** — on a title
scan this looks like more of the same, but it is a genuine competitor comparison
(Prometheus, Zabbix, Netdata, cloud freebies) with distinct search intent, and
its pricing copy is already current. Also keep `icmp-vs-http-monitoring`
(earns clicks at pos 7.3) and `websockets-vs-polling` (1,750 words, original).

Net: −2 posts.

## Cluster E — cronjob monitoring: 5 → 1

All four posts in the category share one skeleton (inventory → heartbeats →
payload validation → alert routing → reporting), 370–539 words each. The fifth
lives in `monitoring/` and covers the same ground.

| Action | Slug |
|---|---|
| **Canonical** | `cronjob-monitoring-playbook-free-scheduled-task-observability` |
| absorb → | `cronjob-monitoring-metrics-that-matter` |
| absorb → | `free-cronjob-monitor-setup-serverless-schedules` |
| absorb → | `scheduled-task-monitoring-checklist-heartbeats-retries-alerts` |
| absorb → | `monitoring/cron-job-worker-monitoring-http-hooks` |

Net: −4 posts. (This empties the `cronjob-monitoring` category to one post —
check the category hub still reads sensibly afterwards.)

## Cluster F — API monitoring playbooks: 3 → 1

Three 535–677 word posts on the same "how to monitor your API" ground. Worth
doing well: `/tools/api-status-checker` is the site's **#2 page (89 clicks, best
CTR at 1.4%)** and `api health check` (111 impr, pos 28.2) plus `api check`
(74 impr, pos 19.4) are open content gaps. One strong post linking to the tool
serves that better than three thin ones.

| Action | Slug |
|---|---|
| **Canonical** | `api-endpoint-monitoring-playbook-2025` |
| absorb → | `api-observability-automation-toolkit` |
| absorb → | `platform-api-monitoring-operations-guide` |

Keep `api-error-budgets-sla` and `websocket-vs-http-monitoring-real-time-services`.

Net: −2 posts.

## Cluster G — four straight duplicate pairs

Same topic, two URLs each. Merge the shorter into the longer.

| Canonical | Absorb |
|---|---|
| `free-website-monitoring-shopify-woocommerce` (681) | `free-uptime-monitor-ecommerce-guide` (555) |
| `free-uptime-monitor-static-sites-jamstack` (659) | `jamstack-github-pages-uptime-monitoring` (642) |
| `free-uptime-monitor-checklist` (766) | `free-website-monitoring-beyond-uptime-checklist` (477) |
| `soc2-iso-website-monitoring-prep-guide` (441) | `free-website-monitoring-audit-sla-evidence` (428) |

Net: −4 posts.

---

## Execution checklist (once signed off)

1. Merge any genuinely unique material from each absorbed post into its canonical before deleting — do not lose content, only URLs.
2. Delete the absorbed `.md` files.
3. Add 26 × `{ source, destination, permanent: true }` to `redirects()` in `next.config.js` (brings the total to 50).
4. Bulk-repoint internal links to the canonicals, then grep for any surviving references to deleted slugs.
5. Check `RelatedPosts` / category hubs still render (cluster E leaves one post in its category).
6. `npx next build` to verify.
7. Re-pull `npm run seo` in 3–4 weeks to measure.

## Not in scope — still the real ceiling

The high-impression tool pages remain **ranking-limited, not content-limited**:
`/tools/redirect-checker` (11,459 impr, pos 27.2, ~3,700 impressions of
perfect-intent `301 redirect checker` queries), `/tools/uptime-checker` (8,405
impr, pos 31.1), `/tools/ssl-checker` (`check ssl certificate` at pos 55.8).
Their titles and metas are already well-tuned. Consolidation frees internal
authority to flow toward them, but the binding constraint is backlinks — see
`scripts/seo/authority-plan.md`.
