import React from 'react';
import { Metadata } from 'next';
import ProductPage from '@/components/ProductPage';
import StructuredData from '@/components/StructuredData';
import { 
  Shield, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Download, 
  Eye,
  Globe,
  BarChart3,
  FileText,
  Bell,
  Code
} from 'lucide-react';

export const metadata: Metadata = {
  title: "SSL Certificate Monitoring & Security Alerts | exit1.dev",
  description: "Monitor SSL certificate validity, expiration dates, and security issues automatically. Get alerts before certificates expire and ensure your websites stay secure. Free SSL monitoring for developers.",
  keywords: "SSL monitoring, certificate monitoring, SSL expiration, SSL alerts, certificate validity, SSL security, free SSL monitoring, certificate expiry alerts",
  openGraph: {
    title: "SSL Certificate Monitoring & Security Alerts | exit1.dev",
    description: "Monitor SSL certificate validity, expiration dates, and security issues automatically. Get alerts before certificates expire and ensure your websites stay secure. Free SSL monitoring for developers.",
    type: "website",
    url: "https://exit1.dev/ssl-monitoring",
  },
  twitter: {
    title: "SSL Certificate Monitoring & Security Alerts | exit1.dev",
    description: "Monitor SSL certificate validity, expiration dates, and security issues automatically. Get alerts before certificates expire and ensure your websites stay secure. Free SSL monitoring for developers.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://exit1.dev/ssl-monitoring",
  },
};

const SSLMonitoring = () => {
  const features = [
    {
      title: "Automatic SSL Checks",
      description: "Monitor SSL certificates automatically with every website check. No extra setup required.",
      icon: <Shield className="w-6 h-6 text-white" />
    },
    {
      title: "Expiration Alerts",
      description: "Get notified weeks before certificates expire. Never let SSL certificates lapse again.",
      icon: <Clock className="w-6 h-6 text-white" />
    },
    {
      title: "Security Validation",
      description: "Check certificate validity, issuer, and security protocols. Ensure your SSL is properly configured.",
      icon: <CheckCircle className="w-6 h-6 text-white" />
    },
    {
      title: "Detailed Information",
      description: "View certificate details, issuer information, and security status in one place.",
      icon: <Eye className="w-6 h-6 text-white" />
    },
    {
      title: "Security Warnings",
      description: "Get alerts for weak ciphers, outdated protocols, and other security issues.",
      icon: <AlertTriangle className="w-6 h-6 text-white" />
    },
    {
      title: "Export Certificate Data",
      description: "Download certificate information for compliance and documentation purposes.",
      icon: <Download className="w-6 h-6 text-white" />
    }
  ];

  const comparisonTable = [
    {
      feature: "Automatic SSL monitoring",
      exit1: true,
      competitors: "Separate service"
    },
    {
      feature: "Expiration alerts",
      exit1: true,
      competitors: "Limited or paid"
    },
    {
      feature: "Security validation",
      exit1: true,
      competitors: "Basic checks only"
    },
    {
      feature: "Detailed certificate info",
      exit1: true,
      competitors: "Limited details"
    },
    {
      feature: "Security warnings",
      exit1: true,
      competitors: false
    },
    {
      feature: "Free SSL monitoring",
      exit1: true,
      competitors: "Paid service"
    },
    {
      feature: "Integration with monitoring",
      exit1: true,
      competitors: "Separate tools"
    },
    {
      feature: "API access to SSL data",
      exit1: true,
      competitors: "Paid only"
    },
    {
      feature: "Export certificate data",
      exit1: true,
      competitors: "Limited exports"
    },
    {
      feature: "No SSL check limits",
      exit1: true,
      competitors: "Monthly limits"
    }
  ];

  const faq = [
    {
      question: "How often do you check SSL certificates?",
      answer: "We check SSL certificates automatically with every website monitoring check. If you monitor a website every 5 minutes, we'll check its SSL certificate every 5 minutes too. This ensures you catch any SSL issues immediately."
    },
    {
      question: "When do I get SSL expiration alerts?",
      answer: "You'll receive SSL expiration alerts 30 days, 7 days, and 1 day before certificates expire. This gives you plenty of time to renew certificates before they cause website issues. You can customize these alert thresholds if needed."
    },
    {
      question: "What SSL security issues do you detect?",
      answer: "We detect weak cipher suites, outdated SSL/TLS protocols, certificate chain issues, and other security vulnerabilities. We also check for proper certificate installation and configuration to ensure your SSL is working correctly."
    },
    {
      question: "Do I need to set up SSL monitoring separately?",
      answer: "No, SSL monitoring is automatically included with every website you monitor. When you add a website for uptime monitoring, we automatically start monitoring its SSL certificate as well. No additional configuration required."
    },
    {
      question: "What certificate information do you provide?",
      answer: "We show certificate issuer, validity dates, subject information, key strength, signature algorithm, and supported protocols. You can view all certificate details in our dashboard and export this information for compliance purposes."
    },
    {
      question: "Can I monitor SSL certificates for APIs and services?",
      answer: "Yes, we monitor SSL certificates for any HTTPS endpoint you add to monitoring. This includes websites, APIs, microservices, and any other HTTPS service. All SSL monitoring features work the same regardless of the service type."
    },
    {
      question: "How do SSL alerts work with my other notifications?",
      answer: "SSL alerts are integrated with your existing alerting system. You can receive SSL alerts via email, webhooks, or both. SSL alerts follow the same suppression and rate limiting rules as your other monitoring alerts."
    },
    {
      question: "Do you support wildcard certificates and multiple domains?",
      answer: "Yes, we support all types of SSL certificates including wildcard certificates, multi-domain certificates (SAN), and single-domain certificates. We'll monitor the certificate for each domain you add to monitoring."
    }
  ];

  const technicalDetails = {
    architecture: "SSL monitoring integrated into our core monitoring system. Certificate validation performed using industry-standard OpenSSL libraries. Certificate information cached and updated with each monitoring check. Security validation follows OWASP guidelines.",
    performance: "SSL certificate checks complete in under 100ms per domain. Certificate validation includes full chain verification and security protocol analysis. System handles thousands of concurrent SSL checks efficiently.",
    api: "SSL API provides programmatic access to certificate information and validation results. RESTful endpoints with HMAC authentication. Rate limits: 1000 requests/hour per API key. Includes certificate details and security analysis."
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
      title: "Global Monitoring",
      description: "Monitor your infrastructure from multiple global locations for comprehensive coverage.",
      href: "/global-monitoring",
      icon: <Globe className="w-6 h-6 text-white" />
    },
    {
      title: "API Integration",
      description: "Integrate monitoring and SSL data into your workflows with our comprehensive REST API.",
      href: "/api-webhooks",
      icon: <Code className="w-6 h-6 text-white" />
    }
  ];

  return (
    <>
      <StructuredData
        type="Product"
        data={{
          name: "SSL Certificate Monitoring",
          description: "Monitor SSL certificate validity, expiration dates, and security issues automatically. Get alerts before certificates expire and ensure your websites stay secure. Free SSL monitoring for developers.",
          url: "https://exit1.dev/ssl-monitoring",
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
          category: "SSL Monitoring",
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
        title="SSL Monitoring That Keeps You Secure"
        subtitle="Automatic certificate validation, expiration alerts"
        description="Never let SSL certificates expire again. Automatic monitoring, security validation, and timely alerts keep your websites secure. Included free with every website you monitor."
        features={features}
        ctaText="Monitor SSL Certificates"
        ctaHref="https://app.exit1.dev/"
        seoTitle="SSL Certificate Monitoring & Security Alerts | exit1.dev"
        seoDescription="Monitor SSL certificate validity, expiration dates, and security issues automatically. Get alerts before certificates expire and ensure your websites stay secure. Free SSL monitoring for developers."
        comparisonTable={comparisonTable}
        faq={faq}
        technicalDetails={technicalDetails}
        relatedFeatures={relatedFeatures}
      />
    </>
  );
};

export default SSLMonitoring;
