---
title: "DNSSEC Rollover Gone Wrong: Lessons from High-Profile Failures"
author: "Exit1 Team"
date: "2026-01-23"
category: "domain-intelligence"
excerpt: "When NASA, Slack, and major TLDs got DNSSEC wrong, everyone noticed. Here's what happened and what we can learn."
readTime: "10 min read"
metaDescription: "Case studies of DNSSEC failures at NASA, Slack, Comcast, and major TLDs. Learn from high-profile incidents to avoid similar disasters with your DNSSEC deployment."
---

# DNSSEC Rollover Gone Wrong: Lessons from High-Profile Failures

DNSSEC is unforgiving. A small mistake in key rollover can take down domains for hours or days. It's happened to some of the most sophisticated organizations in the world.

These case studies show what goes wrong and why. Learn from their expensive mistakes.

## The NASA Outage (2012)

### What Happened

NASA's websites became unreachable for users with DNSSEC-validating resolvers. The outage lasted several hours.

### The Cause

During a routine DNSSEC key rollover:
1. NASA published new DNSKEY
2. Updated DS record at parent zone
3. Removed old DNSKEY too quickly
4. Cached DS records still pointed to old key
5. Chain of trust broken
6. SERVFAIL for validating resolvers

### The Timeline

- New keys published
- DS updated (but not propagated everywhere)
- Old keys removed
- Users with cached old DS couldn't validate new keys
- Outage begins
- Emergency rollback initiated
- Old keys restored
- Service gradually restored as caches updated

### Key Lesson

**Timing is critical.** You can't remove old keys until the new DS has propagated everywhere AND all cached copies of the old DS have expired.

Safe rollover requires:
- Publish new key
- Wait for TTL
- Update DS at parent
- Wait for DS propagation + TTL
- THEN remove old key

This takes weeks, not hours.

## The Slack DNS Incident (2021)

### What Happened

Slack experienced significant accessibility issues for users relying on DNSSEC validation.

### The Cause

During DNS infrastructure changes:
1. DNSSEC signatures became stale
2. Automated re-signing process failed
3. Signatures expired
4. Validating resolvers returned SERVFAIL
5. Mixed user experience (some could access, some couldn't)

### The Complexity

Slack uses complex DNS infrastructure:
- Multiple DNS providers
- Traffic management
- Geographic distribution
- Failover systems

One component's signing process failed, but not all queries went through that path. Result: intermittent, hard-to-diagnose failures.

### Key Lesson

**Complex infrastructure needs comprehensive monitoring.** When you have multiple DNS paths, you need to monitor DNSSEC status on all of them.

Also: **Automated signing can fail silently.** Just because you set up automation doesn't mean it's working.

## The Comcast DNSSEC Validation Issue (2015)

### What Happened

Comcast customers suddenly couldn't access many websites. The ISP's validating resolvers were returning SERVFAIL for a large number of domains.

### The Cause

This wasn't a rollover failure - it was a validation implementation bug:
1. Comcast enabled stricter DNSSEC validation
2. Many domains had subtle DNSSEC issues (previously ignored)
3. Stricter validation = sudden failures
4. Millions of customers affected

### The Domino Effect

Domains that "worked fine" suddenly broke because:
- Expired signatures (that non-validating resolvers ignored)
- Missing NSEC records
- Algorithm mismatches
- Clock skew issues

Comcast's resolvers started enforcing the spec strictly. Spec-violating domains stopped resolving.

### Key Lesson

**Your DNSSEC might be broken and you don't know it.** Non-validating resolvers hide problems. When a major ISP enables validation, suddenly your problems are visible.

Test with validating resolvers, not just your ISP's default.

## The .gov DNSSEC Incident (2014)

### What Happened

Multiple .gov domains became unreachable for DNSSEC-validating users.

### The Cause

The .gov registry had DNSSEC signing issues:
1. Scheduled key rollover began
2. Automation had a bug
3. Some domains weren't properly signed
4. Partial outage across .gov

When the registry itself has DNSSEC problems, all domains under it are affected.

### The Scope

- Affected federal government websites
- Taxpayer services
- Citizen information portals
- Government communications

### Key Lesson

**TLD-level failures affect everyone.** If you're depending on a TLD with DNSSEC enabled, you're depending on their operational competence.

Nothing you can do if the registry breaks. This is an accepted risk of DNSSEC.

## The Swedish TLD (.se) Incident (2009)

### What Happened

The entire .se TLD became unreachable from DNSSEC-validating resolvers. Every .se domain affected.

### The Cause

During routine DNSSEC operations:
1. New zone file was generated
2. File contained corruption
3. Zone was signed including corrupted data
4. DNSSEC signatures were valid (signed corrupted data correctly)
5. But NS records were wrong
6. Entire TLD resolution failed

### The Scope

- Every .se domain affected
- Millions of Swedish websites
- Swedish businesses, government, services
- Lasted several hours

### Key Lesson

**DNSSEC doesn't validate semantic correctness.** It proves data wasn't tampered with. It doesn't prove the data is right.

Garbage in, cryptographically-signed garbage out.

Zone validation must happen before signing, not after.

## The Root Key Rollover (2018)

### What Happened

ICANN performed the first-ever root zone KSK rollover - changing the ultimate trust anchor for all of DNSSEC.

### The Risk

If this went wrong:
- Every DNSSEC-enabled domain could become unreachable
- From validating resolvers worldwide
- Internet-wide impact

### The Preparation

ICANN spent years preparing:
- Multiple delays to assess readiness
- Extensive communication with operators
- Fallback procedures developed
- Monitoring infrastructure deployed

### The Result

The rollover succeeded with minimal issues:
- A few resolvers failed to update trust anchor
- Some minor outages reported
- Overall: success

### Key Lesson

**Operational excellence is possible for DNSSEC**, but requires:
- Extensive planning
- Clear communication
- Fallback procedures
- Patience (ICANN delayed multiple times to get it right)

## Common Patterns in DNSSEC Failures

Analyzing these incidents reveals patterns:

### Pattern 1: Timing Violations

Most common failure mode:
- Removing keys too early
- Not waiting for propagation
- Ignoring TTLs and caching

**Rule:** When in doubt, wait longer.

### Pattern 2: Automation Failures

Automated signing is great until:
- Cron job stops running
- Permissions change
- Disk fills up
- Process gets killed

**Rule:** Monitor your automation. Alert on signing failures.

### Pattern 3: Incomplete Testing

Testing with non-validating resolvers misses:
- Expired signatures
- Chain of trust issues
- Algorithm problems

**Rule:** Test with validating resolvers. Use DNSViz.

### Pattern 4: Coordination Gaps

Complex environments need coordination:
- Multiple DNS providers
- Registry and registrar
- Internal teams

**Rule:** Document dependencies. Communicate changes.

### Pattern 5: Cascading Failures

One DNSSEC issue leads to:
- Some users affected
- Difficult diagnosis (works for some, not others)
- Slow recognition of problem
- Extended outage

**Rule:** Have runbooks for partial outages.

## Preventing Rollover Disasters

### Before Rollover

1. **Verify current state is healthy**
   - All signatures valid
   - Chain of trust intact
   - No existing issues

2. **Document the plan**
   - Specific steps and timing
   - Who does what
   - Success criteria
   - Rollback procedure

3. **Communicate**
   - Internal teams aware
   - Monitoring enhanced
   - On-call briefed

### During Rollover

1. **Follow the timeline exactly**
   - Don't rush
   - Don't skip steps
   - Wait for propagation

2. **Monitor continuously**
   - Validation status
   - Error rates
   - User reports

3. **Have rollback ready**
   - Know exactly how to undo
   - Keep old keys available
   - Test rollback in staging if possible

### After Rollover

1. **Verify from multiple locations**
   - Different resolvers
   - Different ISPs
   - Different countries

2. **Monitor for delayed issues**
   - Cache expirations
   - Edge cases
   - Late reporters

3. **Document what happened**
   - Update runbooks
   - Share learnings
   - Improve for next time

## When to Abort

Signs you should stop and rollback:

- SERVFAIL from validating resolvers
- DNSViz showing chain of trust errors
- User reports of unreachable site
- Monitoring alerts for DNS failures
- Any unexpected behavior

**Better to rollback and try again than push through a broken rollover.**

## The Bottom Line

DNSSEC failures at major organizations prove that:
- DNSSEC is operationally complex
- Even experts make mistakes
- Timing and coordination are critical
- Monitoring is essential
- Rollback capability is mandatory

The organizations that recovered fastest had:
- Clear runbooks
- Good monitoring
- Quick escalation paths
- Pre-planned rollback procedures

Learn from their failures. Your rollover doesn't have to be a disaster.

---

## Recommended Reading

- [DNSSEC Explained](/blog/dnssec-explained-what-it-is-why-you-need-it) - Basics
- [Common DNSSEC Misconfigurations](/blog/dnssec-misconfigurations-detection-guide) - Detection
- [Is DNSSEC Worth It?](/blog/dnssec-worth-the-complexity-analysis) - Risk/benefit analysis
