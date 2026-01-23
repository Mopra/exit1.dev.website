import React from 'react';
import { Metadata } from 'next';
import ProductPage from '@/components/ProductPage';
import StructuredData from '@/components/StructuredData';
import { 
  Bell, 
  Webhook, 
  Mail, 
  Shield, 
  Zap, 
  Settings,
  Globe,
  BarChart3,
  FileText,
  Shield as ShieldIcon,
  Code
} from 'lucide-react';

export const metadata: Metadata = {
  title: "Website Monitoring Alerts & Notifications - Smart Alerting | exit1.dev",
  description: "Smart website monitoring alerts with webhooks, email notifications, and custom rules. Prevent alert fatigue with intelligent suppression and instant notifications. Free alerting for developers.",
  keywords: "monitoring alerts, website alerts, uptime alerts, webhook notifications, email alerts, alert fatigue, instant notifications, free alerting, monitoring notifications",
  openGraph: {
    title: "Website Monitoring Alerts & Notifications - Smart Alerting | exit1.dev",
    description: "Smart website monitoring alerts with webhooks, email notifications, and custom rules. Prevent alert fatigue with intelligent suppression and instant notifications. Free alerting for developers.",
    type: "website",
    url: "https://exit1.dev/alerting",
  },
  twitter: {
    title: "Website Monitoring Alerts & Notifications - Smart Alerting | exit1.dev",
    description: "Smart website monitoring alerts with webhooks, email notifications, and custom rules. Prevent alert fatigue with intelligent suppression and instant notifications. Free alerting for developers.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://exit1.dev/alerting",
  },
};

const Alerting = () => {
  const features = [
    {
      title: "Instant Notifications",
      description: "Get alerted immediately when issues occur. No delays, no missed problems.",
      icon: <Zap className="w-6 h-6 text-white" />
    },
    {
      title: "Webhook Alerts",
      description: "Send alerts to your systems via webhooks with custom payloads and HMAC signatures.",
      icon: <Webhook className="w-6 h-6 text-white" />
    },
    {
      title: "Email Notifications",
      description: "Receive email alerts with detailed information about issues and recovery.",
      icon: <Mail className="w-6 h-6 text-white" />
    },
    {
      title: "Smart Suppression",
      description: "Prevent alert fatigue with intelligent suppression and rate limiting.",
      icon: <Shield className="w-6 h-6 text-white" />
    },
    {
      title: "Custom Rules",
      description: "Configure alert conditions, recipients, and timing to match your needs.",
      icon: <Settings className="w-6 h-6 text-white" />
    },
    {
      title: "Multiple Channels",
      description: "Send alerts via webhooks, email, or both. Integrate with any system.",
      icon: <Bell className="w-6 h-6 text-white" />
    }
  ];

  const comparisonTable = [
    {
      feature: "Instant alert delivery",
      exit1: true,
      competitors: "Delayed notifications"
    },
    {
      feature: "Webhook support",
      exit1: true,
      competitors: "Limited or paid"
    },
    {
      feature: "HMAC signatures",
      exit1: true,
      competitors: false
    },
    {
      feature: "Alert suppression",
      exit1: true,
      competitors: "Basic rate limiting"
    },
    {
      feature: "Custom alert rules",
      exit1: true,
      competitors: "Fixed templates"
    },
    {
      feature: "Multiple notification channels",
      exit1: true,
      competitors: "Email only"
    },
    {
      feature: "Test alert functionality",
      exit1: true,
      competitors: false
    },
    {
      feature: "API access to alerts",
      exit1: true,
      competitors: "Paid only"
    },
    {
      feature: "Free tier alerting",
      exit1: "Full features",
      competitors: "Limited alerts"
    },
    {
      feature: "No alert volume limits",
      exit1: true,
      competitors: "Daily limits"
    }
  ];

  const faq = [
    {
      question: "How quickly do I get notified when my website goes down?",
      answer: "You'll receive alerts within seconds of detecting an issue. Our system performs real-time monitoring checks and immediately triggers notifications via webhooks and email when problems are detected. No delays, no missed alerts."
    },
    {
      question: "What's the difference between webhooks and email alerts?",
      answer: "Webhooks send instant HTTP POST requests to your systems with detailed JSON payloads, perfect for integrating with Slack, Discord, or custom applications. Email alerts provide human-readable notifications with issue details and recovery information. You can use both simultaneously."
    },
    {
      question: "How do you prevent alert spam and fatigue?",
      answer: "We use intelligent alert suppression that requires multiple consecutive failures before sending the first alert. We also limit alerts to one per check per event per hour to prevent spam. You can customize these settings based on your preferences and monitoring needs."
    },
    {
      question: "Can I customize the alert messages and payloads?",
      answer: "Yes, webhook alerts include detailed JSON payloads with website information, status codes, response times, and error details. You can also add custom headers to webhooks for authentication. Email alerts include comprehensive issue information and recovery suggestions."
    },
    {
      question: "Do you support HMAC signatures for webhook security?",
      answer: "Yes, we provide optional HMAC signatures for webhook payloads. This allows you to verify that alerts are genuinely from exit1.dev and haven't been tampered with. The signature is included in the X-Exit1-Signature header."
    },
    {
      question: "Can I test my alert configurations?",
      answer: "Absolutely. You can send test webhook payloads and test emails to verify your alert configurations work correctly. This helps ensure your integrations are set up properly before real issues occur."
    },
    {
      question: "What happens when my website comes back online?",
      answer: "You'll receive recovery notifications when your website comes back online. These alerts include information about the downtime duration and help you track your service reliability. You can configure whether to receive recovery notifications separately from downtime alerts."
    },
    {
      question: "Can I set different alert rules for different websites?",
      answer: "Yes, you can configure different alert settings for each website you monitor. Set different recipients, notification channels, or suppression rules based on the importance and characteristics of each service."
    }
  ];

  const technicalDetails = {
    architecture: "Alert system built on serverless functions for instant delivery. Webhooks use HTTP POST with retry logic and timeout handling. Email alerts sent via reliable email service with delivery tracking. All alert configurations stored securely.",
    performance: "Alert delivery typically completes in under 2 seconds. Webhook retries with exponential backoff for failed deliveries. Email alerts processed within 30 seconds. System handles thousands of concurrent alerts with intelligent queuing.",
    api: "Alerting API allows programmatic management of webhooks and email settings. RESTful endpoints with HMAC authentication. Rate limits: 500 requests/hour per API key. Webhook delivery includes detailed payloads with retry logic."
  };

  const relatedFeatures = [
    {
      title: "Real-Time Monitoring",
      description: "Monitor websites and APIs with 1-minute checks and instant alerts when issues occur.",
      href: "/real-time-monitoring",
      icon: <Globe className="w-6 h-6 text-white" />
    },
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
      title: "SSL Monitoring",
      description: "Monitor SSL certificate validity, expiration dates, and security issues automatically.",
      href: "/ssl-monitoring",
      icon: <ShieldIcon className="w-6 h-6 text-white" />
    },
    {
      title: "Global Monitoring",
      description: "Monitor your infrastructure from multiple global locations for comprehensive coverage.",
      href: "/global-monitoring",
      icon: <Globe className="w-6 h-6 text-white" />
    },
    {
      title: "API Integration",
      description: "Integrate monitoring and alerting into your workflows with our comprehensive REST API.",
      href: "/api-webhooks",
      icon: <Code className="w-6 h-6 text-white" />
    }
  ];

  return (
    <>
      <StructuredData
        type="Product"
        data={{
          name: "Website Monitoring Alerts",
          description: "Smart website monitoring alerts with webhooks, email notifications, and custom rules. Prevent alert fatigue with intelligent suppression and instant notifications. Free alerting for developers.",
          url: "https://exit1.dev/alerting",
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
          category: "Website Alerting",
          features: features.map(f => f.title),
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            reviewCount: "110"
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
        title="Alerts That Actually Work"
        subtitle="Instant notifications, smart suppression"
        description="Get notified immediately when things break. Webhooks, email, custom rules—configure alerts that wake you up without driving you crazy. Free and intelligent."
        features={features}
        ctaText="Set Up Alerts"
        ctaHref="https://app.exit1.dev/"
        seoTitle="Website Monitoring Alerts & Notifications - Smart Alerting | exit1.dev"
        seoDescription="Smart website monitoring alerts with webhooks, email notifications, and custom rules. Prevent alert fatigue with intelligent suppression and instant notifications. Free alerting for developers."
        comparisonTable={comparisonTable}
        faq={faq}
        technicalDetails={technicalDetails}
relatedFeatures={relatedFeatures}
        nanoUpgrade={{
          title: "Want SMS alerts?",
          description: "Get texted when your site goes down — not hours later via email. Nano includes SMS alerts, custom status page domains, and branding for just $3/month."
        }}
      />
    </>
  );
};

export default Alerting;
