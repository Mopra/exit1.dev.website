---
title: "Free SPF Record Checker — Verify Your Email Authentication"
author: "Morten Pradsgaard"
date: "2026-04-09"
category: "domain-intelligence"
excerpt: "Check if your domain has a valid SPF record to prevent email spoofing."
readTime: "5 min read"
metaDescription: "Free SPF record checker. Verify your domain's SPF configuration, find missing senders, and fix email deliverability issues. No signup required."
---

# Free SPF Record Checker — Verify Your Email Authentication

*Without an SPF record, anyone can send email pretending to be from your domain. Gmail and Yahoo now require SPF for bulk senders — missing it means your emails go to spam or get rejected outright.*

**Check your SPF now:** Our [free DNS Lookup Tool](/tools/dns-checker) detects your SPF record and shows the full value in the email security section.

## What Is an SPF Record?

SPF (Sender Policy Framework) is a TXT record in your DNS that lists which servers are authorized to send email for your domain. When a receiving server gets an email "from" your domain, it checks your SPF record. If the sending server isn't listed, SPF fails.

**Example SPF record:**
```
v=spf1 include:_spf.google.com include:sendgrid.net -all
```

**Breakdown:**
- `v=spf1` — Identifies this as an SPF record
- `include:_spf.google.com` — Authorizes Google Workspace servers
- `include:sendgrid.net` — Authorizes SendGrid servers
- `-all` — Reject all other senders (hard fail)

## How to Check Your SPF Record

### Method 1: DNS Lookup Tool

Enter your domain in our [DNS Lookup Tool](/tools/dns-checker). The "Mail & Email Security" section shows whether an SPF record exists and displays the full record value. If SPF is missing, the health grade drops and it's flagged as an issue.

### Method 2: Command line

```bash
dig +short example.com TXT | grep spf
# Output: "v=spf1 include:_spf.google.com -all"
```

## Common SPF Problems

### No SPF record

Your domain has zero protection against spoofing. Any server can send email as `you@yourdomain.com`. Fix: create a TXT record with `v=spf1` listing your authorized senders, ending with `-all`.

### Too many DNS lookups

SPF is limited to **10 DNS lookups**. Each `include:` and `redirect=` counts as one. Nested includes count too — `include:_spf.google.com` itself triggers 3 lookups internally. Exceed 10 and the entire SPF check fails with a "permerror."

**How to count:** Use an SPF validator or count your `include:` statements and check if any of them nest further includes.

**Fixes:**
- Remove unused `include:` entries for services you no longer use
- Replace `include:` with `ip4:` for servers with static IPs
- Use an SPF flattening service for complex setups

### Multiple SPF records

A domain must have **exactly one** SPF TXT record. Two SPF records = both invalid. If you have multiple, merge them into one:

```
# Wrong — two records
v=spf1 include:_spf.google.com -all
v=spf1 include:sendgrid.net -all

# Right — one record
v=spf1 include:_spf.google.com include:sendgrid.net -all
```

### Using `~all` instead of `-all`

`~all` (soft fail) means unauthorized senders are flagged but typically delivered anyway. It's meant for testing. For production, use `-all` (hard fail) to actually block unauthorized senders.

### Forgetting a sending service

If you use Google Workspace, SendGrid, Mailchimp, and Zendesk, all four must be in your SPF record. Forgetting one means legitimate emails from that service fail SPF. Audit every service that sends email as your domain.

## SPF Alone Isn't Enough

SPF verifies the sending server, but it breaks when emails are forwarded (the forwarding server's IP isn't in your SPF record). That's why you also need DKIM and DMARC.

Read our complete [SPF, DKIM, and DMARC setup guide](/blog/spf-dkim-dmarc-email-authentication-guide) for the full picture.

## Recommended Resources

- [Free DNS Lookup Tool](/tools/dns-checker) — Check SPF, DMARC, and all DNS records
- [SPF, DKIM, and DMARC Guide](/blog/spf-dkim-dmarc-email-authentication-guide) — Complete email authentication setup
- [Free MX Record Lookup](/blog/free-mx-record-lookup) — Check your mail server configuration
- [DNS Record Types Explained](/blog/dns-record-types-explained) — What every DNS record type does
