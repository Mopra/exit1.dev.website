# Off-page playbook

The daily run that builds exit1's authority and reach outside exit1.dev:
backlinks, listings, mentions, reviews, communities, social and digital PR.
Horadric's "Off-page playbook" errand runs it every morning after the
on-page run ([marketing-playbook.md](marketing-playbook.md)).

Why it matters: the tool pages are backlink-limited, not content-limited.
`/tools/ssl-checker` sits around position 40 with rich content, because
the pages above it have more referring domains. More links from relevant
sites is the lever on-page work can not pull. LLMs work the same way: they
cite products that show up across many independent sources (lists,
directories, Reddit threads, comparison articles), so every real listing
helps AI answers too.

## What the run may do by itself, and what it drafts

Arming this errand is the human's go-ahead for the first list. Everything
else is drafted and handed over as an `Ask:` quest.

**Does it itself:**
- Opens PRs to GitHub awesome-lists and registries from the Mopra account
  (`GH_TOKEN=$(gh auth token --user Mopra)`), one entry, following the
  list's CONTRIBUTING rules, in the list's own format. Owner-prefixed fork
  names, since fork names collide.
- Answers maintainer review comments on our own open PRs.
- Submits to free directories through the Horadric browser, signing in with
  Google (mortenprads@gmail.com) where an account exists.
- Updates `docs/offpage-tracker.md`, `docs/social-drafts.md` and the log.

**Drafts only, never posts:**
- Social posts (X, LinkedIn, Bluesky, Mastodon).
- Reddit, Hacker News, Stack Overflow, Indie Hackers, Discord replies.
  AI-written community posts get accounts banned and the brand burned.
- Outreach emails to article authors, journalists, newsletters, podcasts.
- Review requests to users.

**Never:**
- Pays anything, or takes a "priority" or "dofollow" paid tier.
- Gets past a captcha or bot wall. Leave the form filled and file an `Ask:`.
- Submits where AI-written PRs or posts are banned (free-for-dev has a trap
  checkbox). The human writes those.
- Ticks a box that is not true ("tested in X", "I am the maintainer of",
  "I used this for a year").
- Adds a reciprocal badge or link to exit1.dev in exchange for a listing.
- Submits anywhere already in the tracker.

## The daily run

1. **Read the tracker and the last 14 days of the log.** The tracker is the
   source of truth for where exit1 is listed, pending or blocked.
2. **Run today's play** from the rotation.
3. **Do at most three external actions** (PRs, submissions), and file at
   most **one** `Ask:` quest that bundles everything the human needs to do
   today, with the drafts inside its notes or pointing at
   `docs/social-drafts.md`.
4. **Update the tracker** with every action and its URL.
5. **Log the day** in `docs/marketing-log.md` under an `Off-page` line.

## Rotation

| Day | Play |
|---|---|
| Monday | Follow-ups and referral numbers |
| Tuesday | Listings: directories, awesome-lists, MCP registries |
| Wednesday | Mentions and reviews |
| Thursday | Link magnets and digital PR |
| Friday | Social drafts for the week |
| Saturday | Communities |
| Sunday | Competitor gap research |

### Monday: follow-ups and referral numbers

- Check every pending PR with `gh pr view` and every pending directory.
  Move merged and live ones to Live in the tracker, closed ones to Blocked
  with the reason. Answer review comments.
- From the latest `scripts/seo/output/seo-<date>.md`, log GA4 referral
  sessions and key events, and the top referring sources. A source that
  sends signups deserves more of the same kind of listing.
- Count live listings in the tracker and log the number. Referring domains
  are the leading indicator; positions follow weeks later.

### Tuesday: listings

Pick from the tracker's Queue first. Otherwise find new candidates by
searching for lists where competitors appear: "awesome uptime monitoring",
"awesome status page", "awesome devops tools", "awesome mcp servers",
"free saas tools list", "free developer tools". Good targets in order:

1. Active GitHub awesome-lists (a commit in the last 3 months, PRs getting
   merged) that fit the topic.
2. MCP registries and directories (exit1 ships `exit1-mcp` on npm and a
   hosted OAuth server at `app.exit1.dev/mcp/v1`).
3. Free SaaS and dev-tool directories with a dofollow or at least an
   indexed listing page.
4. Integration directories (Slack, Discord, Zapier, Raycast) when the
   integration really exists.

Each free tool is its own listing opportunity: "best free SSL checker",
"free DNS lookup tools", "domain expiry checker" lists.

### Wednesday: mentions and reviews

- WebSearch `"exit1.dev"` and `"exit1" uptime` for the past month. A
  mention without a link becomes a short, friendly link request draft.
  A wrong fact (old price, old limits) becomes a correction draft.
- Check our pages on Product Hunt, G2, AlternativeTo, SaaSHub, Capterra.
  Stale descriptions or pricing get fixed where we can edit, drafted where
  we can not.
- Draft one review request the human can send to happy users, for
  example in the Discord, pointing at the one review site that matters
  most this month.

### Thursday: link magnets and digital PR

exit1 has data nobody else has: real outage timings on `/status/*` and
uptime data in the app. That earns links from journalists and bloggers.

- Did a well-known developer service have an outage in the last week?
  (Spike pages in the SEO report and status-page news tell you.) If yes,
  file an on-site quest for a factual timeline with our numbers, and draft
  pitches to two or three outlets or newsletters that cover it.
- Find articles ranking on page 1 for our tool queries ("check ssl
  certificate", "dns checker", "domain expiry checker", "api status
  checker", "is my website down") that list tools and miss exit1. Draft a
  short note to the author: what the tool does, the link, nothing more.
- Look at reporter request services and newsletters asking for SRE,
  reliability or incident sources. Draft a quotable answer.

### Friday: social drafts

Write next week's posts into `docs/social-drafts.md`. Sources:
`git log --since="1 week ago"` in `../exit1.dev` (the app) and in this
repo, new or improved tools, outage data, a striking number from the
status pages, a customer question from Discord.

- Five posts for X/Bluesky, two for LinkedIn. Each one stands alone, says
  one concrete thing, links one page with UTM
  (`?utm_source=<network>&utm_medium=social&utm_campaign=weekly`).
- Developer voice, the rules in the on-page playbook's Guardrails. No
  hashtag walls, no emoji bullets, no "excited to announce".
- One `Ask:` quest: "Post this week's social drafts".

### Saturday: communities

Find three fresh threads (under a week old) where someone asks for what
exit1 does: a free uptime monitor, status page, SSL expiry alerts, domain
expiry alerts, monitoring from an AI assistant. Search Reddit (r/webdev,
r/selfhosted, r/sysadmin, r/devops, r/SaaS, r/indiehackers), Hacker News,
Stack Overflow, Indie Hackers.

Draft a reply that answers the question first and mentions exit1 only
where it actually helps, disclosed ("I make this"). Skip threads where a
link would be spam. All three go into one `Ask:` quest with the thread
links.

### Sunday: competitor gap

Pick one competitor a week, in turn: UptimeRobot, Better Stack, Pingdom,
StatusCake, Hetrix Tools, Freshping alternatives, Upptime, Uptime Kuma,
Cronitor, Checkly. Search for where they are listed, reviewed or
recommended (awesome-lists, directories, "alternatives" articles, Reddit
recommendation threads). Every place that fits exit1 and is not in the
tracker goes into the tracker's Queue with a one-line note. Tuesday works
the queue.

## Tracker format

`docs/offpage-tracker.md` has four sections: Live, Pending, Queue,
Blocked. One line per place:

```
- <name> | <url of our listing, PR or form> | <date> | <note>
```

## Measure

- Weekly (Monday): live listings, pending, referral sessions, referral key
  events.
- Monthly: positions of the backlink-limited tool pages
  (`/tools/ssl-checker`, `/tools/dns-checker`,
  `/tools/domain-expiration-checker`, `/tools/api-status-checker`,
  `/tools/redirect-checker`). Target: domain-expiration-checker on page 1
  first, since it is closest.
- LLM mentions are measured on the on-page run's Wednesday.
