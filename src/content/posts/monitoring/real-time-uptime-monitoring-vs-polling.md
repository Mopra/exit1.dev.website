---
title: "Most 'Real-Time' Uptime Monitors Refresh Every 30 Seconds. Here's What Actually Live Looks Like."
author: "Morten Pradsgaard"
category: "monitoring"
date: "2026-05-22"
excerpt: "Pingdom, UptimeRobot, Better Stack, Checkly, Hyperping, StatusCake — every 'real-time' dashboard is just a polled API on a 30–60s refresh timer. There's another way."
readTime: "6 min read"
metaDescription: "Audit of how the leading uptime monitors implement 'real-time' dashboards — and why most are just 30-second polls. Compare to a true streamed-probe model with sub-second paint."
---

# Most "Real-Time" Uptime Monitors Refresh Every 30 Seconds

Open any uptime tool's marketing site and you'll see the same word: **real-time**. Live. Instant. Second-by-second.

Open the actual dashboard and they're all doing the same thing — polling their own API on a timer and re-rendering the page.

That's not real-time. That's a slow page reload.

## What "real-time" usually means

Every uptime tool runs probes on some interval — 30s, 1 min, 5 min. That's the **detection** interval. It's the floor on how fast the system *could* know something went down.

But what you see in the dashboard is gated by a second thing: how often the **UI** refreshes. Even if the prober just finished a check, you don't see the result until the next dashboard poll.

Here's what that looks like across the major tools:

| Tool | Check interval (min) | Dashboard "live" mechanism |
|---|---|---|
| Pingdom | 60s | Polled `/api/uptime` calls; "Live Map" re-renders on a timer |
| UptimeRobot | 30s (Enterprise), 5min (Free) | Auto-refresh of the monitor list |
| Better Stack | 30s | Auto-refresh of the "real-time" timeline |
| Checkly | 10s (high-frequency) | "Near real-time" — polled aggregates |
| Hyperping | 30s | "Real-world response times" — polled |
| StatusCake | 30s | Dashboard refresh + polled "live view" |

None of these push the probe result to your browser. They all run a poll loop in JavaScript, hit a REST endpoint, and re-render. The lag is the polling interval *on top of* the detection interval.

## Why polling won the last decade

It's simple. Polling needs nothing the rest of the web app doesn't already have: an HTTP endpoint, an auth header, a `setInterval`. WebSockets need a separate gateway, a separate auth plane, and a different mental model for the frontend (state from a push, not from a fetch).

For a dashboard that mostly shows aggregates — "uptime 99.94% this month", "average response 187ms" — polling is fine. The number doesn't change every probe.

It stops being fine the moment you're staring at a chart during an incident.

## When polling actually hurts

You deployed at 14:03. By 14:04 your API's p95 latency has tripled. Nothing is *down*, exactly — the response times are just bad.

In a polled dashboard you find out when:

1. The next probe runs (up to 30s after deploy)
2. The next dashboard refresh fires (up to another 30s)
3. The chart re-aggregates the last 5 minutes (smearing the spike across buckets)

That's up to a minute of lag, and the chart smooths away the very signal you were trying to see.

A streamed-probe dashboard shows you the individual probe with its phase breakdown — DNS time, TCP connect, TLS handshake, TTFB — the moment it lands. No aggregation. No refresh timer. The spike is visible because it's *the next dot on the chart*.

## What actually live looks like

Exit1.dev's [Live Checks page](/live-checks) takes a different route. Probes run on dedicated VPS workers in Frankfurt and Boston with a 500ms dispatcher tick. The moment a probe completes, the result (about 30 bytes on the wire) is pushed to a region-local WebSocket gateway and fanned out to subscribed clients.

From wire to paint: p50 under one second.

What you see:

- A canvas-rendered scrolling chart that tweens smoothly as the live tip advances
- A particle trail streaming backward from the live tip in real-time mode
- Toggle between Total and **Phases** — Phases stacks DNS → Connect → TLS → TTFB on every single probe
- Probes auto-classified against the visible window's median: amber for ≥2× (elevated), red for ≥3× (spike)
- A raw probe table beside the chart, newest first, new rows flashing green for 900ms
- Click any row to highlight the corresponding chart point — and vice versa
- Drag-to-zoom on the chart; double-click to zoom back out
- Export visible-window or full-buffer probes as CSV or JSON, with phase timings included

No polling. No "refreshing in 28 seconds." Just the actual probe stream.

## How is this not just a polling-with-extra-steps story

A few things distinguish a real stream from a fast poll:

- **Sub-second probe → paint.** Polling can be 5 seconds and still feels slow. The actual lower bound on polling is the slowest mobile network round-trip in your user base.
- **No client-side timer.** A poll-based UI re-renders on its own clock, not on probe completion. A stream-based UI re-renders on probe completion.
- **No batching at the API layer.** Polling typically returns "everything since the last poll." Streams deliver individual events. Spikes don't get bucketed into 30s aggregates before they reach the chart.
- **Replay buffer on reconnect.** Drop your Wi-Fi for 90 seconds and a polled UI just resumes polling — silently missing whatever happened. A stream-based UI replays missed state transitions from a server-side ring buffer.

## When polling is still the right call

Most of the dashboard doesn't need to be live. Folder lists, settings pages, billing, the monthly uptime report — re-rendering on navigate is fine.

Streaming is the right call for **one** view: the per-check detail page during an incident or a deploy. That's the moment when you're staring at the chart waiting for the next probe to land.

## What to ask your current tool

Before believing a "real-time" claim on a competitor's page, ask:

1. What's the **detection** interval (probe frequency)?
2. What's the **dashboard refresh** interval?
3. Does the chart re-aggregate over a window, or does it plot individual probes?
4. Are per-stage phase timings (DNS / Connect / TLS / TTFB) captured on every probe or sampled?
5. If I drop the connection for a minute, do I get the missing events on reconnect?

If the answers are "30s + 30s, aggregated, sampled, no" — you're polling. That's fine for the index page. It's the wrong default for the page you stare at when something is wrong.

## See it live

[Open a check on the Live page](/live-checks) and watch probes paint as they finish. The first time you see DNS, Connect, TLS, and TTFB shift around in real time during a deploy, the polled refresh model starts to feel old.

## Related reading

- [WebSockets vs Polling for Monitoring Dashboards: Why We Stream 30-Byte Probes Instead of Refreshing](/blog/websockets-vs-polling-monitoring-dashboards)
- [How to Watch DNS, TCP, TLS and TTFB Change in Real Time While Debugging a Slow Endpoint](/blog/watch-ttfb-dns-tls-real-time)
- [1-Min vs 5-Min Monitoring: Speed Matters](/blog/real-time-vs-5-minute-monitoring)
- [Best Free Uptime Monitoring Tools](/blog/best-free-uptime-monitoring-tools)
