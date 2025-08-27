import React from 'react';
import { Metadata } from 'next';
import ProductPage from '@/components/ProductPage';
import StructuredData from '@/components/StructuredData';
import { 
  Globe, 
  MapPin, 
  Network, 
  Activity, 
  Shield, 
  Zap,
  BarChart3,
  FileText,
  Bell,
  Shield as ShieldIcon,
  Code
} from 'lucide-react';

export const metadata: Metadata = {
  title: "Global Website Monitoring - Multi-Location Uptime Monitoring | exit1.dev",
  description: "Monitor your websites from multiple global locations for comprehensive coverage. Detect regional issues, network problems, and ensure your services work worldwide. Free global monitoring for developers.",
  keywords: "global monitoring, multi-location monitoring, worldwide monitoring, regional monitoring, network monitoring, global uptime, free global monitoring, worldwide website monitoring",
  openGraph: {
    title: "Global Website Monitoring - Multi-Location Uptime Monitoring | exit1.dev",
    description: "Monitor your websites from multiple global locations for comprehensive coverage. Detect regional issues, network problems, and ensure your services work worldwide. Free global monitoring for developers.",
    type: "website",
    url: "https://exit1.dev/global-monitoring",
  },
  twitter: {
    title: "Global Website Monitoring - Multi-Location Uptime Monitoring | exit1.dev",
    description: "Monitor your websites from multiple global locations for comprehensive coverage. Detect regional issues, network problems, and ensure your services work worldwide. Free global monitoring for developers.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://exit1.dev/global-monitoring",
  },
};

const GlobalMonitoring = () => {
  const features = [
    {
      title: "Global Coverage",
      description: "Monitor from multiple locations worldwide to ensure your services work everywhere.",
      icon: <Globe className="w-6 h-6 text-white" />
    },
    {
      title: "Regional Detection",
      description: "Identify issues specific to certain regions or network providers.",
      icon: <MapPin className="w-6 h-6 text-white" />
    },
    {
      title: "Network Monitoring",
      description: "Detect network-level issues, routing problems, and connectivity issues.",
      icon: <Network className="w-6 h-6 text-white" />
    },
    {
      title: "Performance Insights",
      description: "Compare response times across different locations and identify bottlenecks.",
      icon: <Activity className="w-6 h-6 text-white" />
    },
    {
      title: "Comprehensive Alerts",
      description: "Get notified when issues occur in specific regions or globally.",
      icon: <Zap className="w-6 h-6 text-white" />
    },
    {
      title: "Global Analytics",
      description: "View performance trends and uptime statistics from all monitoring locations.",
      icon: <Shield className="w-6 h-6 text-white" />
    }
  ];

  const comparisonTable = [
    {
      feature: "Multiple global locations",
      exit1: true,
      competitors: "Limited locations"
    },
    {
      feature: "Regional issue detection",
      exit1: true,
      competitors: "Global only"
    },
    {
      feature: "Network-level monitoring",
      exit1: true,
      competitors: "Basic HTTP checks"
    },
    {
      feature: "Location-specific alerts",
      exit1: true,
      competitors: "Global alerts only"
    },
    {
      feature: "Performance comparison",
      exit1: true,
      competitors: "Limited metrics"
    },
    {
      feature: "Free global monitoring",
      exit1: true,
      competitors: "Paid feature"
    },
    {
      feature: "Real-time global data",
      exit1: true,
      competitors: "Delayed updates"
    },
    {
      feature: "API access to global data",
      exit1: true,
      competitors: "Paid only"
    },
    {
      feature: "Unlimited global checks",
      exit1: true,
      competitors: "Location limits"
    },
    {
      feature: "Global analytics dashboard",
      exit1: true,
      competitors: "Basic reporting"
    }
  ];

  const faq = [
    {
      question: "How many global locations do you monitor from?",
      answer: "We monitor from multiple strategic locations worldwide to provide comprehensive coverage. Our global monitoring network includes locations in North America, Europe, Asia, and other key regions to ensure your services work everywhere your users are located."
    },
    {
      question: "How do you detect regional issues?",
      answer: "By monitoring from multiple locations simultaneously, we can identify when issues occur in specific regions while other locations remain unaffected. This helps distinguish between global outages and regional network problems, routing issues, or local infrastructure failures."
    },
    {
      question: "What types of network issues do you detect?",
      answer: "We detect routing problems, DNS issues, network congestion, ISP-specific problems, and connectivity issues between different regions. Our monitoring can identify whether issues are with your infrastructure or with the network path to specific locations."
    },
    {
      question: "How do global monitoring alerts work?",
      answer: "You can configure alerts to trigger when issues occur in specific regions or globally. For example, you might want immediate alerts for global outages but different handling for regional issues. Alerts include location information to help you understand the scope of problems."
    },
    {
      question: "Can I compare performance across locations?",
      answer: "Yes, our global analytics show response times, uptime percentages, and performance trends for each monitoring location. This helps you identify which regions have the best and worst performance, and optimize your infrastructure accordingly."
    },
    {
      question: "Do I need to set up global monitoring separately?",
      answer: "No, global monitoring is automatically included with every website you monitor. When you add a website, we automatically start monitoring it from all our global locations. No additional configuration required."
    },
    {
      question: "How accurate is global monitoring compared to single-location monitoring?",
      answer: "Global monitoring is more accurate because it accounts for real-world network conditions that your users experience. Single-location monitoring might miss regional issues, while global monitoring provides a complete picture of your service availability worldwide."
    },
    {
      question: "Can I export global monitoring data?",
      answer: "Yes, you can export global monitoring data including location-specific metrics, regional performance comparisons, and network analysis. This data is valuable for compliance, optimization, and understanding your global service delivery."
    }
  ];

  const technicalDetails = {
    architecture: "Global monitoring network distributed across multiple cloud providers and data centers worldwide. Each location runs independent monitoring checks with redundant connectivity. Data aggregated in real-time for comprehensive global analysis.",
    performance: "Global checks complete within 2 seconds across all locations. Real-time aggregation provides instant global status updates. System handles thousands of concurrent global checks with intelligent load distribution.",
    api: "Global monitoring API provides access to location-specific data and aggregated global metrics. RESTful endpoints with HMAC authentication. Rate limits: 2000 requests/hour per API key. Includes regional performance data."
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
      title: "API Integration",
      description: "Integrate global monitoring data into your workflows with our comprehensive REST API.",
      href: "/api-webhooks",
      icon: <Code className="w-6 h-6 text-white" />
    }
  ];

  return (
    <>
      <StructuredData
        type="Product"
        data={{
          name: "Global Website Monitoring",
          description: "Monitor your websites from multiple global locations for comprehensive coverage. Detect regional issues, network problems, and ensure your services work worldwide. Free global monitoring for developers.",
          url: "https://exit1.dev/global-monitoring",
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
          category: "Global Monitoring",
          features: features.map(f => f.title),
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            reviewCount: "75"
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
        title="Global Monitoring That Works Worldwide"
        subtitle="Multi-location monitoring, regional detection"
        description="Monitor your websites from multiple global locations to ensure they work everywhere. Detect regional issues, network problems, and optimize for worldwide performance. Free global coverage."
        features={features}
        ctaText="Start Global Monitoring"
        ctaHref="https://app.exit1.dev/"
        seoTitle="Global Website Monitoring - Multi-Location Uptime Monitoring | exit1.dev"
        seoDescription="Monitor your websites from multiple global locations for comprehensive coverage. Detect regional issues, network problems, and ensure your services work worldwide. Free global monitoring for developers."
        comparisonTable={comparisonTable}
        faq={faq}
        technicalDetails={technicalDetails}
        relatedFeatures={relatedFeatures}
      />
    </>
  );
};

export default GlobalMonitoring;
