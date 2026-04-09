---
title: "DNS Record Types Explained: A, AAAA, MX, CNAME, TXT, NS, SOA, CAA"
author: "Morten Pradsgaard"
date: "2026-03-12"
category: "domain-intelligence"
excerpt: "Every DNS record type, what it does, and when you need it."
readTime: "11 min read"
metaDescription: "Complete guide to DNS record types: A, AAAA, MX, CNAME, TXT, NS, SOA, and CAA. Learn what each record does, see real examples, and check your own DNS instantly."
---

# DNS Record Types Explained: A, AAAA, MX, CNAME, TXT, NS, SOA, CAA

*Your domain's DNS records are the instructions that tell the internet where to find your website, where to deliver your email, and who's allowed to issue your SSL certificates. Get them wrong, and things break silently.*

DNS has over 30 record types, but most domains only use 8-10. This guide covers the ones that actually matter — what they do, when you need them, and what happens when they're missing or misconfigured.

**Check your own records:** Use our [free DNS Lookup Tool](/tools/dns-checker) to see every record configured for your domain, with a health grade and email security analysis.

## Quick Reference

| Record | Purpose | Example |
|--------|---------|---------|
| A | Maps domain to IPv4 address | `93.184.216.34` |
| AAAA | Maps domain to IPv6 address | `2606:2800:21f:cb07::` |
| CNAME | Alias pointing to another domain | `www` → `example.com` |
| MX | Mail server routing | `10 mail.example.com` |
| TXT | Arbitrary text (SPF, DMARC, verification) | `v=spf1 include:_spf.google.com ~all` |
| NS | Authoritative nameservers | `ns1.cloudflare.com` |
| SOA | Zone authority and timing | Primary NS, serial, refresh intervals |
| CAA | Certificate authority restrictions | `0 issue "letsencrypt.org"` |

## A Record (Address)

The most fundamental DNS record. An A record maps your domain name to an IPv4 address — the 32-bit numeric address that servers actually use to communicate.

**Example:**
```
example.com.    300    IN    A    93.184.216.34
```

**When you need it:** Always. Every domain that serves a website or API needs at least one A record. Many domains have multiple A records for load balancing — DNS rotates between them (round-robin).

**The `300` is the TTL** (Time To Live) in seconds. It tells DNS resolvers how long to cache this record. 300 seconds = 5 minutes. Lower TTLs mean faster propagation when you change the record, but more DNS queries hitting your nameservers.

**Common mistake:** Setting an A record for the root domain (`example.com`) AND a CNAME. You can't have a CNAME at the apex alongside other records. Use an A record (or your provider's ALIAS/ANAME flattening) for the root, and CNAME only for subdomains.

## AAAA Record (IPv6 Address)

Same as an A record, but for IPv6. The name comes from the fact that IPv6 addresses are four times the size of IPv4 (128 bits vs 32 bits).

**Example:**
```
example.com.    300    IN    AAAA    2606:2800:21f:cb07:6820:80da:af6b:8b2c
```

**When you need it:** Increasingly important. Mobile carriers and large ISPs are moving to IPv6. If you only have A records, IPv6-only clients fall back to IPv4 (if they can) or fail entirely. Google, Cloudflare, and most CDNs serve AAAA records by default.

**Missing AAAA records** won't break your site today for most users, but it's a gap in your DNS health. Our [DNS Checker](/tools/dns-checker) flags this in the health grade.

## CNAME Record (Canonical Name)

A CNAME is an alias. Instead of mapping to an IP address, it points one domain name to another. The resolver follows the chain until it hits an A or AAAA record.

**Example:**
```
www.example.com.    3600    IN    CNAME    example.com.
blog.example.com.   3600    IN    CNAME    mysite.netlify.app.
```

**When you need it:** Subdomains that should resolve to a hosting provider's domain. `www` pointing to the root domain. `blog` pointing to a CMS. SaaS platforms that give you a CNAME target for custom domains.

**Critical rule:** A CNAME cannot coexist with other record types at the same name. You can't have a CNAME and an MX record on `example.com`. This is why CNAMEs are for subdomains, not the root domain. Some DNS providers offer "CNAME flattening" (Cloudflare calls it "Flattening", Route53 calls it "ALIAS") to work around this at the apex.

## MX Record (Mail Exchange)

MX records tell other mail servers where to deliver email for your domain. Each MX record has a **priority** (lower number = higher priority) and a **mail server hostname**.

**Example:**
```
example.com.    3600    IN    MX    10    mail1.example.com.
example.com.    3600    IN    MX    20    mail2.example.com.
```

**When you need it:** If your domain sends or receives email. Even if you use Gmail for Business, you need MX records pointing to Google's mail servers.

**No MX records = no email delivery.** Senders get a bounce. This is surprisingly common on domains that "only serve a website" — someone eventually tries to email `info@yourdomain.com` and it fails silently.

**Priority matters.** Mail servers try the lowest-numbered MX first. If `mail1` (priority 10) is down, they fall back to `mail2` (priority 20). Always configure at least two MX records for redundancy.

## TXT Record (Text)

A general-purpose record that holds arbitrary text. Originally designed for human-readable notes, TXT records now carry machine-readable data critical to email security and domain verification.

**Common uses:**

| Purpose | Example Value |
|---------|--------------|
| SPF (email auth) | `v=spf1 include:_spf.google.com ~all` |
| DMARC (email policy) | `v=DMARC1; p=reject; rua=mailto:dmarc@example.com` |
| DKIM (email signing) | `v=DKIM1; k=rsa; p=MIIBIjANBgk...` |
| Google site verification | `google-site-verification=abc123...` |
| Slack domain verification | `slack-domain-verification=xyz789` |

**When you need it:** Almost always. At minimum, you need an SPF record to prevent email spoofing. DMARC is increasingly expected — Gmail and Yahoo require it for bulk senders as of 2024.

**Deep dive:** See our full guide on [SPF, DKIM, and DMARC](/blog/spf-dkim-dmarc-email-authentication-guide) for setup instructions.

## NS Record (Nameserver)

NS records declare which nameservers are authoritative for your domain — the servers that hold the "source of truth" for all your other DNS records.

**Example:**
```
example.com.    86400    IN    NS    ns1.cloudflare.com.
example.com.    86400    IN    NS    ns2.cloudflare.com.
```

**When you need it:** Every domain has NS records. They're typically set at your registrar when you configure your nameservers (e.g., pointing to Cloudflare, Route53, or your hosting provider).

**Always have at least two nameservers.** If your only nameserver goes down, your entire domain becomes unresolvable — website, email, APIs, everything. Major DNS providers give you 2-4 nameservers across geographically distributed data centers.

**NS records have long TTLs** (often 24-48 hours) because nameserver changes are rare and high-impact. When migrating DNS providers, plan for a 24-48 hour propagation window. See our [DNS propagation guide](/blog/dns-propagation-how-long-do-changes-take) for timing strategies.

## SOA Record (Start of Authority)

The SOA record contains administrative information about the DNS zone. Every zone has exactly one SOA record.

**Example:**
```
example.com.    3600    IN    SOA    ns1.example.com. admin.example.com. (
                                     2024041001  ; Serial
                                     3600        ; Refresh (1 hour)
                                     900         ; Retry (15 min)
                                     604800      ; Expire (7 days)
                                     300         ; Minimum TTL (5 min)
                                     )
```

**What the fields mean:**

| Field | Purpose |
|-------|---------|
| Primary NS | The main nameserver for the zone |
| Admin email | Zone administrator contact (`.` replaces `@`) |
| Serial | Version number — must increment on every change |
| Refresh | How often secondaries check for updates |
| Retry | How often to retry if refresh fails |
| Expire | When secondaries discard the zone if primary is unreachable |
| Minimum TTL | Default TTL for negative caching (NXDOMAIN responses) |

**When you care about it:** SOA is managed automatically by most DNS providers. But the serial number is critical for zone transfers — if it doesn't increment when you make changes, secondary nameservers won't pick up updates. This is a common source of "I changed my DNS but nothing happened" bugs.

## CAA Record (Certificate Authority Authorization)

CAA records specify which Certificate Authorities (CAs) are allowed to issue SSL/TLS certificates for your domain. Without CAA records, **any CA in the world** can issue a certificate for your domain.

**Example:**
```
example.com.    3600    IN    CAA    0 issue "letsencrypt.org"
example.com.    3600    IN    CAA    0 issuewild "letsencrypt.org"
example.com.    3600    IN    CAA    0 iodef "mailto:security@example.com"
```

**Tags:**

| Tag | Purpose |
|-----|---------|
| `issue` | Which CAs can issue standard certificates |
| `issuewild` | Which CAs can issue wildcard certificates |
| `iodef` | Where to send violation reports |

**When you need it:** Every domain with an SSL certificate should have CAA records. It's a low-effort, high-impact security measure. If you use Let's Encrypt, set `issue "letsencrypt.org"` to prevent any other CA from issuing certs for your domain.

**The `0` is the critical flag.** If set to `128`, it tells CAs that they MUST understand this tag or refuse to issue. `0` means the tag is advisory.

## Less Common Record Types

A few others you might encounter:

- **SRV** — Service records. Used by protocols like SIP, XMPP, and Microsoft 365 to locate specific services. Format: `_service._proto.name TTL IN SRV priority weight port target`.
- **PTR** — Pointer records. The reverse of A/AAAA — maps an IP address back to a hostname. Used for reverse DNS lookups and email server validation.
- **NAPTR** — Name Authority Pointer. Used in VoIP and ENUM. Rarely relevant for web operations.
- **TLSA** — DANE (DNS-based Authentication of Named Entities). Pins TLS certificates in DNS. Requires DNSSEC.

## Check Your DNS Records

You don't need to memorize all of this. Use our [free DNS Lookup Tool](/tools/dns-checker) to check any domain's records instantly. It resolves all record types in parallel, analyzes your email security (SPF and DMARC), and grades your DNS health from A+ to F.

For ongoing visibility, exit1.dev offers continuous DNS monitoring that alerts you when records change unexpectedly — catching misconfigurations, expired delegations, and hijacking attempts before they affect your users.

## Common DNS Mistakes

1. **No SPF record.** Your domain can be spoofed by anyone. Add `v=spf1` to a TXT record.
2. **CNAME at the apex.** You can't put a CNAME on `example.com` if you also have MX or TXT records. Use A/AAAA or your provider's ALIAS feature.
3. **Single nameserver.** One NS going down takes your entire domain offline.
4. **No CAA records.** Any CA can issue certificates for your domain. Add at minimum an `issue` tag.
5. **TTL too high before migration.** Lower your TTLs to 300 seconds 24-48 hours before a DNS change. See our [propagation guide](/blog/dns-propagation-how-long-do-changes-take).
6. **MX records pointing to an IP.** MX records must point to a hostname, not an IP address. The hostname needs its own A record.

## Recommended Resources

- [Free DNS Lookup Tool](/tools/dns-checker) — Check all DNS records for any domain
- [SPF, DKIM, and DMARC Guide](/blog/spf-dkim-dmarc-email-authentication-guide) — Set up email authentication
- [DNS Propagation: Why Changes Take Time](/blog/dns-propagation-how-long-do-changes-take) — TTL, caching, and timing
- [How to Check DNS Records](/blog/how-to-check-dns-records) — Three free methods
- [Free Domain Expiration Checker](/tools/domain-expiration-checker) — Check WHOIS and registration data
- [Free SSL Certificate Checker](/tools/ssl-checker) — Check your certificate and TLS config
