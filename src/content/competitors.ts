// Data for the head-to-head comparison pages at /compare/[competitor].
//
// These pages target the *commercial* "X vs exit1" / "X vs exit1.dev" search
// intent — a feature-by-feature buyer decision. That is deliberately distinct
// from the editorial "X alternative" blog posts (e.g.
// /blog/uptimerobot-alternative-free-unlimited), which already rank. Each entry
// cross-links to its blog post via `relatedPost` so the two reinforce each
// other instead of cannibalising the same SERP.
//
// exit1.dev tier facts are the source of truth from /pricing:
//   Free  — 50 monitors, 5-min checks, all protocols, SSL, 1 webhook,
//           1 status page, 1 API key + MCP, Live page, 60-day retention.
//           $0, no card.
//   Indie — 100 monitors, 1-min checks, 3 API keys + MCP, 3 webhooks,
//           status page builder, DNS checks, 90-day retention. $4/mo ($3 annual).
//   Nano  — 250 monitors, 30-sec, 10 API keys + MCP, domain intelligence,
//           maintenance mode, region choice, 1-yr retention. $9/mo ($7 annual).
//   Pro   — 1,000 monitors, 15-sec, 50 SMS/mo, Slack/Discord/Teams, CSV export,
//           100 API keys, 3-yr retention. $24/mo ($20 annual).
//
// The ladder is monotonic on every dimension: each tier is a strict superset of
// the one below it, with check interval as the primary axis. API + MCP access
// and the real-time Live page are on every tier, Free included.
//
// The Agency tier was retired in 2026 and folded into Pro.
//
// Competitor numbers are current as of 2026 and mirror the vetted /compare
// table. Competitor pricing changes often — re-check before major edits.

export type Cell = string | boolean;

export interface CompareRow {
  feature: string;
  exit1: Cell;
  competitor: Cell;
}

export interface CompareTier {
  /** exit1 plan being compared (e.g. "Free", "Pro — $24/mo"). */
  exit1Plan: string;
  /** Competitor plan being compared (e.g. "Free", "Team — $34/mo"). */
  competitorPlan: string;
  /** Optional short heading for the section, defaults derived from plans. */
  heading: string;
  subheading?: string;
  rows: CompareRow[];
}

export interface CompetitorFAQ {
  question: string;
  answer: string;
}

export interface Competitor {
  slug: string;
  /** Display name, e.g. "UptimeRobot". */
  name: string;
  /** SEO */
  seoTitle: string;
  seoDescription: string;
  keywords: string;
  /** Hero copy */
  heroSubtitle: string;
  intro: string;
  /** One-line "what they're known for" shown under the hero. */
  bestKnownFor: string;
  /** The honest verdict paragraph. */
  verdict: string;
  /** Free-tier comparison table (null when the competitor has no free tier). */
  free: CompareTier | null;
  /** Paid-tier comparison table (null for discontinued products). */
  paid: CompareTier | null;
  /** Shown as a callout when the competitor is being sunset. */
  discontinuedNote?: string;
  /** Honest breakdown. */
  exit1Wins: string[];
  competitorWins: string[];
  faq: CompetitorFAQ[];
  /** The editorial blog post to cross-link (complements, doesn't compete). */
  relatedPost?: { slug: string; title: string };
  /** Optional disclaimer under the tables (pricing model quirks etc.). */
  pricingNote?: string;
}

const EXIT1_FREE_PROTOCOLS = "HTTP, TCP, UDP, ICMP, WebSocket";

export const competitors: Competitor[] = [
  // ─────────────────────────────────────────────────────────────────────
  {
    slug: "uptimerobot",
    name: "UptimeRobot",
    seoTitle: "UptimeRobot vs exit1.dev: Free & Paid Compared (2026)",
    seoDescription:
      "UptimeRobot vs exit1.dev, tier for tier. Both give 50 free monitors. exit1.dev adds SSL monitoring and every protocol for free, and 1,000 monitors on Pro at $24/mo against 100 on Team.",
    keywords:
      "uptimerobot vs exit1, uptimerobot alternative, uptimerobot comparison, uptimerobot free plan, uptimerobot vs exit1.dev",
    heroSubtitle:
      "The 50-monitor free plan vs multi-protocol checks, free SSL monitoring, and 1,000 monitors on Pro.",
    intro:
      "UptimeRobot is the default name in cheap uptime monitoring. Its free plan hands you 50 HTTP monitors and everyone knows it. exit1.dev goes for depth: every protocol and SSL monitoring on the free tier, and 10x the monitors on the paid tier. Both have a REST API and a hosted MCP server. Here's the tier-by-tier reality.",
    bestKnownFor: "Best known for: 50 free HTTP monitors and a huge install base.",
    verdict:
      "Both free tiers now give you 50 monitors, so the comparison comes down to depth. If you monitor TCP/UDP/ICMP/WebSocket endpoints or run 100+ monitors, exit1.dev is cheaper and deeper. Pro gives you 1,000 monitors and 15-second checks at $24/mo, while UptimeRobot Team gives you 100 monitors with 30-second checks at €35/mo on annual billing (€41 monthly).",
    free: {
      exit1Plan: "exit1.dev Free",
      competitorPlan: "UptimeRobot Free",
      heading: "Free tier",
      subheading: "What each gives you for $0, no credit card.",
      rows: [
        { feature: "Monitors", exit1: "50", competitor: "50" },
        { feature: "Check interval", exit1: "5 min", competitor: "5 min" },
        { feature: "Protocols", exit1: EXIT1_FREE_PROTOCOLS, competitor: "HTTP, ping, port, keyword" },
        { feature: "Multi-region checks", exit1: false, competitor: false },
        { feature: "SSL certificate monitoring", exit1: true, competitor: false },
        { feature: "Domain expiry alerts", exit1: false, competitor: false },
        { feature: "Response validation (JSON, headers, body)", exit1: true, competitor: "Keyword only" },
        { feature: "Webhooks", exit1: "1", competitor: false },
        { feature: "Slack / Discord / Teams", exit1: false, competitor: "Discord only" },
        { feature: "REST API", exit1: true, competitor: true },
        { feature: "Public status page", exit1: "1", competitor: "1" },
        { feature: "Log retention", exit1: "60 days", competitor: "3 months" },
      ],
    },
    paid: {
      exit1Plan: "exit1.dev Pro, $24/mo",
      competitorPlan: "UptimeRobot Team, €35/mo",
      heading: "Paid tier",
      subheading: "exit1.dev Pro ($24/mo, $20 annual) vs UptimeRobot Team (€35/mo annual, €41 monthly).",
      rows: [
        { feature: "Monitors included", exit1: "1,000", competitor: "100" },
        { feature: "Minimum check interval", exit1: "15 sec", competitor: "30 sec" },
        { feature: "Multi-region checks", exit1: true, competitor: true },
        { feature: "Protocols", exit1: EXIT1_FREE_PROTOCOLS, competitor: "HTTP + keyword" },
        { feature: "SSL certificate monitoring", exit1: true, competitor: true },
        { feature: "SMS alerts", exit1: "50 / month included", competitor: "30 included" },
        { feature: "Slack / Discord / Teams", exit1: true, competitor: true },
        { feature: "Webhooks", exit1: "100", competitor: true },
        { feature: "REST API", exit1: true, competitor: true },
        { feature: "Hosted MCP server", exit1: true, competitor: true },
        { feature: "CSV bulk export", exit1: true, competitor: false },
        { feature: "Log retention", exit1: "3 years", competitor: "24 months" },
      ],
    },
    exit1Wins: [
      "TCP, UDP, ICMP, and WebSocket checks on the free tier, not just HTTP pings.",
      "1,000 monitors on Pro ($24/mo) vs 100 on UptimeRobot Team (€35/mo).",
      "15-second checks on Pro vs 30 seconds on Team.",
      "SSL certificate monitoring on the free plan. UptimeRobot keeps SSL and domain expiry monitoring for paid plans.",
      "Your agent can set everything up over MCP: the account, the checks, the alerts, and a test alert to prove delivery.",
    ],
    competitorWins: [
      "A far larger probe network and a decade more brand recognition behind the free plan.",
      "Comparable paid log retention (24 months vs our 3 years on Pro).",
      "A larger brand and community, and integrations built up over a decade.",
    ],
    faq: [
      {
        question: "Is exit1.dev a good UptimeRobot alternative?",
        answer:
          "Yes, especially if you monitor more than HTTP. Both free tiers give 50 monitors, but exit1.dev's covers TCP, UDP, ICMP, and WebSocket checks plus SSL, a status page and API access. Pro gives you 1,000 monitors with 15-second checks at $24/mo.",
      },
      {
        question: "How does UptimeRobot's free plan compare to exit1.dev's?",
        answer:
          "UptimeRobot free gives 50 HTTP/ping/port monitors at 5-minute intervals. exit1.dev free gives 50 across every protocol, with SSL monitoring, JSON/header validation, a webhook, a status page, and an API key with MCP access included. Same count, more capability per monitor.",
      },
      {
        question: "Is exit1.dev cheaper than UptimeRobot?",
        answer:
          "At the paid tier, yes. exit1.dev Pro is $24/mo ($20 annually) for 1,000 monitors and 15-second checks. UptimeRobot Team is €35/mo on annual billing (€41 monthly) for 100 monitors at 30-second checks, with 30 SMS included.",
      },
      {
        question: "Can I migrate from UptimeRobot to exit1.dev?",
        answer:
          "Yes. Bulk-import your URLs, point your existing alert endpoints (Slack, webhooks, email) at exit1.dev, and you're running. The migration checklist walks through it step by step.",
      },
    ],
    relatedPost: {
      slug: "uptimerobot-alternative-free-unlimited",
      title: "UptimeRobot Free Plan: Limits, Pricing & the Best Free Alternative",
    },
    pricingNote:
      "UptimeRobot Team is priced in euros: €35/mo on annual billing, €41 monthly. It includes 30 SMS and voice credits a month. Figures from uptimerobot.com/pricing, checked 2026-11-14. UptimeRobot does not publish which plans include its MCP server.",
  },

  // ─────────────────────────────────────────────────────────────────────
  {
    slug: "pingdom",
    name: "Pingdom",
    seoTitle: "Pingdom vs exit1.dev — Cheaper Uptime Monitoring (2026)",
    seoDescription:
      "Pingdom (SolarWinds) vs exit1.dev. Pingdom has no free tier and prices per check; exit1.dev gives 50 monitors free and 1,000 on Pro at $24/mo. Head-to-head comparison.",
    keywords:
      "pingdom vs exit1, pingdom alternative, pingdom pricing, cheaper than pingdom, pingdom vs exit1.dev",
    heroSubtitle:
      "Enterprise per-check pricing and no free tier, vs flat monitor pricing that starts at $0.",
    intro:
      "Pingdom (now part of SolarWinds) is the enterprise incumbent — synthetic monitoring and real-user monitoring, priced per check. There's no free tier and costs climb fast as you add checks. exit1.dev takes the opposite approach: a genuinely free plan, then flat pricing where one plan covers hundreds of monitors. Here's how they stack up.",
    bestKnownFor: "Best known for: enterprise-grade synthetic + real-user monitoring, at an enterprise price.",
    verdict:
      "Pingdom makes sense if you need its real-user monitoring and page-speed analytics inside the SolarWinds ecosystem and have the budget. For straight uptime and API monitoring, exit1.dev is dramatically cheaper: you start free, and Pro covers 1,000 monitors for $24/mo — roughly what Pingdom charges for a couple dozen checks.",
    free: null,
    paid: {
      exit1Plan: "exit1.dev Pro — $24/mo",
      competitorPlan: "Pingdom (Synthetic) — priced per check",
      heading: "Paid comparison",
      subheading: "exit1.dev Pro vs Pingdom's per-check Synthetic Monitoring.",
      rows: [
        { feature: "Free tier", exit1: "Yes — 50 monitors", competitor: "No (14-day trial)" },
        { feature: "Pricing model", exit1: "Flat — 1,000 monitors per plan", competitor: "Per uptime check" },
        { feature: "Entry price for real usage", exit1: "$0 free · $24/mo Pro", competitor: "Scales quickly with checks" },
        { feature: "Minimum check interval", exit1: "15 sec", competitor: "1 min" },
        { feature: "Multi-region checks", exit1: true, competitor: true },
        { feature: "Protocols", exit1: EXIT1_FREE_PROTOCOLS, competitor: "HTTP + transaction checks" },
        { feature: "SSL certificate monitoring", exit1: true, competitor: true },
        { feature: "Real-user monitoring (RUM)", exit1: false, competitor: true },
        { feature: "SMS alerts", exit1: "50 / month included", competitor: "Included (limited)" },
        { feature: "MCP server", exit1: true, competitor: "None published" },
        { feature: "REST API", exit1: true, competitor: true },
      ],
    },
    exit1Wins: [
      "A real free tier — Pingdom has none, only a 14-day trial.",
      "Flat pricing: 1,000 monitors on one $24/mo plan instead of paying per check.",
      "TCP, UDP, ICMP, and WebSocket monitoring included.",
      "MCP access for querying uptime data from AI assistants.",
    ],
    competitorWins: [
      "Real-user monitoring (RUM) and deep page-speed analytics — exit1.dev is uptime/API focused, not RUM.",
      "Transaction/synthetic scripting for multi-step user flows.",
      "Part of the wider SolarWinds observability suite for enterprise buyers.",
    ],
    faq: [
      {
        question: "Is exit1.dev a cheaper alternative to Pingdom?",
        answer:
          "Substantially. Pingdom has no free tier and charges per check, so costs rise with every monitor. exit1.dev starts free (50 monitors) and Pro covers 1,000 monitors for $24/mo — a fraction of a comparable Pingdom bill.",
      },
      {
        question: "Does Pingdom have a free plan?",
        answer:
          "No. Pingdom offers a 14-day free trial but no permanent free tier. exit1.dev's free plan is free forever, with no credit card required.",
      },
      {
        question: "What does Pingdom do that exit1.dev doesn't?",
        answer:
          "Pingdom includes real-user monitoring (RUM) and transaction/synthetic scripting for multi-step flows. exit1.dev is focused on uptime, SSL, and API monitoring across every protocol — if you need RUM specifically, Pingdom covers that ground.",
      },
    ],
    relatedPost: {
      slug: "pingdom-alternative-free-unlimited-monitoring",
      title: "Pingdom Alternative: Free, Flat-Priced Uptime Monitoring",
    },
    pricingNote:
      "Pingdom prices Synthetic Monitoring per uptime check, so a like-for-like quote depends on how many checks you run. Figures reflect published plans as of 2026 — confirm current pricing on pingdom.com.",
  },

  // ─────────────────────────────────────────────────────────────────────
  {
    slug: "better-stack",
    name: "Better Stack",
    seoTitle: "Better Stack vs exit1.dev — Uptime Monitoring Compared (2026)",
    seoDescription:
      "Better Stack (Better Uptime) vs exit1.dev. On-call and unlimited SMS vs 1,000 monitors and all-protocol checks at $24/mo. Tier-by-tier comparison.",
    keywords:
      "better stack vs exit1, better uptime alternative, better stack comparison, better stack vs exit1.dev, betterstack alternative",
    heroSubtitle:
      "Polished on-call and status pages, vs 1,000 monitors and every protocol.",
    intro:
      "Better Stack (formerly Better Uptime) built its reputation on slick status pages and on-call incident management. It's a strong product, but its paid plans start at just 10 monitors, with more billed as add-ons. exit1.dev gives you 1,000 monitors on Pro at a lower price and every protocol on the free tier. Both have a hosted MCP server. Here's the honest breakdown.",
    bestKnownFor: "Best known for: beautiful status pages and built-in on-call scheduling.",
    verdict:
      "Better Stack is the pick if on-call scheduling, incident management, and unlimited SMS are central to your workflow. exit1.dev wins on monitor volume and breadth: 1,000 monitors on Pro at $24/mo vs Better Stack's 10-monitor Responder base at $34/mo, plus TCP/UDP/ICMP/WebSocket checks free.",
    free: {
      exit1Plan: "exit1.dev Free",
      competitorPlan: "Better Stack Free",
      heading: "Free tier",
      subheading: "What each gives you for $0.",
      rows: [
        { feature: "Monitors", exit1: "50", competitor: "10" },
        { feature: "Check interval", exit1: "5 min", competitor: "3 min" },
        { feature: "Protocols", exit1: EXIT1_FREE_PROTOCOLS, competitor: "HTTP only" },
        { feature: "SSL certificate monitoring", exit1: true, competitor: false },
        { feature: "Response validation (JSON, headers, body)", exit1: true, competitor: false },
        { feature: "Webhooks", exit1: "1", competitor: false },
        { feature: "Slack / Discord / Teams", exit1: false, competitor: "Slack only" },
        { feature: "REST API", exit1: true, competitor: true },
        { feature: "Public status page", exit1: "1", competitor: "1" },
        { feature: "Log retention", exit1: "60 days", competitor: "3 days" },
      ],
    },
    paid: {
      exit1Plan: "exit1.dev Pro — $24/mo",
      competitorPlan: "Better Stack Responder — $34/mo",
      heading: "Paid tier",
      subheading: "exit1.dev Pro ($24/mo) vs Better Stack Responder ($34/mo, $29 annual).",
      rows: [
        { feature: "Monitors included", exit1: "1,000", competitor: "10 (add-ons extra)" },
        { feature: "Minimum check interval", exit1: "15 sec", competitor: "30 sec" },
        { feature: "Multi-region checks", exit1: true, competitor: true },
        { feature: "Protocols", exit1: EXIT1_FREE_PROTOCOLS, competitor: "HTTP + TCP + DNS" },
        { feature: "SSL certificate monitoring", exit1: true, competitor: true },
        { feature: "SMS alerts", exit1: "50 / month included", competitor: "Unlimited" },
        { feature: "On-call scheduling", exit1: false, competitor: true },
        { feature: "Slack / Discord / Teams", exit1: true, competitor: true },
        { feature: "Webhooks", exit1: "100", competitor: true },
        { feature: "Hosted MCP server", exit1: true, competitor: true },
        { feature: "REST API", exit1: true, competitor: true },
        { feature: "Log retention", exit1: "3 years", competitor: "Unlimited incidents" },
      ],
    },
    exit1Wins: [
      "1,000 monitors on Pro vs Better Stack Responder's 10-monitor base (the rest are paid add-ons).",
      "Every protocol — TCP, UDP, ICMP, WebSocket — on the free tier; Better Stack free is HTTP only.",
      "SSL monitoring, JSON validation, and a webhook on the free plan.",
      "Your agent can set everything up over MCP: the account, the checks, the alerts, and a test alert to prove delivery.",
    ],
    competitorWins: [
      "Unlimited SMS on paid plans vs our 50/month on Pro.",
      "Built-in on-call scheduling and incident management (rotations, escalations).",
      "Status pages are among the most polished in the category.",
    ],
    faq: [
      {
        question: "Better Stack vs exit1.dev — which is cheaper?",
        answer:
          "exit1.dev Pro is $24/mo for 1,000 monitors. Better Stack Responder is $34/mo but starts at 10 monitors, with more billed as add-ons — so exit1.dev is markedly cheaper once you scale past a handful of monitors.",
      },
      {
        question: "Does Better Stack have on-call scheduling?",
        answer:
          "Yes. On-call rotations and incident management are a core Better Stack strength. exit1.dev focuses on monitoring depth (all protocols, 1,000 monitors) rather than full incident-management workflows, so if on-call is your priority, Better Stack has the edge there.",
      },
      {
        question: "Is exit1.dev's free plan better than Better Stack's?",
        answer:
          "For monitoring depth, yes: exit1.dev free includes SSL monitoring, JSON/header validation, a webhook, every protocol, and REST API access with an API key, while Better Stack's free tier is HTTP only with 3-day retention.",
      },
    ],
    relatedPost: undefined,
    pricingNote:
      "Better Stack Responder's base plan includes 10 monitors; scaling to 50 adds roughly $21 to $25/month in add-ons. Figures reflect published plans as of 2026. Better Stack does not publish which plans include its MCP server.",
  },

  // ─────────────────────────────────────────────────────────────────────
  {
    slug: "freshping",
    name: "Freshping",
    seoTitle: "Freshping vs exit1.dev — Where to Migrate (2026)",
    seoDescription:
      "Freshping (Freshworks) is being discontinued. Compare it to exit1.dev — a free-forever uptime monitor with all-protocol checks, SSL, and MCP — and migrate cleanly.",
    keywords:
      "freshping vs exit1, freshping alternative, freshping replacement, freshping shutdown, freshping migration",
    heroSubtitle:
      "Freshping is being wound down. Here's the free-forever monitor to move to.",
    intro:
      "Freshping was Freshworks' free uptime monitor — generous, with 50 monitors and 1-minute checks. But Freshworks has been winding it down, which leaves teams needing somewhere to land. exit1.dev is a free-forever monitor built by people who actually run infrastructure: all protocols, SSL, JSON validation, and a clean migration path. Here's the comparison and how to move.",
    bestKnownFor: "Best known for: a generous free plan inside Freshworks — now being discontinued.",
    verdict:
      "If you're still on Freshping, the decision is really 'where do I go?' exit1.dev matches the free-forever promise with 50 monitors free (or 100 on Indie at $4/mo, 250 on Nano at $9/mo), adds every protocol and SSL monitoring, and gives you a migration checklist so the move is painless.",
    discontinuedNote:
      "Freshworks has been discontinuing Freshping. If you're still relying on it, now is the time to migrate before checks stop running.",
    free: {
      exit1Plan: "exit1.dev Free",
      competitorPlan: "Freshping Free (legacy)",
      heading: "Free tier",
      subheading: "exit1.dev's free-forever plan vs Freshping's legacy free plan.",
      rows: [
        { feature: "Status", exit1: "Active & maintained", competitor: "Being discontinued" },
        { feature: "Monitors", exit1: "50 (100 on Indie $4/mo, 250 on Nano $9/mo)", competitor: "50" },
        { feature: "Check interval", exit1: "5 min (1 min on Indie)", competitor: "1 min" },
        { feature: "Protocols", exit1: EXIT1_FREE_PROTOCOLS, competitor: "HTTP only" },
        { feature: "SSL certificate monitoring", exit1: true, competitor: "Limited" },
        { feature: "Response validation (JSON, headers, body)", exit1: true, competitor: false },
        { feature: "Webhooks", exit1: "1", competitor: false },
        { feature: "Public status pages", exit1: "1 (5 on Nano)", competitor: "5" },
        { feature: "Log retention", exit1: "60 days", competitor: "Limited" },
      ],
    },
    paid: null,
    exit1Wins: [
      "Actively maintained and free forever — no shutdown looming.",
      "Every protocol (TCP, UDP, ICMP, WebSocket), not just HTTP.",
      "SSL monitoring and JSON/header validation built in.",
      "A step-by-step migration checklist to move off Freshping cleanly.",
    ],
    competitorWins: [
      "Freshping's legacy free plan offered 50 monitors and 1-minute checks — generous while it lasted.",
      "Tight integration with the wider Freshworks suite (for teams already inside it).",
    ],
    faq: [
      {
        question: "Is Freshping shutting down?",
        answer:
          "Freshworks has been discontinuing Freshping. If you depend on it, migrate now so you don't lose monitoring coverage when checks stop.",
      },
      {
        question: "What's the best Freshping replacement?",
        answer:
          "exit1.dev is a direct, free-forever replacement: 50 monitors free (100 on Indie at $4/mo, 250 on Nano at $9/mo), every protocol, SSL monitoring, and a migration checklist to move your existing checks over.",
      },
      {
        question: "How do I migrate from Freshping to exit1.dev?",
        answer:
          "Export or list your Freshping monitors, bulk-import the URLs into exit1.dev, reconnect your alert channels (email, Slack, webhooks), and verify. The Freshping migration checklist covers each step.",
      },
    ],
    relatedPost: {
      slug: "freshping-replacement-uptime-monitoring",
      title: "Freshping Replacement: Free Uptime Monitoring That Won't Shut Down",
    },
    pricingNote:
      "Freshping figures describe its legacy free plan. Freshworks has been winding the product down — confirm its current status before relying on it.",
  },

  // ─────────────────────────────────────────────────────────────────────
  {
    slug: "statuscake",
    name: "StatusCake",
    seoTitle: "StatusCake vs exit1.dev — Uptime Monitoring Compared (2026)",
    seoDescription:
      "StatusCake vs exit1.dev, tier for tier. All-protocol checks, JSON validation, a hosted MCP server, and 1,000 monitors on Pro at $24/mo vs StatusCake's plans. Honest comparison.",
    keywords:
      "statuscake vs exit1, statuscake alternative, statuscake comparison, statuscake vs exit1.dev, statuscake free",
    heroSubtitle:
      "Page-speed and domain tools, vs deeper checks, JSON validation, and hosted MCP.",
    intro:
      "StatusCake bundles uptime with page-speed, domain, and server monitoring. It is a broad toolkit. exit1.dev goes narrower and deeper on the monitoring itself: every protocol on the free tier, JSON/header validation, bundled SMS, and a hosted MCP server that can change your monitoring as well as read it. Here's the tier-by-tier comparison.",
    bestKnownFor: "Best known for: a broad toolkit spanning uptime, page speed, and domain checks.",
    verdict:
      "StatusCake is a fine generalist if you want page-speed and domain tools alongside uptime. exit1.dev is the sharper choice for pure monitoring: all protocols and SSL on the free tier, JSON validation, 1,000 monitors on Pro at $24/mo, and a hosted MCP server that can create and update checks. StatusCake's MCP server runs on your machine and is read-only.",
    free: {
      exit1Plan: "exit1.dev Free",
      competitorPlan: "StatusCake Free",
      heading: "Free tier",
      subheading: "What each gives you for $0.",
      rows: [
        { feature: "Monitors", exit1: "50", competitor: "10" },
        { feature: "Check interval", exit1: "5 min", competitor: "5 min" },
        { feature: "Protocols", exit1: EXIT1_FREE_PROTOCOLS, competitor: "HTTP, TCP, ping" },
        { feature: "SSL certificate monitoring", exit1: true, competitor: "Limited" },
        { feature: "Response validation (JSON, headers, body)", exit1: true, competitor: false },
        { feature: "Webhooks", exit1: "1", competitor: false },
        { feature: "Public status page", exit1: "1", competitor: "1" },
        { feature: "Log retention", exit1: "60 days", competitor: "7 days" },
      ],
    },
    paid: {
      exit1Plan: "exit1.dev Pro — $24/mo",
      competitorPlan: "StatusCake Superior — ~$25/mo",
      heading: "Paid tier",
      subheading: "exit1.dev Pro ($24/mo) vs a similarly-priced StatusCake plan.",
      rows: [
        { feature: "Monitors included", exit1: "1,000", competitor: "100+" },
        { feature: "Minimum check interval", exit1: "15 sec", competitor: "1 min" },
        { feature: "Multi-region checks", exit1: true, competitor: true },
        { feature: "Protocols", exit1: EXIT1_FREE_PROTOCOLS, competitor: "HTTP, TCP, ping, DNS" },
        { feature: "SSL certificate monitoring", exit1: true, competitor: true },
        { feature: "SMS alerts", exit1: "50 / month included", competitor: "Credits / add-on" },
        { feature: "Response validation (JSON, headers, body)", exit1: true, competitor: "Limited" },
        { feature: "MCP server", exit1: "Hosted, read and write", competitor: "Local, read-only" },
        { feature: "REST API", exit1: true, competitor: true },
        { feature: "CSV bulk export", exit1: true, competitor: true },
      ],
    },
    exit1Wins: [
      "Full JSON/header/body validation vs StatusCake's limited response checks.",
      "1,000 monitors on Pro at $24/mo with 15-second checks.",
      "Bundled SMS (50/month) instead of prepaid credits or add-ons.",
      "A hosted MCP server with write tools. StatusCake's runs locally and is read-only.",
    ],
    competitorWins: [
      "Page-speed and server/CPU monitoring bundled alongside uptime.",
      "Domain-monitoring tooling as part of the same product.",
      "A longer track record and established brand.",
    ],
    faq: [
      {
        question: "Is exit1.dev a good StatusCake alternative?",
        answer:
          "Yes, if monitoring depth matters more than a broad toolkit. exit1.dev covers every protocol on the free tier, adds JSON/header validation, and gives 1,000 monitors on Pro at $24/mo. StatusCake bundles page-speed and domain tools that exit1.dev leaves to dedicated features.",
      },
      {
        question: "How do the free plans compare?",
        answer:
          "StatusCake free gives 10 monitors at 5-minute intervals; exit1.dev free gives 50. exit1.dev adds SSL monitoring, JSON validation, a webhook, and every protocol, with 60-day retention vs StatusCake's 7 days — and Indie at $4/mo moves you to 1-minute checks.",
      },
      {
        question: "Which has faster checks on paid plans?",
        answer:
          "exit1.dev Pro runs 15-second checks at $24/mo. StatusCake's similarly-priced tier typically runs 1-minute checks, with 30-second checks reserved for higher plans.",
      },
    ],
    relatedPost: {
      slug: "statuscake-vs-free-monitoring",
      title: "StatusCake vs Free Monitoring: What You Actually Get",
    },
    pricingNote:
      "StatusCake plan names and limits change periodically; figures reflect published plans as of 2026. Confirm current details on statuscake.com.",
  },

  // ─────────────────────────────────────────────────────────────────────
  {
    slug: "hyperping",
    name: "Hyperping",
    seoTitle: "Hyperping vs exit1.dev: Uptime Monitoring Compared (2026)",
    seoDescription:
      "Hyperping vs exit1.dev, tier for tier. Both put status pages on your own domain. exit1.dev adds all-protocol checks and 1,000 monitors on Pro at $24/mo. Honest head-to-head.",
    keywords:
      "hyperping vs exit1, hyperping alternative, hyperping comparison, hyperping vs exit1.dev, hyperping pricing",
    heroSubtitle:
      "Clean status pages vs 1,000 monitors, every protocol, custom domains and SLA reports.",
    intro:
      "Hyperping is a well-designed monitor with a focus on status pages, priced simply. exit1.dev competes on depth and volume: all protocols and SSL on the free tier, 1,000 monitors on Pro, status pages on your own domain and SLA reports. Both ship a hosted MCP server. At the same $24 price point, here's what each gets you.",
    bestKnownFor: "Best known for: clean, hosted status pages with custom-domain support.",
    verdict:
      "Hyperping is a solid pick if a polished status page is the main thing you're buying. exit1.dev delivers far more monitoring for the same price: 1,000 monitors vs 50 at $24/mo, every protocol on the free tier, custom status page domains and monthly SLA reports.",
    free: {
      exit1Plan: "exit1.dev Free",
      competitorPlan: "Hyperping Free",
      heading: "Free tier",
      subheading: "What each gives you for $0.",
      rows: [
        { feature: "Monitors", exit1: "50", competitor: "20" },
        { feature: "Check interval", exit1: "5 min", competitor: "5 min" },
        { feature: "Protocols", exit1: EXIT1_FREE_PROTOCOLS, competitor: "HTTP, port, ping, keyword" },
        { feature: "SSL certificate monitoring", exit1: true, competitor: false },
        { feature: "Response validation (JSON, headers, body)", exit1: true, competitor: false },
        { feature: "Webhooks", exit1: "1", competitor: true },
        { feature: "REST API", exit1: true, competitor: true },
        { feature: "Public status page", exit1: "1", competitor: "1" },
        { feature: "Log retention", exit1: "60 days", competitor: "2 days" },
      ],
    },
    paid: {
      exit1Plan: "exit1.dev Pro, $24/mo",
      competitorPlan: "Hyperping Essentials, $24/mo",
      heading: "Paid tier",
      subheading: "exit1.dev Pro vs Hyperping Essentials at the same $24/mo price point.",
      rows: [
        { feature: "Monitors included", exit1: "1,000", competitor: "50" },
        { feature: "Minimum check interval", exit1: "15 sec", competitor: "30 sec" },
        { feature: "Multi-region checks", exit1: true, competitor: true },
        { feature: "Protocols", exit1: EXIT1_FREE_PROTOCOLS, competitor: "HTTP + TCP + DNS" },
        { feature: "SSL certificate monitoring", exit1: true, competitor: true },
        { feature: "SMS alerts", exit1: "50 / month included", competitor: "20 / month" },
        { feature: "Status pages", exit1: "50 + custom domains", competitor: "1 + custom domain" },
        { feature: "Hosted MCP server", exit1: true, competitor: true },
        { feature: "REST API", exit1: true, competitor: true },
        { feature: "CSV bulk export", exit1: true, competitor: false },
        { feature: "Log retention", exit1: "3 years", competitor: "7 days" },
      ],
    },
    exit1Wins: [
      "1,000 monitors on Pro vs Hyperping's 50 at the same $24/mo price.",
      "Every protocol (TCP, UDP, ICMP, WebSocket) on the free tier, and 60-day log retention vs Hyperping's 2 days.",
      "SSL monitoring and JSON validation on the free plan.",
      "CSV bulk export on Pro.",
      "Up to 10 custom status page domains on Pro, plus branded monthly SLA reports for your clients.",
    ],
    competitorWins: [
      "Status pages are the center of Hyperping's product, and it shows in the polish.",
      "Hyperping free has no monitor-count edge over us (20 vs our 50), but its free plan is simple and quick to set up.",
      "Simple, focused product that's quick to set up.",
    ],
    faq: [
      {
        question: "Hyperping vs exit1.dev: which gives more at $24/mo?",
        answer:
          "exit1.dev Pro includes 1,000 monitors at $24/mo; Hyperping Essentials includes 50 monitors and 20 SMS a month at the same price. exit1.dev also adds every protocol, CSV export and SLA reports. Both put a status page on your own domain and both have a hosted MCP server.",
      },
      {
        question: "Does Hyperping's free plan beat exit1.dev's?",
        answer:
          "Hyperping free gives 20 monitors and REST API access; exit1.dev free gives 50 and adds SSL monitoring, JSON validation, and every protocol. exit1.dev free has more monitors, longer log retention (60 days vs 2), and more protocols.",
      },
      {
        question: "Is exit1.dev a good Hyperping alternative for status pages?",
        answer:
          "Yes. exit1.dev Pro includes 50 status pages and up to 10 custom domains like status.yourcompany.com, with HTTPS set up for you. Hyperping's status pages are more of a headline feature. If the status page is your primary purchase, compare them directly; if monitoring breadth matters more, exit1.dev leads.",
      },
    ],
    relatedPost: undefined,
    pricingNote:
      "Hyperping's Essentials plan is billed annually. Figures from hyperping.com/pricing, checked 2026-10-17. MCP from hyperping.com/docs/mcp, checked 2026-11-14.",
  },

  // ─────────────────────────────────────────────────────────────────────
  // Self-hosted and code-first tools. AI assistants reach for these three
  // whenever someone asks for a "cheap, simple, dev-minded" monitor, so each
  // one gets an honest hosted-vs-self-hosted page. Facts checked 2026-11-14
  // against each project's README or pricing page.
  {
    slug: "uptime-kuma",
    name: "Uptime Kuma",
    seoTitle: "Uptime Kuma vs exit1.dev: Self-Hosted or Hosted? (2026)",
    seoDescription:
      "Uptime Kuma vs exit1.dev. Kuma is free, open source and checks every 20 seconds on a server you run. exit1.dev is hosted, free for 50 monitors, with a REST API and MCP on every plan.",
    keywords:
      "uptime kuma vs exit1, uptime kuma alternative, hosted uptime kuma alternative, uptime kuma hosted, uptime kuma mcp, uptime kuma vs exit1.dev",
    heroSubtitle:
      "A free monitor you host yourself, vs a free monitor that runs somewhere else.",
    intro:
      "Uptime Kuma is the self-hosted monitor a lot of developers try first. It is MIT licensed, has no monitor limit, and checks as often as every 20 seconds. You pay with a server and the time to keep it running. exit1.dev is the hosted version of the same idea: 50 monitors free, a REST API, and an MCP server so Claude or Cursor can set the checks up for you.",
    bestKnownFor: "Best known for: open-source, self-hosted uptime monitoring with a friendly UI.",
    verdict:
      "Run Uptime Kuma if you want everything on your own box, need to watch services behind your firewall, or enjoy running your own tools. Pick exit1.dev if you want the monitor to live outside the infrastructure it watches, with nothing to patch or back up. A monitor on the same VPS as your app goes down with it. exit1.dev Free covers 50 monitors at 5-minute checks, Nano gets you 30-second checks for $9/mo, and Pro gets 15-second checks for $24/mo.",
    free: {
      exit1Plan: "exit1.dev Free",
      competitorPlan: "Uptime Kuma Self-hosted",
      heading: "Free vs self-hosted",
      subheading: "exit1.dev's free plan next to Uptime Kuma on your own server.",
      rows: [
        { feature: "Price", exit1: "$0", competitor: "$0 plus your server" },
        { feature: "Hosting", exit1: "Hosted for you", competitor: "You run it (Docker or Node.js)" },
        { feature: "Monitors", exit1: "50", competitor: "No limit" },
        { feature: "Check interval", exit1: "5 min (15 sec on Pro)", competitor: "20 sec" },
        { feature: "Protocols", exit1: EXIT1_FREE_PROTOCOLS, competitor: "HTTP, TCP, ping, DNS, WebSocket, Docker, push" },
        { feature: "Monitors private services", exit1: false, competitor: true },
        { feature: "Runs outside your infrastructure", exit1: true, competitor: "Only if you host it elsewhere" },
        { feature: "SSL certificate monitoring", exit1: true, competitor: true },
        { feature: "Notification channels", exit1: "Email + 1 webhook", competitor: "90+ services" },
        { feature: "Status pages", exit1: "1", competitor: "Multiple, with custom domains" },
        { feature: "REST API", exit1: true, competitor: "No official API" },
        { feature: "MCP server", exit1: "Hosted, official", competitor: "Community projects" },
        { feature: "Updates and backups", exit1: "Handled for you", competitor: "Yours to do" },
      ],
    },
    paid: null,
    exit1Wins: [
      "Nothing to host. No Docker container, no upgrades, no database to back up.",
      "The monitor runs outside your infrastructure, so it still alerts when your server or your whole provider is down.",
      "An official REST API. Uptime Kuma's internal API is not supported for third-party use.",
      "A hosted MCP server on every plan: your agent creates the checks and alerts, then fires a test alert.",
      "15-second checks and multi-region checks on Pro.",
    ],
    competitorWins: [
      "Free with no monitor limit. You only pay for the server.",
      "20-second checks at no cost. exit1.dev needs Nano ($9/mo) for 30 seconds and Pro ($24/mo) for 15.",
      "It can reach services behind your firewall. exit1.dev only checks public endpoints.",
      "90+ notification services out of the box, and your monitoring history stays on your own server.",
    ],
    faq: [
      {
        question: "Is there a hosted alternative to Uptime Kuma?",
        answer:
          "Yes. exit1.dev is a hosted uptime monitor with a free plan: 50 monitors, 5-minute checks, HTTP, TCP, UDP, ICMP and WebSocket checks, SSL monitoring, a status page, a REST API and an MCP server. You sign up and add URLs. There is no server to run.",
      },
      {
        question: "Is Uptime Kuma really free?",
        answer:
          "The software is free and MIT licensed. You still need a server to run it on, plus the time to update it and back it up. A small VPS costs about the same as exit1.dev Indie ($4/mo), which gives you 100 monitors at 1-minute checks with nothing to maintain.",
      },
      {
        question: "Does Uptime Kuma have an MCP server?",
        answer:
          "There is no official one. Community projects wrap Uptime Kuma's internal API, which the project does not support for third-party use. exit1.dev ships an official hosted MCP server at app.exit1.dev/mcp/v1 on every plan, Free included, plus the exit1-mcp npm package.",
      },
      {
        question: "Should I host my uptime monitor on the same server as my app?",
        answer:
          "No. If that server or its network goes down, the monitor goes down with it and nobody gets an alert. Run Uptime Kuma on a separate machine with a different provider, or use a hosted monitor like exit1.dev that checks from outside.",
      },
    ],
    relatedPost: undefined,
    pricingNote:
      "Uptime Kuma facts from the project README and wiki at github.com/louislam/uptime-kuma (version 2.5), checked 2026-11-14.",
  },

  // ─────────────────────────────────────────────────────────────────────
  {
    slug: "gatus",
    name: "Gatus",
    seoTitle: "Gatus vs exit1.dev: YAML Config or Hosted Monitoring? (2026)",
    seoDescription:
      "Gatus vs exit1.dev. Gatus is an open-source health dashboard you configure in YAML and host yourself. exit1.dev is hosted, free for 50 monitors, and set up through a REST API or MCP.",
    keywords:
      "gatus vs exit1, gatus alternative, hosted gatus alternative, gatus.io pricing, gatus mcp, gatus vs exit1.dev",
    heroSubtitle:
      "Health checks in a YAML file on your own server, vs a hosted monitor your agent can configure.",
    intro:
      "Gatus is an open-source health dashboard for people who like their monitoring in version control. You describe endpoints and conditions in a YAML file, run the container, and get a status page with alerting. exit1.dev does the core job as a hosted service: 50 monitors free, and you create checks from the dashboard, the REST API, or an MCP server that lets Claude or Cursor do it for you.",
    bestKnownFor: "Best known for: config-as-code health checks with a built-in status page.",
    verdict:
      "Gatus fits if you want monitoring defined in Git and you are happy to host it. It is free, Apache-2.0 licensed, and speaks more protocols than most hosted tools. exit1.dev fits if you want the same checks without a server: Free covers 50 monitors, and Nano gives 250 monitors at 30-second checks for $9/mo. Gatus's own managed plan starts at $10/mo for 30 endpoints at 2-minute checks.",
    free: {
      exit1Plan: "exit1.dev Free",
      competitorPlan: "Gatus Self-hosted",
      heading: "Free vs self-hosted",
      subheading: "exit1.dev's free plan next to Gatus on your own server.",
      rows: [
        { feature: "Price", exit1: "$0", competitor: "$0 plus your server" },
        { feature: "Hosting", exit1: "Hosted for you", competitor: "You run it (Docker or binary)" },
        { feature: "Configuration", exit1: "Dashboard, REST API or MCP", competitor: "YAML file" },
        { feature: "Monitors", exit1: "50", competitor: "No limit" },
        { feature: "Check interval", exit1: "5 min (15 sec on Pro)", competitor: "You set it (60 sec default)" },
        { feature: "Protocols", exit1: EXIT1_FREE_PROTOCOLS, competitor: "HTTP, ICMP, TCP, UDP, DNS, SSH, TLS, WebSocket, gRPC" },
        { feature: "Response validation (status, body, JSON)", exit1: true, competitor: true },
        { feature: "Monitors private services", exit1: false, competitor: true },
        { feature: "Alerting", exit1: "Email + 1 webhook", competitor: "40+ providers" },
        { feature: "Status page", exit1: "1", competitor: "Built in" },
        { feature: "MCP server", exit1: "Hosted, official", competitor: "None published" },
      ],
    },
    paid: {
      exit1Plan: "exit1.dev Nano, $9/mo",
      competitorPlan: "Gatus Standard (gatus.io), $10/mo",
      heading: "Hosted vs hosted",
      subheading: "exit1.dev Nano ($9/mo, $7 annual) vs the managed Gatus.io Standard plan ($10/mo, $108/yr).",
      rows: [
        { feature: "Monitors included", exit1: "250", competitor: "30 endpoints" },
        { feature: "Minimum check interval", exit1: "30 sec", competitor: "2 min" },
        { feature: "Status pages", exit1: "5", competitor: "1" },
        { feature: "MCP server", exit1: "Hosted, official", competitor: "None published" },
        { feature: "Free trial", exit1: "7 days", competitor: "7 days" },
      ],
    },
    exit1Wins: [
      "Nothing to host or upgrade, and the checks run from outside your infrastructure.",
      "250 monitors at 30-second checks for $9/mo. Gatus.io Standard gives 30 endpoints at 2 minutes for $10/mo.",
      "A REST API and a hosted MCP server on every plan, so an agent can create checks and alerts for you.",
      "A dashboard for the people on your team who will never open a YAML file.",
    ],
    competitorWins: [
      "Monitoring as a YAML file in Git, reviewed and deployed like the rest of your config.",
      "Free and open source with no monitor limit when you host it yourself.",
      "More protocols out of the box, including gRPC, SSH and STARTTLS.",
      "It can reach services behind your firewall. exit1.dev only checks public endpoints.",
    ],
    faq: [
      {
        question: "Is there a hosted alternative to Gatus?",
        answer:
          "Yes. exit1.dev is a hosted uptime monitor with a free plan of 50 monitors, plus a REST API and MCP server for people who want to script their setup. Gatus also sells its own managed service at gatus.io, starting at $10/mo for one status page with 30 endpoints at 2-minute checks.",
      },
      {
        question: "Can I keep monitoring as code with exit1.dev?",
        answer:
          "You can script it. Every plan includes the REST API with full create, update and delete for checks, so a deploy script or CI job can keep monitors in sync with your services. There is no YAML file format like Gatus has.",
      },
      {
        question: "Does Gatus have an MCP server?",
        answer:
          "Gatus does not publish one as of November 2026. exit1.dev ships an official hosted MCP server at app.exit1.dev/mcp/v1 on every plan, Free included, with 14 tools for reading and changing your monitoring.",
      },
    ],
    relatedPost: undefined,
    pricingNote:
      "Gatus.io plan figures from gatus.io/pricing, checked 2026-11-14. Self-hosted Gatus is free under the Apache-2.0 license.",
  },

  // ─────────────────────────────────────────────────────────────────────
  {
    slug: "checkly",
    name: "Checkly",
    seoTitle: "Checkly vs exit1.dev: Synthetic Checks or Uptime Monitoring? (2026)",
    seoDescription:
      "Checkly vs exit1.dev. Checkly runs Playwright browser checks as code and meters check runs. exit1.dev does flat-priced uptime monitoring: 50 monitors free, 1,000 on Pro at $24/mo.",
    keywords:
      "checkly vs exit1, checkly alternative, cheaper checkly alternative, checkly pricing, checkly uptime monitoring, checkly vs exit1.dev",
    heroSubtitle:
      "Playwright browser checks with metered runs, vs flat-priced uptime monitoring.",
    intro:
      "Checkly is a synthetic monitoring platform built around Playwright. You write browser and API checks as code, run them from the CLI, and pay by the number of check runs. exit1.dev does one job: uptime, SSL and API monitoring at a flat price per plan. If you only need to know that your site and API are up, you are paying Checkly for a lot you will not use.",
    bestKnownFor: "Best known for: Playwright-based synthetic monitoring as code.",
    verdict:
      "Checkly is the right tool when you need to script real user flows, like logging in and checking out, in a headless browser. For uptime and API checks, exit1.dev gives you far more for the same money: 50 monitors free against Checkly's 10, and 1,000 monitors at 15-second checks on Pro for $24/mo against 50 uptime monitors at 1-minute checks on Checkly Starter.",
    free: {
      exit1Plan: "exit1.dev Free",
      competitorPlan: "Checkly Hobby",
      heading: "Free tier",
      subheading: "What each gives you for $0.",
      rows: [
        { feature: "Uptime monitors", exit1: "50", competitor: "10" },
        { feature: "Uptime check interval", exit1: "5 min", competitor: "2 min" },
        { feature: "API checks", exit1: "Included in the 50 monitors", competitor: "10,000 runs / month" },
        { feature: "Browser checks (Playwright)", exit1: false, competitor: "1,000 runs / month" },
        { feature: "Hosted MCP server", exit1: true, competitor: true },
      ],
    },
    paid: {
      exit1Plan: "exit1.dev Pro, $24/mo",
      competitorPlan: "Checkly Starter, $24/mo",
      heading: "Paid tier",
      subheading: "exit1.dev Pro ($24/mo, $20 annual) vs Checkly Starter ($24/mo, billed annually).",
      rows: [
        { feature: "Uptime monitors", exit1: "1,000", competitor: "50" },
        { feature: "Minimum uptime check interval", exit1: "15 sec", competitor: "1 min" },
        { feature: "API check runs", exit1: "Not metered", competitor: "25,000 / month" },
        { feature: "Browser checks (Playwright)", exit1: false, competitor: "3,000 runs / month" },
        { feature: "Users", exit1: "10", competitor: "3" },
        { feature: "REST API", exit1: true, competitor: true },
        { feature: "Hosted MCP server", exit1: true, competitor: true },
      ],
    },
    exit1Wins: [
      "50 uptime monitors on the free plan against Checkly's 10.",
      "1,000 monitors at 15-second checks on Pro for $24/mo. Checkly Starter gives 50 at 1 minute for the same price.",
      "Flat pricing. A check that runs every 15 seconds costs the same as one that runs every 5 minutes.",
      "10 team members on Pro against 3 users on Starter.",
    ],
    competitorWins: [
      "Playwright browser checks for multi-step user flows. exit1.dev has no browser checks.",
      "Monitoring as code: checks live in your repo and deploy from the Checkly CLI in CI.",
      "A faster free interval: 2 minutes against our 5.",
      "A larger MCP surface: 48 tools against our 14.",
    ],
    faq: [
      {
        question: "Is exit1.dev a cheaper alternative to Checkly?",
        answer:
          "For uptime and API monitoring, yes. exit1.dev Pro is $24/mo for 1,000 monitors at 15-second checks. Checkly Starter is $24/mo billed annually for 50 uptime monitors at 1-minute checks, plus metered API and browser check runs. If you need Playwright browser checks, Checkly is the one that has them.",
      },
      {
        question: "Does exit1.dev do browser or Playwright checks?",
        answer:
          "No. exit1.dev checks HTTP, TCP, UDP, ICMP and WebSocket endpoints and validates status codes, headers, body text and JSON. It does not run a browser. For scripted login or checkout flows, use Checkly.",
      },
      {
        question: "How do the free plans compare?",
        answer:
          "Checkly Hobby gives 10 uptime monitors at 2-minute checks, 10,000 API check runs and 1,000 browser check runs a month. exit1.dev Free gives 50 monitors at 5-minute checks with no run metering, plus SSL monitoring, a status page, the REST API and MCP access.",
      },
    ],
    relatedPost: undefined,
    pricingNote:
      "Checkly figures from checklyhq.com/pricing, checked 2026-11-14. Checkly's listed prices are for annual billing, and it does not publish which plans include its MCP server.",
  },
];

export function getCompetitor(slug: string): Competitor | undefined {
  return competitors.find((c) => c.slug === slug);
}

export const competitorSlugs = competitors.map((c) => c.slug);
