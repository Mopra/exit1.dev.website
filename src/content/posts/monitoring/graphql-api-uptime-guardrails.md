---
title: "GraphQL and API Uptime Guardrails"
author: "Morten Pradsgaard"
category: "monitoring"
excerpt: "Keep GraphQL and REST APIs honest with exit1.dev. Validate JSON payloads, auth headers, and performance without paying for enterprise observability."
date: "2025-02-18"
metaDescription: "Monitor GraphQL and REST APIs using exit1.dev's free uptime monitor. Add JSON path checks, headers, and auth to keep services reliable."
---

# GraphQL and API Uptime Guardrails

APIs don’t fail politely. They return partial data, stale caches, or 200 OK with garbage inside. exit1.dev keeps your GraphQL and REST endpoints honest with real validation and zero upsells.

## Monitor more than status codes

Status 200 means nothing if the payload is broken. exit1.dev lets you:

- Add custom headers (auth tokens, API keys, versioning).
- Validate JSON responses with JSONPath.
- Assert body keywords for HTML or plaintext endpoints.
- Check response times by region.

All of that lives in the free tier.

## GraphQL specifics

GraphQL returns a 200 even when there are errors. Configure exit1.dev to check the `errors` array and ensure it’s empty. Validate specific fields:

```json
{
  "query": "{ healthcheck { status version } }"
}
```

Add JSONPath checks for `$.data.healthcheck.status == "OK"`. If the resolver fails, you’ll know immediately.

## REST APIs

For REST endpoints, validate:

- Expected status code.
- JSON fields (e.g., `$.status == "ready"`).
- Response size to catch truncated payloads.
- Headers like `cache-control` or custom flags.

## Auth and headers

Need bearer tokens, HMAC headers, or basic auth? exit1.dev supports them all. Store secrets securely in the monitor configuration and rotate them whenever you like.

## Multi-region validation

Enable global monitoring to hit your APIs from multiple continents. Compare latency and error rates per region so you can tune routing rules or CDN edge caches.

## Combine with logs and analytics

exit1.dev keeps detailed logs for every request. Export them to CSV or hit the API for deeper analysis. Analytics show uptime, response times, and trends—perfect for SLOs.

## FAQs

### Can I monitor GraphQL mutations?

Yes. Send POST requests with variables. Validate the response payload and make sure side effects completed by checking downstream monitors.

### Do you support custom request bodies?

Absolutely. Send JSON, form data, or raw payloads. We replay them exactly as configured.

### How often can I run checks?

Every minute if you want. No upgrade required.

### Can I chain monitors?

Use webhooks to trigger follow-up checks or workflows. For example, if a GraphQL mutation fails, call an automation that replays the request or creates an incident ticket.

