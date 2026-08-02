---
title: "Cronjob Monitoring Playbook: Free Scheduled Task Observability"
author: "Morten Pradsgaard"
category: "cronjob-monitoring"
excerpt: "The complete free playbook for cron jobs, serverless schedules, and background workers — heartbeats, payload assertions, the metrics that predict failure, and retry verification."
date: "2025-09-14"
readTime: "10 min read"
seoTitle: "Cronjob Monitoring: Free Scheduled Task Playbook"
metaDescription: "Complete cronjob monitoring playbook: heartbeats, JSON payload assertions, serverless setup for Lambda and Workers, the four metrics that predict failure, retry testing, and alert routing."
---

# Cronjob Monitoring Playbook: Free Scheduled Task Observability

Cron jobs are the janitors of your platform. When they fail, customer-facing uptime numbers stay green while data quietly rots. A free heartbeat monitor fixes that. If you want "set it and forget it" operations, go elsewhere — if you want ruthless visibility, read on.

This covers traditional crontabs, serverless schedules (Lambda, Cloudflare Workers, Cloud Functions), and background queue workers. They all speak HTTP, so they all monitor the same way.

## Step 1: Inventory the jobs you actually rely on

Most teams don't know how many scheduled tasks they run. List them. Tag every cronjob, queue worker, and timed function. **If it changes state or data, it gets a monitor.** Skip this and you'll only discover what exists when something burns down.

For each job, write down cadence, owner, timeout, blast radius, and *why it exists*. If the answer to that last one is "not sure", either delete the job or fix the owner — shadow cron jobs are operational debt. Use the [uptime monitor checklist](/blog/free-uptime-monitor-checklist) as the baseline, then layer this cron-specific metadata on top.

## Step 2: Wire up heartbeats

1. Create a monitor and choose **Heartbeat / Cron**.
2. Drop the generated URL into your job. Call it when the run finishes.
3. **Set the expected interval tighter than the job schedule.** If the job runs hourly, enforce 65 minutes, not 90.
4. Tag by team or service — `billing`, `analytics`, `ops` — so dashboards stay filterable.

You now have a watchdog that screams when the job disappears. Because it is plain HTTP, every language and platform can participate:

1. Add a monitor pointing to a unique URL.
2. Have the job hit that URL when it starts or finishes.
3. If the ping doesn't arrive, alerts fire.

## Step 3: Serverless setup

Serverless schedulers promise simplicity, then a function stalls and you find out three days later. Add the ping at the end of the handler:

```javascript
await fetch(process.env.EXIT1_MONITOR_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    status: "success",
    duration_ms: duration,
    region: context.invokedFunctionArn?.split(":")[3]
  })
});
```

Keep the monitor URL in an environment variable so you can rotate it without redeploying, and keep the payload lean — only the numbers you will actually assert on.

## Step 4: Validate payloads, not just presence

Heartbeat-only monitoring is lazy. A job that runs and fails still sends a heartbeat. Send JSON alongside the ping with fields like `duration_ms`, `records_processed`, and `result`, then assert on them with JSONPath:

- `$.status == "success"` — catches `"succeeded": false` states before support tickets pile up.
- `$.duration_ms < 60000` — catches slow runs that technically completed.

This is the difference between "the job ran" and "the job produced healthy output".

## Step 5: The four metrics that predict failure

Most cron dashboards are noise — line charts nobody reads and aggregate success counts that hide the rot. Track these instead:

**1. Expected cadence vs. observed cadence.** How often the job *should* run versus how often it actually pings. A missing run is a failure, not a rounding error. Alert on a single miss; anything softer invites customer-facing outages.

**2. Start-to-finish duration.** Compare each run's `duration_ms` against the historical median and alert when it doubles. That is how you catch a slowing database before it starts timing out — and how you spot cost creep before the cloud bill does.

**3. Time-to-detect and time-to-resolve.** How long until someone notices and fixes a failed job. You should know within minutes, not hours. Tighten the loop with the [incident postmortem templates](/blog/incident-postmortem-templates-with-exit1).

**4. Downstream impact.** If the job populates a cache, feeds an API, or triggers an email campaign, monitor *that* surface too. A nightly import failure should make the next request fail — so check the request.

## Step 6: Instrument dependencies and queues

Monitor the API, database, or queue the task touches. When the cron fails you need to know immediately whether an upstream service caused it.

For workers specifically, expose an endpoint reporting queue length or worker health, poll it every minute, and assert thresholds. If the backlog spikes, you know before customers do.

## Step 7: Verify retries

If a job fails, how does it actually recover? Document whether the script retries automatically, whether you re-run manually, or whether there is a queue to drain. **Then test the failure path at least quarterly.** Trusting untested retries is naive.

The cheap version of this test: clone the heartbeat monitor for staging, shorten the interval, and block the outbound ping before a release. If no alert fires, your monitoring is broken — fix that before shipping.

## Step 8: Route alerts with intent

- **PagerDuty / Opsgenie** — revenue-impacting tasks.
- **Slack / Discord** — supporting jobs that still deserve visibility.
- **Email digests** — long-running, low-urgency tasks. Pair with the [email alerts guide](/blog/free-uptime-monitor-email-alerts) to keep execs informed without giving them dashboard logins.

Split alerts per team and per environment. Production failures page someone; nightly staging jobs do not. Integrations are not metered, so be generous — do not throw everything into one `#alerts` channel and hope the right person notices.

## Step 9: Report the wins

Run history is retained, so export cron stats using the [logs-to-warehouse workflow](/blog/exit1-logs-to-warehouse-csv-excel) and plot duration creep over time. Show leadership how many jobs tried to self-destruct and how fast you responded. Roll cron reliability into the same SLO review you already run for customer-facing uptime — the [SLA reporting playbook](/blog/free-sla-monitoring-reporting-playbook) covers putting that data in client-facing decks.

## Step 10: Keep one cockpit

Pin critical jobs inside the uptime dashboard next to customer-facing monitors. Web, API, workers, and scheduled tasks belong in the same view. If you're still flipping between crontabs and Grafana, you're wasting time.

And when a scheduled task does fail, treat it like any other incident. Cron failures that touch billing, analytics, or email campaigns deserve the same rigor as a front-end outage — run them through the [incident management runbook](/blog/free-incident-management-runbook).

## FAQ

### How many cron monitors can I add?

The free tier includes 5 monitors with 5-minute checks. Indie ($4/month) gives 10 monitors with 15-second checks, and Nano ($9/month) gives 100 monitors with 2-minute checks.

### Can I monitor serverless schedules?

Yes. Cloud Functions, Cloudflare Workers, and Lambda cron jobs all speak HTTP — hit the monitor URL from the handler and you're covered. See the serverless example above.

### Do you support POST payloads?

Yes. Send JSON with execution metadata and assert on it with JSONPath expressions.

### What if a job runs more than once per interval?

Set the monitor interval to match the job cadence; multiple hits simply confirm it's alive. If you need stricter guarantees, monitor start and finish as separate heartbeats.

### How do I monitor a job that has no outbound network access?

Invert it: have the job write a timestamp somewhere your API can read, then monitor an endpoint that reports the age of that timestamp. You are still asserting freshness, just indirectly.

## Recommended Reading

- [SLA reporting with a free uptime stack](/blog/free-sla-monitoring-reporting-playbook)
- [Free uptime monitor for SaaS](/blog/free-uptime-monitor-for-saas)
- [Real-time vs 5-minute monitoring](/blog/real-time-vs-5-minute-monitoring) — for when the team argues about alert frequency
- [Free incident management runbook](/blog/free-incident-management-runbook)
