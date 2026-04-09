---
title: "How to Check DNS Records for Any Domain (3 Free Methods)"
author: "Morten Pradsgaard"
date: "2026-03-17"
category: "domain-intelligence"
excerpt: "Three free ways to look up DNS records for any domain."
readTime: "8 min read"
metaDescription: "Learn how to check DNS records for any domain using free tools, command line, and Google DNS. Step-by-step guide with examples for A, MX, TXT, NS, and more."
---

# How to Check DNS Records for Any Domain (3 Free Methods)

*You changed a DNS record and your site went down. You migrated email providers and messages stopped arriving. You set up a new subdomain and it doesn't resolve. The first step in fixing all of these is the same: check your DNS records.*

DNS lookups aren't just for debugging. They're a routine part of domain management, email troubleshooting, security auditing, and migration planning. Here are three free methods — from the fastest (zero setup) to the most powerful (command line).

## Method 1: exit1.dev DNS Lookup Tool

**Best for:** Quick checks, email security auditing, DNS health overview.

Our [free DNS Lookup Tool](/tools/dns-checker) resolves all record types in one click and gives you a health grade.

**What you get:**
- **All record types** — A, AAAA, CNAME, MX, NS, TXT, SOA, and CAA
- **TTL values** — See how long each record is cached
- **Email security analysis** — SPF and DMARC detection with full record display
- **DNS health grade** — A+ through F based on completeness and security
- **Shareable URL** — Results are bookmarkable via URL parameters
- **Copy & download** — Export full report as text

**How to use it:**
1. Go to [exit1.dev/tools/dns-checker](/tools/dns-checker)
2. Enter any domain (e.g., `github.com`)
3. Click "Lookup DNS"

Results show in seconds. No signup, no rate limits.

**When to use this method:** When you want a comprehensive overview without touching a terminal. The health grade immediately tells you if something important is missing — no need to interpret raw records yourself.

## Method 2: Command Line (dig & nslookup)

**Best for:** Targeted queries, scripting, querying specific nameservers, advanced debugging.

Every developer should know `dig` (Linux/macOS) and `nslookup` (all platforms). They're already installed on most systems.

### Using dig

`dig` is the go-to DNS tool for sysadmins. It gives detailed, parseable output.

**Basic A record lookup:**
```bash
dig example.com A
```

**Query specific record types:**
```bash
dig example.com MX        # Mail servers
dig example.com TXT       # Text records (SPF, DMARC, etc.)
dig example.com NS        # Nameservers
dig example.com SOA       # Start of authority
dig example.com CAA       # Certificate authority restrictions
dig example.com AAAA      # IPv6 addresses
dig example.com ANY       # All records (often blocked by providers)
```

**Query a specific nameserver:**
```bash
dig @8.8.8.8 example.com A          # Query Google DNS
dig @1.1.1.1 example.com A          # Query Cloudflare DNS
dig @ns1.example.com example.com A  # Query authoritative directly
```

This is essential for [DNS propagation checking](/blog/dns-propagation-how-long-do-changes-take) — you can query different resolvers to see if they've picked up your changes.

**Show only the answer (short output):**
```bash
dig +short example.com A
# Output: 93.184.216.34
```

**Check DMARC:**
```bash
dig +short _dmarc.example.com TXT
```

**Trace the full resolution path:**
```bash
dig +trace example.com A
```

This follows the resolution chain from root servers → TLD servers → authoritative nameservers. Invaluable for debugging delegation issues.

### Using nslookup

`nslookup` is simpler than `dig` and available on Windows, macOS, and Linux.

```bash
nslookup example.com                    # Basic lookup
nslookup -type=MX example.com           # MX records
nslookup -type=TXT example.com          # TXT records
nslookup -type=NS example.com           # Nameservers
nslookup example.com 8.8.8.8            # Query specific server
```

**When to use command line:** When you need to query a specific nameserver, check propagation across multiple resolvers, automate lookups in scripts, or debug resolution chains. The command line gives you control that web tools can't match.

## Method 3: Google Public DNS Lookup

**Best for:** A quick web-based check against Google's global resolvers.

Google offers a free DNS lookup at [dns.google](https://dns.google). Enter a domain, select a record type, and see what Google's resolvers return.

**What you get:**
- Raw DNS response data
- DNSSEC validation status
- Response code (NOERROR, NXDOMAIN, SERVFAIL)
- TTL for each record

**Limitations:** You can only query one record type at a time. No health grading, no email security analysis, no copy/download. It's a raw resolver query — useful for confirming what Google sees, but not for a comprehensive audit.

**When to use this method:** When you specifically want to know what Google's DNS resolvers return. Useful after a DNS change to check if Google has picked up the update.

## What to Look For in DNS Results

### The basics

Every production domain should have:

| Check | Why |
|-------|-----|
| **A record exists** | Your domain resolves to an IP address |
| **Multiple NS records** | Redundancy — if one nameserver goes down, others serve |
| **MX records** (if email is used) | Email delivery requires MX records |
| **SPF record** | Prevents email spoofing |
| **DMARC record** | Enforces email authentication policy |

### Red flags

- **No A or AAAA record** — Domain doesn't resolve. Check your DNS provider.
- **CNAME on the root domain** with other records — Invalid. CNAME can't coexist with MX or TXT at the same name.
- **Single nameserver** — No redundancy. If it goes down, your entire domain is offline.
- **Missing SPF** — Anyone can send email as your domain. See our [SPF, DKIM, and DMARC guide](/blog/spf-dkim-dmarc-email-authentication-guide).
- **SPF with `+all`** — Allows literally anyone to send email for your domain. Should be `-all` or `~all`.
- **No CAA records** — Any certificate authority can issue certs for your domain.
- **High TTL before a migration** — If you're about to change DNS, lower TTLs to 300 first.

### Email-specific checks

If you're troubleshooting email delivery:

1. **Check MX records** — Do they point to the right mail servers?
2. **Check SPF** — Does the TXT record include all your sending services?
3. **Check DMARC** — Is there a `_dmarc.yourdomain.com` TXT record?
4. **Check DKIM** — Use `dig +short selector._domainkey.yourdomain.com TXT` (replace `selector` with your provider's DKIM selector)

## When to Check DNS Records

DNS isn't "set it and forget it." Check your records:

- **Before and after DNS changes** — Verify the change took effect
- **After migrating email providers** — Confirm MX, SPF, and DKIM are updated
- **After migrating hosting/CDN** — Confirm A records point to the new provider
- **When email delivery fails** — SPF/DMARC misconfiguration is the #1 cause
- **When SSL renewal fails** — CAA records might block your CA
- **During security audits** — Check for unauthorized changes or missing security records
- **Periodically** — DNS records can be changed accidentally. Regular checks catch drift.

## From One-Time Checks to Continuous Monitoring

Manual DNS checks are fine for troubleshooting. But for production domains, you want continuous monitoring.

exit1.dev is rolling out DNS monitoring that tracks your records around the clock. When a record changes — whether it's an accidental deletion, a misconfigured migration, or a hijacking attempt — you get an alert before your users are affected.

Start with a [free DNS check](/tools/dns-checker) to see where you stand today.

## Recommended Resources

- [Free DNS Lookup Tool](/tools/dns-checker) — Check all records for any domain
- [DNS Record Types Explained](/blog/dns-record-types-explained) — What every record type means
- [SPF, DKIM, and DMARC Guide](/blog/spf-dkim-dmarc-email-authentication-guide) — Set up email authentication
- [DNS Propagation Guide](/blog/dns-propagation-how-long-do-changes-take) — How long changes take and how to check
- [Free SSL Certificate Checker](/tools/ssl-checker) — Verify your certificate configuration
- [Free Domain Expiration Checker](/tools/domain-expiration-checker) — Check registration and WHOIS data
