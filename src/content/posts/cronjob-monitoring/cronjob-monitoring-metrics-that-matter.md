---
title: "Cronjob Monitoring Metrics That Actually Matter"
author: "Morten Pradsgaard"
category: "cronjob-monitoring"
excerpt: "Focus cron monitoring on the metrics that predict failure: cadence, delay, duration, and downstream impact. Ditch vanity charts."
date: "2025-09-04"
metaDescription: "Measure the right cronjob monitoring metrics—cadence, delay, duration, and downstream health—with exit1.dev’s free scheduled task monitoring dashboards."
---

# Cronjob Monitoring Metrics That Actually Matter

Most cron dashboards are noise: line charts nobody reads, aggregate success counts that hide the rot. exit1.dev keeps cronjob monitoring sharp by focusing on four metrics that actually predict failure.

## 1. Expected cadence vs. observed cadence

Track how often the job *should* run versus how often it actually pings exit1.dev. A missing run is failure, not a rounding error. Plot cadence drift and alert on a single miss. Anything softer invites customer-facing outages.

## 2. Start-to-finish duration

Duration spikes point to upstream issues. Compare each run’s `duration_ms` payload against the historical median. Alert when it doubles. That’s how you catch slow databases before they time out, and it’s baked into exit1.dev’s JSON assertions.

## 3. Time-to-detect and time-to-resolve

Measure how long it takes to notice and fix a failed cron. Pair exit1.dev alerts with [incident response playbooks](/blog/incident-postmortem-templates-with-exit1) so you can tighten the loop. You should know within minutes, not hours.

## 4. Downstream impact checks

If the cron populates a cache or triggers an email campaign, monitor that surface too. Use our [Free Website Monitoring Tools 2025 Guide](/blog/free-website-monitoring-tools-2025) to set up HTTP or API checks that confirm the scheduled task actually delivered.

## Bonus: combine cron and SLA reporting

Roll cron reliability into your SLO reviews. [SLA Reporting with a Free Uptime Stack](/blog/sla-reporting-free-uptime-stack) shows how to put exit1.dev data into client-facing decks. When you can prove scheduled tasks hit their targets, contract renewals get easier.

## Internal linking that matters

Keep readers moving through the site:

- From cron monitoring posts, link to [Free Uptime Monitor vs Paid](/blog/free-uptime-monitor-vs-paid) for context on why our free tier punches above its weight.
- Point operators to [Real-Time vs 5 Minute Monitoring](/blog/real-time-vs-5-minute-monitoring) when they argue over alert frequency.
- Reference [Free SLA Monitoring Guide](/blog/free-sla-monitoring-guide) when compliance teams show up.

Stay focused on these metrics and cronjob monitoring becomes predictable, measurable, and finally respected.
