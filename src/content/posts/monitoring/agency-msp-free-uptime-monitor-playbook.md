---
title: "Agency and MSP Playbook for Free Uptime Monitoring"
author: "Morten Pradsgaard"
category: "monitoring"
excerpt: "Run client uptime monitoring affordably. exit1.dev gives agencies and MSPs 10 free monitors with 5-minute checks, or unlimited monitors with 1-minute checks on the Nano plan ($5/month)."
date: "2025-02-17"
metaDescription: "Agencies and MSPs can start monitoring client sites free with exit1.dev (10 monitors, 5-min checks) or go unlimited with Nano ($5/month). Organize monitors, report uptime, and automate alerts."
---

# Agency and MSP Playbook for Free Uptime Monitoring

Billing clients for uptime and then paying another vendor for “premium” monitoring is backwards. exit1.dev lets agencies and MSPs get started with 10 free monitors (5-minute checks) and scale to unlimited monitors with 1-minute checks on the Nano plan for just $5/month. Here’s how to run it like a pro.

## Step 1: Tag everything by client

Create monitors for each client’s sites and APIs. Use tags (e.g., `client-acme`, `client-zenith`) so analytics and reports segment cleanly. You can share exports without redacting other clients’ data.

## Step 2: Standardize the monitor set

For every new client:

- Homepage and key landing pages.
- Checkout, booking, or lead forms.
- API endpoints that power mobile apps.
- SSL expiry.
- Cron or worker heartbeats if you manage backend jobs.

Build a template checklist and clone it per client. The Nano plan ($5/month) gives you unlimited monitors so you don’t have to ration coverage.

## Step 3: Route alerts by responsibility

Keep marketing alerts lightweight (email, Slack). Push production outages to PagerDuty or Opsgenie through webhooks. exit1.dev lets you configure both per monitor.

## Step 4: Share proof of reliability

Export uptime analytics monthly and drop them into your client reports. Include incident notes from your ticketing system. Clients love seeing that you caught issues before they escalated.

## Step 5: Automate onboarding

Use the exit1.dev API to spin up monitors when you sign a new client. Feed the monitor IDs back into your CRM or project tracker so everyone knows coverage is live.

## Step 6: Monetize the value

You’re providing 24/7 coverage. Bake it into your retainers. The tooling cost is minimal—free for small setups, $5/month for unlimited—which means nearly every bit of value flows to your margin.

## Extra benefits

- Privacy-first monitoring keeps you compliant with GDPR-heavy clients.
- 90 days retention max makes audits and postmortems painless.
- Global probes let you reassure international clients their sites load everywhere.

## FAQs

### Can I give clients access?

Yes. Invite them as read-only users or share exports. You choose the visibility.

### How do I handle hundreds of monitors?

Use tags, sensible naming, and the API. You can bulk update intervals, alerts, and headers whenever needed.

### Do you throttle API usage?

The free tier gives you 1,000 API requests per hour per key. Plenty for onboarding and reporting.

### What about white-labeling?

Export the data and present it however you want—your branding, your decks. exit1.dev just feeds you the truth.

