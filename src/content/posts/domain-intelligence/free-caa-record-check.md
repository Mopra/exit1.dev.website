---
title: "Free CAA Record Check — Verify Certificate Authority Restrictions"
author: "Morten Pradsgaard"
date: "2026-04-09"
category: "domain-intelligence"
excerpt: "Check CAA records to see which CAs can issue SSL certificates."
readTime: "5 min read"
metaDescription: "Free CAA record checker. See which certificate authorities can issue SSL certificates for any domain. Improve your security posture. No signup required."
---

# Free CAA Record Check — Verify Certificate Authority Restrictions

*Without CAA records, any of the hundreds of certificate authorities worldwide can issue an SSL certificate for your domain. That includes CAs you've never heard of, in countries you don't operate in. CAA records fix this with one simple DNS entry.*

**Check CAA records now:** Our [free DNS Lookup Tool](/tools/dns-checker) shows CAA records with tags and values, and flags missing CAA in the DNS health grade.

## What Are CAA Records?

CAA (Certificate Authority Authorization) records specify which Certificate Authorities (CAs) are allowed to issue SSL/TLS certificates for your domain. CAs are required to check CAA records before issuing — if your CAA record doesn't authorize them, they must refuse.

**Example:**
```
example.com.  IN  CAA  0 issue "letsencrypt.org"
example.com.  IN  CAA  0 issuewild "letsencrypt.org"
example.com.  IN  CAA  0 iodef "mailto:security@example.com"
```

This says: only Let's Encrypt can issue certificates (standard and wildcard), and send violation reports to `security@example.com`.

## How to Check CAA Records

### Method 1: DNS Lookup Tool

Enter any domain in our [DNS Lookup Tool](/tools/dns-checker). CAA records appear in their own collapsible section with tags (`issue`, `issuewild`, `iodef`) and values clearly displayed. If no CAA records exist, the grade details flag it as an issue.

### Method 2: Command line

```bash
dig example.com CAA +short
# Output:
# 0 issue "letsencrypt.org"
# 0 issuewild "letsencrypt.org"
# 0 iodef "mailto:security@example.com"
```

## CAA Record Tags

| Tag | Purpose | Example |
|-----|---------|---------|
| `issue` | Which CAs can issue standard (non-wildcard) certificates | `0 issue "letsencrypt.org"` |
| `issuewild` | Which CAs can issue wildcard certificates (`*.example.com`) | `0 issuewild "letsencrypt.org"` |
| `iodef` | Where to send violation reports when a CA refuses issuance | `0 iodef "mailto:security@example.com"` |

**The `0` flag** is the "critical" flag. `0` means advisory — unknown tags are ignored. `128` means critical — CAs must understand the tag or refuse to issue entirely.

## Common CA Identifiers

| Certificate Authority | CAA Identifier |
|----------------------|---------------|
| Let's Encrypt | `letsencrypt.org` |
| DigiCert | `digicert.com` |
| Sectigo (Comodo) | `sectigo.com` |
| Google Trust Services | `pki.goog` |
| Amazon (ACM) | `amazon.com` or `amazontrust.com` |
| Cloudflare | `cloudflare.com` (via DigiCert/Let's Encrypt) |
| ZeroSSL | `sectigo.com` |

**If you use Cloudflare for SSL**, you may need both `digicert.com` and `letsencrypt.org` in your CAA, depending on your Cloudflare SSL settings.

## Setting Up CAA Records

### Step 1: Identify your CA

Check your current SSL certificate to see who issued it. Our [SSL Certificate Checker](/tools/ssl-checker) shows the issuer.

### Step 2: Add CAA records

For a domain using Let's Encrypt:
```
example.com.  CAA  0 issue "letsencrypt.org"
example.com.  CAA  0 issuewild "letsencrypt.org"
```

For a domain using both Let's Encrypt and DigiCert:
```
example.com.  CAA  0 issue "letsencrypt.org"
example.com.  CAA  0 issue "digicert.com"
example.com.  CAA  0 issuewild "letsencrypt.org"
```

Multiple `issue` records allow multiple CAs. If you only want one CA, use a single `issue` record.

### Step 3: Add reporting (optional but recommended)

```
example.com.  CAA  0 iodef "mailto:security@example.com"
```

You'll receive notifications when a CA refuses to issue a certificate for your domain due to CAA restrictions. This alerts you to unauthorized issuance attempts.

## Why CAA Records Matter

### Preventing unauthorized certificates

In 2011, a CA issued fraudulent certificates for `*.google.com`, enabling man-in-the-middle attacks. CAA records (made mandatory for CAs to check in 2017) prevent this by explicitly listing which CAs you authorize.

### Compliance and audit requirements

Many security frameworks (SOC 2, ISO 27001) recommend or require CAA records as part of certificate management. It's a checkbox on most security audits.

### Defense in depth

CAA is one layer in your certificate security:
- **CAA records** restrict who can issue
- **Certificate Transparency logs** let you detect issuance
- **HSTS** prevents downgrade attacks
- **TLSA/DANE** pins specific certificates (requires DNSSEC)

## Troubleshooting CAA Issues

### SSL certificate renewal failing

Your CA can't renew because your CAA record doesn't authorize them. Check your CAA records and add the CA that manages your certificates.

### "CAA record prevents issuance" error

The CA checked your CAA records and isn't listed. Either add the CA to your CAA records or switch to a CA you've already authorized.

### No CAA records but SSL works fine

CAA is optional — absence means "any CA can issue." Your SSL works, but you have no restrictions on who can issue certificates for your domain. Adding CAA records is a quick, high-impact security win.

## Recommended Resources

- [Free DNS Lookup Tool](/tools/dns-checker) — Check CAA records and DNS health
- [Free SSL Certificate Checker](/tools/ssl-checker) — See who issued your certificate
- [DNS Record Types Explained](/blog/dns-record-types-explained) — Complete DNS reference
- [How to Check DNS Records](/blog/how-to-check-dns-records) — Three free lookup methods
- [Free Domain Expiration Checker](/tools/domain-expiration-checker) — Check registration and WHOIS data
