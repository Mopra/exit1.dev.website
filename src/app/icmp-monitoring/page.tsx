import React from 'react';
import { Metadata } from 'next';
import ProductPage from '@/components/ProductPage';
import StructuredData from '@/components/StructuredData';
import {
  Activity,
  Clock,
  Globe,
  BarChart3,
  Bell,
  Shield,
  Server,
  Gauge,
  FileText,
  Code,
  Network,
  MapPin
} from 'lucide-react';

export const metadata: Metadata = {
  title: "Free ICMP Ping Monitoring | Network Uptime & Latency Checks | exit1.dev",
  description: "Monitor network hosts with free ICMP ping checks. Track uptime, round-trip latency, and TTL for servers, routers, and infrastructure. Instant alerts when hosts go down. No credit card required.",
  keywords: "ICMP monitoring, ping monitoring, network monitoring, free ping monitor, host availability, latency monitoring, RTT monitoring, server ping, uptime monitoring, infrastructure monitoring",
  openGraph: {
    title: "Free ICMP Ping Monitoring | Network Uptime & Latency Checks | exit1.dev",
    description: "Monitor network hosts with free ICMP ping checks. Track uptime, round-trip latency, and TTL for servers, routers, and infrastructure. Instant alerts when hosts go down.",
    type: "website",
    url: "https://exit1.dev/icmp-monitoring",
  },
  twitter: {
    title: "Free ICMP Ping Monitoring | Network Uptime & Latency Checks | exit1.dev",
    description: "Monitor network hosts with free ICMP ping checks. Track uptime, round-trip latency, and TTL for servers, routers, and infrastructure. Instant alerts when hosts go down.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://exit1.dev/icmp-monitoring",
  },
};

const ICMPMonitoring = () => {
  const features = [
    {
      title: "ICMP Ping Checks",
      description: "Send ICMP Echo requests to any public host. Know instantly when servers, routers, or network devices become unreachable.",
      icon: <Activity className="w-6 h-6 text-white" />
    },
    {
      title: "Round-Trip Latency",
      description: "Track precise round-trip time in milliseconds for every check. Spot latency spikes and network degradation early.",
      icon: <Gauge className="w-6 h-6 text-white" />
    },
    {
      title: "TTL & Routing Insights",
      description: "Capture Time-To-Live values with each ping to detect routing changes and diagnose network path issues.",
      icon: <Network className="w-6 h-6 text-white" />
    },
    {
      title: "Geographic Enrichment",
      description: "Every check enriches results with target geolocation, ASN, ISP, and organization data for full network context.",
      icon: <MapPin className="w-6 h-6 text-white" />
    },
    {
      title: "Smart Failure Detection",
      description: "Automatic 30-second re-checks on first failure. Alerts only fire after 4 consecutive failures to eliminate false positives.",
      icon: <Shield className="w-6 h-6 text-white" />
    },
    {
      title: "European Monitoring",
      description: "Ping hosts from our European server to detect network issues and measure latency.",
      icon: <Globe className="w-6 h-6 text-white" />
    }
  ];

  const comparisonTable = [
    {
      feature: "Free ICMP ping monitoring",
      exit1: true,
      competitors: "Paid only"
    },
    {
      feature: "Round-trip latency tracking",
      exit1: true,
      competitors: "Basic"
    },
    {
      feature: "TTL monitoring",
      exit1: true,
      competitors: false
    },
    {
      feature: "Geographic target enrichment",
      exit1: true,
      competitors: false
    },
    {
      feature: "European ping checks",
      exit1: true,
      competitors: "Limited availability"
    },
    {
      feature: "Smart false-positive prevention",
      exit1: true,
      competitors: "Basic retry"
    },
    {
      feature: "1-minute check intervals",
      exit1: true,
      competitors: "5+ minutes"
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
    },
    {
      feature: "Combine with HTTP/TCP/UDP checks",
      exit1: true,
      competitors: "Separate tools"
    }
  ];

  const faq = [
    {
      question: "What is ICMP ping monitoring?",
      answer: "ICMP ping monitoring sends Internet Control Message Protocol Echo Request packets to a target host and waits for an Echo Reply. It's the simplest and most reliable way to check if a network host is reachable and measure the round-trip latency between your monitoring location and the target."
    },
    {
      question: "Is ICMP monitoring included in the free tier?",
      answer: "Yes, ICMP ping monitoring is available on both the Free and Nano tiers. On the Free tier you get up to 10 monitors with 5-minute check intervals. On the Nano tier you get unlimited monitors with 1-minute check intervals."
    },
    {
      question: "When should I use ICMP checks instead of HTTP checks?",
      answer: "Use ICMP checks for monitoring network infrastructure like routers, switches, firewalls, DNS servers, and bare-metal hosts that don't run HTTP services. For websites, APIs, and web applications, use HTTP or API checks instead, as they validate application-level health rather than just network reachability."
    },
    {
      question: "Can some hosts block ICMP ping?",
      answer: "Yes, some firewalls and network configurations block ICMP traffic. If a host blocks ping requests, ICMP checks will report it as down even though the host may be running. In those cases, use TCP or HTTP checks instead. Most infrastructure devices and servers allow ICMP by default."
    },
    {
      question: "What metrics do ICMP checks provide?",
      answer: "Each ICMP check records the round-trip time (RTT) in milliseconds, the TTL (Time To Live) value from the ICMP reply, the resolved IP address, and geographic metadata including the target's country, region, city, ASN, and ISP. All metrics are stored in your monitoring history."
    },
    {
      question: "How does exit1.dev prevent false ping alerts?",
      answer: "When a ping check fails, exit1.dev automatically performs a 30-second re-check. An alert is only triggered after 4 consecutive failures within 5 minutes. This eliminates false positives from transient network blips and ensures you only get notified about real outages."
    },
    {
      question: "Can I monitor the same host with both ICMP and HTTP checks?",
      answer: "Absolutely. Combining ICMP ping checks with HTTP or TCP checks gives you full-stack visibility. If your HTTP check fails but the ICMP ping succeeds, you know the host is reachable but the application has an issue. If both fail, it's likely a network or infrastructure problem."
    },
    {
      question: "What alert channels are supported for ICMP checks?",
      answer: "ICMP checks support the same alert channels as all other check types: email, SMS (Nano tier), and webhooks. Webhooks integrate with Slack, Discord, Microsoft Teams, PagerDuty, Opsgenie, and any other webhook-enabled platform."
    }
  ];

  const technicalDetails = {
    architecture: "ICMP monitoring runs on the same infrastructure as all exit1.dev checks. Each ping sends a single ICMP Echo Request packet with an adaptive timeout based on historical response times. Results are enriched with IP geolocation, ASN, and ISP data. All check history is stored in BigQuery for long-term analytics.",
    performance: "Ping checks execute in milliseconds with minimal overhead. Strict hostname validation prevents command injection. Process-level timeouts ensure hung checks are terminated cleanly. The system handles thousands of concurrent ICMP checks across all monitoring regions.",
    api: "ICMP checks are fully supported through the exit1.dev REST API. Create, update, delete, and query ping monitors programmatically. Access check history, response times, and TTL data via API endpoints. HMAC authentication with rate limits of 1000 requests/hour per key."
  };

  const relatedFeatures = [
    {
      title: "Real-Time Monitoring",
      description: "Monitor websites and APIs with fast checks and instant alerts when issues occur.",
      href: "/real-time-monitoring",
      icon: <Clock className="w-6 h-6 text-white" />
    },
    {
      title: "Global Monitoring",
      description: "Monitor your infrastructure from multiple global locations for comprehensive coverage.",
      href: "/global-monitoring",
      icon: <Globe className="w-6 h-6 text-white" />
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
      title: "Comprehensive Logs",
      description: "View detailed monitoring history with advanced search, filtering, and export capabilities.",
      href: "/logs",
      icon: <FileText className="w-6 h-6 text-white" />
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
          name: "ICMP Ping Monitoring",
          description: "Monitor network hosts with free ICMP ping checks. Track uptime, round-trip latency, and TTL for servers, routers, and infrastructure. Instant alerts when hosts go down.",
          url: "https://exit1.dev/icmp-monitoring",
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
          category: "Network Monitoring",
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
        title="ICMP Ping Monitoring for Your Infrastructure"
        subtitle="Network reachability, latency tracking, and instant alerts"
        description="Monitor any host on the internet with ICMP ping checks. Track round-trip latency, detect outages, and get alerted when servers, routers, or network devices go down. Free on both tiers."
        features={features}
        ctaText="Start Ping Monitoring"
        ctaHref="https://app.exit1.dev/"
        seoTitle="Free ICMP Ping Monitoring | Network Uptime & Latency Checks | exit1.dev"
        seoDescription="Monitor network hosts with free ICMP ping checks. Track uptime, round-trip latency, and TTL for servers, routers, and infrastructure. Instant alerts when hosts go down."
        comparisonTable={comparisonTable}
        faq={faq}
        technicalDetails={technicalDetails}
        relatedFeatures={relatedFeatures}
        nanoUpgrade={{
          title: "Need faster ping checks?",
          description: "Upgrade to Nano for 1-minute ICMP check intervals, SMS alerts, 200 monitors, and 1-year data retention."
        }}
      />
    </>
  );
};

export default ICMPMonitoring;
