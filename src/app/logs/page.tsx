import React from 'react';
import { Metadata } from 'next';
import ProductPage from '@/components/ProductPage';
import StructuredData from '@/components/StructuredData';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  Database, 
  Zap,
  Globe,
  BarChart3,
  Bell,
  Shield,
  Code
} from 'lucide-react';

export const metadata: Metadata = {
  title: "Website Monitoring Logs & History - Comprehensive Logging | exit1.dev",
  description: "Detailed monitoring logs with advanced search, filtering, and export capabilities. Track your website performance history with comprehensive logging and analytics. Free logging for developers.",
  keywords: "monitoring logs, website logs, uptime history, monitoring history, log search, log filtering, log export, free logging, monitoring data",
  openGraph: {
    title: "Website Monitoring Logs & History - Comprehensive Logging | exit1.dev",
    description: "Detailed monitoring logs with advanced search, filtering, and export capabilities. Track your website performance history with comprehensive logging and analytics. Free logging for developers.",
    type: "website",
    url: "https://exit1.dev/logs",
  },
  twitter: {
    title: "Website Monitoring Logs & History - Comprehensive Logging | exit1.dev",
    description: "Detailed monitoring logs with advanced search, filtering, and export capabilities. Track your website performance history with comprehensive logging and analytics. Free logging for developers.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://exit1.dev/logs",
  },
};

const Logs = () => {
  const features = [
    {
      title: "Comprehensive History",
      description: "Track all monitoring events with detailed logs and performance data.",
      icon: <Database className="w-6 h-6 text-white" />
    },
    {
      title: "Advanced Search",
      description: "Find specific events quickly with powerful search and filtering tools.",
      icon: <Search className="w-6 h-6 text-white" />
    },
    {
      title: "Smart Filtering",
      description: "Filter by time, status, website, and more to focus on what matters.",
      icon: <Filter className="w-6 h-6 text-white" />
    },
    {
      title: "Easy Export",
      description: "Download logs as CSV or Excel for external analysis and reporting.",
      icon: <Download className="w-6 h-6 text-white" />
    },
    {
      title: "Real-Time Updates",
      description: "Watch logs as they happen with live streaming updates.",
      icon: <Zap className="w-6 h-6 text-white" />
    },
    {
      title: "Detailed Records",
      description: "Complete logs with status, latency, errors, and performance metrics.",
      icon: <FileText className="w-6 h-6 text-white" />
    }
  ];

  const comparisonTable = [
    {
      feature: "Unlimited log retention",
      exit1: true,
      competitors: "30-90 days"
    },
    {
      feature: "Advanced search & filtering",
      exit1: true,
      competitors: "Basic search only"
    },
    {
      feature: "Real-time log streaming",
      exit1: true,
      competitors: "Delayed updates"
    },
    {
      feature: "Export all data formats",
      exit1: "CSV, Excel, JSON",
      competitors: "Limited formats"
    },
    {
      feature: "Detailed log entries",
      exit1: true,
      competitors: "Basic status only"
    },
    {
      feature: "Performance metrics in logs",
      exit1: true,
      competitors: "Status only"
    },
    {
      feature: "API access to logs",
      exit1: true,
      competitors: "Paid only"
    },
    {
      feature: "Custom log views",
      exit1: true,
      competitors: "Fixed views"
    },
    {
      feature: "Free tier logging",
      exit1: "Full features",
      competitors: "Limited logs"
    },
    {
      feature: "No log volume limits",
      exit1: true,
      competitors: "Daily limits"
    }
  ];

  const faq = [
    {
      question: "How long do you keep my monitoring logs?",
      answer: "We keep all your monitoring logs indefinitely with no retention limits. Unlike competitors who delete logs after 30-90 days, we believe you should have access to your complete monitoring history for debugging, compliance, and trend analysis."
    },
    {
      question: "What information is included in each log entry?",
      answer: "Each log entry includes timestamp, website/API URL, HTTP status code, response time, error details (if any), SSL certificate information, and any custom validation results. We capture the full context of each monitoring check for comprehensive debugging."
    },
    {
      question: "Can I search and filter my logs?",
      answer: "Yes, you can search logs by website name, URL, status codes, error messages, or time ranges. Filter by specific time periods (24h, 7d, 30d, 90d, 1y, all), status types, or individual websites. Our search is fast and works across years of data."
    },
    {
      question: "How do I export my logs?",
      answer: "You can export logs in CSV or Excel format. Select your desired time range and filters, then download the data. We also provide API access to programmatically retrieve logs. There are no limits on export volume or frequency."
    },
    {
      question: "Are logs updated in real-time?",
      answer: "Yes, logs are updated in real-time as monitoring checks complete. You can watch new log entries appear live, making it easy to debug issues as they happen. The interface automatically refreshes to show the latest data."
    },
    {
      question: "Can I view logs for specific time periods?",
      answer: "Absolutely. You can view logs for any time period - from the last hour to years of historical data. Use our time presets (24h, 7d, 30d, 90d, 1y, all) or set custom date ranges with our calendar picker."
    },
    {
      question: "Do you store sensitive data in logs?",
      answer: "We only store the information necessary for monitoring - URLs, status codes, response times, and error messages. We don't store request bodies, passwords, or other sensitive data. Your data privacy is protected."
    },
    {
      question: "How do logs help with debugging?",
      answer: "Logs show you exactly when issues occurred, how long they lasted, and what the specific problems were. You can trace performance degradation, identify patterns in failures, and correlate issues across multiple services. This makes debugging much faster and more accurate."
    }
  ];

  const technicalDetails = {
    architecture: "Logs are stored in BigQuery for 90 days retention max and fast querying. Real-time updates flow instantly for immediate UI updates. Search and filtering use optimized BigQuery queries for sub-second response times.",
    performance: "Log queries return results in under 1 second even for years of data. Real-time streaming updates have sub-100ms latency. Export operations handle millions of log entries efficiently with progress indicators.",
    api: "Logs API provides programmatic access to all historical data with powerful filtering. RESTful endpoints with HMAC authentication. Rate limits: 1000 requests/hour per API key. Supports pagination for large datasets."
  };

  const relatedFeatures = [
    {
      title: "Real-Time Monitoring",
      description: "Monitor websites and APIs with fast checks and instant alerts when issues occur.",
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
      description: "Integrate monitoring and logs into your workflows with our comprehensive REST API.",
      href: "/api-webhooks",
      icon: <Code className="w-6 h-6 text-white" />
    }
  ];

  return (
    <>
      <StructuredData
        type="Product"
        data={{
          name: "Website Monitoring Logs",
          description: "Detailed monitoring logs with advanced search, filtering, and export capabilities. Track your website performance history with comprehensive logging and analytics. Free logging for developers.",
          url: "https://exit1.dev/logs",
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
          category: "Website Logging",
          features: features.map(f => f.title),
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.7",
            reviewCount: "95"
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
        title="Logs That Tell the Full Story"
        subtitle="Comprehensive history, smart search"
        description="Track every monitoring event with detailed logs, advanced search, and easy exports. Understand your site's performance history and debug issues effectively. Free and comprehensive."
        features={features}
        ctaText="View Your Logs"
        ctaHref="https://app.exit1.dev/"
        seoTitle="Website Monitoring Logs & History - Comprehensive Logging | exit1.dev"
        seoDescription="Detailed monitoring logs with advanced search, filtering, and export capabilities. Track your website performance history with comprehensive logging and analytics. Free logging for developers."
        comparisonTable={comparisonTable}
        faq={faq}
        technicalDetails={technicalDetails}
        relatedFeatures={relatedFeatures}
      />
    </>
  );
};

export default Logs;
