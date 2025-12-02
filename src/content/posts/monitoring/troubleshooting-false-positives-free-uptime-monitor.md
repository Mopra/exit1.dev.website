---
title: "Why Your Free Uptime Monitor Throws False Positives (and How to Fix Them)"
author: "Morten Pradsgaard"
date: "2025-12-02"
category: "monitoring"
excerpt: "If your pager cries wolf, you’ll ignore the real fire. Here’s how to debug false positives in a free uptime monitor—fast, opinionated, and proven." 
readTime: "9 min read"
metaDescription: "Guide to fixing false positives in free uptime monitoring. Covers DNS/cache gotchas, TLS errors, timeouts, assertions, regional probes, and alert hygiene." 
---

# Why Your Free Uptime Monitor Throws False Positives (and How to Fix Them)

Nothing kills trust in monitoring faster than false positives. Once the team stops believing alerts, real downtime slips through. The good news: most false alarms have boring, fixable causes. Here’s the blunt guide to cleaning them up without neutering your monitors.

## Start with the evidence

Look at the raw response from the monitor before blaming the tool. Is it a TLS handshake failure, a redirect loop, or a timeout? Pipe responses to your warehouse via the [Exit1.dev CSV export](/blog/exit1-logs-to-warehouse-csv-excel) so you can spot patterns across regions and time. If you don’t store evidence, you’re guessing.

## Fix DNS and cache weirdness

CDNs love to mask DNS mistakes. Monitor apex and `www` separately with the **Free Website Monitor** and verify TTLs aren’t excessively long. If you serve different content by region, make sure the monitor’s location matches the user base. For cache-heavy sites, add a header to bypass cache in one probe and compare it to a cached probe to detect stale or misconfigured layers.

## Tighten assertions, don’t remove them

False positives often come from flimsy assertions. Check for stable strings or structured JSON fields instead of brittle HTML snippets. Add an assertion for a known header or checksum on a static asset. If the site uses authentication, create a private health route with a token so you can validate the real app state without scraping the UI.

## Timeouts and latency spikes

A slow dependency can look like downtime. Monitor latency percentiles and alert on deviation, not just hard failure. If you see regular spikes, follow the [real-time vs 5-minute monitoring](/blog/real-time-vs-5-minute-monitoring) approach: keep real-time probes for detection, but page only after a short confirmation window. And yes, keep intervals at one minute—longer intervals hide real problems more than they cut noise.

## Regional noise and ISP blocks

Some networks block or rate-limit bots. Run monitors from multiple regions and compare. If one region is always noisy, disable paging there and keep it for visibility. Document the decision on your status page using the [free uptime monitor checklist](/blog/free-uptime-monitor-checklist); transparency keeps trust high.

## Keep alerts honest

Alerts belong in Slack via the [free uptime monitor Slack integration](/blog/free-uptime-monitor-slack-integration) and email for backup. If nobody owns an alert, delete it. Review false positives weekly and adjust assertions, timeouts, or regions instead of muting everything. A clean signal makes the next real incident impossible to ignore.

False positives are a process smell, not a destiny. Fix the inputs, keep the evidence, and your free uptime monitor will actually be believed when it shouts.
