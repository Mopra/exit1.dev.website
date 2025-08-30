---
title: "Monitoring 101: What, Why, Metrics"
author: "Morten Pradsgaard"
category: "monitoring"
excerpt: "Basics: Keep site up, fast, functional."
readTime: "7 min read"
metaDescription: "Monitoring 101: Metrics and why."
---

# Monitoring 101: Essentials

Monitoring watches site health 24/7. Critical for users, revenue.

Compare tools: [Best 2025](/blog/best-website-monitoring-service-2025). Setup: [Get Started](/blog/get-started).

## What

Continuous checks: Accessible, functional, performing.

Example: E-comm: Homepage loads, cart adds, checkout works. Alert on fail.

## Monitoring vs Perf

Monitoring: Up/down?
Perf: How well?

Need both: Up but slow loses users.

Pro tip: Start monitoring, add perf.

## Uptime vs Availability

Uptime: Operational time %.
Availability: Operational probability, includes maintenance.

| % | Mo Down | Yr Down | Impact |
|---|---------|---------|--------|
| 90 | 72 hrs | 36.5 days | Bad |
| 95 | 36 hrs | 18.25 days | Poor |
| 99 | 7.2 hrs | 3.65 days | Ok |
| 99.9 | 43 min | 8.77 hrs | Good |
| 99.99 | 4 min | 52 min | Excellent |
| 99.999 | 26s | 5 min | World-class |

99% = weekend down. Not great.

## Metrics

HTTP codes: 200 good, 3xx ok, 4xx client err, 5xx server err.

Response: <200ms target, <1s acceptable, >3s bad.

Uptime: 99.9% min.

Geographic: Diff regions.

SSL: Expiry 30+ days warn, handshake <100ms, chain valid.

Content: Keywords present, API expected, forms work.

Advanced: TTFB, Web Vitals, synthetic, RUM.

Deep dive: [Real-time vs 5-min](/blog/real-time-vs-5-minute-monitoring). Landscape: [Intro](/blog/intro-to-website-monitoring).

## Types

1. Ping: Alive?
2. HTTP/S: Server response.
3. API: Endpoints valid.
4. Transaction: Full flows.
5. DNS: Resolution.

## Practices

1. HTTP main pages.
2. Alerts.
3. Multi-locations.
4. Test alerting.

Strategy:
```
Critical: Homepage, login, checkout, API, admin.
Frequency: Critical 1 min, important 5 min, secondary 15 min.
```

Thresholds: Response 3x normal, immediate downtime, content missing.

Response: Who alerted, escalation, tracking.

## Avoid Mistakes

1. Alert fatigue: Tune thresholds.
2. One location: Multi-region.
3. Ignore SSL: Monitor expiry.
4. No full journey: Multi-step.
5. Forget mobile: Monitor specific.
6. No doc: Document setup/response.

Advanced: [Beyond Uptime](/blog/beyond-uptime-monitoring-guide), [Best Practices](/blog/website-monitoring-best-practices-2025).

## Why exit1.dev

30s checks free, dev-friendly, global, intelligent, transparent.

## Conclusion

Monitor smart. Start simple, evolve.

[Sign up free](https://app.exit1.dev/). Catch issues before users.

Related: [Get Started](/blog/get-started), [Free Tools](/blog/free-website-monitoring-tools-2025), [Downtime](/blog/understanding-website-downtime), [Free vs Paid](/blog/free-vs-paid-website-monitoring), [Best Practices](/blog/website-monitoring-best-practices-2025)

## Sources

- MDN: HTTP response status codes — https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status
- web.dev: Core Web Vitals — https://web.dev/articles/vitals
- Google SRE Book: Monitoring Distributed Systems — https://sre.google/sre-book/monitoring-distributed-systems/
