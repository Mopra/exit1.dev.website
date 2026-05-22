---
title: "WebSockets vs Polling for Monitoring Dashboards: Why We Stream 30-Byte Probes Instead of Refreshing"
author: "Morten Pradsgaard"
category: "infrastructure-monitoring"
date: "2026-05-22"
excerpt: "An engineering breakdown of why polling is the wrong default for a probe stream — and how we built a WebSocket transport that paints in sub-second time with a 30-byte wire format."
readTime: "8 min read"
metaDescription: "Architecture deep dive: why most monitoring dashboards use polling, when polling falls apart, and how to design a streaming probe transport with replay buffer, multi-region multi-connect, and Firestore fallback."
---

# WebSockets vs Polling for Monitoring Dashboards

Most monitoring SaaS dashboards are built on polling. There's a good reason for that — and a stage at which it stops being a good reason.

This post is about both: when polling is the right default, when it breaks down, and how to design a WebSocket transport for a probe stream that doesn't fall over the moment the user's train goes through a tunnel.

## When polling is the right default

The default web app data plane in 2026 looks like this:

- Client → REST endpoint (or GraphQL)
- Server reads from a database
- Page renders
- A `setInterval` re-fetches every N seconds

That works fine when:

- The data changes slowly relative to the poll interval.
- Each fetch is cheap (response size, server cost).
- There's no in-app expectation of "the moment something happens."

Most of a monitoring dashboard fits all three: settings, billing, monitor lists, last-30-days reports. Polling those every 30 seconds — or just on navigation — is genuinely fine.

## When polling falls apart

Polling falls apart when:

- The **data changes faster** than your poll interval. You're shipping stale data and the UI is constantly chasing the truth.
- The data is **a stream of discrete events**, not a value. Polling collapses N events into one snapshot. The chart loses individual probes; spikes get smeared into aggregates.
- The user is **literally watching**. The UI's responsiveness floor is the polling interval, regardless of how fast the backend is.
- You add **per-region complexity**. Polling N regional endpoints in parallel just multiplies your client-side cron jobs.

The per-check live page in a monitoring tool hits every one of these.

## Why a probe stream is event-shaped

Each probe completes at a specific instant. It carries:

- The timestamp
- The total response time
- A status code (or null for non-HTTP checks)
- A status enum (up / down / unknown)
- Optional per-stage timings: DNS, Connect, TLS, TTFB

That's an event. Polling forces you to convert events into snapshots ("what's the state right now?"), which is information loss. The right transport for events is push.

## What polling forces you to compromise on

Three things give:

**1. Latency.** Even at a 5-second poll interval, your visible latency floor is 2.5 seconds (average wait) plus network. At 30s it's 15+ seconds.

**2. Aggregation.** Because you don't know which events arrived in the last poll window, the server typically returns "the latest N events" or "the window since timestamp X." Either way, the chart has to bucket them. Individual probes get lost.

**3. Resilience.** Polling is silently lossy. If a fetch fails, the next one just resumes — you don't notice what you missed.

## What streaming buys you

A WebSocket transport for probe data inverts every one of those:

**1. Latency goes to wire-time.** Frankfurt to your browser is ~30ms in Europe, ~110ms transatlantic. Probe → paint p50 lands well under a second.

**2. Individual events, no bucketing.** Each probe is rendered as a discrete chart point with its own metadata. Spikes don't get averaged.

**3. Reconnect with replay.** A server-side ring buffer of recent events lets you deliver exactly what was missed during a network gap. The client knows it dropped, and gets the missing events on rejoin.

## The wire format

Exit1.dev's per-probe payload looks roughly like this on the wire:

```
{ t, rt, sc?, st, dn?, cn?, tl?, ft? }
```

That's:

- `t` — timestamp (epoch ms)
- `rt` — total response time (ms)
- `sc` — status code (HTTP family only)
- `st` — status enum (up/down/unknown)
- `dn`, `cn`, `tl`, `ft` — DNS / Connect / TLS / TTFB phase timings

Roughly 30 bytes per probe on the wire, about 100 bytes in browser heap.

At a 15-second check interval (the Agency tier floor), that's:

- 240 probes/hour per check
- 7.2 KB/hour per check
- 173 KB/day per check

You can leave the page open in a background tab all day on a phone plan and it won't burn measurable data. That's only feasible because the format is event-shaped, not snapshot-shaped.

## Auth without a new trust plane

A common reason monitoring tools default to polling: streaming requires a separate auth path. Every WebSocket gateway needs to know "is this user allowed to see this data," and the obvious answer is "build a new SDK."

We didn't. The transport re-uses the existing Clerk → Firebase token bridge that authenticates the rest of the app. The client gets a Firebase ID token (same one used for Firestore), opens the WebSocket, sends the token in the connect handshake, and the gateway validates it against the same JWKS. No new SDK on the gateway, no new credential store.

After auth, every probe pushed to the connection is filtered against the verified `uid`. The client never receives probes for checks it doesn't own.

## The reconnect-replay problem

The hard part of any live UI isn't the happy path. It's "what happens when the user's Wi-Fi drops for 90 seconds."

If you do nothing: the UI silently misses 90 seconds of probes. State on screen is stale. The user has no idea.

If you reconnect with no replay: the chart resumes at the new probes, with a visible gap. Better, but you lose any state transitions (up → down → up) that happened in the gap.

The right design is a **server-side replay ring buffer**. Each region's gateway maintains the last 5 minutes of events in memory. When a client reconnects with an auth token, the gateway:

1. Validates auth
2. Delivers a fresh state snapshot ("here's the current state of every check you own")
3. Delivers any state transitions from the ring buffer that happened during the gap
4. Resumes pushing new probes

The client never sees an "error" state — at most it sees the connection indicator flip from `live` → `reconnecting` → `live` again, with no missing data.

If the WebSocket is down for longer than 5 minutes, the same UI silently falls back to Firestore `onSnapshot` — the system of record still has every state transition. An 8-second debounce prevents the connection indicator from flickering during brief reconnects, with a banner naming the affected region if degradation persists.

## Per-region multi-connect

Modern monitoring services run probes from multiple regions. The naive approach is to fan in: one centralized gateway, multiple regions push to it, clients read from one socket.

That works until the central gateway becomes the bottleneck — or worse, a single failure point. A regional outage shouldn't take down the live view for users with checks in *other* regions.

The fix is to fan out at the client. Each browser opens one WebSocket per region the user has checks in (Frankfurt, Boston, …), capped at 10 concurrent connections per user. Each region is independent and failure-isolated. If Boston is degraded, Frankfurt-resident checks keep streaming with no visible impact.

This composes cleanly with a future read-only fan-in relay when the region count exceeds ten — but we don't need it yet, and the architecture doesn't have to change to add it.

## What this enables in the UI

Once the data plane streams individual probes with phase timings and per-region attribution, the UI can do things polling can't:

- **Canvas-rendered scrolling charts** with smooth tweening as the live tip advances (no flicker on each refresh)
- **Per-probe classification** against the visible window's median (amber for ≥2×, red for ≥3×) — both the chart marker and the table row tint stay in sync because they consume the same windowed-median computation
- **Bidirectional selection** between the chart and the raw probe table — click a probe, the table row highlights, and vice versa
- **Drag-to-zoom** on the chart, brush navigator to pan back through the buffer
- **Phase mode** that stacks DNS / Connect / TLS / TTFB on every probe (which exists only because we capture them on every probe, not as a sampled average)
- **CSV/JSON export** of the visible window or full buffer, with phase timings included

The UI tricks aren't expensive on top of a stream. They're nearly impossible on top of a poll.

## Cost story

The thing people fear about WebSockets is cost. One long-lived connection per user, all day, sounds expensive compared to a fetch every 30 seconds.

It isn't, for two reasons:

- The bytes per event are smaller than the per-fetch overhead. A 30-byte event vs a ~1.5 KB poll response with headers. The break-even is fewer than five events per polling interval.
- The connection itself is cheap on modern servers. A typical WebSocket gateway can hold tens of thousands of idle connections per node with single-digit GB of memory.

The other thing people fear is database load. The trick is to keep the live transport separate from your system of record. Probes get *broadcast* through the gateway; they get *persisted* by a separate writer. The gateway never touches the database on the read path. That's what makes the sub-second paint feasible — there's no Firestore round-trip in the hot loop.

## When you don't need this

Most pages in a monitoring app don't need it. The monitor list, the settings page, billing — polling on navigate is fine. We didn't migrate any of those.

The page that needs it is the per-check live detail view. That's where you stare during a deploy or an incident, that's where polling latency is visible to the user, and that's where the event-shaped data really wants to be a stream.

For everything else, REST and Firestore `onSnapshot` are still right.

## See the actual implementation

Exit1.dev runs this for every check on Nano, Pro, and Agency. [Open a check on the Live page](/live-checks) and watch the architecture above translate to UI: sub-second paint, individual probes, drag-to-zoom, per-region streaming, replay on reconnect.

## Related reading

- [Most "Real-Time" Uptime Monitors Refresh Every 30 Seconds](/blog/real-time-uptime-monitoring-vs-polling)
- [How to Watch DNS, TCP, TLS and TTFB Change in Real Time](/blog/watch-ttfb-dns-tls-real-time)
- [Free Infrastructure Monitoring Stack](/blog/free-infrastructure-monitoring-stack)
- [SRE Playbook for Infrastructure Monitoring](/blog/sre-playbook-free-infrastructure-monitoring)
