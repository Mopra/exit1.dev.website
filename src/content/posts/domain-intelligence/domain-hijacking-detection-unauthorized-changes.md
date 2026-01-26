---
title: "Domain Hijacking: How to Detect Unauthorized Changes Before It's Too Late"
author: "Exit1 Team"
date: "2026-01-09"
category: "domain-intelligence"
excerpt: "Your domain's lastUpdated timestamp just changed. Was it you? Here's how to catch hijacking attempts early."
readTime: "8 min read"
metaDescription: "Learn how to detect domain hijacking through monitoring nameserver changes, lastUpdated timestamps, and transfer status. Catch unauthorized modifications early."
---

# Domain Hijacking: How to Detect Unauthorized Changes Before It's Too Late

Domain hijacking doesn't start with your website going dark. It starts with small changes - a nameserver modification, a status flag removal, an unexpected update timestamp.

By the time traffic redirects to a phishing page, it's already too late. The attackers have control. Your customers are compromised. Your reputation is damaged.

The key to stopping domain hijacking is catching unauthorized changes before they become catastrophic.

## How Domain Hijacking Works

Domain hijacking follows predictable patterns. Understanding them helps you detect attacks in progress.

### The Registrar Account Compromise

The most common attack vector begins with an attacker gaining access to your registrar account, usually through phishing, credential stuffing, or social engineering support staff. Once inside, they change the email address on file to one they control, ensuring future notifications and password resets go to them instead of you. Then they disable the transfer lock, initiate a transfer to a registrar they control, and wait. The transfer process takes five to seven days, giving you a narrow window to detect and stop it. If you miss that window, your domain belongs to them.

### The DNS Redirect

This attack is faster and stealthier than transfer hijacking. After gaining registrar access, the attacker changes your nameservers to servers they control. Your domain now points wherever they want it - typically a phishing page designed to harvest your customers' credentials, or a malware distribution site. Because DNS changes propagate based on TTL settings, this attack can affect visitors worldwide within minutes or hours. By the time you notice something's wrong, your customers have already been exposed.

### The Insider Threat

More subtle attacks come from within. A disgruntled employee with domain access might make small changes over time, positioning for a larger attack or preparing to sell access. Sometimes they simply lock out legitimate administrators as revenge. These attacks are harder to detect because changes happen gradually and may appear to be routine administrative activity.

### The Registrar Breach

Rare but devastating, registrar-level breaches affect multiple customers simultaneously. When attackers compromise the registrar's own systems, they can modify domain records without any activity showing up in your account. You receive no notification because, from your perspective, nothing happened. These breaches make external monitoring essential - you can't rely on the compromised system to alert you about its own compromise.

## The Signals That Indicate Hijacking

Each type of attack creates detectable signals. Knowing what to watch provides your best chance of catching an attack in progress.

### Nameserver Changes

Any modification to NS records warrants immediate attention. Normal nameserver changes happen when you're migrating DNS providers or adding secondary DNS for redundancy - in both cases, you initiated the change and know it's coming. Suspicious changes happen without anyone on your team being responsible. Nameservers suddenly point to unknown providers. Changes occur outside business hours or during holidays when attention is minimal.

Monitoring should alert instantly when nameservers change. The alert should show both the previous and current configuration so you can immediately assess whether the change is legitimate.

### LastUpdated Timestamp

Every domain record includes a timestamp showing when it was last modified. This field updates whenever contact information changes, nameservers are modified, status flags are added or removed, registrar transfers occur, or any administrative change is made.

If this timestamp changes and nobody on your team did anything, someone else did. Monitoring this field catches modifications you wouldn't otherwise notice until their effects became visible.

### Status Flag Changes

Domains have protection flags that prevent unauthorized changes. The `clientTransferProhibited` flag prevents transfers without explicit approval. The `clientUpdateProhibited` flag prevents record changes. The `clientDeleteProhibited` flag prevents deletion.

Removing these flags is often the first step in a hijacking attack. The attacker needs to disable protections before they can transfer or modify the domain. If protection flags disappear without your knowledge, an attack may already be in progress.

Normal flag removal happens when you're legitimately transferring registrars or making administrative changes. Suspicious removal happens without corresponding action on your part, especially if multiple protection flags disappear simultaneously.

### Registrant Contact Changes

Attackers often change the email address associated with a domain as an early step in taking control. Once they control the contact email, password resets and transfer confirmations go to them. Changing the registrant name can affect ownership claims if disputes arise later.

Watch for any contact change you didn't initiate, especially changes to free email providers like Gmail or Outlook, or subtle modifications to organization names that might not immediately look wrong.

### Transfer Status

When a domain enters `pendingTransfer` status, you have five to seven days to stop an unauthorized transfer. Most registrars send transfer notifications, but these can be missed due to spam filters or email address problems. External monitoring that detects transfer status changes provides independent confirmation that something needs immediate attention.

## Building a Detection System

Catching hijacking attempts requires active monitoring, not periodic manual checks that happen too late.

Start by establishing a baseline for each domain. Document the expected nameservers, expected status flags, expected registrar, and expected contacts. Store this baseline somewhere accessible so you can quickly compare against current state when alerts fire. Any deviation from baseline triggers investigation.

Configure monitoring to alert on changes to critical fields. Nameserver changes require immediate alerts regardless of time of day. Status flag changes, especially removal of protection flags, need prompt notification. Unexpected modifications to the lastUpdated timestamp indicate something changed even if you don't know what. Registrar changes indicate transfers that may or may not be legitimate. Even expiration date changes deserve attention - the date moving backward shouldn't happen and might indicate tampering.

Scale check frequency based on domain criticality. Your primary business domain should be checked every four to six hours with immediate SMS alerts for any change and multiple team members notified. Important secondary domains can be checked every twelve to twenty-four hours with email and Slack alerts. Standard domains can be checked daily with email alerts and regular review.

For hijacking detection, alerts must reach the right people immediately. SMS is appropriate for critical domains because someone may need to wake up and respond. A phone tree with automated escalation handles after-hours incidents. Team chat channels provide visibility across the organization. Email creates a documentation trail for post-incident review.

## Response Playbook

When alerts fire, having a plan means the difference between stopping an attack and becoming a victim.

Within fifteen minutes of an alert, verify whether the change was authorized. If anyone on your team made the modification, you can stand down. If not, contact your registrar's emergency line immediately. Lock the account if you still have access, and begin documenting everything - you may need records later for legal or law enforcement purposes.

Within one hour, assess the scope of what changed. If possible, revert unauthorized changes before they propagate further. Rotate all registrar credentials and enable additional authentication. If the breach appears serious, contact law enforcement.

Within twenty-four hours, conduct a full security audit to understand how access was compromised. If customer data may have been exposed, begin notification procedures. Implement additional monitoring to catch any residual attacker access. Hold a post-incident review to prevent similar incidents.

## Real-World Hijacking Examples

In 2015, hackers from Lizard Squad hijacked lenovo.com by compromising the domain's registrar account. Visitors were redirected to a page displaying hacked company emails. The detection signal was a nameserver change, but detection took hours rather than minutes, and the resulting embarrassment and data exposure risk made headlines worldwide.

In 2013, the Syrian Electronic Army hijacked nytimes.com DNS, redirecting visitors to their propaganda page. Again, the detection signal was a nameserver change. It took roughly two hours to detect and respond. During that time, one of the most respected news organizations in the world was serving propaganda to its readers.

Craigslist experienced similar DNS hijacking in 2014 when attackers redirected the domain to a hacker's page after exploiting registrar account access. Detection took several hours, causing service disruption and reputation damage.

The common pattern across these incidents is striking. Every major hijacking could have been detected by monitoring for unauthorized nameserver changes. The window between compromise and catastrophe was hours, not minutes. Automated alerting would have enabled faster response in every case.

## Integration with Domain Intelligence

Exit1's Domain Intelligence monitors the key indicators that reveal hijacking attempts. LastUpdated tracking alerts when domain records are modified unexpectedly. Nameserver monitoring detects changes to NS records. Status flag tracking catches removal of protections. Registrar change detection identifies transfers in progress.

Combined with uptime monitoring, you see both the domain-level changes and the downstream impact when your site starts resolving to wrong servers. This dual-layer visibility catches attacks regardless of which signal appears first.

## Prevention Plus Detection

Detection is your last line of defense. Prevention should come first.

Secure your registrar account with a strong unique password and hardware-based two-factor authentication rather than SMS codes, which can be intercepted through SIM swapping attacks. Enable all available registrar account alerts. Limit account access to only those who genuinely need it.

Keep all protection flags enabled at all times. The `clientTransferProhibited` flag should always be active unless you're legitimately transferring. The `clientDeleteProhibited` flag prevents accidental or malicious deletion. The `clientUpdateProhibited` flag can be enabled when you're not making changes, though it requires more active management.

For truly critical domains, consider registry-level locks. These require out-of-band verification, often a phone call with identity verification, before any changes can be made. They're more cumbersome for routine administration but significantly more secure against sophisticated attacks.

And always maintain monitoring. Automated checks for unauthorized changes, multiple alert channels, clear escalation procedures, and regular testing of detection systems ensure you'll know when something goes wrong.

## The Bottom Line

Domain hijacking is preventable and detectable. Attackers rarely succeed through sophisticated technical exploits - they succeed because nobody was watching.

Monitor for unauthorized changes. Alert immediately when they occur. Have a response plan ready. The difference between a near-miss and a catastrophe is often just a few hours of detection time.

Don't give attackers those hours.

---

## Recommended Reading

- [Understanding Registry Status Codes](/blog/registry-status-codes-business-guide) - What those status flags mean
- [Is Your Domain Really Secure?](/blog/domain-transfer-lock-security) - Transfer lock best practices
- [Domain Intelligence Feature](/domain-intelligence) - Automated hijacking detection
