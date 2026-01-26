---
title: "Understanding Registry Status Codes: What serverHold, clientTransferProhibited, and pendingDelete Mean for Your Business"
author: "Exit1 Team"
date: "2026-01-10"
category: "domain-intelligence"
excerpt: "Your domain has 'serverHold' status. Is that bad? Here's what every status code means and when to worry."
readTime: "9 min read"
metaDescription: "Complete guide to domain registry status codes including serverHold, clientTransferProhibited, pendingDelete, and redemptionPeriod. Understand what each means for your domain's health."
---

# Understanding Registry Status Codes: A Business Guide

Your domain monitoring dashboard shows "clientTransferProhibited" and "serverDeleteProhibited". Good or bad? Should you call your registrar?

Registry status codes look cryptic, but they're critical indicators of your domain's health and security. Understanding them helps you know when your domain is protected, catch problems before they become disasters, understand what's happening during disputes or legal holds, and make informed decisions about domain management.

## How Status Codes Work

Every domain has one or more status codes assigned by either the registrar (codes starting with `client`) or the registry (codes starting with `server`). This distinction matters because registrar-set codes can be modified through your normal account access, while registry-set codes are controlled by entities like Verisign for .com or PIR for .org and typically require special procedures or legal processes to change.

A domain can have multiple status codes simultaneously. Seeing several codes at once is normal - in fact, a healthy domain should have multiple protection codes enabled.

## Protection Status Codes

These are the codes you want to see. They indicate your domain has active protections against unauthorized changes.

### clientTransferProhibited

When you see this code, your registrar has locked the domain against transfer requests. This prevents unauthorized transfer to another registrar, meaning attackers can't move your domain to a registrar they control. Most registrars enable this by default, and you should always keep it active unless you're legitimately transferring to a new registrar.

If this code disappears from your domain without your knowledge, treat it as a potential security incident. Someone either compromised your account and removed it, or your registrar made an error. Either way, investigate immediately.

### serverTransferProhibited

This is the registry-level version of transfer protection, and it's significantly stronger because it can't be removed simply by accessing your registrar account. When you see this code, the registry itself has locked your domain.

Registry-level transfer locks are commonly applied during legal disputes, UDRP proceedings, or when you've requested premium protection through your registrar. If this code appears unexpectedly on your domain, it may indicate someone has initiated legal action against you. If it's not related to any dispute you're aware of, contact your registrar to understand why it was applied.

### clientDeleteProhibited and serverDeleteProhibited

These codes protect your domain against deletion. The client version is set by your registrar and prevents accidental or malicious deletion that would release your domain to the public pool. The server version provides the same protection at the registry level.

Any important domain should have at least clientDeleteProhibited enabled. The server version is typically reserved for premium protection services or domains under legal review.

### clientUpdateProhibited and serverUpdateProhibited

Update prohibition codes block changes to domain records, including nameserver modifications and contact information changes. These are more restrictive than transfer and delete locks because they prevent even routine administrative changes.

The trade-off is between security and convenience. With update prohibition enabled, you must remove the code before making any legitimate changes. For critical domains where changes are rare, this extra friction provides meaningful protection. For domains you actively manage, the inconvenience may outweigh the benefit.

## Standard Status Codes

These codes indicate normal operational states that don't require any action.

When you see `ok` or `active`, your domain is functioning normally with no restrictions. This is the standard healthy state for a domain that resolves correctly. However, if you see only "ok" with no protection codes, consider enabling clientTransferProhibited at minimum.

The `autoRenewPeriod` and `renewPeriod` codes appear after a domain renews, indicating a grace period during which your registrar might offer a refund if you cancel. Similarly, `transferPeriod` appears after completing a registrar transfer, and `addPeriod` appears on newly registered domains. These are all transitional states that resolve automatically.

## Warning Status Codes

These codes indicate problems or impending problems that need your attention.

### inactive

A domain showing inactive status has no nameservers assigned and won't resolve. Your website won't work, email won't work, and nothing depending on that domain will function. Check your nameserver configuration immediately. This might be a configuration problem, or it might indicate someone deliberately removed your nameservers.

### clientHold

When your registrar suspends a domain, it shows clientHold status. The domain stops resolving entirely. This commonly happens due to payment failures, terms of service violations, or the registrar flagging your account for security review.

Contact your registrar immediately to understand why the hold was applied. If it's a payment issue, resolving it usually restores the domain quickly. If it's an abuse complaint, you may need to provide documentation or make changes before the hold is lifted.

### serverHold

Registry-level suspension is significantly more serious than a registrar hold. When the registry itself suspends a domain, it indicates something like a court order, law enforcement request, serious abuse complaint, UDRP decision, or ICANN compliance action.

If you see serverHold on your domain unexpectedly, contact your registrar immediately and consider consulting legal counsel. This isn't something that resolves through normal customer service channels.

## Critical Status Codes

These codes indicate expiration or imminent loss of the domain. They require immediate action.

### pendingDelete

This is the final stage before a domain is deleted and released to the public registration pool. Once a domain enters pendingDelete status, it's queued for deletion, usually within five days. After that, anyone can register it.

If you see this status unexpectedly, treat it as an emergency. Contact your registrar immediately. If the domain has already entered pendingDelete, you may have lost your window to recover it through normal channels.

### redemptionPeriod

When a domain expires and isn't renewed during the grace period, it enters redemption. The domain is still recoverable, but your registrar will charge a redemption fee ranging from $100 to $300 or more depending on the registrar and TLD. This period typically lasts 30 days.

If you want to keep the domain, pay the redemption fee immediately. Waiting accomplishes nothing except potentially losing the domain entirely when redemption expires and the domain moves to pendingDelete.

### pendingRestore

This status appears after you've requested recovery from redemption. It indicates the registrar and registry are processing your restore request. Wait for confirmation that the restore completed successfully.

### pendingTransfer

A domain showing pendingTransfer is in the process of moving to another registrar. This is normal if you initiated the transfer. If you didn't initiate it, contact your current registrar immediately to cancel the transfer. You typically have five to seven days before the transfer completes.

## Dispute and Legal Status Codes

When domains become subject to legal proceedings or disputes, special status codes appear.

`serverRenewProhibited` indicates the registry has blocked renewal of the domain. This is unusual and serious - it means your domain could expire without the ability to renew, often because of an ongoing legal dispute about ownership.

`clientRenewProhibited` is the registrar-level version, which is less severe and often indicates account issues rather than legal problems. Contact your registrar to understand and resolve whatever is blocking renewal.

## Understanding Status Code Combinations

Real domains typically display multiple status codes simultaneously. Learning to read combinations helps you understand your domain's complete security posture.

A healthy protected domain typically shows clientTransferProhibited, clientDeleteProhibited, and active. This combination indicates the domain resolves normally and has standard protections against unauthorized transfer and deletion.

A domain locked for legal dispute might show serverTransferProhibited, serverUpdateProhibited, serverDeleteProhibited, and serverHold. This domain is completely frozen, likely due to ongoing legal proceedings. Nothing can be changed until the dispute resolves.

Domains showing only redemptionPeriod or pendingDelete require urgent action. These statuses indicate the domain is expired or about to be released.

After completing a transfer, you might see clientTransferProhibited, transferPeriod, and ok. This is normal and the transferPeriod status will disappear after the grace period ends.

## Monitoring Status Changes

Your domain monitoring should distinguish between status changes that require immediate attention, those that warrant investigation, and those that are purely informational.

Red-level alerts requiring immediate action include serverHold (registry suspended your domain), clientHold (registrar suspended your domain), pendingDelete (you're about to lose the domain), redemptionPeriod (domain has expired), and unexpected pendingTransfer status (possible hijacking attempt).

Yellow-level warnings include inactive status (domain isn't resolving), unexpected removal of protection codes, addition of serverTransferProhibited (may indicate dispute), and pendingUpdate lasting longer than expected.

Green-level informational changes include autoRenewPeriod (confirming renewal succeeded), transferPeriod after an expected transfer, and addition of protection codes.

## Responding to Status Changes

When protection codes are unexpectedly removed, verify whether anyone on your team made the change. If not, assume an attack may be in progress. Log into your registrar immediately and re-enable protection. Rotate all credentials and check for unauthorized access. Enable additional security measures like hardware 2FA if you haven't already.

When serverHold appears on your domain, don't panic but do act quickly. Contact your registrar for an explanation. Depending on the reason, you may need legal counsel. Document everything and preserve all correspondence - you may need these records later.

If pendingTransfer appears unexpectedly, contact your registrar immediately to request transfer cancellation. You typically have five days to stop an unauthorized transfer. After cancellation, conduct a full security audit of your registrar account.

When redemptionPeriod appears, make a decision immediately about whether to keep the domain. If you want to keep it, pay the redemption fee now. Every day of delay increases the risk that the domain moves to pendingDelete before you act.

## The Bottom Line

Status codes are your domain's vital signs. Learning to read them, monitoring for changes, and responding appropriately to warnings keeps your domains secure and prevents small problems from becoming catastrophic losses.

The key takeaways: clientTransferProhibited should always be enabled on any domain you care about. serverHold is serious and may require professional help. pendingDelete and redemptionPeriod are emergencies requiring immediate action. Unexpected removal of protection codes may indicate an attack in progress.

Set up monitoring that tracks status changes and alerts you immediately when anything concerning happens. The few minutes it takes to respond can be the difference between keeping and losing your domain.

---

## Recommended Reading

- [Domain Hijacking Detection](/blog/domain-hijacking-detection-unauthorized-changes) - Catch attacks early
- [Is Your Domain Really Secure?](/blog/domain-transfer-lock-security) - Complete security guide
- [Domain Intelligence Feature](/domain-intelligence) - Automated status monitoring
