import React from 'react';
import { Metadata } from 'next';
import ProductPage from '@/components/ProductPage';
import StructuredData from '@/components/StructuredData';
import { 
  Code, 
  Webhook, 
  Shield, 
  Zap, 
  Database, 
  Settings,
  Globe,
  BarChart3,
  FileText,
  Bell,
  Shield as ShieldIcon
} from 'lucide-react';

export const metadata: Metadata = {
  title: "Website Monitoring API & Webhooks - REST API Integration | exit1.dev",
  description: "Integrate website monitoring into your workflows with our comprehensive REST API and webhooks. Get real-time data, manage monitors programmatically, and build custom integrations. Free API access for developers.",
  keywords: "monitoring API, webhooks, REST API, monitoring integration, API access, webhook notifications, monitoring automation, free API, monitoring webhooks",
  openGraph: {
    title: "Website Monitoring API & Webhooks - REST API Integration | exit1.dev",
    description: "Integrate website monitoring into your workflows with our comprehensive REST API and webhooks. Get real-time data, manage monitors programmatically, and build custom integrations. Free API access for developers.",
    type: "website",
    url: "https://exit1.dev/api-webhooks",
  },
  twitter: {
    title: "Website Monitoring API & Webhooks - REST API Integration | exit1.dev",
    description: "Integrate website monitoring into your workflows with our comprehensive REST API and webhooks. Get real-time data, manage monitors programmatically, and build custom integrations. Free API access for developers.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://exit1.dev/api-webhooks",
  },
};

const APIWebhooks = () => {
  const features = [
    {
      title: "RESTful API",
      description: "Comprehensive REST API with full CRUD operations for managing your monitoring setup.",
      icon: <Code className="w-6 h-6 text-white" />
    },
    {
      title: "Webhook Integration",
      description: "Send real-time alerts to your systems via webhooks with custom payloads and HMAC signatures.",
      icon: <Webhook className="w-6 h-6 text-white" />
    },
    {
      title: "Secure Authentication",
      description: "HMAC-based API authentication and webhook signature verification for secure integrations.",
      icon: <Shield className="w-6 h-6 text-white" />
    },
    {
      title: "Real-Time Data",
      description: "Access live monitoring data, status updates, and performance metrics via API.",
      icon: <Zap className="w-6 h-6 text-white" />
    },
    {
      title: "Comprehensive Endpoints",
      description: "Manage monitors, retrieve logs, get analytics, and configure alerts programmatically.",
      icon: <Database className="w-6 h-6 text-white" />
    },
    {
      title: "Custom Integrations",
      description: "Build custom dashboards, automate workflows, and integrate with your existing tools.",
      icon: <Settings className="w-6 h-6 text-white" />
    }
  ];

  const comparisonTable = [
    {
      feature: "RESTful API access",
      exit1: true,
      competitors: "Limited or paid"
    },
    {
      feature: "Webhook support",
      exit1: true,
      competitors: "Basic only"
    },
    {
      feature: "HMAC authentication",
      exit1: true,
      competitors: false
    },
    {
      feature: "Real-time data access",
      exit1: true,
      competitors: "Delayed data"
    },
    {
      feature: "Full CRUD operations",
      exit1: true,
      competitors: "Read-only"
    },
    {
      feature: "Comprehensive endpoints",
      exit1: true,
      competitors: "Limited endpoints"
    },
    {
      feature: "Free API access",
      exit1: true,
      competitors: "Paid tiers"
    },
    {
      feature: "Webhook signatures",
      exit1: true,
      competitors: false
    },
    {
      feature: "OpenAPI documentation",
      exit1: true,
      competitors: "Limited docs"
    },
    {
      feature: "No API rate limits",
      exit1: "Generous limits",
      competitors: "Strict limits"
    }
  ];

  const faq = [
    {
      question: "What can I do with the API?",
      answer: "Our REST API provides full programmatic access to all monitoring features. You can create, update, and delete monitors, retrieve real-time status and historical data, configure alerts and webhooks, export logs and analytics, and manage your entire monitoring setup programmatically."
    },
    {
      question: "How do I authenticate API requests?",
      answer: "We use HMAC-based authentication for security. Include your API key in the X-Api-Key header and sign requests with your secret key. This ensures your API calls are secure and can't be intercepted or tampered with."
    },
    {
      question: "What's the difference between API and webhooks?",
      answer: "The API allows you to retrieve data and manage your monitoring setup programmatically. Webhooks send real-time notifications to your systems when monitoring events occur (like downtime or recovery). Both use the same authentication system for security."
    },
    {
      question: "How do webhook signatures work?",
      answer: "Webhook payloads include an HMAC signature in the X-Exit1-Signature header. You can verify this signature using your webhook secret to ensure the notification is genuinely from exit1.dev and hasn't been tampered with during transmission."
    },
    {
      question: "What data is included in webhook payloads?",
      answer: "Webhook payloads include comprehensive information about the monitoring event: website details, status codes, response times, error messages, timestamp, and event type. This gives you all the context needed to handle the alert appropriately."
    },
    {
      question: "Can I customize webhook payloads?",
      answer: "While the core webhook structure is standardized for consistency, you can add custom headers to webhooks for authentication or routing purposes. The payload includes all relevant monitoring data to help you build robust integrations."
    },
    {
      question: "What are the API rate limits?",
      answer: "We provide generous rate limits to accommodate most use cases: 1000 requests/hour for general API calls, 2000 requests/hour for analytics data, and 500 requests/hour for alerting operations. These limits are designed to prevent abuse while allowing legitimate usage."
    },
    {
      question: "Do you provide API documentation?",
      answer: "Yes, we provide comprehensive OpenAPI documentation with examples, authentication details, and endpoint descriptions. The documentation is interactive and allows you to test API calls directly from the browser to understand how everything works."
    }
  ];

  const technicalDetails = {
    architecture: "RESTful API built on Firebase Functions with automatic scaling. Webhook delivery system with retry logic and timeout handling. HMAC authentication ensures secure API access and webhook verification. All endpoints follow REST conventions.",
    performance: "API responses typically complete in under 200ms. Webhook delivery happens within 2 seconds with automatic retries for failed deliveries. System handles thousands of concurrent API requests and webhook deliveries efficiently.",
    api: "RESTful API with HMAC authentication, comprehensive endpoints for all monitoring features. Rate limits: 1000-2000 requests/hour depending on endpoint. Full OpenAPI documentation available. Webhook delivery includes detailed payloads with signature verification."
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
      title: "Smart Alerting",
      description: "Configure webhooks, email alerts, and custom notification rules to stay informed about issues.",
      href: "/alerting",
      icon: <Bell className="w-6 h-6 text-white" />
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
    }
  ];

  return (
    <>
      <StructuredData
        type="Product"
        data={{
          name: "Website Monitoring API & Webhooks",
          description: "Integrate website monitoring into your workflows with our comprehensive REST API and webhooks. Get real-time data, manage monitors programmatically, and build custom integrations. Free API access for developers.",
          url: "https://exit1.dev/api-webhooks",
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
          category: "API Integration",
          features: features.map(f => f.title),
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "65"
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
        title="API & Webhooks That Integrate Seamlessly"
        subtitle="REST API, webhooks, secure authentication"
        description="Integrate monitoring into your workflows with our comprehensive API and webhooks. Get real-time data, manage monitors programmatically, and build custom integrations. Free API access with generous limits."
        features={features}
        ctaText="Explore API"
        ctaHref="https://app.exit1.dev/"
        seoTitle="Website Monitoring API & Webhooks - REST API Integration | exit1.dev"
        seoDescription="Integrate website monitoring into your workflows with our comprehensive REST API and webhooks. Get real-time data, manage monitors programmatically, and build custom integrations. Free API access for developers."
        comparisonTable={comparisonTable}
        faq={faq}
        technicalDetails={technicalDetails}
        relatedFeatures={relatedFeatures}
      />
    </>
  );
};

export default APIWebhooks;
