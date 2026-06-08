---
title: "GitHub Doesn't Get To Decide What 'Down' Means"
author: "Morten Pradsgaard"
category: "founder-log"
excerpt: "GitHub has had three months of corrupted merges, broken search, and auth outages — and the status page is still mostly green. That's not because the platform is healthy. It's because GitHub gets to define the word 'down,' and they've defined it generously."
date: "2026-05-01"
metaDescription: "GitHub's recent outages, the status page math that hides them, and why the company running the service should never be the one grading its own uptime."
---

# GitHub Doesn't Get To Decide What "Down" Means

If you've used GitHub at any point in the last six months, you already know it. The merge button greys out. The PR list won't load. Search returns empty. Actions queues stall. Your octocat sits there spinning while you wonder if it's you, your network, or them.

It's them. It's been them for a while.

What's interesting isn't that a giant platform is having a rough patch. Big systems break — that's the whole reason an industry like ours exists. What's interesting is the gap between what's actually happening to developers and what GitHub's status page is willing to call an outage.

That gap is where the real story is.

## The receipts

A short, incomplete list from the last few months:

- **February 9, 2026.** Authentication database overloaded by background processing. Logins flapped. The post-mortem language was the now-familiar combination of "insufficient isolation between components" and "inadequate backpressure mechanisms" — fancy ways of saying one component took the rest of them down with it.
- **March 5, 2026.** Another degradation cycle. Same family of cause. By this point GitHub had been publishing monthly availability reports admitting their own scale targets had moved from 10X to 30X in a quarter.
- **April 22, 2026.** Copilot coding agent and PR comment processing degraded for 13 hours. Roughly 23,000 invocations dropped on the floor.
- **April 23, 2026.** A Merge Queue regression produced *incorrect merge commits* on 658 repositories across 2,092 pull requests. Read that sentence again. This wasn't slowness. This was the platform silently reverting code that had already been merged.
- **April 27, 2026.** Elasticsearch cluster overloaded — possibly a botnet, possibly just Tuesday — and search-dependent surfaces of the UI stopped returning results. PR lists came up empty. People thought their work had vanished.

The CTO posted an apology at the end of April. "We hear the pain you're experiencing." The Register has the writeup. Mitchell Hashimoto called GitHub "no longer a place for serious work" and announced he was moving Ghostty elsewhere. OpenAI is reportedly looking at alternatives.

Now go look at the status page from those same days. Mostly green. Sometimes a yellow blob. Always healing fast.

How?

## The math

GitHub's status page works on a weighting system. The leaked detail that sums it up:

- **Major Outage:** 100% downtime
- **Partial Outage:** 30% downtime
- **Degraded Performance:** 0% downtime

Zero. Percent.

So when the search subsystem is overloaded and you can't list your pull requests, that's "degraded." Your work is gone from the UI, your team is paralyzed, your CI is throwing 500s, and the formula says: nothing happened. The number doesn't move. The headline uptime stays pristine.

This is not a bug in the formula. This is the formula.

A while ago GitHub also quietly stopped publishing aggregate uptime numbers on the page itself. Independent projects like Marek Šuppa's "Missing GitHub Status Page" exist for exactly this reason — somebody had to reconstruct what the official page no longer wants to summarize. When a public company maintains a status page and then removes the part that compresses the truth into a single number, that's a tell. You don't take down a scoreboard you're proud of.

We keep our own running scoreboard for exactly this: a [live, independent status page for github.com](/status/github.com) that records real 30- and 90-day uptime and a rolling outage history, measured from outside, with no incentive to round the number up.

## The detection lag

There's a smaller, less discussed problem on top of the math: GitHub is not always the first to notice GitHub is broken.

On April 23, third-party monitors picked up the merge queue incident at 14:26 UTC. GitHub's own status page acknowledged it at 14:40. Fourteen minutes is an eternity when corrupted commits are landing in your main branch.

That gap is structural, not malicious. A status page run by the same org that runs the service has organizational gravity working against it — somebody has to escalate, somebody has to confirm, somebody has to approve the public statement, somebody has to pick the right severity bucket. By the time the dot turns yellow, the pain has been live for a while.

But once you accept that gap exists, it's hard to keep believing the dot is the truth.

## The thing nobody wants to say out loud

The service you depend on does not get to define what "down" means for you.

This is the rule. It applies to GitHub. It applies to your hosting provider. It applies to your payments processor and your auth vendor and your email API and your CDN. The vendor's status page is the vendor's marketing surface. It is not — and cannot be — neutral.

Three reasons:

1. **They define the categories.** They get to decide which class of failure counts as "degraded" versus "partial outage" versus "major." They picked the buckets, and the buckets have weights, and the weights determine the number on the page.

2. **They define the perimeter.** A status page covers the components the vendor chose to expose. If your specific failure mode is "the API works but returns wrong results for our region," there is rarely a green-or-red dot for that.

3. **They have a contract incentive.** Most SLAs trigger on the page's verdict. If the page says it was up, it was up. The page is a financial instrument as much as it is a transparency tool.

None of this makes GitHub villains. They're a company under load running a hard system, and the people on call are doing real work. But the status page is not built for you. It's built for the company. Pretending otherwise is how you find yourself explaining to your boss why your "100% uptime dependency" took the team out for half a day.

## What I keep telling people

If GitHub is on the critical path of your business, monitor it yourself. From outside. With a vendor that has no incentive to grade you generously. Pick the endpoints you actually care about — the API calls your build pipeline makes, the OAuth handshake your app does, the webhook deliveries you rely on. Set thresholds that match how *your* product fails, not how the vendor's status page classifies its own pain.

This isn't a pitch for our product. We happen to do this for a living, and yes, you could use us. You could also use a competitor. You could write a 30-line script and a Slack webhook on a $5 box. The technology is not the point. The point is whose definition of "up" you're trusting.

GitHub has been telling its customers they were up 99-point-something for the last three months. A non-trivial fraction of those customers experienced something different from the inside. Both statements can be technically consistent — that's the whole problem. When two sides of the same fact disagree and one side controls the math, you should be very skeptical of the math.

The fix here isn't for GitHub to publish more honest numbers. They won't. The fix is to stop treating their numbers as the source of truth in the first place.

Watch your own dependencies. Trust your own monitors. The status page belongs to them. The downtime belongs to you.
