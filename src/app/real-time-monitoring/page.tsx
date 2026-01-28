import React from 'react';
import { Metadata } from 'next';
import ProductPage from '@/components/ProductPage';
import StructuredData from '@/components/StructuredData';
import { 
  Globe, 
  Clock, 
  Code, 
  Shield, 
  TrendingUp, 
  Bell,
  BarChart3,
  FileText
} from 'lucide-react';

export const metadata: Metadata = {
  title: "Real-Time Website Monitoring - Free Uptime Monitor | exit1.dev",
  description: "Real-time website monitoring with unlimited sites and instant alerts. Free 5-minute checks, 1-minute with Nano. Monitor websites, APIs, and SSL certificates. Start monitoring for free.",
  keywords: "real-time monitoring, uptime monitor, website monitoring, free monitoring, API monitoring, SSL monitoring, instant alerts",
  openGraph: {
    title: "Real-Time Website Monitoring - Free Uptime Monitor | exit1.dev",
    description: "Real-time website monitoring with unlimited sites and instant alerts. Free 5-minute checks, 1-minute with Nano.",
    type: "website",
    url: "https://exit1.dev/real-time-monitoring",
  },
  twitter: {
    title: "Real-Time Website Monitoring - Free Uptime Monitor | exit1.dev",
    description: "Real-time website monitoring with unlimited sites and instant alerts. Free 5-minute checks, 1-minute with Nano.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://exit1.dev/real-time-monitoring",
  },
};

const RealTimeMonitoring = () => {
  const features = [
    {
      title: "Unlimited Monitoring, Zero Cost",
      description: "Watch endless sites and APIs. 5-min checks free, 1-min with Nano.",
      icon: <Globe className="w-6 h-6 text-white" />
    },
    {
      title: "Instant Updates",
      description: "Know when it breaks or fixes. Real-time, no delays.",
      icon: <Clock className="w-6 h-6 text-white" />
    },
    {
      title: "All HTTP Methods",
      description: "GET, POST, whatever— we handle it.",
      icon: <Code className="w-6 h-6 text-white" />
    },
    {
      title: "Auth and Headers",
      description: "Secure APIs? Custom headers? No problem.",
      icon: <Shield className="w-6 h-6 text-white" />
    },
    {
      title: "Smart Validation",
      description: "Check status, JSON paths—ensure it's really working.",
      icon: <TrendingUp className="w-6 h-6 text-white" />
    },
    {
      title: "Alerts That Wake You",
      description: "Webhooks, email—pinged instantly on issues.",
      icon: <Bell className="w-6 h-6 text-white" />
    }
  ];

  type ComparisonRow = {
    feature: string;
    exit1: string | boolean;
    competitors: string | boolean;
  };

  const comparisonTable: ComparisonRow[] = [
    {
      feature: "Unlimited websites",
      exit1: true,
      competitors: false
    },
    {
      feature: "1-minute check intervals",
      exit1: "Nano plan",
      competitors: false
    },
    {
      feature: "Custom authentication",
      exit1: true,
      competitors: "Limited"
    },
    {
      feature: "JSON response validation",
      exit1: true,
      competitors: false
    },
    {
      feature: "SSL certificate monitoring",
      exit1: true,
      competitors: "Paid only"
    },
    {
      feature: "Webhook alerts",
      exit1: true,
      competitors: "Limited"
    },
    {
      feature: "API access",
      exit1: true,
      competitors: "Paid only"
    },
    {
      feature: "Historical data retention",
      exit1: "Unlimited",
      competitors: "30 days"
    },
    {
      feature: "Free tier",
      exit1: "Everything free",
      competitors: "Limited features"
    }
  ];

  const faq = [
    {
      question: "How often do you check my websites?",
      answer: "We check your websites as frequently as every 1 minute. You can set intervals of 1 minute, 5 minutes, 1 hour, or 24 hours depending on your needs. Most users start with 5-minute intervals for optimal balance of speed and resource usage."
    },
    {
      question: "What happens when my website goes down?",
      answer: "We immediately detect the issue and send you instant alerts via email and webhooks. You'll know about problems before your users do. Our system tracks downtime duration and automatically resumes monitoring when your site comes back online."
    },
    {
      question: "Can I monitor APIs and authenticated endpoints?",
      answer: "Absolutely. We support all HTTP methods (GET, POST, PUT, DELETE) and custom headers for authentication. You can monitor APIs that require API keys, bearer tokens, or custom authentication headers. We also validate JSON responses to ensure your APIs are returning the expected data."
    },
    {
      question: "How accurate is your monitoring?",
      answer: "We use multiple global monitoring locations to ensure accuracy. Our system performs real HTTP requests (not just ping) and validates responses. We also implement smart retry logic and alert suppression to prevent false positives from temporary network issues."
    },
    {
      question: "Do you monitor SSL certificates?",
      answer: "Yes, we automatically monitor SSL certificate validity, expiration dates, and security issues. You'll get alerts when certificates are about to expire or have security problems. This is included free with every website you monitor."
    },
    {
      question: "Can I export my monitoring data?",
      answer: "Yes, you can export all your monitoring logs and data via our API or download them as CSV/Excel files. We believe you should own your data, so there are no restrictions on data export or retention limits."
    },
    {
      question: "What's the difference between real-time and 5-minute monitoring?",
      answer: "Real-time monitoring checks every minute, giving you the fastest possible detection of issues. 5-minute monitoring is more resource-efficient and suitable for most websites. Choose based on your uptime requirements and server capacity."
    },
    {
      question: "How do you prevent alert spam?",
      answer: "We use intelligent alert suppression that requires multiple consecutive failures before sending alerts. We also limit alerts to one per check per hour to prevent spam. You can customize these settings based on your preferences."
    }
  ];

  const technicalDetails = {
    architecture: "Built on serverless infrastructure with real-time updates. Global monitoring nodes ensure low-latency checks from multiple locations. Serverless architecture scales automatically with your monitoring needs.",
    performance: "Average response time under 200ms for HTTP checks. SSL validation completes in under 100ms. Our system handles thousands of concurrent checks with intelligent rate limiting and circuit breakers.",
    api: "RESTful API with HMAC authentication. Get real-time status, historical data, and manage monitors programmatically. Full OpenAPI documentation available. Rate limits: 1000 requests/hour per API key."
  };

  const relatedFeatures = [
    {
      title: "Analytics & Reports",
      description: "Track uptime trends, response times, and performance metrics with detailed analytics and custom reports.",
      href: "/analytics",
      icon: <BarChart3 className="w-6 h-6 text-white" />
    },
    {
      title: "Comprehensive Logs",
      description: "View detailed monitoring history with advanced search, filtering, and export capabilities for debugging.",
      href: "/logs",
      icon: <FileText className="w-6 h-6 text-white" />
    },
    {
      title: "Smart Alerting",
      description: "Configure webhooks, email alerts, and custom notification rules to stay informed about issues.",
      href: "/alerting",
      icon: <Bell className="w-6 h-6 text-white" />
    },
    {
      title: "SSL Monitoring",
      description: "Monitor SSL certificate validity, expiration dates, and security issues automatically.",
      href: "/ssl-monitoring",
      icon: <Shield className="w-6 h-6 text-white" />
    },
    {
      title: "Global Monitoring",
      description: "Monitor your infrastructure from multiple global locations for comprehensive coverage.",
      href: "/global-monitoring",
      icon: <Globe className="w-6 h-6 text-white" />
    },
    {
      title: "API Integration",
      description: "Integrate monitoring into your workflows with our comprehensive REST API and webhooks.",
      href: "/api-webhooks",
      icon: <Code className="w-6 h-6 text-white" />
    }
  ];

  return (
    <>
      <StructuredData
        type="Product"
        data={{
          name: "Real-Time Website Monitoring",
          description: "Real-time website monitoring with unlimited sites and instant alerts. Free 5-minute checks, 1-minute with Nano.",
          url: "https://exit1.dev/real-time-monitoring",
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
          category: "Website Monitoring",
          features: features.map(f => f.title),
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            reviewCount: "150"
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
        title="Monitoring That Works"
        subtitle="Unlimited sites, instant alerts, free forever"
        description="Forget capped 'free' tiers. Real monitoring: fast checks, custom auth, smart validation. Built for devs who hate downtime."
        features={features}
        ctaText="Start Watching"
        ctaHref="https://app.exit1.dev/"
        seoTitle="Real-Time Website Monitoring - Free Uptime Monitor | exit1.dev"
        seoDescription="Real-time website monitoring with unlimited sites and instant alerts. Free 5-minute checks, 1-minute with Nano."
        comparisonTable={comparisonTable}
        faq={faq}
        technicalDetails={technicalDetails}
relatedFeatures={relatedFeatures}
        nanoUpgrade={{
          title: "Need SMS alerts and branded status pages?",
          description: "Nano adds instant SMS notifications, custom domains for status pages, and your branding — all for less than a coffee per week."
        }}
      />
    </>
  );
};

export default RealTimeMonitoring;
