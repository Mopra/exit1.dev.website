---
title: "Why Planned Maintenance Is Destroying Your Uptime Numbers"
author: "Morten Pradsgaard"
category: "sla"
excerpt: "Your SLA says 99.9% but your dashboard says 99.5%. The gap is planned maintenance being counted as downtime. Here's the fix."
date: "2026-02-13"
metaDescription: "Planned maintenance counted as downtime ruins uptime reports. Learn how maintenance windows protect SLA numbers and keep uptime stats accurate."
---

# Why Planned Maintenance Is Destroying Your Uptime Numbers

You promise 99.9% uptime to your customers. That gives you roughly 43 minutes of downtime per month. You check your monitoring dashboard and it says 99.5%. That's 3.6 hours of "downtime." But you didn't have 3.6 hours of incidents — you had two 15-minute deploys and a 30-minute database migration. All planned. All communicated. All counting against you.

This is one of the most common SLA reporting problems: **your monitoring tool doesn't know the difference between planned maintenance and a real outage.**

## The math that kills your SLA

A 30-minute deploy every week adds up to roughly 2 hours of "downtime" per month. That alone drops a 99.9% target to 99.7%. Add a monthly database migration window and you're at 99.5%. In a quarter, your SLA report looks like you have a reliability problem when you actually have a tooling problem.

If you're using monitoring data for [SLA evidence and audit trails](/blog/free-website-monitoring-audit-sla-evidence), this pollution matters. Clients see the numbers. Stakeholders see the numbers. Nobody reads the footnotes explaining "well, 2 hours of that was planned."

## Why "just explain it" doesn't work

Some teams add disclaimers to SLA reports: _"Excludes planned maintenance windows on Jan 3, Jan 10, Jan 17..."_ This creates three problems:

1. **Manual tracking.** Someone has to log every maintenance event and cross-reference it with the downtime data. Miss one and your report is wrong.
2. **Trust erosion.** When you manually subtract downtime from reports, it looks like you're gaming the numbers. Even if you're honest, it creates doubt.
3. **No automation.** You can't use raw monitoring data in dashboards, status pages, or automated SLA calculations because the data is dirty.

The cleanest solution is to **tag maintenance at the source** so the data is correct from the start.

## How maintenance mode fixes the data

When you put a check into [maintenance mode](/maintenance-mode) before planned work, three things happen to your data:

**Uptime calculation excludes the window.** The time spent in maintenance doesn't count as uptime or downtime — it's excluded from the calculation entirely. A 30-minute maintenance window on a check with 99.9% uptime stays at 99.9%.

**Logs are tagged, not deleted.** The check keeps running during maintenance. Response times and status codes are recorded and flagged as maintenance data. You get full visibility into what happened during the window without polluting your uptime metrics.

**Reports are clean by default.** When you pull [SLA reports](/blog/free-sla-monitoring-reporting-playbook) or export to BigQuery, maintenance periods are already separated. No manual adjustments. No footnotes. No arguments about what counts.

## Real-world impact on SLA tiers

Here's what the numbers look like with and without maintenance mode for a team that deploys twice a week with 15-minute windows:

| Scenario | Monthly Maintenance | Raw Uptime | With Maintenance Mode |
| --- | --- | --- | --- |
| Weekly deploys (2x) | ~2 hours | 99.7% | 99.99% |
| + Monthly DB migration | ~2.5 hours | 99.6% | 99.99% |
| + Quarterly infra update | ~3.5 hours | 99.5% | 99.99% |

The difference between 99.5% and 99.99% is the difference between a breach notice and a clean report.

## Stop punishing good practice

Here's the irony: **teams that deploy frequently are penalized the most.** If you ship once a quarter, the uptime hit is small. If you practice continuous delivery with multiple deploys per week, your monitoring data makes it look like your service is less reliable — when the opposite is true.

Frequent deploys reduce risk. Smaller changesets are easier to roll back. But if every deploy creates a blip in your uptime data, the metrics tell the wrong story. Maintenance mode corrects this by treating planned work as what it is: planned.

## Set it up once, forget it

For recurring deploys, set a [recurring maintenance window](/maintenance-mode) that matches your release schedule. Tuesday deploys at 10 PM? Set a recurring window for Tuesday 10:00–10:30 PM. It handles DST changes, runs automatically, and you never think about it again.

For ad-hoc work, enter immediate maintenance from the dashboard or wire it into your [CI/CD pipeline](/blog/deploy-without-waking-oncall-team). The maintenance reason gets logged so future audits have full context.

## Your uptime should reflect your reliability

If your team runs a stable service with planned maintenance windows, your SLA numbers should show that. Maintenance mode separates the signal from the noise at the data layer — no manual cleanup, no footnotes, no debates about what counts as downtime.

Your uptime score should reflect how reliable your service actually is, not how often you deploy.

## Recommended Reading

- [Maintenance Mode — Suppress Alerts During Planned Downtime](/maintenance-mode) — Full feature overview and FAQ.
- [Free SLA Monitoring Reporting Playbook](/blog/free-sla-monitoring-reporting-playbook) — Build SLA reports your clients will trust.
- [Free Website Monitoring Audit SLA Evidence](/blog/free-website-monitoring-audit-sla-evidence) — Use monitoring data as compliance evidence.
- [How to Deploy Without Waking Up Your On-Call Team](/blog/deploy-without-waking-oncall-team) — Wire maintenance mode into your deploy process.
