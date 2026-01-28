import React from 'react';
import { Metadata } from 'next';
import ProductPage from '@/components/ProductPage';
import StructuredData from '@/components/StructuredData';
import { 
  Globe, 
  Clock, 
  AlertTriangle, 
  Bell, 
  Search, 
  RefreshCw,
  Shield,
  BarChart3,
  FileText,
  Code,
  Zap
} from 'lucide-react';

export const metadata: Metadata = {
  title: "Domain Intelligence - Automatic Domain Expiration Monitoring | exit1.dev",
  description: "Never lose a domain to an expired registration again. Automatic domain expiration monitoring with smart alerts at 30, 14, 7, and 1 day before expiry. No spreadsheets, no missed emails - just protection.",
  keywords: "domain expiration monitoring, domain expiry alerts, domain renewal reminders, RDAP monitoring, domain tracking, domain management, domain expiration checker, domain expiry notification",
  openGraph: {
    title: "Domain Intelligence - Automatic Domain Expiration Monitoring | exit1.dev",
    description: "Never lose a domain to an expired registration again. Automatic domain expiration monitoring with smart alerts at 30, 14, 7, and 1 day before expiry.",
    type: "website",
    url: "https://exit1.dev/domain-intelligence",
  },
  twitter: {
    title: "Domain Intelligence - Automatic Domain Expiration Monitoring | exit1.dev",
    description: "Never lose a domain to an expired registration again. Automatic domain expiration monitoring with smart alerts at 30, 14, 7, and 1 day before expiry.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://exit1.dev/domain-intelligence",
  },
};

const DomainIntelligence = () => {
  const features = [
    {
      title: "Zero Setup Required",
      description: "Domains are auto-detected from the URLs you're already monitoring. Enable it and it just works.",
      icon: <Zap className="w-6 h-6 text-white" />
    },
    {
      title: "Smart Alert Timing",
      description: "Get notified at 30, 14, 7, and 1 day before expiry. Customizable thresholds per domain.",
      icon: <Bell className="w-6 h-6 text-white" />
    },
    {
      title: "Intelligent Check Frequency",
      description: "Monthly checks for far-off expirations, twice daily as deadlines approach. No wasted resources.",
      icon: <Clock className="w-6 h-6 text-white" />
    },
    {
      title: "Real-Time Dashboard",
      description: "Color-coded status indicators, sortable views, search and filter across all domains.",
      icon: <Search className="w-6 h-6 text-white" />
    },
    {
      title: "Renewal Detection",
      description: "Automatically detects when domains are renewed and sends confirmation. No more guessing.",
      icon: <RefreshCw className="w-6 h-6 text-white" />
    },
    {
      title: "Multi-Channel Alerts",
      description: "Email, SMS, webhooks - Slack, Discord, or your custom endpoint. Your choice.",
      icon: <AlertTriangle className="w-6 h-6 text-white" />
    }
  ];

  const comparisonTable = [
    {
      feature: "Integrated with uptime monitoring",
      exit1: true,
      competitors: "Separate tool"
    },
    {
      feature: "Auto-detect domains from checks",
      exit1: true,
      competitors: "Manual entry"
    },
    {
      feature: "Smart check frequency scaling",
      exit1: true,
      competitors: "Fixed intervals"
    },
    {
      feature: "RDAP protocol (modern)",
      exit1: true,
      competitors: "Legacy WHOIS"
    },
    {
      feature: "Multi-channel alerts",
      exit1: "Email, SMS, Webhooks",
      competitors: "Email only"
    },
    {
      feature: "Automatic renewal detection",
      exit1: true,
      competitors: false
    },
    {
      feature: "Single dashboard for all monitoring",
      exit1: true,
      competitors: "Separate tools"
    },
    {
      feature: "Rich domain information (registrar, nameservers, status)",
      exit1: true,
      competitors: "Limited details"
    },
    {
      feature: "Bulk enable across all checks",
      exit1: true,
      competitors: "One at a time"
    },
    {
      feature: "Global TLD support",
      exit1: true,
      competitors: "Major TLDs only"
    }
  ];

  const faq = [
    {
      question: "What TLDs are supported?",
      answer: "Domain Intelligence supports most major TLDs including .com, .net, .org, .io, .dev, .co, .ai, and many country-code TLDs like .co.uk and .com.au. We use the RDAP protocol via IANA bootstrap, which covers the vast majority of registered domains worldwide."
    },
    {
      question: "How often are domains checked?",
      answer: "Check frequency scales with urgency. Domains expiring in 90+ days are checked monthly. 30-90 days out: bi-weekly. 7-30 days: every 3 days. Under 7 days: daily. Final 24 hours: twice daily. This means you get more frequent updates as expiration approaches."
    },
    {
      question: "Can I customize when I receive alerts?",
      answer: "Yes. Default alerts are sent at 30, 14, 7, and 1 day before expiry, but you can customize these thresholds for each domain to match your renewal workflow."
    },
    {
      question: "What notification channels are available?",
      answer: "Email with detailed HTML and urgency indicators, SMS for concise alerts, and webhooks including pre-formatted Slack and Discord messages. You can also set up custom webhook endpoints for your own automation."
    },
    {
      question: "Do I need to manually enter my domains?",
      answer: "No. Domain Intelligence automatically extracts domains from the URLs you're already monitoring. Just enable it on your existing checks - no manual entry required."
    },
    {
      question: "What happens if I renew my domain?",
      answer: "We automatically detect renewals when the expiry date extends by 30+ days and send you a confirmation notification. This gives you peace of mind that the renewal was processed correctly."
    },
    {
      question: "What domain information do you provide?",
      answer: "For each domain you see: days until expiry, exact expiration date, registrar name and URL, domain creation date, last update date, nameservers, and registry status codes. Everything you need in one place."
    },
    {
      question: "Is this included in the free plan?",
      answer: "Domain Intelligence is available on the Nano subscription tier as a premium feature. It's designed for professionals who need proactive domain management across multiple properties."
    }
  ];

  const technicalDetails = {
    architecture: "Domain Intelligence uses the modern RDAP protocol (not legacy WHOIS) for accurate, structured data. IANA bootstrap automatically routes queries to the correct authoritative RDAP server for any TLD. Subdomains are automatically resolved to root domains for accurate tracking.",
    performance: "Intelligent caching with 24-hour bootstrap data retention. Check frequency automatically scales based on expiry urgency - from monthly for far-off dates to twice daily in the final 24 hours. Real-time updates appear instantly across all devices.",
    api: "Full API access to domain expiration data and alert configurations. RESTful endpoints with HMAC authentication. Integrate domain monitoring into your existing workflows and automation pipelines."
  };

  const relatedFeatures = [
    {
      title: "SSL Monitoring",
      description: "Monitor SSL certificate validity, expiration dates, and security issues automatically.",
      href: "/ssl-monitoring",
      icon: <Shield className="w-6 h-6 text-white" />
    },
    {
      title: "Real-Time Monitoring",
      description: "Monitor websites and APIs with fast checks and instant alerts when issues occur.",
      href: "/real-time-monitoring",
      icon: <Globe className="w-6 h-6 text-white" />
    },
    {
      title: "Smart Alerting",
      description: "Configure webhooks, email alerts, SMS, and custom notification rules.",
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
      description: "View detailed monitoring history with advanced search and filtering capabilities.",
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
          name: "Domain Intelligence - Domain Expiration Monitoring",
          description: "Automatic domain expiration monitoring with smart alerts. Never lose a domain to an expired registration again. Integrated with uptime monitoring for complete website health visibility.",
          url: "https://exit1.dev/domain-intelligence",
          brand: {
            "@type": "Brand",
            name: "exit1.dev"
          },
          offers: {
            "@type": "Offer",
            price: "3",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            priceValidUntil: "2026-12-31"
          },
          category: "Domain Monitoring",
          features: features.map(f => f.title),
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "47"
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
        title="Never Lose a Domain Again"
        subtitle="Automatic expiration monitoring, smart alerts, zero setup"
        description="Every year, businesses lose domains they've built their entire brand around - simply because a renewal email got buried in spam. Domain Intelligence eliminates this risk by tracking when your domains expire and alerting you before disaster strikes."
        features={features}
        ctaText="Start Monitoring Domains"
        ctaHref="https://app.exit1.dev/"
        seoTitle="Domain Intelligence - Automatic Domain Expiration Monitoring | exit1.dev"
        seoDescription="Never lose a domain to an expired registration again. Automatic domain expiration monitoring with smart alerts at 30, 14, 7, and 1 day before expiry."
        comparisonTable={comparisonTable}
        faq={faq}
        technicalDetails={technicalDetails}
        relatedFeatures={relatedFeatures}
        nanoUpgrade={{
          title: "Domain Intelligence is a Nano Feature",
          description: "Get automatic domain expiration monitoring, smart alerts, and renewal detection with the Nano subscription. Just $3/month (annual) or $4/month (monthly)."
        }}
      />
    </>
  );
};

export default DomainIntelligence;
