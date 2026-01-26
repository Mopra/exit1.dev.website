---
title: "Monitoring DNSSEC: Why Set-and-Forget Doesn't Work"
author: "Exit1 Team"
date: "2026-01-26"
category: "domain-intelligence"
excerpt: "You enabled DNSSEC six months ago. Is it still working? Here's why ongoing monitoring is essential."
readTime: "7 min read"
metaDescription: "Learn why DNSSEC requires ongoing monitoring, what can go wrong after initial setup, and how to detect DNSSEC problems before they cause outages."
---

# Monitoring DNSSEC: Why Set-and-Forget Doesn't Work

You enabled DNSSEC. Keys generated. Zone signed. DS record published. Everything validated. Done, right?

Six months later, your signatures expire and your site goes dark.

DNSSEC is not a set-and-forget technology. It requires ongoing monitoring. Here's what can go wrong after initial setup and how to catch it before users do.

## What Changes After Initial Setup

### Signatures Expire

DNSSEC signatures have expiration dates, typically 1-4 weeks out:

```
example.com. RRSIG A 13 2 3600 (
    20250215000000  ; Expiration
    20250201000000  ; Inception
    12345 example.com.
    ...
)
```

**What should happen:** Automatic re-signing before expiration
**What can go wrong:** Automation fails silently

### Keys Need Rotation

Best practices require periodic key rotation:
- ZSK: Every 1-3 months
- KSK: Every 1-2 years

**What should happen:** Scheduled rollover with proper coordination
**What can go wrong:** Forgotten, rushed, or botched rollover

### Zone Changes Invalidate Signatures

When you add/remove/modify DNS records:

**What should happen:** Zone is re-signed automatically
**What can go wrong:** Changes published without re-signing

### Infrastructure Changes

Server migrations, provider changes, configuration updates:

**What should happen:** DNSSEC configuration migrates correctly
**What can go wrong:** Signing stops, keys lost, DS orphaned

## Failure Modes That Develop Over Time

### The Silent Automation Failure

Day 1: Automation works
Month 3: Cron job silently fails
Month 4: Signatures expire
Month 4: Outage

**Why it's insidious:**
- No immediate symptom
- Problem only appears at expiration
- Weeks of silent failure before impact

### The Forgotten Rotation

Initial setup: Keys generated
Year 1: "We should rotate those keys"
Year 2: "We really should rotate those keys"
Year 3: Key compromise? Who knows.

**Why it happens:**
- No immediate forcing function
- Other priorities
- Fear of breaking things
- Nobody owns it

### The Drift Problem

Day 1: Primary and secondary nameservers in sync
Month 6: Configuration drift
Month 7: One server serves unsigned responses
Month 8: Intermittent validation failures

**Why it's hard to catch:**
- Most queries work fine
- Only some paths are broken
- User reports are inconsistent

### The Provider Change

Before: Provider A handles signing
After: Migrate to Provider B
Forgotten: Update DS record for new keys

**Result:** DS points to old Provider A's key, zone has Provider B's key, validation fails.

## What to Monitor

### Signature Validity

**Check:**
- All record types have valid signatures
- Signatures are not expired
- Signatures are not expiring soon (< 7 days)

**Alert on:**
- Signature expiration < 7 days (warning)
- Signature expiration < 24 hours (critical)
- Signature already expired (emergency)

### Chain of Trust

**Check:**
- DS record exists at parent
- DS matches current KSK
- DNSKEY records present
- Chain validates from root

**Alert on:**
- DS/DNSKEY mismatch
- Missing DNSKEY
- Chain validation failure

### Key Status

**Check:**
- Both ZSK and KSK published
- Keys approaching rotation date
- Key algorithms still supported

**Alert on:**
- Missing key types
- Overdue rotation
- Algorithm deprecation warnings

### Resolution Success

**Check:**
- Queries succeed from validating resolvers
- Responses include DNSSEC records
- No SERVFAIL responses

**Alert on:**
- SERVFAIL from validation test
- Missing DNSSEC records in response
- Inconsistent results across locations

### NSEC/NSEC3 Health

**Check:**
- Non-existent domains return proper NSEC/NSEC3
- NSEC chain is complete
- No zone enumeration exposure (if using NSEC3)

**Alert on:**
- NSEC validation failures
- Broken NSEC chain

## Monitoring Approaches

### External Monitoring

Query your domain from outside your network:

**Benefits:**
- Tests what users actually experience
- Catches network-specific issues
- Independent from your infrastructure

**Implementation:**
- Scheduled validation tests
- Multiple geographic locations
- Different resolver types (validating/non-validating)

### Automated Validation Testing

Periodically run validation checks:

```bash
# Simple validation test
dig +dnssec example.com @8.8.8.8 | grep -q "RRSIG" && echo "OK" || echo "FAIL"

# Detailed validation
delv example.com @8.8.8.8

# Full chain analysis
# Use DNSViz API or similar
```

### Signature Expiration Tracking

Monitor days until signature expiration:

```bash
# Extract expiration from RRSIG
dig +short RRSIG example.com | head -1 | awk '{print $5}'

# Parse and calculate days remaining
# Alert if < threshold
```

### DS Record Monitoring

Check that DS at parent matches your DNSKEY:

```bash
# Get DS from parent
dig DS example.com @a.gtld-servers.net +short

# Get DNSKEY
dig DNSKEY example.com +short | grep "^257"

# Generate DS from DNSKEY
dnssec-dsfromkey -2 <(echo "$DNSKEY")

# Compare
```

## Alerting Strategy

### Tiered Alerts

**Information (FYI):**
- Key rotation due in 30 days
- Signature refresh completed
- Validation test passed

**Warning (investigate within 24 hours):**
- Signature expiration < 7 days
- Key rotation overdue
- Intermittent validation failures

**Critical (investigate immediately):**
- Signature expiration < 24 hours
- DS/DNSKEY mismatch detected
- SERVFAIL from validation tests

**Emergency (drop everything):**
- Signatures expired
- Chain of trust broken
- Widespread resolution failures

### Alert Routing

**DNSSEC alerts should go to:**
- DNS/infrastructure team
- On-call rotation
- Security team (for some alerts)

**Not just email:**
- PagerDuty/OpsGenie for critical
- Slack for warnings
- Dashboard for information

### Reducing Alert Fatigue

**Aggregate related alerts:**
- Multiple signature warnings = one alert
- Transient failures = aggregate before alerting

**Tune thresholds:**
- Start conservative
- Adjust based on experience
- Different thresholds for different domains

## Building a DNSSEC Monitoring Stack

### Option 1: Use Existing Tools

If you have DNS monitoring:
- Add DNSSEC-specific checks
- Monitor RRSIG validity
- Test validation periodically

**Tools with DNSSEC support:**
- Pingdom
- Datadog
- Exit1 Domain Intelligence
- Custom scripts

### Option 2: Dedicated DNSSEC Monitoring

**Commercial options:**
- DNSViz API
- ThousandEyes
- Catchpoint

**Open source:**
- dnsdiag tools
- OARC tools
- Custom Nagios/Zabbix plugins

### Option 3: Build Your Own

Minimum viable monitoring:

```python
#!/usr/bin/env python3
"""Basic DNSSEC health check"""

import dns.resolver
import dns.dnssec
from datetime import datetime, timedelta

def check_dnssec(domain):
    issues = []
    
    # Check for RRSIG
    try:
        answers = dns.resolver.resolve(domain, 'A', want_dnssec=True)
        # Check if RRSIG present in response
    except Exception as e:
        issues.append(f"Resolution failed: {e}")
    
    # Check signature expiration
    try:
        rrsig = dns.resolver.resolve(domain, 'RRSIG')
        for rr in rrsig:
            exp = rr.expiration
            remaining = exp - datetime.utcnow().timestamp()
            if remaining < 86400:  # Less than 1 day
                issues.append(f"Signature expires in {remaining/3600:.1f} hours")
    except Exception as e:
        issues.append(f"RRSIG check failed: {e}")
    
    return issues

# Run periodically, alert on issues
```

## The Operational Checklist

### Daily (Automated)

- [ ] Validation tests passing
- [ ] No SERVFAIL from validating resolvers
- [ ] Signatures not expiring within 24 hours

### Weekly (Review Dashboard)

- [ ] Signature expiration status
- [ ] Any warning-level alerts
- [ ] Signing automation status

### Monthly (Manual Check)

- [ ] Full DNSViz analysis
- [ ] Key rotation schedule review
- [ ] Zone consistency check (all nameservers)

### Quarterly (Audit)

- [ ] Key rotation due dates
- [ ] DS record accuracy
- [ ] Documentation current
- [ ] Runbooks tested

## When Monitoring Catches Problems

What to do when alerts fire:

### Signature Expiration Warning

1. Verify signing automation status
2. Check for recent errors
3. Trigger manual re-sign if needed
4. Fix automation root cause

### Validation Failure

1. Check from multiple locations
2. Run DNSViz analysis
3. Identify specific failure
4. Fix or rollback

### DS Mismatch

1. Verify current DNSKEY
2. Generate correct DS
3. Update at registrar
4. Verify propagation

## The Bottom Line

DNSSEC is a living system, not a one-time configuration:

- **Signatures expire** - need continuous re-signing
- **Keys need rotation** - need periodic rollover
- **Automation fails** - need monitoring
- **Configuration drifts** - need validation

Set-and-forget DNSSEC is a ticking time bomb. The question isn't whether something will break, but when - and whether you'll catch it before users do.

Monitor your DNSSEC. It's the only way to know it's working.

---

## Recommended Reading

- [Common DNSSEC Misconfigurations](/blog/dnssec-misconfigurations-detection-guide) - What to watch for
- [DNSSEC Rollover Failures](/blog/dnssec-rollover-failures-case-studies) - Learning from others
- [Is DNSSEC Worth It?](/blog/dnssec-worth-the-complexity-analysis) - Risk/benefit analysis
