# Nano Plan Conversion - Marketing Website Implementation Plan

**Created:** January 2026  
**Goal:** Increase Nano plan conversions from marketing website visitors

---

## Overview

This plan addresses the marketing website changes identified in `nanoplan-feedback.md`. Each item is a discrete task that can be implemented independently.

---

## Phase 1: Messaging Improvements (Quick Wins)

### 1.1 Rewrite Nano Value Props - Outcome-Focused

**Priority:** High  
**Effort:** Low  
**Files:** `src/app/pricing/page.tsx`, `src/app/page.tsx`

**Current State:**
```
- SMS alerts
- Custom status page domain
- Status page branding (logo, favicon, colors)
- Higher email limits (100/hour, 1000/month)
```

**New Messaging:**
```
- Get texted when your site goes down — not hours later via email
- Your domain, your brand — status.yourcompany.com
- Professional status pages with your logo and colors
- 100x more email alerts — because outages don't wait for billing cycles
```

**Detailed Changes:**

On the pricing page recommendation banner, change:
- "SMS Alerts" → "Instant SMS Alerts"
- Description: "Get critical downtime alerts sent directly to your phone" → "Your site goes down at 3am. Your phone buzzes. You fix it before customers notice."

On homepage pricing section:
- "SMS alerts" → "SMS alerts — know in seconds, not hours"
- "Custom status page domain" → "Your domain (status.yourbrand.com)"
- "Status page branding" → "Your logo, your colors"

---

### 1.2 Add Cost-Comparison Framing

**Priority:** High  
**Effort:** Low  
**Files:** `src/app/pricing/page.tsx`

**Add to Nano card or recommendation banner:**
- "SMS included — skip the $20/month Twilio bill"
- "Custom domains included — no extra DNS service needed"
- "All for less than a coffee per week"

**Implementation:**
Add a small "Value callout" below the price:
```
$3/month = Less than one coffee per week
Includes SMS alerts worth $20+/month elsewhere
```

---

### 1.3 Change CTA Button Copy

**Priority:** High  
**Effort:** Low  
**Files:** `src/app/pricing/page.tsx`, `src/app/page.tsx`

**Current:**
- "Subscribe" (Nano button)

**Test Options:**
- "Get SMS Alerts"
- "Upgrade to Nano"
- "Never Miss Another Outage"
- "Start Nano Trial" (if trial is implemented)

**Recommendation:** Use "Get SMS Alerts" — it's specific and action-oriented.

---

## Phase 2: Audience Targeting

### 2.1 Add Persona-Targeted Messaging

**Priority:** Medium  
**Effort:** Medium  
**Files:** `src/app/pricing/page.tsx` (new section)

**Add a "Who Nano is For" section on pricing page:**

```
## Who uses Nano?

**Freelancers & Agencies**
Monitoring client sites? Custom domains and branding make your status pages look professional. No "powered by" footers.

**On-Call Engineers**
You're not checking email at 3am. SMS alerts wake you up when it matters.

**SaaS Founders**
Your customers expect professional status pages. Your brand, your domain, your reputation.
```

**Visual treatment:** 3-column grid with icons, similar to existing feature grids.

---

### 2.2 Update Homepage "Why Free" Section

**Priority:** Medium  
**Effort:** Low  
**Files:** `src/app/page.tsx`

**Current copy at line 482-485:**
> "The free tier covers real monitoring. Nano adds SMS, custom domains, and branding for those who need it."

**New copy:**
> "Free covers everything hobbyists need. Nano is for professionals who monitor client sites, need SMS at 3am, or want branded status pages."

This subtly positions Nano as the "professional" choice without devaluing free.

---

## Phase 3: New Content

### 3.1 Create "Why Nano?" Dedicated Page

**Priority:** High  
**Effort:** Medium  
**Files:** New file `src/app/why-nano/page.tsx`

**Purpose:** Emotional storytelling page that makes the case for upgrading.

**Page Structure:**

```
# Why Nano?

## The 3am Problem

You're a developer. You're asleep. Your client's e-commerce site goes down.

**Without Nano:**
- Email arrives at 3:12am
- You see it at 7:30am when you check your phone
- Client already called. Twice. They're not happy.
- You lost them $4,000 in sales overnight.

**With Nano:**
- SMS arrives at 3:12am
- Your phone buzzes. You wake up.
- You fix it in 10 minutes.
- Client never knows. You're a hero.

---

## The Professional Problem

Your client asks: "Where can I see our uptime status?"

**Without Nano:**
- You share a link to status.exit1.dev/abc123
- They ask why it doesn't match their brand
- You look amateur

**With Nano:**
- You share status.theircompany.com
- Their logo, their colors
- You look like you've got your act together

---

## The Math

Nano costs $3/month (annual) or $4/month (monthly).

- SMS via Twilio: ~$0.0079/message × 20 alerts = $0.16/month minimum, plus $20+ platform fees
- Custom domain setup elsewhere: $5-15/month
- Professional status page tools: $20-50/month

**Nano: $3/month. Everything included.**

[CTA: Get Nano →]
```

**Add to navigation:** Link from pricing page and potentially footer.

---

### 3.2 Create Comparison Page

**Priority:** Medium  
**Effort:** Medium  
**Files:** New file `src/app/compare/page.tsx` or `src/app/vs/page.tsx`

**Purpose:** SEO + conversion content comparing Exit1 Nano to competitors.

**Page options:**
- `/compare` — general comparison table
- `/vs/uptimerobot` — specific competitor page
- `/vs/betteruptime` — specific competitor page

**Comparison table columns:**
| Feature | Exit1 Free | Exit1 Nano | UptimeRobot Free | UptimeRobot Pro |
|---------|------------|------------|------------------|-----------------|
| Check interval | 1 min | 1 min | 5 min | 1 min |
| Monitors | Unlimited | Unlimited | 50 | 50+ |
| SMS alerts | No | Yes | No | $20+/mo |
| Custom domain | No | Yes | No | $$$$ |
| Price | $0 | $3/mo | $0 | $14+/mo |

**Key message:** Exit1 Nano at $3/mo gives you what costs $20-50/mo elsewhere.

---

## Phase 4: Structural Changes

### 4.1 Add Nano to Main Navigation

**Priority:** Low  
**Effort:** Low  
**Files:** `src/components/Header.tsx` or `src/components/GlassNavigation.tsx`

**Current:** Pricing link in nav  
**Change:** Consider adding "Nano" or "Why Nano?" as a distinct nav item to increase visibility.

---

### 4.2 Add Nano CTA to Feature Pages

**Priority:** Low  
**Effort:** Low  
**Files:** Various product pages (`src/app/product/*.tsx`, `src/app/alerting/page.tsx`, etc.)

**On the Alerting page specifically:**
Add a callout box:
> "Want SMS alerts? Nano includes unlimited SMS notifications for $3/month."
> [Get Nano →]

**On Status Pages content (if exists):**
> "Want your own domain and branding? Nano includes custom domains and white-label status pages."

---

## Implementation Order (Recommended)

| Order | Task | Impact | Effort |
|-------|------|--------|--------|
| 1 | 1.3 Change CTA copy | High | 5 min |
| 2 | 1.1 Rewrite value props | High | 30 min |
| 3 | 1.2 Add cost-comparison framing | High | 15 min |
| 4 | 2.2 Update "Why Free" copy | Medium | 5 min |
| 5 | 2.1 Add persona section to pricing | Medium | 45 min |
| 6 | 3.1 Create "Why Nano?" page | High | 2 hrs |
| 7 | 3.2 Create comparison page | Medium | 2 hrs |
| 8 | 4.2 Add Nano CTAs to feature pages | Low | 1 hr |
| 9 | 4.1 Update navigation | Low | 15 min |

---

## Metrics to Track

After implementing changes, monitor:

1. **Pricing page → Nano click rate** (via analytics events)
2. **Homepage pricing section → Nano click rate**
3. **New Nano subscriptions per week**
4. **"Why Nano?" page views and exit rate** (once created)
5. **Comparison page organic traffic** (once created)

---

## Notes

- All changes should maintain the existing dark theme and design language
- Test copy changes with A/B testing if traffic supports it
- Consider running the CTA copy test (1.3) first as it's lowest effort, highest signal
- The "Why Nano?" page (3.1) is the highest-impact content piece but requires the most effort

---

## Status Tracker

| Task | Status | Date Completed | Notes |
|------|--------|----------------|-------|
| 1.1 Rewrite value props | Complete | Jan 2026 | Updated pricing page banner & feature lists, homepage pricing section |
| 1.2 Cost-comparison framing | Complete | Jan 2026 | Added "Less than a coffee per week" + Twilio comparison to Nano card |
| 1.3 Change CTA copy | Complete | Jan 2026 | Changed "Subscribe" to "Get SMS Alerts" on pricing & homepage |
| 2.1 Persona section | Complete | Jan 2026 | Added "Who uses Nano?" 3-column section to pricing page |
| 2.2 Update "Why Free" copy | Complete | Jan 2026 | Updated to position Nano as "professional" choice |
| 3.1 "Why Nano?" page | Complete | Jan 2026 | Created /why-nano with 3am problem, professional problem, and math sections |
| 3.2 Comparison page | Complete | Jan 2026 | Created /compare with Exit1 vs UptimeRobot vs Better Uptime table |
| 4.1 Navigation update | Complete | Jan 2026 | Added "Why Nano?" to main nav, links from pricing page |
| 4.2 Feature page CTAs | Complete | Jan 2026 | Added nanoUpgrade prop to ProductPage, enabled on alerting & monitoring pages |
