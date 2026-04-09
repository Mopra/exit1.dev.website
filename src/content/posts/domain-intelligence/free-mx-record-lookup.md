---
title: "Free MX Record Lookup — Find Mail Servers for Any Domain"
author: "Morten Pradsgaard"
date: "2026-04-09"
category: "domain-intelligence"
excerpt: "Look up MX records to find any domain's mail servers."
readTime: "5 min read"
metaDescription: "Free MX record lookup tool. Find mail servers, check priority routing, and troubleshoot email delivery for any domain. No signup required."
---

# Free MX Record Lookup — Find Mail Servers for Any Domain

*Email not arriving? MX records are the first thing to check. They tell the internet where to deliver email for your domain — get them wrong and messages vanish silently.*

**Check MX records now:** Our [free DNS Lookup Tool](/tools/dns-checker) shows MX records with priorities, plus SPF and DMARC analysis, for any domain.

## What Are MX Records?

MX (Mail Exchange) records are DNS records that specify which servers handle email for a domain. Every MX record has two parts:

- **Priority** — A number (lower = preferred). Mail servers try the lowest-priority server first.
- **Mail server hostname** — The server that accepts email for the domain.

**Example MX records for a domain using Google Workspace:**
```
example.com.    3600    IN    MX    1     aspmx.l.google.com.
example.com.    3600    IN    MX    5     alt1.aspmx.l.google.com.
example.com.    3600    IN    MX    5     alt2.aspmx.l.google.com.
example.com.    3600    IN    MX    10    alt3.aspmx.l.google.com.
example.com.    3600    IN    MX    10    alt4.aspmx.l.google.com.
```

Priority 1 is tried first. If `aspmx.l.google.com` is unreachable, senders fall back to priority 5, then 10. This gives you redundancy — email keeps flowing even if one server is down.

## How to Look Up MX Records

### Method 1: DNS Lookup Tool (fastest)

Enter any domain in our [DNS Lookup Tool](/tools/dns-checker). MX records appear in the "Mail & Email Security" section with priorities sorted from highest to lowest preference. You'll also see whether SPF and DMARC are configured — critical for email deliverability.

### Method 2: Command line

```bash
# Using dig
dig example.com MX +short

# Output:
# 1 aspmx.l.google.com.
# 5 alt1.aspmx.l.google.com.
# 5 alt2.aspmx.l.google.com.

# Using nslookup
nslookup -type=MX example.com
```

## Common Email Providers and Their MX Records

| Provider | MX Records |
|----------|-----------|
| **Google Workspace** | `aspmx.l.google.com` (pri 1), `alt1-4.aspmx.l.google.com` |
| **Microsoft 365** | `*.mail.protection.outlook.com` |
| **Zoho Mail** | `mx.zoho.com`, `mx2.zoho.com`, `mx3.zoho.com` |
| **ProtonMail** | `mail.protonmail.ch`, `mailsec.protonmail.ch` |
| **iCloud Mail** | `mx1-6.mail.icloud.com` |

If your MX records don't match your email provider, that's your problem.

## Troubleshooting MX Issues

### No MX records found

Your domain can't receive email at all. Senders get a bounce. Fix: add MX records pointing to your email provider's servers.

### MX records point to the wrong server

Common after switching email providers. You changed to Google Workspace but your MX still points to your old host. Update the MX records and remove the old ones.

### MX record points to an IP address

MX records **must** point to a hostname, not an IP. `10 192.168.1.1` is invalid. The hostname must have its own A record that resolves to the IP.

### Email works but goes to spam

MX records are fine, but you're missing email authentication. Check your [SPF and DMARC records](/blog/spf-dkim-dmarc-email-authentication-guide) — our [DNS Lookup Tool](/tools/dns-checker) flags these in the email security section.

### Multiple MX records with the same priority

Valid and common. Senders pick randomly between equal-priority servers, distributing load. Google uses this with `alt1` and `alt2` both at priority 5.

## Why MX Records Matter Beyond Email

MX records reveal a lot about a domain's infrastructure:

- **Which email provider they use** — Google, Microsoft, or self-hosted
- **Whether they have redundancy** — Multiple MX records mean failover capability
- **Whether the domain accepts email at all** — No MX = no inbound email

Security researchers and pentesters routinely check MX records to understand a target's email setup. If you're auditing your own domain, start with a [full DNS check](/tools/dns-checker).

## Recommended Resources

- [Free DNS Lookup Tool](/tools/dns-checker) — Check MX records and email security for any domain
- [SPF, DKIM, and DMARC Guide](/blog/spf-dkim-dmarc-email-authentication-guide) — Complete email authentication setup
- [DNS Record Types Explained](/blog/dns-record-types-explained) — What every DNS record type does
- [How to Check DNS Records](/blog/how-to-check-dns-records) — Three free lookup methods
