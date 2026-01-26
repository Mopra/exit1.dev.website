---
title: "DNSSEC vs. DoH vs. DoT: Understanding Modern DNS Security Options"
author: "Exit1 Team"
date: "2026-01-30"
category: "domain-intelligence"
excerpt: "Three different DNS security technologies, three different threat models. Here's what each protects against and how they work together."
readTime: "9 min read"
metaDescription: "Compare DNSSEC, DNS-over-HTTPS (DoH), and DNS-over-TLS (DoT). Understand what each protects against, their limitations, and how they complement each other."
---

# DNSSEC vs. DoH vs. DoT: Understanding Modern DNS Security Options

DNS security isn't one thing - it's several technologies addressing different threats. DNSSEC, DoH, and DoT are often mentioned together, sometimes confused with each other.

They're complementary, not alternatives. Here's what each does, what it doesn't do, and how they work together.

## The Three Technologies

### DNSSEC (DNS Security Extensions)

**What it is:** Cryptographic signatures on DNS records

**Added in:** 1997 (spec), gradual adoption since

**Where it works:** Between authoritative servers and resolvers

### DNS-over-HTTPS (DoH)

**What it is:** DNS queries encrypted over HTTPS

**Added in:** 2018 (RFC 8484)

**Where it works:** Between client (your device) and resolver

### DNS-over-TLS (DoT)

**What it is:** DNS queries encrypted over TLS

**Added in:** 2016 (RFC 7858)

**Where it works:** Between client and resolver

## What Each Protects Against

### DNSSEC

**Protects against:**
- DNS cache poisoning
- DNS spoofing at resolver level
- Man-in-the-middle between authoritative and resolver
- Record tampering

**Does NOT protect against:**
- Eavesdropping on DNS queries
- Tracking which domains you visit
- Local interception (on your network)
- DDoS attacks on DNS

### DoH/DoT

**Protects against:**
- Eavesdropping on DNS queries
- Local network interception
- ISP DNS tracking
- Man-in-the-middle between you and resolver
- Some forms of censorship

**Does NOT protect against:**
- DNS spoofing (if not combined with DNSSEC)
- Malicious resolver
- Record tampering at authoritative level

## The Threat Model Differences

### DNSSEC's Threat Model

*"Someone might give me fake DNS answers"*

**The scenario:**
1. You query for bank.com
2. Resolver queries authoritative server
3. Attacker injects fake response
4. Without DNSSEC: You get attacker's IP, visit fake bank
5. With DNSSEC: Fake response has invalid signature, rejected

**Key point:** DNSSEC validates that the answer is authentic, not that the query is private.

### DoH/DoT's Threat Model

*"Someone might see what domains I'm looking up"*

**The scenario:**
1. You query for political-site.com
2. Your ISP sees the query (plain text DNS)
3. ISP logs it, sells data, or blocks it
4. Without DoH/DoT: ISP sees everything
5. With DoH/DoT: Query is encrypted, ISP sees nothing

**Key point:** DoH/DoT protects query privacy, not answer authenticity.

## How They Work Together

The complete picture:

```
Your Device
    |
    | DoH/DoT encrypts this path
    v
Resolver (8.8.8.8, 1.1.1.1, etc.)
    |
    | DNSSEC validates this path
    v
Authoritative Server (bank.com's nameserver)
```

**With all three:**
1. Your query is encrypted to the resolver (DoH/DoT)
2. Nobody on your local network sees the query
3. Resolver queries authoritative server
4. Response is signed with DNSSEC
5. Resolver validates signature
6. Resolver returns validated answer (still encrypted via DoH/DoT)
7. You get an authentic, private answer

## Technical Comparison

| Aspect | DNSSEC | DoH | DoT |
|--------|--------|-----|-----|
| Purpose | Authenticity | Privacy | Privacy |
| Port | 53 (UDP/TCP) | 443 (HTTPS) | 853 (TLS) |
| What's encrypted | Nothing | Query + response | Query + response |
| What's signed | Records | Nothing | Nothing |
| Validation at | Resolver | - | - |
| Encryption at | - | Client | Client |
| Deployment | Server-side | Client-side | Client-side |

## Implementation Details

### DNSSEC Implementation

**On your domain:**
1. Enable signing at DNS provider
2. Publish DS record at registrar
3. Zone now has RRSIG records

**For users:**
- Mostly invisible
- Resolvers validate automatically
- Failure = SERVFAIL, not insecure answer

### DoH Implementation

**On your device/browser:**
- Chrome: Settings > Privacy > Use secure DNS
- Firefox: Settings > Network > Enable DNS over HTTPS
- System-wide: Configure in OS network settings

**Common DoH providers:**
```
https://dns.google/dns-query
https://cloudflare-dns.com/dns-query
https://dns.quad9.net/dns-query
```

### DoT Implementation

**On your device:**
- Android 9+: Private DNS setting
- iOS: Configuration profiles
- Linux: systemd-resolved

**Common DoT servers:**
```
dns.google (8.8.8.8, 8.8.4.4)
one.one.one.one (1.1.1.1)
dns.quad9.net (9.9.9.9)
```

## When to Use What

### Use DNSSEC When

**You're a domain owner:**
- Your domain is valuable/targeted
- Compliance requires it
- You want defense in depth

**As a user:**
- Nothing to configure
- Use a validating resolver
- Benefits are automatic

### Use DoH When

**You're a user:**
- You're on untrusted networks
- You want to prevent ISP tracking
- You want to bypass simple DNS blocks
- Your browser supports it

### Use DoT When

**You're a user:**
- You want device-wide encrypted DNS
- Your network allows port 853
- You prefer system-level configuration

### Use All Three When

- Maximum security is required
- You control both domain (DNSSEC) and client (DoH/DoT)
- Defense in depth is the goal

## Limitations and Trade-offs

### DNSSEC Limitations

**Operational complexity:**
- Key management required
- Can cause outages if misconfigured
- Larger DNS responses

**Limited scope:**
- Only validates record authenticity
- Doesn't provide privacy
- Requires resolver to validate

### DoH Limitations

**Resolver trust:**
- You trust the DoH provider completely
- They see all your queries
- Shifts trust from ISP to resolver operator

**Not invisible:**
- Traffic goes to known DoH endpoints
- Network can block DoH providers
- Doesn't hide that you're doing DNS

**Application-specific:**
- Browser might use DoH
- Other apps might not
- Inconsistent protection

### DoT Limitations

**Blockable:**
- Uses dedicated port 853
- Easy for networks to block
- Less common than DoH

**Infrastructure support:**
- Fewer resolvers support it
- Less client software support
- Still emerging

## The Complementary Nature

None of these technologies is sufficient alone:

**DNSSEC alone:**
- Validates answers
- But queries are visible
- Local interception still possible

**DoH/DoT alone:**
- Encrypts queries
- But doesn't validate answers
- Malicious resolver could lie

**Together:**
- Queries are private (DoH/DoT)
- Answers are validated (DNSSEC)
- Multiple layers of protection

## Real-World Deployment

### For Domain Owners

**What you control:**
- DNSSEC on your domains

**What you can encourage:**
- Users use validating resolvers
- Documentation about DNS security

### For Application Developers

**What you control:**
- DoH/DoT for your app's DNS
- DNSSEC validation if doing DNS directly

**Best practice:**
- Use system DNS (user's choice)
- Or offer encrypted DNS option
- Document DNS dependencies

### For End Users

**What you control:**
- DoH/DoT on your devices
- Choice of resolver

**Best practice:**
- Enable DoH in browsers
- Use DoT system-wide
- Choose privacy-respecting resolver
- Benefits from DNSSEC automatically

### For Network Administrators

**What you control:**
- Internal DNS configuration
- DoT/DoH policies
- DNSSEC validation on resolvers

**Considerations:**
- DoH can bypass security monitoring
- May need to allow or block DoH/DoT
- Balance security vs. visibility

## Future: DANE and Beyond

DNSSEC enables future protocols:

### DANE (DNS-based Authentication of Named Entities)

Uses DNSSEC to publish TLS certificate info in DNS:
- Domain owner specifies expected certificate
- Clients can verify certificate matches
- Reduces reliance on certificate authorities

### SVCB/HTTPS Records

New record types that can include:
- Encryption hints
- Alternative endpoints
- Security parameters

Requires DNSSEC for security.

## The Bottom Line

| Technology | Provides | Requires |
|------------|----------|----------|
| DNSSEC | Answer authenticity | Domain owner to enable |
| DoH | Query privacy | User to enable |
| DoT | Query privacy | User to enable |

**They're not alternatives - they're layers:**

1. DNSSEC ensures the answer is real
2. DoH/DoT ensures the question is private
3. Together, DNS becomes significantly more secure

For maximum DNS security:
- **Domain owners:** Enable DNSSEC
- **Users:** Enable DoH or DoT
- **Everyone:** Use validating, privacy-respecting resolvers

DNS security isn't either/or. It's all of the above.

---

## Recommended Reading

- [DNSSEC Explained](/blog/dnssec-explained-what-it-is-why-you-need-it) - Fundamentals
- [Is DNSSEC Worth It?](/blog/dnssec-worth-the-complexity-analysis) - Decision guide
- [Domain Health Checklist](/blog/domain-health-checklist-comprehensive-guide) - Complete security
