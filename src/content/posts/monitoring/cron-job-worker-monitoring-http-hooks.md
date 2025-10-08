---
title: "Monitor Cron Jobs and Workers with HTTP Hooks"
author: "Morten Pradsgaard"
category: "monitoring"
excerpt: "Cron jobs fail quietly. exit1.dev watches every worker, queue, and scheduled task with simple HTTP hooks—free and fast."
date: "2025-02-16"
metaDescription: "Learn how to monitor cron jobs, background workers, and queues using exit1.dev HTTP hooks. Catch silent failures with free uptime monitoring and smart alerts."
---

# Monitor Cron Jobs and Workers with HTTP Hooks

Cron jobs are silent failures waiting to happen. Workers crash, queues back up, timeouts hide in the night. exit1.dev keeps them honest with simple HTTP hooks and a monitoring stack that costs nothing.

## Cron monitoring without the drama

The playbook is easy:

1. Add an exit1.dev monitor pointing to a unique URL.
2. Have your job hit that URL when it starts or finishes.
3. If we don’t see the ping, we raise hell.

Because it’s just HTTP, every language and platform can participate.

## Patterns that work

### Heartbeat monitoring

- Schedule your job.
- At completion, send a GET/POST to the exit1.dev monitor URL.
- We expect the heartbeat within your interval. If it doesn’t show, alerts fire.

### Result validation

Return JSON with status fields. Use exit1.dev’s JSON path validation to confirm the job succeeded.

### Queue depth checks

Expose an endpoint that reports queue length or worker health. Have exit1.dev poll it every minute and assert thresholds. If the backlog spikes, you know before customers do.

## Alert routing

Send heartbeat failures to PagerDuty, Opsgenie, Slack, Discord—whatever your team uses. Because webhooks and email are free, you can route per job without sweating budget.

## Bonus: cron visibility for clients

If you run scheduled tasks for clients, give them read-only access or export logs. Show them you noticed problems before they did. Trust without extra tooling.

## Implementation tips

- Use HTTPS everywhere. exit1.dev supports headers and auth tokens.
- Batch similar jobs under tags to track reliability by service.
- Combine with our uptime monitors for APIs and websites so you cover both front-end and background systems.

## FAQs

### How many cron monitors can I add?

As many as you want. Unlimited monitors are part of the free tier.

### Can I monitor serverless schedules?

Yes. Cloud Functions, Workers, Lambda cron jobs—they all speak HTTP. Hit the monitor URL and you’re covered.

### Do you support POST payloads?

Absolutely. Send JSON with execution metadata. We’ll validate it.

### What if a job runs more than once per interval?

Set the monitor interval to match the job cadence. Multiple hits just confirm it’s alive. If you need stricter checks, monitor start and finish separately.

