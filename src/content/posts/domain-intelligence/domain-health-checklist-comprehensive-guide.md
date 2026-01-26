---
title: "Building a Domain Health Checklist: Expiry, SSL, DNS, and Beyond"
author: "Exit1 Team"
date: "2026-01-18"
category: "domain-intelligence"
excerpt: "A domain can fail in a dozen different ways. Here's the complete checklist for keeping your domains healthy."
readTime: "10 min read"
metaDescription: "Complete domain health checklist covering expiration, SSL certificates, DNS configuration, security settings, and monitoring. Everything that can go wrong and how to prevent it."
---

# Building a Domain Health Checklist: Expiry, SSL, DNS, and Beyond

Your domain is the foundation of your online presence. It can fail in more ways than most people realize.

This is the comprehensive checklist for domain health - every component that needs monitoring, every setting that needs verification, every failure mode you need to prevent.

## The Complete Domain Health Checklist

### 1. Domain Registration

#### Expiration Status
- [ ] Days until expiration known
- [ ] Expiration date documented
- [ ] Alerts set for 60, 30, 14, 7, 1 day
- [ ] Renewal process documented

#### Registrar Configuration
- [ ] Registrar account secured (strong password)
- [ ] 2FA enabled on registrar account
- [ ] Contact email valid and monitored
- [ ] Payment method current
- [ ] Auto-renewal enabled (or intentionally disabled)

#### Domain Locks
- [ ] `clientTransferProhibited` enabled
- [ ] `clientDeleteProhibited` enabled
- [ ] `clientUpdateProhibited` enabled (if not making changes)
- [ ] Registry lock considered for critical domains

### 2. DNS Configuration

#### Nameserver Health
- [ ] Nameservers responding
- [ ] All nameservers returning consistent data
- [ ] Nameserver response times acceptable
- [ ] Secondary DNS configured (for critical domains)

#### Record Accuracy
- [ ] A/AAAA records pointing to correct IPs
- [ ] MX records configured correctly
- [ ] CNAME records resolving properly
- [ ] TXT records present (SPF, DKIM, DMARC)

#### DNS Security
- [ ] DNSSEC enabled (if appropriate)
- [ ] DNSSEC signatures valid
- [ ] DNS provider has DDoS protection

#### Propagation
- [ ] Changes propagate correctly
- [ ] TTLs set appropriately
- [ ] No stale cached records

### 3. SSL/TLS Certificates

#### Certificate Validity
- [ ] Certificate not expired
- [ ] Days until expiration known
- [ ] Alerts set for expiration
- [ ] Renewal process documented/automated

#### Certificate Configuration
- [ ] Certificate covers all needed domains
- [ ] Wildcard coverage verified (if applicable)
- [ ] Certificate chain valid
- [ ] Intermediate certificates installed

#### Protocol Security
- [ ] TLS 1.2+ required
- [ ] Weak ciphers disabled
- [ ] Perfect forward secrecy enabled
- [ ] HSTS configured (if appropriate)

#### Certificate Monitoring
- [ ] External monitoring active
- [ ] All endpoints covered
- [ ] Chain validation included

### 4. Email Configuration

#### MX Records
- [ ] MX records present
- [ ] Priority values correct
- [ ] Mail servers responding

#### Authentication
- [ ] SPF record configured
- [ ] DKIM configured
- [ ] DMARC policy set
- [ ] Records validated (no syntax errors)

#### Deliverability
- [ ] Domain not on blacklists
- [ ] Reputation monitoring in place
- [ ] Bounce handling configured

### 5. Security Settings

#### Access Control
- [ ] Registrar account access reviewed
- [ ] Unnecessary users removed
- [ ] Access logs reviewed regularly

#### Monitoring
- [ ] Domain status changes monitored
- [ ] Nameserver changes alerted
- [ ] Contact info changes alerted
- [ ] Unexpected modifications trigger alerts

#### Recovery Preparedness
- [ ] Recovery procedures documented
- [ ] Emergency contacts identified
- [ ] Registrar support contact info available

### 6. Documentation

#### Inventory
- [ ] All domains documented
- [ ] Registrar for each domain known
- [ ] Expiration dates tracked
- [ ] Responsible parties assigned

#### Procedures
- [ ] Renewal process documented
- [ ] Transfer process documented
- [ ] Emergency response playbook exists
- [ ] Access recovery process documented

#### Contacts
- [ ] Registrar support contacts documented
- [ ] Internal escalation path defined
- [ ] Legal/trademark contacts identified

## Using This Checklist

When you go through this checklist for the first time, treat it as a comprehensive audit. Review every item, document the current state for each domain, identify gaps where your coverage falls short, prioritize fixes based on risk and effort, and create an action plan to close the gaps.

Most items on this checklist should be monitored automatically rather than checked manually. Expiration dates, SSL certificate status, DNS resolution, and security settings can all be tracked by monitoring systems that alert when something changes or approaches a threshold. Manual review should confirm that automated monitoring is working, not replace it.

Establish a review schedule that matches each item's risk profile. Weekly, do a quick dashboard check to confirm monitoring shows everything green. Monthly, verify that alerts are reaching the right people and that monitoring is covering all domains. Quarterly, work through the full checklist to catch configuration drift and newly introduced gaps. Annually, conduct a comprehensive audit that questions whether each domain is still needed and whether security posture has kept pace with threats.

## The Most Common Failures

Based on real incidents across thousands of organizations, certain failures appear far more often than others. Understanding these patterns helps you focus prevention efforts where they'll have the most impact.

### Expired Domains

Expired domains remain the most common serious failure. The pattern is depressingly consistent: a renewal email goes to an address nobody monitors, a credit card expires without anyone updating the payment method, or nobody has clear ownership of the domain so everyone assumes someone else will handle renewal. The domain quietly enters grace period, then redemption, then gets snapped up by speculators.

Prevention requires automated expiration monitoring independent of registrar emails, alerts through multiple channels including SMS for urgent warnings, and clear assignment of domain ownership so someone is explicitly responsible.

### Expired SSL Certificates

SSL certificate expiration causes outages almost as often as domain expiration, and the pattern is similar. Manual renewal processes get forgotten. Automated renewal systems fail silently. A certificate on a secondary endpoint gets overlooked because nobody remembers it exists.

Prevention means automated certificate monitoring for every endpoint, Let's Encrypt or similar automated issuance where possible, and documented backup renewal procedures for when automation fails.

### DNS Misconfigurations

DNS issues often stem from human error during changes. A typo in a record breaks resolution. An incomplete migration leaves records pointing to decommissioned infrastructure. Caching issues make problems intermittent and hard to diagnose.

Prevention requires a change validation process before DNS modifications go live, monitoring that verifies expected records resolve correctly, and staged rollouts for major changes that allow verification before full propagation.

### Email Deliverability Issues

Email problems creep up gradually. Missing or incorrect SPF and DKIM records cause messages to land in spam or get rejected outright. A compromised server sends spam and gets your domain blacklisted. Subtle configuration errors pass some validation but fail others.

Prevention involves regular validation of SPF, DKIM, and DMARC records, blacklist monitoring services that alert when your domain appears on blocklists, and regular deliverability testing to catch problems before they affect business communication.

### Security Compromises

Domain security failures often start with weak authentication. A reused password gets compromised in an unrelated breach. A phishing email tricks an administrator into revealing credentials. Social engineering convinces a registrar support representative to reset account access.

Prevention combines strong authentication including hardware 2FA, monitoring for status changes and configuration modifications, and alerts when anything unexpected happens to domain settings.

## Building Your Monitoring Stack

### Level 1: Basic Monitoring

For domains where the stakes are relatively low, basic monitoring covers the essentials at minimal cost. Monitor domain expiration so you don't lose the registration. Monitor SSL expiration so your site doesn't show security warnings. Check basic uptime so you know when the site is down. Exit1's free tier covers these needs, supplemented by periodic manual checks using tools like SSL Labs.

### Level 2: Standard Monitoring

For business-critical domains, add DNS resolution monitoring to catch configuration issues, certificate chain validation to identify problems before browsers do, and email authentication checking to maintain deliverability. Uptime monitoring services with SSL checks, DNS monitoring tools, and email deliverability testing services provide this coverage.

### Level 3: Comprehensive Monitoring

Critical domains warrant comprehensive monitoring that goes beyond basic health checks. Monitor domain status changes to catch unauthorized modifications. Alert on nameserver changes that might indicate hijacking attempts. Verify security configuration matches expectations. Test from multiple geographic locations to catch regional issues.

Domain Intelligence monitoring provides this level of visibility, combined with global uptime monitoring from multiple vantage points, regular security scanning, and automated alerting through multiple channels.

### Level 4: Enterprise Monitoring

Enterprise environments add compliance requirements and integration needs to the monitoring stack. Monitor for compliance with specific regulatory requirements. Maintain audit trails of all configuration changes. Integrate domain monitoring with security information and event management (SIEM) platforms. Consider 24/7 NOC coverage for immediate response to alerts at any hour.

## Checklist by Domain Type

Different domains warrant different levels of monitoring intensity.

Production websites serving customers need the full treatment: expiration monitoring, SSL monitoring, DNS monitoring, uptime monitoring, and all security locks enabled. A failure here directly affects revenue and reputation.

API endpoints require special attention to SSL monitoring because API failures often go unnoticed until customers complain. Certificate chain validation catches problems that browsers might bypass. Uptime monitoring should test from locations that match your actual customers. Response time monitoring helps identify degradation before it becomes an outage.

Email domains need MX record monitoring to ensure mail can be received, SPF/DKIM/DMARC validation to maintain deliverability, blacklist monitoring to catch reputation issues, and periodic deliverability testing to confirm messages actually reach recipients.

Marketing and landing page domains still need expiration and SSL monitoring at minimum, plus basic uptime checks. If the pages use redirects, verify those redirects continue working.

Internal tools often get overlooked, but internal outages disrupt work just as external ones disrupt customer experience. Apply the same expiration and SSL monitoring to internal domains, add internal DNS resolution monitoring, and track access patterns that might indicate compromise.

## Responding to Failures

When monitoring detects a failure, having documented response procedures saves precious time.

For domain expiration, first verify the current status in the registrar account. If the domain is still in the grace period, renew immediately and verify the renewal succeeded. If it's entered the redemption period, pay the redemption fee without delay - waiting accomplishes nothing except increasing the risk of losing the domain permanently. If the domain shows pending delete status, contact the registrar's emergency support line immediately. After recovery, document what went wrong with monitoring and fix the gap.

For SSL certificate expiration, verify the certificate status directly by checking what browsers actually see. Renew or issue a new certificate through whatever process applies to that domain. Install the new certificate across all servers that need it. Verify from multiple locations and browsers that the site shows a valid certificate. Document what failed in the renewal process and improve automation to prevent recurrence.

For DNS failures, verify the status from multiple geographic locations to confirm the issue and rule out local problems. Check nameserver health - are all nameservers responding? Verify record contents match what they should be. Either fix the configuration directly or escalate to your DNS provider if the issue is on their side. After resolution, consider adding DNS redundancy to prevent similar failures.

For security incidents, first verify the alert is real rather than a false positive. If confirmed, immediately lock down account access by changing credentials and verifying MFA. Assess what changed by comparing current configuration to documented baseline. Revert any unauthorized changes. Rotate all credentials associated with the domain. Conduct a full security audit to understand how compromise occurred and prevent recurrence.

## The Annual Audit Checklist

Once a year, step back from day-to-day monitoring and conduct a comprehensive review.

#### Inventory
- [ ] All domains accounted for
- [ ] No unknown domains in portfolio
- [ ] Unused domains identified for cleanup

#### Access
- [ ] All registrar accounts reviewed
- [ ] Access appropriate (no departed employees)
- [ ] Credentials rotated

#### Configuration
- [ ] All locks verified
- [ ] Auto-renewal status confirmed
- [ ] Payment methods current

#### Documentation
- [ ] Procedures current
- [ ] Contacts current
- [ ] Runbooks tested

#### Monitoring
- [ ] Alerts working
- [ ] Right people receiving alerts
- [ ] No monitoring gaps

## The Bottom Line

Domain health isn't one thing - it's dozens of components that all need to work together. Any single failure can take down your online presence.

This checklist covers everything that can go wrong. Work through it systematically, set up monitoring for everything that can be automated, and review regularly for everything that requires human judgment.

Your domains are critical infrastructure. Treat them that way.

---

## Recommended Reading

- [Why Domain Expiration is the Silent Killer](/blog/domain-expiration-silent-killer-websites) - The cost of failures
- [SSL Certificate Expiration](/blog/ssl-certificate-expiration-other-deadline) - Certificate monitoring
- [Domain Intelligence Feature](/domain-intelligence) - Automated monitoring
