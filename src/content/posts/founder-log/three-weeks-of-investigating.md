---
title: "Three Weeks of 'Investigating'"
author: "Morten Pradsgaard"
category: "founder-log"
excerpt: "On June 22, a fiber cut took a fifth of the internet offline and got fixed within the hour. Meanwhile, a Cloudflare incident opened on June 16 is still yellow three weeks later. The loud outage isn't the one that should worry you."
date: "2026-07-07"
metaDescription: "The June 22 Cloudflare fiber cut got fixed in an hour. A Workers AI degradation open since June 16 is still 'investigating' three weeks later. Why slow-burn incidents never count as downtime."
---

# Three Weeks of "Investigating"

Two things happened at Cloudflare in the last few weeks. One of them made every news site on the planet. The other one is still happening, and almost nobody has mentioned it.

The first was June 22. A fiber line got severed somewhere in Eastern North America, and because Cloudflare fronts roughly a fifth of global web traffic, the failure cascaded outward fast: X, Reddit, Microsoft Teams, Zoom, Discord, Canva, Fortnite, parts of AWS. Down Detector lit up. Live blogs spun up. Cloudflare's engineers saw elevated error rates at 13:35 UTC and had traced the root cause by 14:37. Some services were recovering within twenty minutes. By the next morning it was already a war story.

The second incident opened on June 16 — six days *before* the fiber cut. Cloudflare's status page has carried a "Workers AI Degraded Availability" entry since then, covering some of its hosted models. As I write this, the most recent update — dated July 4, more than two weeks in — reads, in full:

> We are continuing to investigate this issue.

Three weeks. Still yellow. Still "investigating."

I want to talk about the second one, because I think we've all been trained to worry about the wrong incident.

## Loud outages fix themselves

Here's the uncomfortable mechanic behind the June 22 story: the outage was so big that it created its own accountability.

When X and Reddit and Teams go dark simultaneously, the vendor doesn't get to control the narrative. Journalists are writing live updates. Customers are screaming in public. Executives are getting pinged. The entire weight of the internet's attention lands on the problem at once, and the problem gets an army.

Detection at 13:35. Root cause at 14:37. That is genuinely impressive incident response — and it is also exactly what you'd expect when the alternative is being the top story on every tech site for another hour. Loud outages recruit their own fixers.

And June 22 wasn't even an isolated bad day. ThousandEyes counted 516 global network outage events that week — ISPs, cloud providers, collaboration platforms, edge networks — up 26% from the week before. On July 3, Cloudflare's status page picked up another entry: increased errors for Durable Objects and downstream services, again in Eastern North America. The plumbing is having a rough summer. But every one of those loud events follows the same arc: spike, headlines, fix, post-mortem.

The slow burn follows a different arc entirely.

## Quiet degradation has no constituency

A "Degraded Availability" incident on a subset of Workers AI models breaks none of the things that make outages loud. There's no Down Detector spike. No journalist covers it. Most affected users probably experience it as flaky behavior they can't quite pin down — a timeout here, an error there, retry and it works. The kind of thing you blame on your own code for a week before you think to check the vendor's status page.

So the incident just... sits there. Day 5. Day 12. Day 18. "We are continuing to investigate this issue."

I wrote a couple of months ago about how [GitHub's status page math](/blog/github-doesnt-get-to-decide-what-down-means) works: major outage counts as 100% downtime, partial outage counts as 30%, and degraded performance counts as **zero**. Zero percent. That weighting scheme isn't unique to GitHub — it's the industry's open secret. A degraded incident can run for a month and the headline uptime number doesn't move at all.

Follow the incentive gradient and the summer makes perfect sense. A fiber cut that takes down a fifth of the internet is existential — it gets root-caused in 62 minutes. A degradation that affects some models for some users costs the uptime number nothing — it gets "we are continuing to investigate" on day 18. Both responses are rational. That's the problem. The system is working exactly as designed, and the design doesn't include you.

## "Degraded" is a place incidents go to be forgotten

Here's the question worth sitting with: what is the practical difference between "degraded for three weeks" and "down"?

If you built a product on one of those affected models, there is no difference. Your feature has been unreliable for three weeks. Your users have been hitting errors for three weeks. Your support queue has been absorbing the fallout for three weeks. From inside your product, this is an outage — it's just an outage that's been filed under a word that doesn't trigger anything. No SLA credit. No headline. No army.

That's the real function of the "degraded" bucket. It's not a severity level. It's a jurisdiction. Incidents classified as degraded exist outside the system of consequences that makes loud outages get fixed — outside the uptime math, outside the SLA triggers, outside the news cycle. The vendor's incentive isn't to resolve them quickly. It's to keep them from ever being promoted to the bucket that counts.

None of this requires anyone at Cloudflare to be acting in bad faith, and I want to be fair here: an eight-day-old model serving issue is presumably genuinely hard, or it would be fixed. Their people are surely working on it. But "hard to fix" and "costs us nothing while unfixed" is a dangerous combination. Urgency is a resource, and it flows toward whatever is loud.

## What this means for the rest of us

The lesson isn't "Cloudflare bad." Cloudflare's transparency is actually better than most — at least the incident is *on* the status page, which is more than you get from plenty of vendors. We keep an [independent eye on cloudflare.com](/status/cloudflare.com) ourselves, and their track record on the things that count as down is strong.

The lesson is that vendor status pages are severity-classification systems built around the vendor's incentives, and the "degraded" tier is where those incentives are most misaligned with yours. Which leads to the same place I keep ending up:

**Monitor the specific thing you depend on, not the vendor's summary of it.** If your product calls a specific API, a specific model, a specific endpoint — check *that*, from outside, on your own schedule, against your own thresholds. The vendor's status page tells you what they're willing to call broken. Your monitor tells you what's actually broken for you. On June 16, those two things diverged, and three weeks later they still haven't converged.

**Treat week-old "investigating" as a signal, not a status.** A fresh incident with active updates means someone's on it. An incident that's been reposting the same sentence for two weeks means it has fallen out of the consequence system. If that incident touches your critical path, the consequence system it's fallen out of is *yours* — act accordingly. Ship the fallback. Add the second provider. Move the workload.

The fiber cut got an army because it was loud. Your dependency's quiet degradation gets a shrug, because the only person with a real incentive to treat it as an emergency is you.

Be loud on your own behalf. Nobody else is going to be.
