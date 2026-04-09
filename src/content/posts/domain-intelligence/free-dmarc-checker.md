---
title: "Free DMARC Checker — Check Your Domain's Email Policy"
author: "Morten Pradsgaard"
date: "2026-04-09"
category: "domain-intelligence"
excerpt: "Check if your domain has a DMARC policy to prevent impersonation."
readTime: "5 min read"
metaDescription: "Free DMARC record checker. Verify your domain's DMARC policy, understand enforcement levels, and protect against email impersonation. No signup required."
---

# Free DMARC Checker — Check Your Domain's Email Policy

*DMARC tells receiving servers what to do when an email fails authentication — deliver it, quarantine it, or reject it. Without DMARC, that decision is entirely up to the receiver, and they usually deliver it. Including the phishing email pretending to be you.*

**Check your DMARC now:** Our [free DNS Lookup Tool](/tools/dns-checker) checks for DMARC at `_dmarc.yourdomain.com` and displays the full policy.

## What Is DMARC?

DMARC (Domain-based Message Authentication, Reporting & Conformance) is a TXT record published at `_dmarc.yourdomain.com`. It does two things:

1. **Tells receivers what to do** with emails that fail SPF and DKIM authentication
2. **Sends you reports** about who's sending email as your domain

**Example DMARC record:**
```
_dmarc.example.com.  IN  TXT  "v=DMARC1; p=reject; rua=mailto:dmarc@example.com; pct=100"
```

**Breakdown:**
- `v=DMARC1` — Identifies this as a DMARC record
- `p=reject` — Reject emails that fail authentication
- `rua=mailto:...` — Send aggregate reports here
- `pct=100` — Apply to 100% of emails

## How to Check Your DMARC Record

### Method 1: DNS Lookup Tool

Enter your domain in our [DNS Lookup Tool](/tools/dns-checker). The email security section checks `_dmarc.yourdomain.com` automatically and shows whether a DMARC record exists with its full value.

### Method 2: Command line

```bash
dig +short _dmarc.example.com TXT
# Output: "v=DMARC1; p=reject; rua=mailto:dmarc@example.com"
```

Note the `_dmarc.` prefix — DMARC records live at a specific subdomain, not on the root domain.

## DMARC Policy Levels

| Policy | What Happens | When to Use |
|--------|-------------|-------------|
| `p=none` | Nothing — emails are delivered regardless. Reports only. | Initial setup. Run for 2-4 weeks to gather data. |
| `p=quarantine` | Failing emails go to spam/junk folder. | After confirming legitimate senders pass auth. |
| `p=reject` | Failing emails are blocked entirely. | Full protection. The goal. |

**The recommended path:** `none` → `quarantine` → `reject`. Jumping straight to `reject` without monitoring risks blocking legitimate emails from services you forgot to authorize in SPF/DKIM.

## Common DMARC Issues

### No DMARC record at all

The most common problem. Without DMARC, SPF and DKIM failures are informational — receivers decide what to do on their own, and most deliver the email anyway. Your domain has no protection against impersonation.

**Fix:** Start with a monitoring-only policy:
```
v=DMARC1; p=none; rua=mailto:dmarc-reports@yourdomain.com
```

### DMARC stuck on `p=none`

`p=none` provides zero protection. It only collects reports. Many domains set `p=none` during initial setup and never progress. Review your aggregate reports, confirm all legitimate senders pass SPF or DKIM, then move to `quarantine` and eventually `reject`.

### No `rua` tag (no reporting)

DMARC without `rua` is blind enforcement. You won't know which emails are failing or why. Always include a `rua` address to receive aggregate reports. Free DMARC report analyzers can parse the XML reports into readable dashboards.

### DMARC record on the wrong subdomain

DMARC must be a TXT record at `_dmarc.yourdomain.com`, not on the root domain. A TXT record containing `v=DMARC1` on `yourdomain.com` is just another TXT record — it won't be recognized as DMARC.

### Alignment failures

DMARC requires **alignment** — the domain in SPF or DKIM must match the "From" header domain. SPF passing for `bounce.sendgrid.net` doesn't satisfy DMARC if the From address is `you@yourdomain.com`. This is why DKIM (which signs with your actual domain) is critical for DMARC alignment.

## DMARC + SPF + DKIM = Complete Protection

DMARC is the enforcement layer. SPF and DKIM are the authentication mechanisms. You need all three:

- **SPF** verifies the sending server is authorized
- **DKIM** cryptographically signs the email content
- **DMARC** tells receivers what to do when both fail

Read our [complete email authentication guide](/blog/spf-dkim-dmarc-email-authentication-guide) for step-by-step setup of all three.

## Recommended Resources

- [Free DNS Lookup Tool](/tools/dns-checker) — Check DMARC, SPF, and all DNS records
- [SPF, DKIM, and DMARC Guide](/blog/spf-dkim-dmarc-email-authentication-guide) — Full setup walkthrough
- [Free SPF Record Checker](/blog/free-spf-record-checker) — Verify your SPF configuration
- [Free MX Record Lookup](/blog/free-mx-record-lookup) — Check your mail server setup
- [DNS Record Types Explained](/blog/dns-record-types-explained) — Complete DNS reference
