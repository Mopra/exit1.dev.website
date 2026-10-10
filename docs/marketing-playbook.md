# Marketing playbook

The daily run that grows organic visitors and signups for exit1.dev, from
search engines and from LLMs. Horadric's "Marketing playbook" errand reads
this file every morning, measures, picks today's play, and files the work as
quests. Warriv runs the quests. This file is the on-page half: the site
itself. Backlinks, listings, mentions, social and communities are the
off-page half, in [offpage-playbook.md](offpage-playbook.md), run by its own
errand an hour later.

The goal is not activity. The goal is more clicks from search, more
mentions in AI answers, and more of those visitors signing up. A day where
nothing is worth doing files nothing.

## The daily run

1. **Pull the numbers.** `npm run seo`. It writes
   `scripts/seo/output/seo-<date>.md`. Read it with the traps in
   `scripts/seo/README.md` in mind (spike pages, bot traffic, query rows
   are a 30% sample, averages hide geography). If the pull fails, log the
   error and stop: never play blind.
2. **Check what we already did.** Read the last 14 days of
   `docs/marketing-log.md` and `horadric quest list`. For every quest the
   playbook filed that has landed and is 14+ days old, compare its page
   against the baseline in the quest's notes and write the verdict in the
   log (worked, flat, worse). Two weeks is the earliest read, 28 days the
   fair one.
3. **Look for alarms.** Any of these beats today's play:
   - Exact site clicks down 20%+ week over week once spike pages are out.
   - A page that earned 10+ clicks last window earns under half now.
   - `npm run seo:index` (Mondays, or when a page vanished) shows a money
     page dropped from the index.
   - GA4 key events fell while sessions held: the signup path may be broken.
     Open the page and click the CTA in the Horadric browser to confirm.
4. **Run today's play** from the rotation below. Find at most **two**
   concrete wins. Fewer is fine.
5. **File each win as a quest** (format below), then log the day.

## Rotation

| Day | Play |
|---|---|
| Monday | Weekly read + title/meta CTR |
| Tuesday | Striking distance |
| Wednesday | LLM visibility |
| Thursday | Internal links, cannibalization, indexing |
| Friday | Conversion |
| Saturday | Programmatic pages (/status, /compare) |
| Sunday | Freshness |

### Monday: weekly read + title/meta CTR

Write a weekly entry in the log: exact clicks, impressions, tier-1 clicks,
ex-spike clicks vs last week, section split, GA4 sessions and key events.
Then take the report's "Title/meta rewrites" section. Pick pages where
tier-1 CTR sits well under what the position earns. Rewrite the title to
match the searcher's words and intent. The proven pattern:
`/tools/uptime-checker` went from 27 to 92 clicks after its title became
"Is My Website Up?". Brand-status queries ("is X down") are not CTR
problems.

### Tuesday: striking distance

Queries at position 5 to 20 with tier-1 impressions. For each candidate,
open the ranking page and ask what would move it: a sharper H1, a direct
answer in the first 100 words, a missing section the top results have, a
FAQ block, fresher `updated:` date with real changes. One page per quest.

### Wednesday: LLM visibility

LLMs cite pages that state facts plainly and are easy to quote.

- Keep `public/llms.txt` true. Diff it against `src/app/pricing`, the
  `src/app/tools` folder and the feature routes. Wrong prices or missing
  tools there go straight into AI answers.
- Ask the questions buyers ask an assistant ("best free uptime monitor",
  "free status page tool", "monitor SSL expiry free", "uptime monitoring
  MCP server") with WebSearch. Note who gets cited and whether exit1 shows
  up. Log it, so the trend is visible week to week.
- Pick one page that should be cited and is not. Make it quotable: a
  one-sentence answer up top, a facts table (limits, intervals, price),
  correct JSON-LD (`SoftwareApplication`, `FAQPage` only for real FAQs).
- GA4 AI referrals (chatgpt.com, perplexity.ai, claude.ai, gemini,
  copilot) are the score. If the SEO report has no AI referral section
  yet, the first Wednesday files a quest to add one to
  `scripts/seo/pull-seo.mjs`.

### Thursday: internal links, cannibalization, indexing

- Two of our pages ranking for the same query split the signal. Pick the
  stronger, repoint links, propose a 301 for the weaker. Merging or
  deleting a post needs the human's yes: file it as a question.
- Tool and feature pages with few internal links from posts get links in
  relevant posts (inline, contextual, not link dumps).
- `npm run seo:index` for pages that should be indexed and are not. After
  a batch of fixes, `npm run seo:recrawl` prints what to submit; the
  "Request indexing" button has no API, so that becomes a human quest.

### Friday: conversion

Visitors who do not sign up are wasted rankings.

- Take the top 10 GA4 landing pages by organic sessions. Sort by key
  events per session. The worst high-traffic page gets the quest.
- Check each CTA goes through `buildSignupUrl` with UTM, fires
  `sign_up_click`, and that tool pages show the result-aware inline CTA.
- Click through the signup path in the Horadric browser once a week.

### Saturday: programmatic pages

- `/status/*`: niche developer infrastructure earns, big consumer brands
  do not. Propose up to 5 new targets from striking-distance queries or
  outage news in the dev space. Status pages must stay deterministic per
  data snapshot (no `Date.now()` strings).
- `/compare/*`: check competitor facts (prices, free tiers) against their
  pricing pages. Stale facts are a quest.

### Sunday: freshness

Take the 10 pages with the most impressions. Look for anything that has
gone stale: a year in a title, old prices or limits, a competitor fact that
changed, a screenshot of an old UI, a feature we have shipped since that
the page does not mention. Real updates get a new `updated:` date, which
feeds the sitemap. A date bump with no real change is not an update.

## Filing a quest

```
horadric quest add "<verb> <page>: <what changes>" --notes "From: playbook <YYYY-MM-DD> <play> <page>
Baseline (28d to <date>): <clicks> clicks, <impr> impr, pos <pos>, tier-1 CTR <ctr>
Why: <one line from the data>
Done when: <the change is on master and npx next build passes>"
```

- One page, one change, per quest. A session must be able to finish it in
  one sitting.
- Before filing, check `horadric quest list` and the log: no second quest
  for a page that has an open one, or that was changed in the last 28 days
  (let the last change be measured first).
- Anything that needs the human (a 301 that removes a post, a new
  submission, money, an account) starts the title with `Ask:` and its notes
  say what to decide.

## Guardrails

These come from things that went wrong before. Do not relitigate them.

- **No new blog posts.** The blog is sprawl, not shortage. Asked three
  times, the answer was no. Improve, merge, link.
- **No new tool pages** unless the data shows a big unserved cluster. A
  fresh exact-match URL does not inherit rankings (`/tools/nameserver-lookup`
  sat at pos 47 while the post it replaced held pos 10).
- **Copy voice**: blunt developer voice. No "X, not Y" antithesis, no
  em dashes, no five-verb lists, no "seamless".
- **This run never pays, posts or submits anything outside the repo.** The
  off-page run has its own, narrower rules for that.
- **Every UI change** keeps `cursor-pointer` on clickables and avoids
  hairline dividers.
- **Do not chase** impressions from Bangladesh/Pakistan/India scrapers or a
  rank tracker. Score on exact and tier-1 numbers.

## The log

`docs/marketing-log.md`, newest day on top. One block per day; the on-page
run writes it, the off-page run adds its `Off-page:` line under it:

```
## 2026-10-11 Sunday: freshness
Clicks 28d: 812 (ex-spike 705), tier-1 251, key events 38
Alarms: none
Measured: "Retitle /tools/ssl-checker" (landed 09-27): pos 42.6 -> 38.1, clicks 8 -> 11, flat
Filed: "Update /tools/dns-checker: 2025 in title, missing CAA lookup"
Off-page (competitor gap: UptimeRobot): 4 places queued, 1 PR opened (<url>), no Ask
```
