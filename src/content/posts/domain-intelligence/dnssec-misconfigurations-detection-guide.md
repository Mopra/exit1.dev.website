---
title: "The Most Common DNSSEC Misconfigurations (And How to Detect Them)"
author: "Exit1 Team"
date: "2026-01-21"
category: "domain-intelligence"
excerpt: "DNSSEC is live but your site is unreachable. Here's what went wrong and how to find it."
readTime: "9 min read"
metaDescription: "Common DNSSEC failure modes including expired signatures, broken chains, DS record mismatches, and key rollover failures. Detection and resolution guide."
---

# The Most Common DNSSEC Misconfigurations (And How to Detect Them)

DNSSEC promises security. Misconfigured DNSSEC delivers outages.

When DNSSEC fails, validating resolvers return SERVFAIL. Users can't reach your site. Worse, not all users are affected - only those using validating resolvers - making diagnosis confusing.

Here are the most common DNSSEC failures, how to detect them, and how to fix them.

## Failure Mode #1: Expired Signatures

### What Happens

RRSIG records have expiration timestamps. When a signature expires:
- Record still exists
- Signature is technically present
- Validation fails because signature is expired
- SERVFAIL to validating resolvers

### Why It Happens

**Manual signing without refresh:**
- Signed the zone once
- Forgot to re-sign before expiration
- No automation in place

**Automation failure:**
- Signing cron job stopped running
- Server hosting signing process went down
- Permissions changed, signing fails silently

**Time synchronization:**
- Server clock significantly wrong
- Signatures created with wrong timestamp
- Appear expired immediately

### Detection

```bash
# Check signature dates
dig +dnssec example.com RRSIG

# Look for expiration field (5th number in RRSIG)
# Format: expiration inception keytag signer signature
# Example: 20250301000000 20250201000000 12345 example.com. ...

# If expiration date is in the past: Problem found
```

**Using DNSViz:**
1. Go to dnsviz.net
2. Enter your domain
3. Look for "signature expired" errors in red

### Resolution

**Immediate:**
1. Re-sign the zone with current timestamps
2. Reload zone on all authoritative servers
3. Verify signatures are fresh

**Permanent:**
1. Implement automated re-signing
2. Monitor signature expiration (alert at 7 days remaining)
3. Set up redundant signing processes

### Prevention

- **Automation:** Use inline signing or automated signing pipelines
- **Monitoring:** Alert before signatures expire, not after
- **NTP:** Ensure accurate time on signing servers

## Failure Mode #2: DS Record Mismatch

### What Happens

The DS record in the parent zone doesn't match any DNSKEY in your zone:
- Parent says "trust key with hash X"
- Your zone has key with hash Y
- Chain of trust breaks
- Validation fails

### Why It Happens

**Key rollover gone wrong:**
- Generated new KSK
- Published new DNSKEY
- Forgot to update DS at registrar
- Old DS doesn't match new key

**DS record entry error:**
- Manually entered DS at registrar
- Typo in the hash or key tag
- Wrong algorithm number

**Provider migration:**
- Moved to new DNS provider
- New provider generated new keys
- Didn't update DS record

**Registrar limitations:**
- Some registrars only accept certain DS formats
- Copied wrong format
- DS silently rejected or mangled

### Detection

```bash
# Get DS from parent zone
dig DS example.com @$(dig +short NS com.)

# Get DNSKEY from your zone
dig DNSKEY example.com @ns1.example.com

# Generate DS from DNSKEY
dnssec-dsfromkey -2 <(dig DNSKEY example.com +short | grep "257")

# Compare: DS in parent should match generated DS
```

**Symptoms:**
- SERVFAIL from validating resolvers
- Works from non-validating resolvers
- DNSViz shows "DS does not match DNSKEY"

### Resolution

**If old key still exists:**
1. Re-add correct DS for current KSK to registrar
2. Wait for propagation (up to 48 hours)
3. Verify chain of trust

**If old key was deleted:**
1. Generate current DS from current KSK
2. Update DS at registrar
3. Wait for propagation
4. Verify

**Emergency (disable DNSSEC):**
1. Remove all DS records from registrar
2. Wait for propagation
3. Site becomes reachable (unsigned)
4. Fix DNSSEC configuration
5. Re-enable

### Prevention

- **Automate DS updates** where possible
- **Verify DS matches** after any key change
- **Double-check** manual DS entries
- **Monitor chain of trust** continuously

## Failure Mode #3: Missing DNSKEY

### What Happens

DNSKEY record is missing or incomplete:
- DS record points to key that doesn't exist
- Or ZSK missing, so records can't be validated
- Or KSK missing, so DNSKEY can't be validated

### Why It Happens

**Incomplete zone publication:**
- Signed zone generated
- DNSKEY not included in published zone
- Zone file error

**Key accidentally deleted:**
- Thought key was old
- Removed from zone
- DS still points to it

**Replication failure:**
- Primary has DNSKEY
- Secondary didn't receive it
- Some queries fail

### Detection

```bash
# Query DNSKEY
dig DNSKEY example.com

# Should see:
# - At least one 256 flag (ZSK)
# - At least one 257 flag (KSK)

# If empty or missing expected keys: Problem found
```

### Resolution

1. Verify key files still exist
2. Regenerate keys if necessary
3. Re-sign zone with complete DNSKEY set
4. Publish zone
5. Verify DNSKEY queries return complete set
6. If KSK changed: Update DS at registrar

### Prevention

- **Verify zone contents** before publication
- **Monitor for DNSKEY** presence
- **Test from multiple locations**

## Failure Mode #4: Algorithm Mismatch

### What Happens

Algorithm in DS doesn't match algorithm in DNSKEY:
- DS says "key uses algorithm 8"
- DNSKEY says "I use algorithm 13"
- Resolver can't validate

Or: Resolver doesn't support the algorithm.

### Why It Happens

**Algorithm upgrade:**
- Changed from RSA to ECDSA
- Published new DNSKEY with new algorithm
- DS still references old algorithm

**Copy-paste error:**
- Copied wrong DS record
- Wrong algorithm number

**Legacy resolver:**
- Used newer algorithm (like Ed25519)
- Some resolvers don't support it yet

### Detection

```bash
# Get DS algorithm (3rd field)
dig DS example.com +short
# Output: 12345 13 2 A1B2C3D4...
# Algorithm is 13

# Get DNSKEY algorithm (3rd field in RDATA)
dig DNSKEY example.com +short
# Output: 257 3 13 ...
# Algorithm is 13

# Should match!
```

### Resolution

1. Generate DS using same algorithm as DNSKEY
2. Update DS at registrar
3. Wait for propagation
4. Verify

For algorithm support issues:
- Use widely-supported algorithm (8 or 13)
- Consider dual-signing during transition

### Prevention

- **Verify algorithm matches** before publishing DS
- **Use common algorithms** (RSA-SHA256, ECDSA-P256)
- **Test with multiple resolvers**

## Failure Mode #5: NSEC/NSEC3 Problems

### What Happens

Non-existence proofs are broken:
- Query for non-existent subdomain
- NSEC/NSEC3 records malformed or missing
- Validation fails

### Why It Happens

**Incomplete signing:**
- Zone signed but NSEC records not generated
- Signing tool misconfiguration

**Zone updates without re-signing:**
- Added new record
- Didn't re-sign zone
- NSEC chain broken

**NSEC3 parameter issues:**
- Wrong salt
- Iteration count too high (slow)
- Opt-out misconfiguration

### Detection

```bash
# Query for non-existent name
dig nonexistent.example.com

# Should get:
# - NSEC or NSEC3 record proving non-existence
# - RRSIG for the NSEC/NSEC3

# If SERVFAIL or missing NSEC: Problem
```

**DNSViz will show:**
- "NSEC chain incomplete"
- "Missing NSEC3 for name"
- "NSEC/NSEC3 signature invalid"

### Resolution

1. Re-sign zone with proper NSEC/NSEC3 generation
2. Verify NSEC chain is complete
3. Publish updated zone

### Prevention

- **Always re-sign** after zone changes
- **Use inline signing** for automatic updates
- **Verify NSEC chain** after signing

## Failure Mode #6: Clock Skew

### What Happens

Server time is wrong:
- Signatures have inception time in "future"
- Or signatures appear expired prematurely
- Validation fails

### Why It Happens

- NTP not configured
- NTP server unreachable
- VM clock drift
- Manual time change for "testing"

### Detection

```bash
# Check signature times
dig +dnssec example.com

# Compare inception/expiration to current time
# Inception should be in past
# Expiration should be in future

# Check server time
date -u
```

**Symptoms:**
- Intermittent validation failures
- Works from some resolvers, not others
- Signing server shows wrong time

### Resolution

1. Fix time on signing server
2. Re-sign zone with correct timestamps
3. Publish

### Prevention

- **NTP everywhere** - signing servers must have accurate time
- **Multiple NTP sources** - redundancy
- **Monitor time drift** - alert on skew > 1 minute

## Monitoring Checklist

Set up alerts for:

### Critical (Immediate Response)
- [ ] Signature expiration < 24 hours
- [ ] DS/DNSKEY mismatch detected
- [ ] SERVFAIL from validation tests
- [ ] Missing DNSKEY records

### Warning (Investigate Soon)
- [ ] Signature expiration < 7 days
- [ ] Key approaching rollover date
- [ ] Algorithm deprecation warnings

### Informational
- [ ] Successful key rollover completed
- [ ] Signature refreshed
- [ ] Validation tests passing

## Quick Diagnostic Commands

```bash
# Overall DNSSEC status
dig +dnssec example.com

# Trace validation chain
delv example.com

# Get all DNSSEC records
dig ANY example.com +dnssec

# Compare DS to DNSKEY
# (Parent DS)
dig DS example.com @a.gtld-servers.net
# (Your DNSKEY)
dig DNSKEY example.com @ns1.example.com

# Visual diagnostic
# Use https://dnsviz.net
```

## The Bottom Line

DNSSEC failures are usually one of:
1. Expired signatures (most common)
2. DS/DNSKEY mismatch (second most common)
3. Missing records
4. Algorithm issues
5. Time problems

The fix is almost always:
1. Identify the specific failure
2. Fix the configuration
3. Re-sign or update DS
4. Verify from multiple locations

Prevention is:
1. Automate everything
2. Monitor proactively
3. Test changes before production

DNSSEC done right is invisible. DNSSEC done wrong is an outage.

---

## Recommended Reading

- [DNSSEC Explained](/blog/dnssec-explained-what-it-is-why-you-need-it) - Basics
- [How DNSSEC Works](/blog/how-dnssec-works-keys-signatures-chain-of-trust) - Technical details
- [DNSSEC Rollover Failures](/blog/dnssec-rollover-failures-case-studies) - Learning from others
