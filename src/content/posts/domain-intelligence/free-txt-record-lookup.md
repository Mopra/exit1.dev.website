---
title: "Free TXT Record Lookup — Check TXT Records for Any Domain"
author: "Morten Pradsgaard"
date: "2026-04-04"
category: "domain-intelligence"
excerpt: "Look up TXT records to check SPF, verification, and more."
readTime: "5 min read"
metaDescription: "Free TXT record lookup tool. Check SPF, domain verification, DKIM, and other TXT records for any domain. See all text records instantly. No signup required."
---

# Free TXT Record Lookup — Check TXT Records for Any Domain

*TXT records are DNS's Swiss army knife. They carry email authentication (SPF, DKIM), domain verification tokens (Google, Slack, Microsoft), and custom metadata. A single domain can have dozens of them.*

**Check TXT records now:** Our [free DNS Lookup Tool](/tools/dns-checker) shows all TXT records in a collapsible section, with SPF and DMARC highlighted separately in the email security analysis.

## What Are TXT Records?

TXT (Text) records store arbitrary text strings in DNS. Originally designed for human-readable notes, they now carry machine-readable data critical for email security and service verification.

**Example TXT records for a typical domain:**
```
example.com.  IN  TXT  "v=spf1 include:_spf.google.com -all"
example.com.  IN  TXT  "google-site-verification=abc123xyz"
example.com.  IN  TXT  "MS=ms12345678"
example.com.  IN  TXT  "slack-domain-verification=xyz789"
```

Unlike most record types, a domain can have **many** TXT records. Each serves a different purpose, identified by its content prefix.

## How to Look Up TXT Records

### Method 1: DNS Lookup Tool

Enter any domain in our [DNS Lookup Tool](/tools/dns-checker). TXT records appear in a dedicated collapsible section showing every record. SPF is also highlighted in the email security section for quick reference.

### Method 2: Command line

```bash
# All TXT records
dig example.com TXT +short

# Filter for SPF
dig example.com TXT +short | grep spf

# Check DKIM (replace 'google' with your provider's selector)
dig google._domainkey.example.com TXT +short

# Check DMARC
dig _dmarc.example.com TXT +short
```

## Common TXT Record Types

### Email Authentication

| Prefix | Purpose | Example |
|--------|---------|---------|
| `v=spf1` | SPF — authorized mail senders | `v=spf1 include:_spf.google.com -all` |
| `v=DMARC1` | DMARC — email policy (at `_dmarc.` subdomain) | `v=DMARC1; p=reject; rua=mailto:...` |
| `v=DKIM1` | DKIM — email signing key (at `selector._domainkey.`) | `v=DKIM1; k=rsa; p=MIIBIj...` |

These three form the email authentication stack. Read our [complete SPF, DKIM, and DMARC guide](/blog/spf-dkim-dmarc-email-authentication-guide) for setup instructions.

### Domain Verification

Services use unique TXT records to verify you own a domain:

| Service | TXT Record Prefix |
|---------|------------------|
| Google Search Console | `google-site-verification=` |
| Microsoft 365 | `MS=` |
| Slack | `slack-domain-verification=` |
| Facebook | `facebook-domain-verification=` |
| Atlassian | `atlassian-domain-verification=` |
| Stripe | `stripe-verification=` |
| Postmark | `postmark-domain-verification=` |

These verification records are safe to leave in place permanently. Removing them might require re-verification later.

### Other TXT Records

- **DNSBL responses** — Anti-spam services use TXT records for blacklist status
- **CAA reporting** — `iodef` contact for CAA violations (often duplicated in CAA records)
- **Custom metadata** — Some organizations store internal identifiers or notes

## Troubleshooting TXT Record Issues

### SPF record not detected

Your TXT record might have a typo. SPF **must** start with exactly `v=spf1` (lowercase, no spaces before `v`). Common mistakes:
- `V=spf1` (uppercase V)
- `v=spf 1` (space before 1)
- Two separate SPF records (only one is allowed)

### Domain verification failing

The service can't find your TXT record. Possible causes:
1. **Propagation delay** — Wait 5-15 minutes after adding the record
2. **Wrong domain** — Some services verify the root domain, others verify a subdomain
3. **Wrapped in quotes** — Your DNS provider may add extra quotes around the value. Check the raw record.
4. **TTL caching** — The verification service's resolver has the old (empty) result cached

### Too many TXT records

DNS responses have a size limit (512 bytes for UDP, larger with EDNS). Domains with many TXT records can approach this limit, causing truncation or fallback to TCP. Clean up unused verification records from services you no longer use.

## Recommended Resources

- [Free DNS Lookup Tool](/tools/dns-checker) — Check all TXT records and email security
- [SPF, DKIM, and DMARC Guide](/blog/spf-dkim-dmarc-email-authentication-guide) — Email authentication setup
- [Free SPF Record Checker](/blog/free-spf-record-checker) — Verify your SPF configuration
- [Free DMARC Checker](/blog/free-dmarc-checker) — Check your DMARC policy
- [DNS Record Types Explained](/blog/dns-record-types-explained) — Complete reference
