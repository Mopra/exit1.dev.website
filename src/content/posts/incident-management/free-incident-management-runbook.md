---
title: "The Free Incident Management Runbook Your Team Will Actually Use"
author: "Morten Pradsgaard"
category: "incident"
excerpt: "Roles, triggers, the first fifteen minutes, and the evidence trail — a complete incident management practice built on free tooling."
date: "2025-09-10"
readTime: "8 min read"
seoTitle: "Free Incident Management Runbook, Roles & Toolkit"
metaDescription: "A complete free incident management runbook: trigger tables, war-room roles, the first 15 minutes, alert routing, automation, and evidence capture for postmortems that hold up."
---

# The Free Incident Management Runbook Your Team Will Actually Use

Runbooks rot when they're verbose and detached from the tools you actually touch during an outage. This one stays stripped down to triggers, roles, actions, and owners — all anchored on live monitoring data.

Everything here runs on free tooling. Incident management is supposed to be ruthless about downtime, not about budgets.

## Start with precise detection

If your monitors are sloppy, your incident response will be sloppy. Before any of the process below matters, get coverage right:

- **1-minute probes** on customer-facing surfaces.
- **HTTP checks** on every public endpoint, plus login and checkout flows specifically — not just the homepage.
- **Cron and background job monitors** for data pipelines (see the [cronjob monitoring playbook](/blog/cronjob-monitoring-playbook-free-scheduled-task-observability)).
- **SSL monitors**, so you never take yourself down with an expired certificate.
- **Regional redundancy**, so you can tell a local failure from a global one.

Cross-check coverage against the [free uptime monitor checklist](/blog/free-uptime-monitor-checklist) before you consider this step done.

## Assign roles before the outage

A war room collapses when everyone freelances. Three roles, assigned in advance, documented next to your monitors:

- **Incident commander** — keeps the room focused, decides when to escalate, and owns the call on when the incident is over.
- **Comms lead** — posts updates to customers, execs, and the status page.
- **Ops lead** — owns technical mitigation.

One person can hold two hats on a small team. Nobody should be discovering which hat they wear while the site is down.

## Trigger table: decide in seconds

Document the obvious failure modes and the first move. A simple table beats a polished document nobody opens.

| Trigger | Action | Owner |
| --- | --- | --- |
| 2 consecutive 500s on checkout API | Flip traffic to secondary region | Ops lead |
| Latency spikes >1s on auth | Roll back the last deployment | Engineering on-call |
| SSL expiry warning | Follow the [SSL monitoring alerts guide](/blog/free-ssl-certificate-monitoring) | Platform lead |
| Third-party dependency down | Enable feature flag failsafe | Product engineer |
| Cron job missed its window | Check pipeline, replay if idempotent | Data owner |

Add nuance later. Right now you're aiming for a fast response, not legalese.

## Own the first fifteen minutes

The first fifteen minutes decide whether you drown in chaos or regain control. Bake this flow into the runbook:

1. **Minute 0–1** — alert hits Slack and email. Incident commander acknowledges, out loud, in the channel.
2. **Minute 2–4** — Ops lead validates scope using the regional breakdown. Local or global? One endpoint or all of them?
3. **Minute 5–7** — Comms lead posts the initial customer update from a pre-written template. Do not wait for root cause to communicate impact.
4. **Minute 8–15** — execute mitigation, log every step in the incident channel, update the status page.

## Make alerts impossible to ignore

Free incident management fails when alerts arrive late or vanish into inbox sludge. Route them deliberately:

1. A dedicated `#incident-response` channel, with webhook posts that tag the on-call role rather than the whole team.
2. Webhooks into PagerDuty or Opsgenie if you already run them — see [automating PagerDuty and Opsgenie with webhooks](/blog/pagerduty-opsgenie-webhook-automation-exit1).
3. A pinned playbook so nobody relitigates polling frequency mid-incident.

## Automate the toil, not the judgment

Automation should clear the runway for human decisions, never replace them:

- **GitHub Actions** that auto-roll back when a monitor fails immediately after a deploy.
- **Status page updates** triggered by monitoring webhooks.
- **Incident ticket templates** in Linear or Jira, so every event captures the same metadata.
- **Ticket creation on first alert** via n8n or Zapier, so the paper trail starts itself.

Tie the reporting side back to the [SLA reporting playbook](/blog/free-sla-monitoring-reporting-playbook) so stakeholders see consistent numbers.

## Keep communication brutal and timestamped

Every update answers three questions: what changed, what's next, who owns it. Your monitoring already tracks the technical timeline — what you're adding is human intent.

```
13:02 UTC – Ops lead – rolled back API deploy 812. Expect recovery in 5 minutes.
```

If nothing has changed, say so every ten minutes. Silence breeds executive drive-bys and customer churn. Keep updates short, timestamped, and free of speculation — your audience cares about impact and recovery ETA, not your feelings.

Async matters too. Not everyone can join a call immediately, so the channel log is the war room. Snapshot response-time graphs the moment the incident starts, and paste timestamped log exports for engineers joining late.

## Capture evidence in real time

If you don't capture evidence while it's happening, your postmortem becomes fiction. During the incident, grab:

- **Alert history exports** — timestamped detection and recovery.
- **Log downloads** — status codes and regional impact.
- **Latency and uptime charts** — the exec summary writes itself.

Store them in the incident ticket immediately, not tomorrow. Detailed logs roll off retention windows, so export before they do. If you need a longer audit trail, push the data into a warehouse using the [logs-to-warehouse guide](/blog/exit1-logs-to-warehouse-csv-excel).

## Don't close until you can explain it

The incident ends when the commander can explain root cause and recovery — not when the graph looks normal again. Use the [incident postmortem templates](/blog/incident-postmortem-templates-with-exit1) as the exit checklist. If the explanation is mushy, you're not done.

Before people scatter, assign follow-up tasks straight from the incident log, with owners and due dates set on the spot. A task without an owner is fantasy.

## Keep the runbook alive

Review it monthly. Compare it against real incidents and adjust. Fold lessons from postmortems into the trigger table so the next response is faster than the last. This thrives on ruthless iteration, not bigger PDFs.

Runbooks aren't corporate theater. They tell your team and your customers that you're ready for impact — and free tooling gives you the live data to make the runbook work. Document the steps, rehearse them, and when things break you'll respond with receipts instead of guesswork.

## Recommended Reading

- [Free uptime monitor checklist](/blog/free-uptime-monitor-checklist) — verify your coverage is complete
- [Incident postmortem templates](/blog/incident-postmortem-templates-with-exit1) — structured follow-up
- [Alert fatigue starts with your maintenance process](/blog/alert-fatigue-starts-with-maintenance-process) — why your alerts get ignored
- [SLA monitoring reporting playbook](/blog/free-sla-monitoring-reporting-playbook) — evidence for stakeholders
