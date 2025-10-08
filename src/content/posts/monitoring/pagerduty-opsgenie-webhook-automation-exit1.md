---
title: "Automating PagerDuty and Opsgenie with exit1.dev Webhooks"
author: "Morten Pradsgaard"
category: "monitoring"
excerpt: "Wire exit1.dev into PagerDuty and Opsgenie using signed webhooks. Free uptime monitoring, serious on-call automation."
date: "2025-02-14"
metaDescription: "Use exit1.dev's free uptime monitor to trigger PagerDuty and Opsgenie workflows. Learn how to configure signed webhooks, suppress noise, and automate incident response."
---

# Automating PagerDuty and Opsgenie with exit1.dev Webhooks

If an uptime monitor can’t trigger your incident platform, it’s a toy. exit1.dev ships webhook alerts in the free tier, complete with HMAC signatures. Here’s how to integrate with PagerDuty and Opsgenie without duct tape.

## Why webhooks matter

Email alerts are fine for awareness. On-call teams need automation:

- Trigger incidents instantly.
- Route based on service or region.
- Auto-resolve when things recover.

exit1.dev webhooks give you the payloads you need with none of the paywall games.

## PagerDuty integration

### 1. Create a PagerDuty event rule

In PagerDuty, create an Events API v2 routing key for your service. This is the token exit1.dev will use.

### 2. Configure the webhook in exit1.dev

Add a webhook to your monitor with the PagerDuty Events API URL. Use the routing key in the JSON body. Example payload:

```json
{
  "routing_key": "YOUR_ROUTING_KEY",
  "event_action": "trigger",
  "payload": {
    "summary": "{{monitor.name}} is down",
    "source": "exit1.dev",
    "severity": "error",
    "custom_details": {{monitor | json}}
  }
}
```

### 3. Verify the signature

exit1.dev includes an `X-Exit1-Signature` header (HMAC SHA256). Validate it with your webhook secret to block spoofed calls.

### 4. Auto-resolve incidents

When the monitor recovers, we send a `recovery` event. Map it to PagerDuty’s `resolve` action so incidents close automatically.

## Opsgenie integration

Opsgenie’s Alerts API works the same way.

- Create an API key scoped to the team handling uptime.
- Add a webhook in exit1.dev pointing to `https://api.opsgenie.com/v2/alerts`.
- Use tags or teams in the payload to route incidents.
- Validate the HMAC signature before accepting the request.

## Noise suppression is built in

exit1.dev requires consecutive failures before firing webhooks. You also get one alert per outage, not a flood. Tune the failure threshold per monitor if you need more caution.

## Bonus automations

- Send recovery events to Slack to close the loop.
- Trigger runbook automation with serverless functions.
- Pipe alerts into incident.io or FireHydrant using the same webhook system.

## FAQs

### Do I pay extra for webhooks?

No. Webhooks, email, and analytics are part of the free tier.

### Can I use different webhooks per monitor?

Yes. Each monitor can have its own webhooks and emails. Route product teams however you like.

### How do I rotate secrets?

Update the webhook secret in exit1.dev and your verification logic. We support multiple headers if you need a transition period.

### What payload fields are available?

Everything about the monitor and incident: name, URL, region, status, timestamps, and failure counts. Use `custom_details` to embed the full JSON.

