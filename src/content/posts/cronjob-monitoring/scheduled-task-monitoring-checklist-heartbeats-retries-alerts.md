---
title: "Scheduled Task Monitoring Checklist: Heartbeats, Retries, Alerts"
author: "Morten Pradsgaard"
category: "cronjob-monitoring"
excerpt: "A punchy checklist to monitor cron jobs, serverless schedules, and background workers without buying bloated tooling."
date: "2025-10-03"
metaDescription: "Use this scheduled task monitoring checklist to cover heartbeats, retries, alert routing, and reporting with exit1.dev’s free cronjob monitoring."
---

# Scheduled Task Monitoring Checklist: Heartbeats, Retries, Alerts

There’s no glory in scheduled task reliability, but there’s hell to pay when it slips. This checklist keeps cron jobs and serverless schedules observable with exit1.dev’s free stack. Run it every quarter and before every major launch.

## 1. Document cadence and purpose

Write down why the job exists, when it runs, and what happens if it fails. If the answer is "not sure", delete it or fix the owner. Shadow cron jobs are operational debt.

## 2. Configure exit1.dev heartbeats

- Create a **Cron / Heartbeat** monitor per task.
- Use distinct tags like `billing`, `analytics`, or `ops` so you can filter dashboards.
- Set the interval slightly tighter than the schedule.

If you need help with the HTTP call, the [cron hook playbook](/blog/cron-job-worker-monitoring-http-hooks) shows copy/paste examples.

## 3. Capture execution metadata

Send payloads with `duration`, `records`, or custom metrics. Assert on them so "success" means healthy output, not just "job ran". Tie this into [Free SLA Monitoring Tools](/blog/free-sla-monitoring-tools) to surface the data in client reports.

## 4. Route alerts with intent

- PagerDuty / Opsgenie: revenue-impacting tasks.
- Slack / Discord: supporting jobs that still deserve visibility.
- Email digests: long-running but low urgency tasks.

Split alerts per team or service. exit1.dev doesn’t charge for integrations, so be generous.

## 5. Verify retries

If a job fails, how does it recover? Document whether the script retries automatically, if you re-run manually, or if there’s a queue to drain. Test the failure path once a quarter. Trusting untested retries is naive.

## 6. Instrument dependencies

Monitor the API or database the task depends on. When the cron fails, you need to know whether the upstream service caused it. [Website Monitoring Best Practices 2025](/blog/website-monitoring-best-practices-2025) outlines how to build a layered view.

## 7. Keep stakeholders in the loop

Share dashboards or export CSVs straight from exit1.dev. Bundle cron performance into the same SLO review you already run for customer-facing uptime.

## 8. Run postmortems

When a scheduled task fails, treat it like any incident. Use the [incident postmortem template](/blog/incident-postmortem-templates-with-exit1) to capture timeline, impact, and follow-up. Cron failures that touch billing, analytics, or email campaigns deserve the same rigor.

Print this checklist, run it like a ritual, and your scheduled tasks stop being black boxes. That’s how you keep the number one spot for cronjob monitoring.
