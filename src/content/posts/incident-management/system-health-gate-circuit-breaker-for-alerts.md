---
title: "The Night We Almost Paged 10,000 People Because Our Own VPS Blinked"
author: "Morten Pradsgaard"
category: "incident"
excerpt: "When a thousand unrelated sites all fail in the same second, the problem is almost never a thousand unrelated sites. Here's how we built a circuit breaker for our own alerts — and why every monitoring system needs one."
date: "2026-04-12"
metaDescription: "How we built a circuit breaker for our alerting pipeline to stop paging customers when our own infrastructure blinks. A real incident, a real fix, and the subtle bugs we hit along the way."
---

# The Night We Almost Paged 10,000 People Because Our Own VPS Blinked

We run an uptime monitor. Checks fire from a dedicated box in Frankfurt — HTTP, TCP, UDP, ICMP, WebSocket, the whole zoo. When a check fails, we email, SMS, and webhook the customer. That's the product.

It's also the failure mode.

The day our upstream provider sneezed, every check on the box failed at once. Not a few — all of them. From the customer's point of view, their site just went down. From our point of view, every one of their sites just went down. The alert pipeline dutifully started doing its job.

We realized something obvious in hindsight: **when a thousand unrelated websites all fail in the same second, the problem is almost never a thousand unrelated websites.** It's us. It's the network between us and them. It's DNS. It's a kernel upgrade. It's never "the entire internet broke at 03:14 UTC on a Tuesday."

So we built a circuit breaker for our own alerts. We call it the System Health Gate.

## The rule

We keep a rolling 3-minute window of UP→DOWN transitions, keyed by check ID. If the unique count in that window crosses a threshold, the gate trips: all outbound notifications are suppressed for 10 minutes.

Monitors keep running. History keeps recording. Dashboards keep updating. The only thing that pauses is the part that wakes people up.

```ts
if (systemHealthGate.downFlips.size >= THRESHOLD) {
  systemHealthGate.trippedAt = now;
  logger.warn(`SYSTEM HEALTH GATE TRIPPED: ${systemHealthGate.downFlips.size} checks`);
  return true; // suppress all alerts
}
```

That's the one-paragraph version. The subtleties are where it gets interesting.

## Subtlety #1: startup grace

On deploy, the process restarts with an empty status buffer. The first check cycle looks like everything just went down, because we don't remember it being up.

So for the first 5 minutes after boot, the gate is pre-tripped. No alerts, period. Simple, right?

Not quite. When the grace period ends, you have to **explicitly clear the DOWN-flip set**. Otherwise, every false failure accumulated during grace is still sitting there waiting to trip the threshold gate the instant grace ends — extending suppression by another 10 minutes, silently, for no reason.

That bug cost us a weekend. Two guards, one lesson:

```ts
if (now - PROCESS_START_TIME < STARTUP_GRACE_MS) {
  return true; // suppress during grace
}

// When grace ends, clear accumulated flips ONCE
if (!startupGraceCleared) {
  startupGraceCleared = true;
  systemHealthGate.downFlips.clear();
}
```

## Subtlety #2: post-grace confirmation

Even after grace ends, the first real cycle for each check is still a bit suspect — it's comparing fresh memory against whatever the database says was the last status. A deployment artifact can sneak through as a "new" UP→DOWN transition.

So for 3 minutes after grace, we require each check to run *twice* before it's allowed to alert. First run: record, don't alert. Second run: alert normally.

```ts
const postGraceConfirmedChecks = new Set<string>();

export function isInPostGraceConfirmation(checkId?: string): boolean {
  const elapsed = Date.now() - PROCESS_START_TIME;
  if (elapsed < GRACE_END || elapsed >= POST_GRACE_END) return false;
  if (checkId && postGraceConfirmedChecks.has(checkId)) return false;
  return true; // first time seen in post-grace — defer
}
```

One check, one free pass. Then we trust it. A deployment can only artificially mark a check once; the second cycle is whatever reality actually is.

## Subtlety #3: the operator gets one email, customers get none

When the gate trips, we send exactly one email — to ourselves.

```
[exit1] System health gate tripped — 847 checks DOWN
```

Customers don't need to know we have a circuit breaker. They need their alerts to be meaningful. If we emailed them every time the gate tripped with an explanation, we'd just be replacing one kind of noise with a slightly more philosophical kind of noise.

The gate tripping is *our* incident to handle. If it's not handled quickly, customers will notice the same way they'd notice any other outage: their dashboard will eventually stop updating and they'll email support. That's fine. That's normal. The one thing we never want is for them to be woken up at 3 AM by a false alarm that came from us.

## Why this matters

The whole thing is maybe 150 lines of code. It's the single most valuable piece of code in the alerting pipeline, because it's the one that stops us from being the boy who cried wolf the one time nobody wanted to be.

If you're building any kind of alerting system — not just uptime — add some version of this. The specific thresholds don't matter. What matters is that your system can distinguish "many unrelated things are failing" from "I am failing" and react accordingly. Without that distinction, you are one bad network blip away from destroying months of accumulated trust with your customers.

The lesson we'd share: **a monitoring system should monitor itself first.** If your alerting layer can't tell the difference between "a thousand sites are down" and "I am down," it will eventually burn every ounce of credibility you've built in a single three-minute window.

Ask how we know.
