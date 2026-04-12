---
title: "Catching DNS Hijacks Without Crying Wolf"
author: "Morten Pradsgaard"
category: "domain-intelligence"
excerpt: "Most uptime monitors check whether a site responds. Fewer check whether the site responding is actually yours. Here's the simple pattern we use to detect DNS hijacks without alerting on every legitimate record change."
date: "2026-04-12"
metaDescription: "How to monitor DNS records for hijacks and misconfigurations without alert fatigue. A simple baseline + hysteresis + auto-accept pattern that catches real drift and ignores normal churn."
---

# Catching DNS Hijacks Without Crying Wolf

Most uptime monitors check whether a site responds. Fewer check whether the site responding is actually *your* site.

DNS is one of the easier ways to lose a domain. A registrar account gets phished, records get rewritten, traffic flows somewhere you didn't authorize — and your HTTP monitor is perfectly happy because, hey, it got a 200 OK. From something. Somewhere.

We wanted to catch that. But DNS is also noisy. Records legitimately change all the time. Load balancers rotate IPs. CDNs shuffle edges. Mail providers update MX entries. If we alerted on every change, we'd become the boy who cried DNS, and customers would mute us within a week.

The solution is a pattern that feels obvious once you see it: **baseline + hysteresis + auto-accept.**

## How it works

The first time we query a domain, we capture a baseline — a snapshot of A, AAAA, MX, CNAME, whatever the customer asked us to watch. On every subsequent check, we compare current records against the baseline.

If nothing changed, we move on.

If something *did* change, three things happen:

1. We force the check offline.
2. We fire a DNS-specific alert that names exactly what changed.
3. We start a counter.

That counter is the whole trick.

```ts
if (changes.length > 0) {
  // Drift detected — alert immediately and reset counter
  status = 'offline';
  lastError = `DNS records changed: ${changes.map(c => c.recordType).join(', ')}`;
  autoAcceptConsecutiveCount = 0;
  await triggerDnsRecordAlert(check, changes);
} else if (autoAccept) {
  // No changes this cycle — increment and maybe accept
  const count = (autoAcceptConsecutiveCount ?? 0) + 1;
  if (count >= AUTO_ACCEPT_THRESHOLD) {
    baseline = currentRecords; // silently adopt new baseline
    changes = [];
  }
}
```

If the new records hold steady for N consecutive checks, we **accept** them. The baseline silently becomes the new baseline. No more alerts. The change log resets. Life goes on.

If they flap back, we alert again.

## Why this is hysteresis, not anomaly detection

The word hysteresis comes from control theory — it describes systems whose output depends not just on the current input, but on the history of inputs. Your thermostat is hysteretic: it doesn't toggle the heater the instant the temperature crosses the setpoint, because that would cause chattering. It waits for the temperature to drift a little further before switching states.

DNS monitoring needs the same property. The state transitions aren't "new records? alert" and "old records? don't alert." They're:

- **Stable on baseline** → quiet
- **Baseline → something new** → loud, immediately
- **Something new → same new thing, repeatedly** → quietly accept it
- **Accepted → something else new** → loud again

The alert fires immediately on drift, because a DNS hijack is the kind of thing you want to know about in the first minute, not the first hour. But the system also assumes operators do legitimate DNS work, and gives them a quiet, automatic path back to normal without requiring anyone to log into a dashboard and click "acknowledge."

## What we're most proud of

This works without any machine learning, any anomaly detection, any "AI." It's a counter and a comparison. The logic fits on a postcard.

And yet it catches a class of attack that almost nobody else in the uptime monitoring space even looks at. Uptime tools check if your site is *up*. This checks if your site is *yours*. Those are different questions, and when a registrar attack happens, the first question keeps returning yes while the answer to the second one has already become no.

If you're building a monitor — or even just thinking about your own infrastructure's observability — add this pattern somewhere. It costs almost nothing. It catches the thing nobody watches for. And it does it without turning into alert spam the rest of the time.

Control theory from the 1940s, applied to a 2026 security problem. Sometimes the old ideas are still the best ones.
