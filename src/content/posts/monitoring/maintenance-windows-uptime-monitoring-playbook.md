---
title: "Maintenance Windows for Uptime Monitoring: The Complete Playbook"
author: "Morten Pradsgaard"
category: "monitoring"
excerpt: "Immediate, scheduled, and recurring maintenance windows — when to use each, how to set them up, and the mistakes that catch teams off guard."
date: "2026-02-13"
metaDescription: "Complete guide to maintenance windows in uptime monitoring. Learn immediate, scheduled, and recurring window types, setup steps, and common mistakes to avoid."
---

# Maintenance Windows for Uptime Monitoring: The Complete Playbook

Maintenance windows are the most overlooked feature in uptime monitoring. Most tools either don't have them or gate them behind enterprise plans. The result: teams either ignore maintenance entirely (and pollute their data) or pause monitors manually (and forget to unpause them). Both are bad.

This playbook covers the three types of maintenance windows, when to use each, and the operational mistakes that trip up even experienced teams.

## What a maintenance window actually does

A maintenance window tells your monitoring tool: "I know this service will be disrupted. Keep watching, but don't alert." During the window:

- **Checks continue running.** Response times and status codes are recorded. You get full data for debugging and post-deploy verification.
- **Alerts are suppressed.** Email, SMS, webhooks, Slack, Discord — all silent. No false pages, no alert fatigue.
- **Uptime stats are protected.** The maintenance period is excluded from uptime calculations. Your [SLA numbers stay clean](/blog/planned-maintenance-destroying-uptime-numbers).
- **Logs are tagged.** Every check result during maintenance is flagged, so you can filter or include maintenance data in exports and BigQuery queries.

This is fundamentally different from pausing a monitor, which stops data collection entirely and creates a blind spot.

## The three window types

### 1. Immediate maintenance

**Use when:** You need to do unplanned but non-emergency work right now. A quick config change, a hotfix, a certificate rotation.

**How it works:** Click "Enter Maintenance" on the check, pick a duration (5, 15, 30 minutes, or 1 hour), optionally add a reason, and confirm. The check enters maintenance instantly. When the timer expires, a verification check runs to confirm the service is healthy.

**Best for:** Hotfixes, quick infra changes, "I need 5 minutes of silence" moments.

**Watch out for:** Don't use immediate maintenance as a crutch for work that should be scheduled. If you're entering immediate maintenance every Tuesday, set up a recurring window instead.

### 2. Scheduled maintenance

**Use when:** You know ahead of time that maintenance will happen at a specific date and time. A database migration next Saturday. A cloud provider maintenance window on Thursday at 2 AM.

**How it works:** Set the start date, start time, and duration. The check enters maintenance automatically at the scheduled time and exits when the duration completes. A verification check runs on exit.

**Best for:** Database migrations, infrastructure upgrades, third-party provider maintenance windows, major releases with a planned rollout time.

**Watch out for:** Make sure the duration covers the full maintenance period plus buffer. If your migration usually takes 45 minutes, set the window to 60. Running over is worse than having a few extra silent minutes.

### 3. Recurring maintenance

**Use when:** You have a regular maintenance cadence. Weekly deploys, nightly batch jobs, daily backup windows.

**How it works:** Pick the days of the week, start time, and duration. The window repeats automatically every week on those days. The scheduler uses your IANA timezone (e.g., "Europe/Copenhagen") and handles DST transitions correctly — your 10 PM window stays at 10 PM local time year-round.

**Best for:** Weekly release trains, nightly ETL jobs, regular backup windows, teams with a fixed deploy schedule.

**Watch out for:** Review recurring windows quarterly. Deploy schedules change. A recurring window that no longer matches your actual maintenance cadence is just a recurring blind spot.

## Operational patterns that work

### Pattern 1: Deploy pipeline integration

Wire maintenance mode into your CI/CD pipeline so it activates automatically when a deploy starts. The pipeline enters maintenance, runs the deploy, and maintenance auto-exits after the set duration. Zero human steps.

```bash
# Enter maintenance before deploy
curl -X POST https://app.exit1.dev/api/v1/checks/$CHECK_ID/maintenance \
  -H "Authorization: Bearer $EXIT1_API_KEY" \
  -d '{"duration": 15, "reason": "Deploy v2.4.1"}'

# Run deploy
./deploy.sh

# Maintenance auto-exits after 15 minutes
# Verification check confirms service health
```

This is the gold standard. See [How to Deploy Without Waking Up Your On-Call Team](/blog/deploy-without-waking-oncall-team) for the full integration walkthrough.

### Pattern 2: Bulk maintenance for microservices

If a deploy touches multiple services, use bulk actions to enter maintenance on all related checks at once. This prevents partial maintenance where some checks are silenced and others aren't — which creates confusing alert patterns.

### Pattern 3: Staggered windows for rolling deploys

If you use rolling deployments across regions, stagger your maintenance windows to match. Region A deploys at 10:00 PM, Region B at 10:15 PM, Region C at 10:30 PM. Each check gets its own window matching the regional deploy time. This is more precise than one large blanket window and keeps [multi-region monitoring](/global-monitoring) useful during the rollout.

### Pattern 4: Third-party maintenance coverage

Your cloud provider sends a maintenance notification for next Thursday 2–4 AM UTC. Create a scheduled maintenance window on the affected checks for that exact window. When the provider's maintenance causes blips, your alerts stay silent and your uptime stays clean. Log the provider's maintenance ID as the reason for audit trails.

## Common mistakes

**Setting windows too short.** If your deploy takes 10 minutes on a good day and your window is 10 minutes, you'll exit maintenance during a slow deploy and get paged. Always add buffer.

**Forgetting verification.** exit1.dev runs a verification check automatically when maintenance exits. If your tool doesn't, you need a manual step to confirm the service recovered. This is the most dangerous gap — maintenance ends, the service is still down, and nobody knows.

**Using maintenance to hide real problems.** If you're entering maintenance mode because a service is flaky during normal operation, that's not maintenance — that's an incident. Maintenance mode is for planned, intentional work. Don't use it to suppress alerts for problems you should be fixing.

**Not logging reasons.** Always add a maintenance reason. "Deploy v2.4.1" or "AWS us-east-1 maintenance window" gives future you the context to understand why the window existed. This matters for [SLA audits](/blog/free-website-monitoring-audit-sla-evidence) and postmortems.

## The goal: zero surprise alerts from planned work

A well-maintained monitoring setup has two properties: **every alert is actionable** and **every maintenance window is intentional.** Maintenance windows are the bridge between your operational calendar and your monitoring tool.

Set them up once for your regular cadence. Wire them into your pipeline for ad-hoc work. And review them quarterly to make sure they still match reality.

Your on-call team will notice the difference immediately.

## Recommended Reading

- [Maintenance Mode — Suppress Alerts During Planned Downtime](/maintenance-mode) — Full feature overview, comparison table, and FAQ.
- [Alert Fatigue Starts with Your Maintenance Process](/blog/alert-fatigue-starts-with-maintenance-process) — How deploy alerts erode incident response.
- [Why Planned Maintenance Is Destroying Your Uptime Numbers](/blog/planned-maintenance-destroying-uptime-numbers) — The SLA impact of not using maintenance windows.
- [Free SLA Monitoring Checklist](/blog/free-sla-monitoring-checklist) — End-to-end SLA monitoring setup including maintenance hygiene.
