import React from 'react';
import { Metadata } from 'next';
import ProductPage from '@/components/ProductPage';
import StructuredData from '@/components/StructuredData';
import {
  Activity,
  Radio,
  Zap,
  Layers,
  MousePointer2,
  Download,
  Wifi,
  Bell,
  BarChart3,
  Globe,
  Shield,
  Code,
} from 'lucide-react';

export const metadata: Metadata = {
  title: "Live Website Monitoring — Streamed Probes, Sub-Second Charts | exit1.dev",
  description: "Live website monitoring that actually streams. Watch HTTP probes paint in your browser the moment they finish — over a dedicated WebSocket, not on a 30-second polling refresh. Per-stage DNS / Connect / TLS / TTFB phases, drag-to-zoom charts, CSV/JSON probe export.",
  keywords: "live website monitoring, live response time chart, real-time uptime dashboard, streaming uptime monitoring, websocket monitoring dashboard, live HTTP probe stream, real-time TTFB monitoring, live API monitoring",
  openGraph: {
    title: "Live Website Monitoring — Streamed Probes, Sub-Second Charts | exit1.dev",
    description: "Watch HTTP probes paint in your browser the moment they finish — streamed over a dedicated WebSocket, not a 30-second polling refresh. Per-stage phases, drag-to-zoom, CSV/JSON probe export.",
    type: "website",
    url: "https://exit1.dev/live-checks",
  },
  twitter: {
    title: "Live Website Monitoring — Streamed Probes, Sub-Second Charts | exit1.dev",
    description: "Watch HTTP probes paint in your browser the moment they finish — streamed over a dedicated WebSocket, not a 30-second polling refresh.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://exit1.dev/live-checks",
  },
};

const LiveChecks = () => {
  const features = [
    {
      title: "Streamed, Not Polled",
      description: "Probes flow from our VPS workers into your browser over a dedicated WebSocket. New points paint in well under a second — no dashboard auto-refresh, no Firestore round-trip, no 30-second lag.",
      icon: <Radio className="w-6 h-6 text-foreground" />,
    },
    {
      title: "Canvas Scrolling Chart",
      description: "A real instrument-panel line chart that tweens smoothly as the live tip advances. A particle trail streams backward in real-time mode and quiets when you pan back through history.",
      icon: <Activity className="w-6 h-6 text-foreground" />,
    },
    {
      title: "Drag-to-Zoom",
      description: "Select any region of the chart to zoom into a single spike or recovery. Double-click to progressively zoom out. A brush navigator below lets you pan through the full buffer while it keeps filling.",
      icon: <MousePointer2 className="w-6 h-6 text-foreground" />,
    },
    {
      title: "Per-Stage Phase Breakdown",
      description: "Toggle Total ↔ Phases to see DNS → Connect → TLS → TTFB rendered as a stacked area on every single probe. Diagnose latency where it actually lives instead of staring at an aggregate number.",
      icon: <Layers className="w-6 h-6 text-foreground" />,
    },
    {
      title: "Tier-Classified Probes",
      description: "Every probe is classified against the visible window's median: amber dots for ≥2× median (elevated), red for ≥3× (spike). Markers and table-row tints always agree.",
      icon: <BarChart3 className="w-6 h-6 text-foreground" />,
    },
    {
      title: "Raw Probe Table",
      description: "Newest-first table beside the chart with timestamp, status, response time, per-stage timings, and status code. New rows flash green for 900ms as they land. Click a row to highlight the chart point — and vice versa.",
      icon: <Code className="w-6 h-6 text-foreground" />,
    },
    {
      title: "CSV & JSON Probe Export",
      description: "Download visible-window or full-buffer probes as CSV or JSON, with range presets from 5 minutes to 24 hours. Per-stage phase timings, status codes, and state segments are all included in the payload.",
      icon: <Download className="w-6 h-6 text-foreground" />,
    },
    {
      title: "Per-Region Multi-Connect",
      description: "Your browser opens one WebSocket per region your checks live in (Frankfurt + opt-in Boston). Each region is independent and failure-isolated, capped at 10 concurrent connections per user.",
      icon: <Globe className="w-6 h-6 text-foreground" />,
    },
    {
      title: "Replay-Buffer Resilience",
      description: "Lose your connection on a flaky train Wi-Fi? Reconnects deliver a fresh snapshot plus any state transitions missed during the gap, from a 5-minute server-side replay ring buffer. Falls back to Firestore on outage — never an error.",
      icon: <Wifi className="w-6 h-6 text-foreground" />,
    },
    {
      title: "Firebase ID Token Auth",
      description: "The WebSocket transport authenticates with the same Clerk → Firebase token bridge as the rest of the app. No new trust plane on the VPS. Probes are filtered to the verified user.",
      icon: <Shield className="w-6 h-6 text-foreground" />,
    },
    {
      title: "30-Byte Wire Format",
      description: "Compact per-probe payload (~30 bytes on the wire, ~100 in heap) makes the stream cheap enough to leave open all day. 30-second app-level keepalive plus protocol-level ping/pong keep the socket honest.",
      icon: <Zap className="w-6 h-6 text-foreground" />,
    },
    {
      title: "Bidirectional Selection",
      description: "Click a probe on the chart to highlight its row in the table. Click a row to highlight its dot on the chart. Click again to deselect. The two surfaces share one selection state.",
      icon: <Bell className="w-6 h-6 text-foreground" />,
    },
  ];

  type ComparisonRow = {
    feature: string;
    exit1: string | boolean;
    competitors: string | boolean;
  };

  const comparisonTable: ComparisonRow[] = [
    {
      feature: "Probes streamed over WebSocket (no polling)",
      exit1: true,
      competitors: false,
    },
    {
      feature: "Sub-second paint from probe → browser",
      exit1: "Under 1s p50",
      competitors: "30–60s dashboard refresh",
    },
    {
      feature: "Per-stage DNS / Connect / TLS / TTFB on every probe",
      exit1: true,
      competitors: "Aggregate or sampled only",
    },
    {
      feature: "Drag-to-zoom chart with brush navigator",
      exit1: true,
      competitors: false,
    },
    {
      feature: "Tier-classified probe markers (elevated / spike)",
      exit1: true,
      competitors: false,
    },
    {
      feature: "Bidirectional chart ↔ table selection",
      exit1: true,
      competitors: false,
    },
    {
      feature: "CSV + JSON probe export with phase timings",
      exit1: true,
      competitors: "Aggregate CSV only",
    },
    {
      feature: "5-minute replay ring buffer on reconnect",
      exit1: true,
      competitors: false,
    },
    {
      feature: "Multi-region streaming (EU + opt-in US)",
      exit1: true,
      competitors: "Single dashboard refresh",
    },
    {
      feature: "Graceful fallback if the socket drops",
      exit1: "Firestore onSnapshot",
      competitors: "Error / blank state",
    },
  ];

  const faq = [
    {
      question: "What does \"live\" actually mean here?",
      answer: "Every other uptime tool we audited (Pingdom, UptimeRobot, Better Stack, Checkly, Hyperping, StatusCake) calls itself real-time, but the dashboard refreshes on a 30–60 second timer and re-renders from a polled API. Exit1's Live Checks stream individual probes from the VPS worker into your browser over a dedicated WebSocket transport. A probe finishing on the wire shows up on your chart in p50 well under a second — there is no polling layer.",
    },
    {
      question: "Which check types does the Live page work for?",
      answer: "All eight: HTTP/HTTPS, heartbeat, DNS, ICMP, TCP, UDP, WebSocket, and redirect. The per-stage phase view (DNS → Connect → TLS → TTFB) is most useful for HTTP-family checks where every probe captures all four stages; other check types fall back to total response time.",
    },
    {
      question: "How does the chart handle a spike I want to investigate later?",
      answer: "The visible window keeps filling live, but the brush navigator below the main chart shows the entire buffer — you can drag it back to a 24-hour view, drag-zoom into a specific minute, and click the spike to highlight the corresponding row in the raw probe table. Or just export the visible window as CSV/JSON.",
    },
    {
      question: "What happens if my Wi-Fi drops while the Live page is open?",
      answer: "The server holds a 5-minute replay ring buffer per region. When the socket reconnects, you get a fresh state snapshot plus any state transitions you missed during the gap — filtered to your verified user. If the WebSocket stays down longer, the UI silently falls back to Firestore onSnapshot with an 8-second debounce to prevent flicker, and a banner names the affected region so you know you're in fallback mode.",
    },
    {
      question: "Can I export the raw probe data for an incident report?",
      answer: "Yes. Download visible-window or full-buffer probes as CSV or JSON, with presets from 5 minutes to 24 hours. The exported payload includes per-stage phase timings (DNS / Connect / TLS / TTFB), status codes, response times, and any state-segment events (maintenance start/end, disabled start/end) that fell inside the range.",
    },
    {
      question: "How is this different from real-time monitoring as everyone else describes it?",
      answer: "Most \"real-time\" features run a 30-second polled check and then auto-refresh a dashboard every 30–60 seconds. That's still 30–60 seconds of UI lag on top of detection lag. Exit1's Live page streams the probe payload itself — about 30 bytes on the wire — so the only lag is the network hop from Frankfurt or Boston to your browser. The chart, the phase breakdown, and the table all update in the same frame.",
    },
    {
      question: "Does the Live page work on the Free tier?",
      answer: "Free users see a blurred preview of the Live page with an upgrade overlay. Streaming is available from Nano upward. All paid tiers stream with no rate-limit on the WebSocket transport.",
    },
    {
      question: "Will leaving the Live page open all day burn my data plan?",
      answer: "No. The wire format is roughly 30 bytes per probe. A check running every 15 seconds (Agency floor) is about 7 KB/hour per check — small enough to leave open in a background tab indefinitely. A 30-second app-level keepalive plus protocol-level ping/pong keep the socket honest without adding meaningful overhead.",
    },
  ];

  const technicalDetails = {
    architecture:
      "Probes are dispatched on a continuous worker pool with a 500ms dispatcher tick on dedicated VPS nodes in Frankfurt (vps-eu-1) and Boston (vps-us-1). When a probe completes, the result is pushed into a region-local WebSocket gateway (wss://live-eu.exit1.dev/ws, wss://live-us.exit1.dev/ws) and fanned out to subscribed clients filtered by verified Firebase uid. The browser opens one WebSocket per region the user has checks in, capped at 10 concurrent connections. Each region is independent and failure-isolated.",
    performance:
      "Probe → paint p50 under 1 second. Wire format ~30 bytes per probe (compact float fields: {t, rt, sc?, st, dn?, cn?, tl?, ft?}), ~100 bytes in browser heap. Sub-minute check support (15-second floor on Agency, 30-second on Pro). Hardened DNS stack — c-ares resolver plus a local recursive Unbound cache on the VPS — so DNS phase noise stays out of the chart.",
    api:
      "Live Checks is a frontend feature on top of the same Firebase ID token bridge that backs the rest of the app — no new SDK. For programmatic export, the Public API (Pro / Agency, with the checks:read scope) exposes /v1/checks/{id}/history and /v1/checks/{id}/stats for the same data the Live page renders, and the exit1-mcp server gives AI assistants the same windows.",
  };

  const relatedFeatures = [
    {
      title: "Analytics & Reports",
      description:
        "Once the live spike is gone, the same data flows into trend reports, SLA metrics, and the daily/weekly summaries.",
      href: "/analytics",
      icon: <BarChart3 className="w-6 h-6 text-foreground" />,
    },
    {
      title: "Logs",
      description:
        "Search and filter the full historical log behind every check — BigQuery-backed and exportable as CSV.",
      href: "/logs",
      icon: <Code className="w-6 h-6 text-foreground" />,
    },
    {
      title: "Smart Alerting",
      description:
        "Stream live, but get pinged via email, SMS, Slack, Discord, Teams, PagerDuty, or any webhook when something flips.",
      href: "/alerting",
      icon: <Bell className="w-6 h-6 text-foreground" />,
    },
    {
      title: "SSL Monitoring",
      description:
        "Every HTTPS probe on the Live page also validates the certificate — issuer, subject, days-until-expiry.",
      href: "/ssl-monitoring",
      icon: <Shield className="w-6 h-6 text-foreground" />,
    },
    {
      title: "Global Monitoring",
      description:
        "Stream from Frankfurt by default, or opt into the Boston region per check on Pro and Agency.",
      href: "/global-monitoring",
      icon: <Globe className="w-6 h-6 text-foreground" />,
    },
    {
      title: "Status Pages",
      description:
        "The same probe stream feeds public status pages — including 90-day heartbeat calendars and custom domains.",
      href: "/status-pages",
      icon: <Activity className="w-6 h-6 text-foreground" />,
    },
  ];

  return (
    <>
      <StructuredData
        type="Product"
        data={{
          name: "Live Website Monitoring",
          description:
            "Live website monitoring that streams probes from VPS workers into the browser over a dedicated WebSocket transport. Sub-second paint, per-stage DNS/Connect/TLS/TTFB phases, drag-to-zoom canvas chart, and CSV/JSON probe export.",
          url: "https://exit1.dev/live-checks",
          brand: {
            "@type": "Brand",
            name: "exit1.dev",
          },
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          },
          category: "Website Monitoring",
          features: features.map((f) => f.title),
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            reviewCount: "150",
          },
        }}
      />

      <StructuredData
        type="FAQPage"
        data={{
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }}
      />

      <ProductPage
        title="Live monitoring that actually streams"
        subtitle="Probes paint in your browser the moment they finish — not on the next 30-second refresh."
        description="Most uptime tools call themselves real-time, then refresh a dashboard every 30–60 seconds. Live Checks streams each probe over a dedicated WebSocket: canvas chart, per-stage DNS / Connect / TLS / TTFB phases, drag-to-zoom, bidirectional probe selection, CSV + JSON export."
        features={features}
        ctaText="Open the Live Page"
        ctaHref="https://app.exit1.dev/"
        seoTitle="Live Website Monitoring — Streamed Probes, Sub-Second Charts | exit1.dev"
        seoDescription="Live website monitoring that actually streams. Watch HTTP probes paint in your browser the moment they finish — over a dedicated WebSocket, not a 30-second polling refresh."
        comparisonTable={comparisonTable}
        faq={faq}
        technicalDetails={technicalDetails}
        relatedFeatures={relatedFeatures}
        nanoUpgrade={{
          title: "Live Checks streams from Nano upward",
          description:
            "Free shows a blurred preview with an upgrade overlay. Nano ($9/mo) unlocks the Live page on every check with no rate limits on the WebSocket. Pro adds 30-second intervals and the Public API; Agency drops to 15 seconds.",
        }}
      />
    </>
  );
};

export default LiveChecks;
