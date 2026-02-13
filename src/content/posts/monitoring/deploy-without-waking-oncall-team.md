---
title: "How to Deploy Without Waking Up Your On-Call Team"
author: "Morten Pradsgaard"
category: "monitoring"
excerpt: "Every deployment triggers alerts. Here's how to suppress monitoring noise during planned work so your on-call team sleeps through the deploy."
date: "2026-02-13"
metaDescription: "Stop uptime monitoring alerts during deployments. Use maintenance mode to suppress false alarms, protect uptime stats, and let your on-call team sleep."
---

# How to Deploy Without Waking Up Your On-Call Team

You ship a release at 11 PM. The health check returns a 503 for eight seconds while containers restart. Your monitoring tool fires an alert. Slack lights up. The on-call engineer's phone buzzes. They open their laptop, check the dashboard, see the deploy, close the laptop, and try to fall back asleep. Repeat next Tuesday.

This is the most common source of wasted on-call energy — **planned work triggering unplanned alerts**. The fix isn't turning off monitoring. It's telling your monitoring tool you're about to do maintenance.

## The real cost of deploy alerts

False alerts during deployments aren't harmless. They train your team to ignore pages. After a few cycles of "oh, it was just a deploy," the reflex changes from "investigate immediately" to "probably nothing." That's how real incidents get a 20-minute head start. This is textbook [alert fatigue](/blog/alert-fatigue-starts-with-maintenance-process), and your deployment process is feeding it.

There's also the data pollution problem. If your monitoring tool counts a 30-second deploy blip as downtime, your monthly uptime drops from 99.99% to 99.93%. That's not a real incident — it's noise in your [SLA reports](/blog/free-sla-monitoring-reporting-playbook).

## Why pausing checks doesn't work

The obvious move is to disable the monitor before you deploy and re-enable it after. Three problems:

1. **You forget to re-enable.** It happens. The deploy goes fine, everyone moves on, and the monitor sits paused for hours or days. Real downtime goes undetected.
2. **You lose data.** Paused monitors don't collect response times during the deploy. You can't verify the service came back healthy — you're flying blind during the riskiest window.
3. **It doesn't scale.** If you're deploying microservices, you might need to pause 10+ checks. Manually. Then re-enable 10+ checks. Manually.

## Maintenance mode: the clean solution

[Maintenance mode](/maintenance-mode) solves all three problems. When you enter maintenance on a check:

- **Alerts are suppressed** — email, SMS, webhook, Slack, Discord. All of them. No false alarms.
- **Checks keep running** — response times and status codes are still recorded. You can verify the deploy succeeded by looking at the data.
- **Uptime stats are protected** — maintenance periods count as uptime, not downtime. Your [SLA numbers stay honest](/blog/planned-maintenance-destroying-uptime-numbers).
- **It auto-exits** — set a duration (5 min, 15 min, 1 hour) and it ends automatically. A verification check runs immediately on exit to confirm the service is healthy.

No forgotten pauses. No data gaps. No manual cleanup.

## Match your deploy workflow

Different deploy patterns need different maintenance approaches:

**Quick hotfix (< 5 min):** Enter immediate maintenance with a 5-minute window. Deploy, verify, move on. The window closes itself.

**Scheduled release window:** Set a scheduled maintenance window ahead of time. The team knows when it starts, the monitors know when it starts, and nobody gets paged. Pair this with your [incident runbook](/blog/free-incident-management-runbook) so the team knows the process.

**Weekly deploys or nightly builds:** Set a recurring maintenance window — say every Tuesday at 10 PM for 30 minutes. It repeats automatically and handles timezone and DST changes. Zero manual steps after the initial setup.

**Multi-service deploys:** Use bulk actions to enter maintenance on multiple checks at once. Deploy your services, then exit maintenance in bulk. Every check runs a verification probe on exit.

## Wire it into your CI/CD pipeline

The ideal state is zero human steps. Your CI/CD pipeline knows when a deploy starts. Use the exit1.dev API to toggle maintenance mode as part of the pipeline:

```yaml
# Example: GitHub Actions step
- name: Enter maintenance mode
  run: |
    curl -X POST https://app.exit1.dev/api/v1/checks/$CHECK_ID/maintenance \
      -H "Authorization: Bearer $EXIT1_API_KEY" \
      -d '{"duration": 15, "reason": "Deploy $GITHUB_SHA"}'

- name: Deploy
  run: ./deploy.sh

# Maintenance auto-exits after 15 minutes
# Verification check confirms the service is up
```

The deploy log captures the maintenance reason. The monitoring log shows the window. Everything is traceable.

## The outcome

After wiring up maintenance mode, here's what changes:

- On-call engineers stop getting paged for deploys. Trust in alerts goes up.
- Uptime reports reflect actual incidents, not deploy artifacts.
- Deploy frequency can increase because the team isn't afraid of alert noise.
- Post-deploy verification is automatic — no manual "go check the dashboard" step.

Your monitoring should make deploys safer, not louder. Maintenance mode is how you get there.

## Recommended Reading

- [Maintenance Mode — Suppress Alerts During Planned Downtime](/maintenance-mode) — Full feature overview with FAQ.
- [Why Planned Maintenance Is Destroying Your Uptime Numbers](/blog/planned-maintenance-destroying-uptime-numbers) — The SLA impact of counting deploys as downtime.
- [Why Your Free Uptime Monitor Throws False Positives](/blog/troubleshooting-false-positives-free-uptime-monitor) — Other sources of alert noise and how to fix them.
- [The Free Incident Management Runbook](/blog/free-incident-management-runbook) — Codify your response process so planned and unplanned events are handled cleanly.
