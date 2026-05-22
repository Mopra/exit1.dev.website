---
title: "How to Watch DNS, TCP, TLS and TTFB Change in Real Time While Debugging a Slow Endpoint"
author: "Morten Pradsgaard"
category: "incident"
date: "2026-05-22"
excerpt: "When an API gets mysteriously slow, the answer is hiding in the phase breakdown. Here's how to actually see DNS, Connect, TLS, and TTFB shift live during an incident."
readTime: "7 min read"
metaDescription: "Diagnose intermittent latency by watching DNS resolution, TCP connect, TLS handshake, and TTFB change in real time. A walkthrough using a live response time chart with per-stage phases."
---

# How to Watch DNS, TCP, TLS and TTFB Change in Real Time

Your API got slow. Not down. Just *slow*. p95 is 3× what it was an hour ago.

You open your dashboard. You see a single response-time line going up. That's it.

Up from where? In which stage? DNS? TLS handshake? Server thinking time? You can't tell — and that one number is the only thing you have.

This is the wrong tool for the job.

## The four phases that actually matter

Every HTTP request decomposes into four sequential network operations, each of which can fail or slow down independently:

- **DNS resolution** — your client asks a resolver for the IP behind a hostname. Slow here means your DNS infrastructure is hurting, your resolver cache is cold, or the authoritative is far away.
- **TCP connect** — the SYN / SYN-ACK / ACK round trip to open the socket. Slow here usually means network latency or the server is connection-saturated.
- **TLS handshake** — ClientHello, certificate exchange, key agreement. Slow here means cert chain issues, an OCSP responder hanging, or the server is CPU-bound on TLS.
- **TTFB (time to first byte)** — the gap between sending the request and seeing the first response byte. Slow here means your server is the bottleneck — database, downstream API, application logic.

If you only see "response time = 1200ms" you can't act. If you see "DNS=12ms, Connect=18ms, TLS=22ms, TTFB=1148ms" you know to go look at the application.

## Why most "real-time" dashboards hide this

Most monitoring UIs aggregate. They take all the probes in the last 5 minutes, average them, and plot one dot.

That has two effects:

1. **Phases get folded into a single number.** Even when phase timings exist in the database, the chart only shows total.
2. **Spikes get smeared.** A 4-second probe averaged with eleven 200ms probes becomes a 500ms dot. Visually invisible.

When you're trying to catch an intermittent latency spike — the kind that happens twice an hour — averaging makes the signal disappear into the noise.

## The trick: plot every individual probe with its phases

The fix is two-fold:

- Don't aggregate. Plot every probe as its own point.
- For each probe, capture and render all four phases — not just total.

That's exactly what Exit1.dev's [Live Checks page](/live-checks) does. The Phases view mode renders DNS → Connect → TLS → TTFB as a stacked area on every probe, so you can literally see which colored band is growing during the spike.

Stage colors flow from design tokens (`--stage-dns`, `--stage-connect`, `--stage-tls`, `--stage-ttfb`), so the chart, the log details, and the request-timing labels in the app all stay in sync — the colored band you see expanding in the chart is the same color as the row in the table beneath it.

## A walkthrough — intermittent slowness on a JSON endpoint

Suppose `api.example.com/v1/orders` is sometimes fast (300ms) and sometimes painfully slow (4 seconds). You can reproduce it ~10% of the time.

**Step 1 — open the check on the Live page.** Make sure the check interval is sub-minute (30s on Pro, 15s on Agency). At 5-minute polling you'll miss the spike entirely.

**Step 2 — switch to Phases view.** You should see a thin stacked-area chart with four colored bands. In a healthy state, the TTFB band dominates (because the actual response calculation is the bulk of the time), and DNS / Connect / TLS are slim lines underneath.

**Step 3 — wait for the spike.** The moment a slow probe lands, it paints as a tall stack. The colored band that grew is your culprit.

What the band tells you:

- **DNS band grows** → your client-side resolver or your authoritative DNS is misbehaving. Switch resolvers, check TTLs, check for resolver pool saturation. This is rare and almost always infrastructure.
- **Connect band grows** → the network between you and the server is slow, or the server is hitting its connection limit. Check the server's accept queue, look at your load balancer's connection pool.
- **TLS band grows** → certificate chain validation is slow (often an OCSP responder hanging), or the server is CPU-bound and can't do the handshake. This is a common one nobody investigates because they assume TLS is fast.
- **TTFB band grows** → application time. Database is slow, downstream API is slow, your code is slow. Most spikes land here.

**Step 4 — click the spike on the chart.** The corresponding row highlights in the raw probe table. You get the exact timestamp, the full phase breakdown in milliseconds, the status code, and whether it was on the Frankfurt or Boston worker.

**Step 5 — export the window.** Drag-zoom on the chart to bracket the incident, then export visible-window probes as CSV or JSON. The exported payload includes every phase timing. Stitch this into the postmortem.

## What you're learning by watching live

After ten minutes of doing this you'll know:

- **Whether the slowness is steady or spiky.** A line at 1200ms is different from a baseline at 200ms with 1200ms spikes every 5 minutes. Steady means your baseline regressed. Spiky means something is briefly broken.
- **Which phase to blame.** This rules out 90% of the wrong investigation paths.
- **Whether your two regions agree.** If the Frankfurt worker sees the spike but Boston doesn't (or vice versa), you've localized the failure to one network path or one regional dependency.

This is what a "live" chart is *for*. Not for staring at the line slowly creeping up; for catching the individual probe that exposes the problem.

## Settings that help

A few configurations that make this workflow actually work:

- **Drop the check interval.** 15s (Agency) or 30s (Pro) checks give you 4× the resolution of a 1-min check during an incident.
- **Enable the Boston region for the affected check.** Per-check region toggling on Pro/Agency. Two parallel probes mean you can disambiguate network path from server.
- **Set a response-time threshold alert.** So the spike that happens at 3am wakes you up and you can come investigate the live page.
- **Open the Live page on a second monitor during deploys.** Watch the phases shift in real time as the new build comes up.

## What to do once you've caught it

Get the timestamp and the phase breakdown. Cross-reference against your application logs, your database slow-query log, and your deploy log. The probe doesn't tell you *why* — it tells you *where*. The where dramatically narrows the why.

If it's TTFB: app log, slow-query log, profile the endpoint.

If it's TLS: check OCSP responders, check CPU on the server during the spike, look at TLS session resumption rates.

If it's Connect: check load balancer connection pool, check the server's `accept` queue, check intermediate networks (traceroute from the probe region).

If it's DNS: check your resolver setup, switch from a single resolver to a pool, lower TTLs on critical records, look for resolver-cache thrashing.

## Try it during your next slow incident

Don't wait for the next outage. Pick the API you know is sometimes slow and open the [Live Checks page](/live-checks) for it. Toggle Phases. Wait.

The first time you actually *see* the TLS band swell instead of the TTFB band, the conventional dashboard view is going to feel a little useless.

## Related reading

- [Most "Real-Time" Uptime Monitors Refresh Every 30 Seconds](/blog/real-time-uptime-monitoring-vs-polling)
- [WebSockets vs Polling for Monitoring Dashboards](/blog/websockets-vs-polling-monitoring-dashboards)
- [Incident Postmortem Templates with Exit1](/blog/incident-postmortem-templates-with-exit1)
- [Troubleshooting False Positives](/blog/troubleshooting-false-positives-free-uptime-monitor)
