import React from 'react';
import { Metadata } from 'next';
import ProductPage from '@/components/ProductPage';
import StructuredData from '@/components/StructuredData';
import {
  Radio,
  Clock,
  Globe,
  BarChart3,
  Bell,
  Shield,
  Gauge,
  FileText,
  Code,
  Lock,
  Zap,
  RefreshCw
} from 'lucide-react';

export const metadata: Metadata = {
  title: "Free WebSocket Monitoring | WS & WSS Uptime Checks | exit1.dev",
  description: "Monitor WebSocket endpoints with free WS and WSS health checks. Verify handshake connections, track latency, and get instant alerts when real-time services go down. No credit card required.",
  keywords: "WebSocket monitoring, WS monitoring, WSS monitoring, WebSocket health check, WebSocket uptime, real-time monitoring, WebSocket latency, free WebSocket monitor, WebSocket connection monitoring",
  openGraph: {
    title: "Free WebSocket Monitoring | WS & WSS Uptime Checks | exit1.dev",
    description: "Monitor WebSocket endpoints with free WS and WSS health checks. Verify handshake connections, track latency, and get instant alerts when real-time services go down.",
    type: "website",
    url: "https://exit1.dev/websocket-monitoring",
  },
  twitter: {
    title: "Free WebSocket Monitoring | WS & WSS Uptime Checks | exit1.dev",
    description: "Monitor WebSocket endpoints with free WS and WSS health checks. Verify handshake connections, track latency, and get instant alerts when real-time services go down.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://exit1.dev/websocket-monitoring",
  },
};

const WebSocketMonitoring = () => {
  const features = [
    {
      title: "WS & WSS Handshake Checks",
      description: "Verify WebSocket connections by performing a full handshake. Detect failures in the HTTP upgrade, TLS negotiation, and protocol switch.",
      icon: <Radio className="w-6 h-6 text-white" />
    },
    {
      title: "Connection Latency Tracking",
      description: "Measure how long it takes to establish a WebSocket connection, broken down by DNS, TCP, TLS, and handshake phases.",
      icon: <Gauge className="w-6 h-6 text-white" />
    },
    {
      title: "SSL Certificate Monitoring",
      description: "WSS endpoints get automatic SSL certificate validation, expiration alerts, and security checks included with every check.",
      icon: <Lock className="w-6 h-6 text-white" />
    },
    {
      title: "Smart Failure Detection",
      description: "Automatic 30-second re-checks on first failure. Alerts only fire after consecutive failures to eliminate false positives from transient issues.",
      icon: <Shield className="w-6 h-6 text-white" />
    },
    {
      title: "Multi-Region Monitoring",
      description: "Test WebSocket connections from US Central, Europe West, and Asia Southeast to catch region-specific connectivity issues.",
      icon: <Globe className="w-6 h-6 text-white" />
    },
    {
      title: "Real-Time Alerts",
      description: "Get notified instantly via email, SMS, Slack, Discord, or any webhook when your WebSocket endpoints fail.",
      icon: <Zap className="w-6 h-6 text-white" />
    }
  ];

  const comparisonTable = [
    {
      feature: "Free WebSocket monitoring",
      exit1: true,
      competitors: "Paid only"
    },
    {
      feature: "WS and WSS support",
      exit1: true,
      competitors: "WSS only"
    },
    {
      feature: "Full handshake verification",
      exit1: true,
      competitors: "Basic HTTP check"
    },
    {
      feature: "Connection latency breakdown",
      exit1: true,
      competitors: false
    },
    {
      feature: "SSL monitoring for WSS",
      exit1: true,
      competitors: "Separate service"
    },
    {
      feature: "Multi-region checks",
      exit1: true,
      competitors: "Single region"
    },
    {
      feature: "1-minute check intervals",
      exit1: true,
      competitors: "5+ minutes"
    },
    {
      feature: "Smart false-positive prevention",
      exit1: true,
      competitors: "Basic retry"
    },
    {
      feature: "Instant alerts (email, SMS, webhooks)",
      exit1: true,
      competitors: "Email only on free"
    },
    {
      feature: "No credit card required",
      exit1: true,
      competitors: "Card required"
    }
  ];

  const faq = [
    {
      question: "What is WebSocket monitoring?",
      answer: "WebSocket monitoring tests your WS and WSS endpoints by performing a full WebSocket handshake — the HTTP upgrade request followed by the protocol switch to WebSocket. If the handshake completes successfully, the endpoint is up. If it fails or times out, you get alerted. This catches issues that regular HTTP checks would miss."
    },
    {
      question: "Is WebSocket monitoring included in the free tier?",
      answer: "Yes, WebSocket monitoring is available on both the Free and Nano tiers. On the Free tier you get up to 50 monitors with 5-minute check intervals. On the Nano tier you get up to 200 monitors with 1-minute check intervals."
    },
    {
      question: "What is the difference between WS and WSS?",
      answer: "WS (ws://) is unencrypted WebSocket, while WSS (wss://) is WebSocket Secure which runs over TLS, similar to HTTPS. For production services you should always use WSS. Exit1.dev supports both protocols and automatically monitors SSL certificates for WSS endpoints."
    },
    {
      question: "Can WebSocket checks detect message-level issues?",
      answer: "WebSocket checks verify the connection handshake only. They confirm that the server accepts WebSocket connections and the upgrade completes successfully. They do not send or validate application-level messages after the connection is established. For message-level validation, pair WebSocket checks with application health endpoints."
    },
    {
      question: "How is WebSocket monitoring different from HTTP monitoring?",
      answer: "HTTP checks request a page and validate the response. WebSocket checks perform the HTTP upgrade handshake that switches the connection from HTTP to the WebSocket protocol. A server might respond to regular HTTP requests just fine but fail to accept WebSocket upgrades — WebSocket checks catch exactly that failure mode."
    },
    {
      question: "What metrics do WebSocket checks provide?",
      answer: "Each check records the total connection time, DNS lookup duration, TCP connect time, TLS handshake time (for WSS), the resolved IP address, and IP family. For WSS endpoints, SSL certificate details including issuer, validity dates, and expiration warnings are also captured."
    },
    {
      question: "How does exit1.dev prevent false WebSocket alerts?",
      answer: "When a WebSocket check fails, exit1.dev performs an automatic 30-second re-check. An alert is only triggered after consecutive failures. This eliminates false positives from brief network blips or server restarts, while still catching real outages quickly."
    },
    {
      question: "What alert channels are supported for WebSocket checks?",
      answer: "WebSocket checks support all the same alert channels as other check types: email, SMS (Nano tier), and webhooks. Webhooks integrate with Slack, Discord, Microsoft Teams, PagerDuty, Opsgenie, and any other webhook-enabled platform."
    }
  ];

  const technicalDetails = {
    architecture: "WebSocket monitoring runs on the same multi-region infrastructure as all exit1.dev checks. Each check performs a complete WebSocket handshake including the HTTP upgrade request and 101 Switching Protocols response. For WSS endpoints, the TLS negotiation is timed separately. Results include full connection phase breakdown and SSL certificate analysis.",
    performance: "WebSocket handshake checks execute quickly with minimal overhead. The connection is closed immediately after successful handshake verification. Strict URL validation ensures only valid WebSocket URLs are accepted. Process-level timeouts prevent hung connections from affecting other checks.",
    api: "WebSocket checks are fully supported through the exit1.dev REST API. Create, update, delete, and query WebSocket monitors programmatically. Access check history, connection times, and SSL data via API endpoints. HMAC authentication with rate limits of 1000 requests/hour per key."
  };

  const relatedFeatures = [
    {
      title: "Real-Time Monitoring",
      description: "Monitor websites and APIs with fast checks and instant alerts when issues occur.",
      href: "/real-time-monitoring",
      icon: <Clock className="w-6 h-6 text-white" />
    },
    {
      title: "SSL Monitoring",
      description: "Automatic certificate validation, expiration alerts, and security checks for HTTPS and WSS endpoints.",
      href: "/ssl-monitoring",
      icon: <Lock className="w-6 h-6 text-white" />
    },
    {
      title: "Smart Alerting",
      description: "Configure webhooks, email alerts, and custom notification rules to stay informed about issues.",
      href: "/alerting",
      icon: <Bell className="w-6 h-6 text-white" />
    },
    {
      title: "Analytics & Reports",
      description: "Track uptime trends, response times, and performance metrics with detailed analytics.",
      href: "/analytics",
      icon: <BarChart3 className="w-6 h-6 text-white" />
    },
    {
      title: "Global Monitoring",
      description: "Monitor your infrastructure from multiple global locations for comprehensive coverage.",
      href: "/global-monitoring",
      icon: <Globe className="w-6 h-6 text-white" />
    },
    {
      title: "API Integration",
      description: "Integrate monitoring data into your workflows with our comprehensive REST API.",
      href: "/api-webhooks",
      icon: <Code className="w-6 h-6 text-white" />
    }
  ];

  return (
    <>
      <StructuredData
        type="Product"
        data={{
          name: "WebSocket Monitoring",
          description: "Monitor WebSocket endpoints with free WS and WSS health checks. Verify handshake connections, track latency, and get instant alerts when real-time services go down.",
          url: "https://exit1.dev/websocket-monitoring",
          brand: {
            "@type": "Brand",
            name: "exit1.dev"
          },
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock"
          },
          category: "WebSocket Monitoring",
          features: features.map(f => f.title),
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "85"
          }
        }}
      />

      <StructuredData
        type="FAQPage"
        data={{
          mainEntity: faq.map(item => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer
            }
          }))
        }}
      />

      <ProductPage
        title="WebSocket Monitoring for Real-Time Services"
        subtitle="WS and WSS handshake verification, latency tracking, and instant alerts"
        description="Monitor your WebSocket endpoints with full handshake checks. Track connection latency, catch upgrade failures, and get alerted when your real-time services go down. Free on both tiers."
        features={features}
        ctaText="Start WebSocket Monitoring"
        ctaHref="https://app.exit1.dev/"
        seoTitle="Free WebSocket Monitoring | WS & WSS Uptime Checks | exit1.dev"
        seoDescription="Monitor WebSocket endpoints with free WS and WSS health checks. Verify handshake connections, track latency, and get instant alerts when real-time services go down."
        comparisonTable={comparisonTable}
        faq={faq}
        technicalDetails={technicalDetails}
        relatedFeatures={relatedFeatures}
        nanoUpgrade={{
          title: "Need faster WebSocket checks?",
          description: "Upgrade to Nano for 1-minute WebSocket check intervals, SMS alerts, 200 monitors, and 1-year data retention."
        }}
      />
    </>
  );
};

export default WebSocketMonitoring;
