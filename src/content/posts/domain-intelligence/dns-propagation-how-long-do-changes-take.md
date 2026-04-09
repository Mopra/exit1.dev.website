---
title: "DNS Propagation: Why Your Changes Take Time and How to Check"
author: "Morten Pradsgaard"
date: "2026-04-09"
category: "domain-intelligence"
excerpt: "Why DNS changes aren't instant, and how to check propagation."
readTime: "7 min read"
metaDescription: "Understand DNS propagation: why changes take time, how TTL and caching work, how to check propagation status, and tricks to speed it up. Free DNS lookup tools included."
---

# DNS Propagation: Why Your Changes Take Time and How to Check

*You updated your DNS record 10 minutes ago. Your colleague sees the new site. You still see the old one. Welcome to DNS propagation — the most common source of "it works on my machine" in infrastructure.*

DNS propagation is the time it takes for DNS changes to spread across the global network of resolvers and caches. It's not a mystery. It's not random. It's entirely determined by caching rules that you can understand and influence.

## What Is DNS Propagation?

When you change a DNS record (say, pointing `example.com` to a new IP), that change starts at your authoritative nameserver. But there are millions of DNS resolvers worldwide — ISPs, corporate networks, Google (8.8.8.8), Cloudflare (1.1.1.1) — and each one caches DNS responses to reduce load and improve speed.

Propagation is the process of all those caches expiring their old records and fetching the new ones.

**It's not a push.** Your nameserver doesn't notify resolvers. Each resolver independently decides when to re-query, based on the **TTL** (Time To Live) of the cached record.

## How TTL Controls Propagation

Every DNS record has a TTL value, measured in seconds. When a resolver caches a record, it stores the TTL alongside it. Once the TTL expires, the resolver discards the cached copy and queries the authoritative nameserver again.

**Example:**
```
example.com.    300    IN    A    93.184.216.34
```

The `300` means resolvers cache this for 5 minutes. After 5 minutes, they fetch a fresh copy. If you changed the IP address, they'll see the new one within 5 minutes.

**Common TTL values:**

| TTL | Duration | Typical Use |
|-----|----------|-------------|
| 60 | 1 minute | Pre-migration, fast failover |
| 300 | 5 minutes | Active records you might change |
| 3600 | 1 hour | Standard for most records |
| 86400 | 24 hours | Stable records (NS, rarely changed) |

**The key insight:** Propagation time is bounded by the **old** TTL, not the new one. If your A record had a TTL of 86400 (24 hours) when a resolver last cached it, that resolver won't check again for up to 24 hours — even if you just changed the TTL to 60.

This is why you **lower TTLs before making changes**, not during.

## How Long Does Propagation Actually Take?

| Scenario | Expected Time |
|----------|---------------|
| TTL was 300 (5 min) | 5-10 minutes |
| TTL was 3600 (1 hour) | Up to 1 hour |
| TTL was 86400 (24 hours) | Up to 24 hours |
| Changing nameservers (NS) | 24-48 hours (NS records have high TTLs at the registry level) |

**In practice, most changes propagate within the TTL.** The "up to 48 hours" warning you see everywhere is a worst case for nameserver changes at the registry level, not for typical A, MX, or TXT record changes.

Some resolvers are aggressive cachers and may hold records slightly past TTL expiry. Others may prefetch records before TTL expires. But as a rule: **TTL is your propagation ceiling.**

## How to Check Propagation Status

### Method 1: Query multiple resolvers

Use `dig` to check what different resolvers return:

```bash
# Google DNS
dig @8.8.8.8 example.com A +short

# Cloudflare DNS
dig @1.1.1.1 example.com A +short

# Quad9
dig @9.9.9.9 example.com A +short

# Your ISP (default resolver)
dig example.com A +short
```

If all four return the new IP, propagation is effectively complete for major resolvers.

### Method 2: Use our DNS Lookup Tool

Our [free DNS Lookup Tool](/tools/dns-checker) shows you what the server-side resolvers return. This gives you a neutral perspective independent of your local cache.

Enter your domain, check the A records (and any other records you changed), and confirm they show the new values.

### Method 3: Check the TTL countdown

```bash
dig example.com A
```

Look at the TTL value in the response. If you queried a caching resolver, the TTL counts down from the original value. A TTL of `147` on a record with a configured TTL of `300` means this resolver cached it `153 seconds ago` and will refresh in `147 seconds`.

### Method 4: Query the authoritative server directly

```bash
dig @ns1.your-dns-provider.com example.com A
```

This bypasses all caches and queries the source of truth. If this returns the new value, the change is live — resolvers will pick it up as their caches expire.

## How to Speed Up Propagation

### Before the change: Lower your TTL

**This is the single most important step.** 24-48 hours before your planned DNS change, lower the TTL on the records you're going to change:

```
# Before (24 hours before migration)
example.com.    300    IN    A    93.184.216.34

# Then make the change
example.com.    300    IN    A    198.51.100.1
```

With a 300-second TTL, propagation completes within 5-10 minutes. After the change is confirmed, you can raise the TTL back to 3600 or whatever your normal value is.

### Flush your local cache

If YOU can't see the change but others can, your local machine is caching the old record.

**macOS:**
```bash
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

**Windows:**
```bash
ipconfig /flushdns
```

**Chrome:** Visit `chrome://net-internals/#dns` and click "Clear host cache."

**Browser:** Hard refresh (Ctrl+Shift+R) or use incognito/private mode.

### Use a different resolver temporarily

Switch your DNS to a fresh resolver to avoid your ISP's cache:

- Google: `8.8.8.8` / `8.8.4.4`
- Cloudflare: `1.1.1.1` / `1.0.0.1`
- Quad9: `9.9.9.9`

## Common Propagation Issues

### "I changed it hours ago and I still see the old record"

1. **Check the old TTL.** If it was 86400, you might have to wait 24 hours.
2. **Flush your local cache.** Your OS and browser cache DNS independently.
3. **Check the authoritative server.** If `dig @your-ns.com example.com A` still shows the old value, the change hasn't been applied at the source. Check your DNS provider's dashboard.

### "Some people see the new site, others see the old one"

Normal during propagation. Different resolvers cached the record at different times. Everyone will converge once all caches expire.

### "I changed my nameservers and it's been 48 hours"

Nameserver changes propagate through the **registry** (the .com, .net, .org authority), not just your DNS provider. Registry NS TTLs are typically 48 hours. Check with your registrar that the nameserver change was actually submitted — registrar UIs sometimes require an extra confirmation step.

### "My email stopped working after a DNS change"

MX records might still be cached with old values. Check:
```bash
dig @8.8.8.8 example.com MX +short
```

Also verify your SPF record wasn't accidentally removed during the change. Our [DNS Lookup Tool](/tools/dns-checker) checks both MX and email security records in one shot.

## The Migration Checklist

When changing DNS (hosting migration, CDN switch, email provider change):

- [ ] **48 hours before:** Lower TTLs on affected records to 300 seconds
- [ ] **Verify TTL change propagated:** `dig example.com A` should show TTL ≤ 300
- [ ] **Make the DNS change**
- [ ] **Verify at authoritative NS:** `dig @your-ns.com example.com A +short`
- [ ] **Check multiple resolvers:** Google, Cloudflare, your ISP
- [ ] **Test the service:** Actually load the website, send a test email
- [ ] **Monitor for 24 hours:** Watch for issues as remaining caches expire
- [ ] **Raise TTLs back** to normal values (3600 or higher)

## Monitor DNS Changes Automatically

Manual propagation checks are fine for planned migrations. But what about unexpected changes?

DNS records can change without your knowledge — misclicks in a provider's dashboard, expired delegations, malicious modifications. exit1.dev is rolling out continuous DNS monitoring that watches your records 24/7 and alerts you when something changes.

Start with a [free DNS check](/tools/dns-checker) to baseline your current records.

## Recommended Resources

- [Free DNS Lookup Tool](/tools/dns-checker) — Check current DNS records for any domain
- [DNS Record Types Explained](/blog/dns-record-types-explained) — What every record type means
- [SPF, DKIM, and DMARC Guide](/blog/spf-dkim-dmarc-email-authentication-guide) — Email authentication setup
- [How to Check DNS Records](/blog/how-to-check-dns-records) — Three free lookup methods
- [Free Domain Expiration Checker](/tools/domain-expiration-checker) — Registration and WHOIS data
