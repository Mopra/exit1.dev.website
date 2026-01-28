import React from 'react';
import { Metadata } from 'next';
import ProductPage from '@/components/ProductPage';
import StructuredData from '@/components/StructuredData';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Clock, 
  Download, 
  Eye,
  Globe,
  FileText,
  Bell,
  Shield,
  Code
} from 'lucide-react';

export const metadata: Metadata = {
  title: "Website Monitoring Analytics & Performance Reports | exit1.dev",
  description: "Comprehensive website monitoring analytics with detailed reports, performance insights, and historical data. Track uptime, response times, and performance trends. Free analytics for developers.",
  keywords: "website analytics, monitoring analytics, uptime reports, performance metrics, response time tracking, free analytics, monitoring reports, website performance",
  openGraph: {
    title: "Website Monitoring Analytics & Performance Reports | exit1.dev",
    description: "Comprehensive website monitoring analytics with detailed reports, performance insights, and historical data. Free analytics for developers.",
    type: "website",
    url: "https://exit1.dev/analytics",
  },
  twitter: {
    title: "Website Monitoring Analytics & Performance Reports | exit1.dev",
    description: "Comprehensive website monitoring analytics with detailed reports, performance insights, and historical data. Free analytics for developers.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://exit1.dev/analytics",
  },
};

const Analytics = () => {
  const features = [
    {
      title: "Dashboards That Matter",
      description: "Cut the fluff—real metrics on uptime, speed, errors. No vanity stats.",
      icon: <BarChart3 className="w-6 h-6 text-white" />
    },
    {
      title: "Trends You Can Use",
      description: "Spot patterns before they bite. Historical data that actually helps fix issues.",
      icon: <TrendingUp className="w-6 h-6 text-white" />
    },
    {
      title: "Live Numbers",
      description: "Response times, uptime now—not yesterday's news.",
      icon: <Activity className="w-6 h-6 text-white" />
    },
    {
      title: "Data That Lasts",
      description: "Keep years of history. Analyze long-term without paying extra.",
      icon: <Clock className="w-6 h-6 text-white" />
    },
    {
      title: "Export Everything",
      description: "Grab your data in CSV, JSON—own it, don't rent it.",
      icon: <Download className="w-6 h-6 text-white" />
    },
    {
      title: "Reports You Build",
      description: "Custom views for what you care about. No preset nonsense.",
      icon: <Eye className="w-6 h-6 text-white" />
    }
  ];

  const comparisonTable = [
    {
      feature: "Unlimited historical data",
      exit1: true,
      competitors: "30-90 days"
    },
    {
      feature: "Real-time analytics",
      exit1: true,
      competitors: "Delayed updates"
    },
    {
      feature: "Custom report builder",
      exit1: true,
      competitors: "Limited templates"
    },
    {
      feature: "Export all data",
      exit1: true,
      competitors: "Limited exports"
    },
    {
      feature: "Performance insights",
      exit1: true,
      competitors: "Basic metrics only"
    },
    {
      feature: "Trend analysis",
      exit1: true,
      competitors: "Limited"
    },
    {
      feature: "Multi-site aggregation",
      exit1: true,
      competitors: "Paid feature"
    },
    {
      feature: "API access to analytics",
      exit1: true,
      competitors: "Paid only"
    },
    {
      feature: "Free tier analytics",
      exit1: "Full features",
      competitors: "Limited metrics"
    },
    {
      feature: "No data retention limits",
      exit1: true,
      competitors: false
    }
  ];

  const faq = [
    {
      question: "What metrics do you track in analytics?",
      answer: "We track uptime percentage, response times (average, min, max), incident counts, total downtime, Mean Time Between Incidents (MTBI), and Overall Reliability Score (ORS). All metrics are calculated in real-time and stored indefinitely for trend analysis."
    },
    {
      question: "How accurate are your analytics compared to Google Analytics?",
      answer: "Our analytics focus on infrastructure monitoring, not user behavior. We track server-side metrics like uptime and response times, while Google Analytics tracks user interactions. Both are valuable but serve different purposes. Our data is more accurate for monitoring website availability and performance."
    },
    {
      question: "Can I export my analytics data?",
      answer: "Yes, you can export all your analytics data in CSV or Excel format. We also provide API access to programmatically retrieve your analytics data. There are no restrictions on data export or retention limits - you own your data completely."
    },
    {
      question: "How far back does your historical data go?",
      answer: "We store all your monitoring data indefinitely with no retention limits. You can analyze trends from years ago, compare performance across different time periods, and build long-term reliability reports. Most competitors limit historical data to 30-90 days."
    },
    {
      question: "Do you provide custom reports?",
      answer: "Yes, you can build custom reports focusing on the metrics that matter to you. Filter by time periods, specific websites, or performance thresholds. Create dashboards that show exactly what you need without the clutter of irrelevant metrics."
    },
    {
      question: "How do you calculate uptime percentage?",
      answer: "Uptime is calculated as (successful checks / total checks) × 100 for any given time period. We perform real HTTP requests, not just ping tests, so our uptime calculations reflect actual website availability to users."
    },
    {
      question: "What's the difference between your analytics and other monitoring tools?",
      answer: "Unlike generic analytics tools, we focus specifically on infrastructure monitoring with real-time data, 90 days retention max, and developer-friendly features. We don't track user behavior - we track whether your services are working and how fast they respond."
    },
    {
      question: "Can I integrate analytics with other tools?",
      answer: "Yes, our REST API allows you to integrate analytics data with other tools and dashboards. You can also set up webhooks to receive real-time analytics updates in your own systems."
    }
  ];

  const technicalDetails = {
    architecture: "Real-time analytics powered by BigQuery for unlimited data storage and fast queries. Live updates flow instantly while BigQuery processes historical analysis and complex aggregations.",
    performance: "Analytics queries return results in under 500ms even for years of data. Real-time dashboards update instantly with new monitoring data. Aggregated metrics are pre-calculated for optimal performance.",
    api: "Analytics API provides programmatic access to all metrics, trends, and reports. RESTful endpoints with HMAC authentication. Rate limits: 2000 requests/hour per API key. Full OpenAPI documentation available."
  };

  const relatedFeatures = [
    {
      title: "Real-Time Monitoring",
      description: "Monitor websites and APIs with fast checks and instant alerts when issues occur.",
      href: "/real-time-monitoring",
      icon: <Globe className="w-6 h-6 text-white" />
    },
    {
      title: "Comprehensive Logs",
      description: "View detailed monitoring history with advanced search, filtering, and export capabilities.",
      href: "/logs",
      icon: <FileText className="w-6 h-6 text-white" />
    },
    {
      title: "Smart Alerting",
      description: "Configure webhooks, email alerts, and custom notification rules for monitoring events.",
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
      description: "Integrate monitoring and analytics into your workflows with our comprehensive REST API.",
      href: "/api-webhooks",
      icon: <Code className="w-6 h-6 text-white" />
    }
  ];

  return (
    <>
      <StructuredData
        type="Product"
        data={{
          name: "Website Monitoring Analytics",
          description: "Comprehensive website monitoring analytics with detailed reports, performance insights, and historical data. Free analytics for developers.",
          url: "https://exit1.dev/analytics",
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
          category: "Website Analytics",
          features: features.map(f => f.title),
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "120"
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
        title="Analytics That Cut Through Noise"
        subtitle="Real insights, no fluff metrics"
        description="Most analytics drown you in data. Ours shows what breaks your site—and why. Track trends, spot issues, fix faster. Free, unlimited."
        features={features}
        ctaText="See Your Real Stats"
        ctaHref="https://app.exit1.dev/"
        seoTitle="Website Monitoring Analytics & Performance Reports | exit1.dev"
        seoDescription="Comprehensive website monitoring analytics with detailed reports, performance insights, and historical data. Free analytics for developers."
        comparisonTable={comparisonTable}
        faq={faq}
        technicalDetails={technicalDetails}
        relatedFeatures={relatedFeatures}
      />
    </>
  );
};

export default Analytics;
