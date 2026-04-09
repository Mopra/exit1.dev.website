---
title: "SPF, DKIM, and DMARC: Protect Your Domain from Email Spoofing"
author: "Morten Pradsgaard"
date: "2026-04-09"
category: "domain-intelligence"
excerpt: "Set up email authentication to stop spoofing and impersonation."
readTime: "9 min read"
metaDescription: "Learn how SPF, DKIM, and DMARC work together to protect your domain from email spoofing. Step-by-step setup guide with real examples and free checking tools."
---

# SPF, DKIM, and DMARC: Protect Your Domain from Email Spoofing

*Anyone can send an email claiming to be from your domain. Right now. Without your permission. Unless you've set up SPF, DKIM, and DMARC, there is nothing stopping them.*

Email spoofing isn't theoretical. Phishing attacks impersonating legitimate domains account for over 80% of reported security incidents. And since February 2024, Gmail and Yahoo require SPF and DMARC for anyone sending more than 5,000 emails per day. Fail to comply, and your emails go straight to spam — or get rejected entirely.

The fix is three DNS records. Here's how they work and how to set them up.

**Check yours now:** Our [free DNS Lookup Tool](/tools/dns-checker) checks your SPF and DMARC records and flags missing email authentication in the health grade.

## How Email Spoofing Works

Email was designed in the 1970s without authentication. The "From" address in an email is just a text field — the sending server can put anything it wants there. There's no built-in mechanism to verify that `invoice@yourcompany.com` was actually sent by your company.

SPF, DKIM, and DMARC fix this by adding verification layers through DNS:

| Layer | What It Checks | Record Type |
|-------|---------------|-------------|
| **SPF** | Is this server allowed to send email for this domain? | TXT on domain |
| **DKIM** | Was this email actually signed by the domain it claims? | TXT on subdomain |
| **DMARC** | What should receivers do with emails that fail SPF/DKIM? | TXT on `_dmarc.domain` |

They work together. SPF alone isn't enough. DKIM alone isn't enough. You need all three.

## SPF (Sender Policy Framework)

SPF tells receiving mail servers which IP addresses and servers are authorized to send email on behalf of your domain.

**How it works:**
1. You publish a TXT record listing your authorized senders
2. When someone receives an email "from" your domain, their server checks your SPF record
3. If the sending server's IP isn't listed, SPF fails

**Example SPF record:**
```
v=spf1 include:_spf.google.com include:sendgrid.net -all
```

**Breakdown:**
- `v=spf1` — This is an SPF record (required prefix)
- `include:_spf.google.com` — Allow Google Workspace to send
- `include:sendgrid.net` — Allow SendGrid to send
- `-all` — Reject everything else (hard fail)

**The `-all` vs `~all` decision:**
- `-all` (hard fail): Unauthorized servers are rejected. Strictest. Use this.
- `~all` (soft fail): Unauthorized servers are flagged but usually delivered. Use during testing only.
- `?all` (neutral): No policy. Pointless. Don't use.

**Common mistakes:**
- **Too many DNS lookups.** SPF is limited to 10 DNS lookups (includes `include:` and `redirect=`). Exceed this and SPF fails entirely. Consolidate includes or use an SPF flattening service.
- **Forgetting a sender.** If you use Mailchimp, SendGrid, your CRM, AND Google Workspace, all four need to be in your SPF record.
- **Multiple SPF records.** A domain must have exactly ONE SPF TXT record. Multiple records cause SPF to fail. Combine them into one.

## DKIM (DomainKeys Identified Mail)

DKIM adds a cryptographic signature to outgoing emails. The receiving server verifies the signature against a public key published in your DNS.

**How it works:**
1. Your mail server signs each outgoing email with a private key
2. The signature is added as a `DKIM-Signature` header
3. You publish the matching public key as a TXT record
4. The receiver checks the signature against your public key

**Example DKIM record:**
```
selector1._domainkey.example.com.  IN  TXT  "v=DKIM1; k=rsa; p=MIIBIjANBgkqh..."
```

The `selector1` is a label chosen by your email provider. Google uses `google`, SendGrid uses `s1` and `s2`, etc. Each provider has its own selector.

**Setting up DKIM:** Unlike SPF and DMARC, you don't write DKIM records manually. Your email provider generates the key pair and gives you the DNS record to publish. Follow your provider's setup guide:
- **Google Workspace:** Admin console → Apps → Google Workspace → Gmail → Authenticate email
- **Microsoft 365:** Defender portal → Email authentication → DKIM
- **SendGrid/Mailchimp/etc.:** Domain authentication in their dashboard

**Why DKIM matters beyond authentication:** DKIM signatures survive email forwarding. SPF breaks when an email is forwarded (because the forwarding server's IP isn't in your SPF record), but the DKIM signature stays intact. This is why you need both.

## DMARC (Domain-based Message Authentication, Reporting & Conformance)

DMARC ties SPF and DKIM together and tells receiving servers what to do when authentication fails. Without DMARC, SPF and DKIM failures are informational only — the receiver decides what to do, and usually delivers the email anyway.

**Example DMARC record:**
```
_dmarc.example.com.  IN  TXT  "v=DMARC1; p=reject; rua=mailto:dmarc-reports@example.com; pct=100"
```

**Breakdown:**
- `v=DMARC1` — This is a DMARC record
- `p=reject` — Reject emails that fail authentication
- `rua=mailto:...` — Send aggregate reports to this address
- `pct=100` — Apply policy to 100% of emails

**DMARC policies:**

| Policy | Action | When to Use |
|--------|--------|-------------|
| `p=none` | Monitor only, deliver everything | Initial setup — gather data |
| `p=quarantine` | Send failures to spam | After reviewing reports |
| `p=reject` | Block failures entirely | Full protection — the goal |

**The recommended rollout:**
1. **Start with `p=none`** and `rua` reporting. Run for 2-4 weeks.
2. **Review aggregate reports** to identify legitimate senders you missed in SPF/DKIM.
3. **Move to `p=quarantine`** once you're confident all legitimate sources pass.
4. **Move to `p=reject`** for full protection.

Skipping straight to `p=reject` without monitoring is risky — you might block legitimate emails from services you forgot to authorize.

## How They Work Together

Here's the flow when someone receives an email claiming to be from `you@example.com`:

```
1. Receiving server checks SPF
   → Is the sending IP in example.com's SPF record?

2. Receiving server checks DKIM
   → Does the DKIM signature match example.com's public key?

3. Receiving server checks DMARC
   → Does example.com have a DMARC policy?
   → Did SPF or DKIM pass AND align with the From domain?

4. DMARC verdict:
   → Both pass: Deliver normally
   → One passes: Usually deliver (depends on policy)
   → Both fail: Apply DMARC policy (none/quarantine/reject)
```

**Alignment is key.** DMARC requires that the domain in SPF or DKIM aligns with the "From" header domain. SPF passing for `bounce.sendgrid.net` doesn't help if the From address is `you@example.com` — the domains don't align. This is why DKIM is critical: it signs the message with your actual domain.

## Step-by-Step Setup

### 1. Audit your current state

Run your domain through our [DNS Lookup Tool](/tools/dns-checker). It checks for SPF and DMARC records and tells you exactly what's missing.

### 2. List every service that sends email as your domain

Common senders people forget:
- Email provider (Google Workspace, Microsoft 365)
- Transactional email (SendGrid, Postmark, SES)
- Marketing email (Mailchimp, HubSpot)
- CRM (Salesforce, HubSpot)
- Helpdesk (Zendesk, Intercom)
- Your application servers (password resets, notifications)

### 3. Create your SPF record

Combine all authorized senders into one TXT record:
```
v=spf1 include:_spf.google.com include:sendgrid.net include:mail.zendesk.com -all
```

Verify you're under 10 DNS lookups. Use an SPF validator tool to check.

### 4. Set up DKIM for each sender

Follow each provider's DKIM setup. They'll give you a TXT record to add to your DNS. You'll typically add 1-2 DKIM records per provider.

### 5. Publish a DMARC record

Start with monitoring:
```
v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com
```

Add this as a TXT record on `_dmarc.yourdomain.com`.

### 6. Monitor and tighten

Review DMARC aggregate reports for 2-4 weeks. Once you're confident all legitimate senders pass, progress through `quarantine` to `reject`.

## Check Your Email Security

Our [DNS Lookup Tool](/tools/dns-checker) gives you an instant assessment:
- **SPF:** Whether a valid SPF record exists and what it contains
- **DMARC:** Whether a DMARC policy is published at `_dmarc.yourdomain.com`
- **Grade impact:** Missing SPF or DMARC directly lowers your DNS health grade

For continuous monitoring, exit1.dev can alert you when your email authentication records change unexpectedly — preventing accidental deletions or modifications that could expose your domain to spoofing.

## Recommended Resources

- [Free DNS Lookup Tool](/tools/dns-checker) — Check your SPF and DMARC records instantly
- [DNS Record Types Explained](/blog/dns-record-types-explained) — Complete reference for all DNS records
- [How to Check DNS Records](/blog/how-to-check-dns-records) — Three free methods to inspect DNS
- [DNS Propagation Guide](/blog/dns-propagation-how-long-do-changes-take) — How long DNS changes take to go live
- [Free Domain Expiration Checker](/tools/domain-expiration-checker) — Check your domain's registration and WHOIS data
