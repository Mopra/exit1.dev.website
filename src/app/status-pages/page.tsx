import React from 'react';
import { Metadata } from 'next';
import ProductPage from '@/components/ProductPage';
import StructuredData from '@/components/StructuredData';
import { 
  Globe,
  Calendar,
  LayoutGrid,
  Lock,
  Palette,
  Link as LinkIcon,
  Maximize2,
  Volume2,
  Bell,
  Clock,
  BarChart3,
  FileText,
  Shield,
  Code
} from 'lucide-react';

export const metadata: Metadata = {
  title: "Public Status Pages | exit1.dev",
  description: "Create beautiful public status pages to share your service health with customers. Real-time updates, 30-day history, custom branding, and custom domains.",
  keywords: "public status page, uptime status page, service status page, custom status page, branded status page, status page hosting, uptime monitoring status page, customer status page, SaaS status page, website status page",
  openGraph: {
    title: "Public Status Pages | exit1.dev",
    description: "Create beautiful public status pages to share your service health with customers. Real-time updates, 30-day history, custom branding, and custom domains.",
    type: "website",
    url: "https://exit1.dev/status-pages",
  },
  twitter: {
    title: "Public Status Pages | exit1.dev",
    description: "Create beautiful public status pages to share your service health with customers. Real-time updates, 30-day history, custom branding, and custom domains.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://exit1.dev/status-pages",
  },
};

const StatusPages = () => {
  const features = [
    {
      title: "Real-Time Status Updates",
      description: "Your status page automatically refreshes every 60 seconds, showing live status for all your monitored services. No manual updates needed.",
      icon: <Globe className="w-6 h-6 text-white" />
    },
    {
      title: "30-Day Heartbeat History",
      description: "Every check displays a visual 30-day history showing daily status. Your customers can see at a glance how reliable your services have been.",
      icon: <Calendar className="w-6 h-6 text-white" />
    },
    {
      title: "Multiple Layout Options",
      description: "Choose from 2-column grid, 3-column grid, or single column layouts. Pick what fits your needs and number of services best.",
      icon: <LayoutGrid className="w-6 h-6 text-white" />
    },
    {
      title: "Public or Private",
      description: "Set your status page as public for customers to access, or keep it private for internal team visibility only.",
      icon: <Lock className="w-6 h-6 text-white" />
    },
    {
      title: "Custom Branding",
      description: "Add your logo, favicon, and brand colors. Make your status page look like a natural part of your product (Nano plan).",
      icon: <Palette className="w-6 h-6 text-white" />
    },
    {
      title: "Custom Domain",
      description: "Host your status page on your own domain like status.yourcompany.com. We handle SSL certificates automatically (Nano plan).",
      icon: <LinkIcon className="w-6 h-6 text-white" />
    },
    {
      title: "Fullscreen Mode",
      description: "Perfect for NOC displays, office dashboards, or TV monitors. One click expands to a clean, distraction-free view.",
      icon: <Maximize2 className="w-6 h-6 text-white" />
    },
    {
      title: "Sound Alerts",
      description: "Enable audio alerts and get an audible notification when any service goes offline. Ideal for keeping a status page open while you work.",
      icon: <Volume2 className="w-6 h-6 text-white" />
    },
    {
      title: "Browser Tab Alerts",
      description: "When a service goes down, the page title changes and the favicon pulses with a red indicator. Notice issues even when the tab is in the background.",
      icon: <Bell className="w-6 h-6 text-white" />
    }
  ];

  const comparisonTable = [
    {
      feature: "Real-time updates",
      exit1: true,
      competitors: "Manual refresh"
    },
    {
      feature: "30-day history visualization",
      exit1: true,
      competitors: "Limited history"
    },
    {
      feature: "Multiple layout options",
      exit1: true,
      competitors: "Single layout"
    },
    {
      feature: "Group by folder",
      exit1: true,
      competitors: false
    },
    {
      feature: "Fullscreen mode",
      exit1: true,
      competitors: false
    },
    {
      feature: "Sound alerts",
      exit1: true,
      competitors: false
    },
    {
      feature: "Browser tab alerts",
      exit1: true,
      competitors: false
    },
    {
      feature: "Custom branding",
      exit1: "Nano plan",
      competitors: "Enterprise only"
    },
    {
      feature: "Custom domain",
      exit1: "Nano plan",
      competitors: "Enterprise only"
    },
    {
      feature: "SSL included",
      exit1: true,
      competitors: "Extra cost"
    },
    {
      feature: "Free tier",
      exit1: "1 status page",
      competitors: "No free tier"
    },
    {
      feature: "Unlimited status pages",
      exit1: "Nano plan",
      competitors: "Per-page pricing"
    }
  ];

  const faq = [
    {
      question: "How often does the status page update?",
      answer: "The status page automatically refreshes every 60 seconds, showing the latest status from your monitors. No manual refresh needed - your customers always see current data."
    },
    {
      question: "Can I show different checks to different audiences?",
      answer: "Yes, you can create multiple status pages (Nano plan) with different selections of checks for different audiences. Show customer-facing services while keeping internal infrastructure private."
    },
    {
      question: "What happens if a check goes down?",
      answer: "The status page immediately reflects the current status with a clear visual indicator. Online services show green, degraded services show amber, and offline services show red. If you have alerts configured, you'll also receive notifications via your preferred channels."
    },
    {
      question: "Do I need technical knowledge to set up a custom domain?",
      answer: "You'll need access to your domain's DNS settings. We provide clear instructions: just add a CNAME record pointing to app.exit1.dev. We handle SSL certificates automatically."
    },
    {
      question: "Is SSL included for custom domains?",
      answer: "Yes, we automatically provision and manage SSL certificates for all custom domains at no extra cost. Your status page will always be served securely over HTTPS."
    },
    {
      question: "Can I embed the status page on my website?",
      answer: "The status page is designed as a standalone page, but you can link to it from your website, documentation, or app. Share the URL with customers or add it to your support resources."
    },
    {
      question: "What are the status indicators?",
      answer: "We show five status states: Online (green) for normal operation, Degraded (amber) for slow or partial availability, Offline (red) for not responding, Redirect (blue) for URL redirects, and Paused (yellow) for paused monitoring."
    },
    {
      question: "How do I set up a status page?",
      answer: "Create a status page in minutes: give it a name, select which monitors to display, choose your layout, and optionally add your branding. Then share the link with your customers or set up your custom domain."
    }
  ];

  const technicalDetails = {
    architecture: "Status pages are served from our global edge network for fast loading worldwide. Real-time data is pulled from our monitoring infrastructure with intelligent caching. Custom domains use automatic SSL provisioning via Let's Encrypt.",
    performance: "Status pages load in under 1 second globally. Auto-refresh every 60 seconds with minimal bandwidth usage. Snapshot data cached for 1 minute, uptime history cached for 5 minutes for optimal performance.",
    api: "Full API access to manage status pages programmatically. Create, update, and delete status pages via REST endpoints. Configure visibility, branding, and monitor selection through the API."
  };

  const relatedFeatures = [
    {
      title: "Real-Time Monitoring",
      description: "Monitor websites and APIs with 1-minute checks and instant alerts when issues occur.",
      href: "/real-time-monitoring",
      icon: <Clock className="w-6 h-6 text-white" />
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
      title: "Smart Alerting",
      description: "Get notified via webhooks and email when issues occur. Prevent alert fatigue with smart suppression.",
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
      title: "API Integration",
      description: "Integrate monitoring and status pages into your workflows with our comprehensive REST API.",
      href: "/api-webhooks",
      icon: <Code className="w-6 h-6 text-white" />
    }
  ];

  return (
    <>
      <StructuredData
        type="Product"
        data={{
          name: "Public Status Pages",
          description: "Create beautiful public status pages to share your service health with customers. Real-time updates, 30-day history, custom branding, and custom domains.",
          url: "https://exit1.dev/status-pages",
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
          category: "Status Page Hosting",
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
        title="Keep Your Customers Informed"
        subtitle="Beautiful public status pages"
        description="Create real-time status pages that show your customers exactly what's up and what's down. Build trust through transparency with 30-day history, custom branding, and your own domain."
        features={features}
        ctaText="Create Your Status Page"
        ctaHref="https://app.exit1.dev/"
        seoTitle="Public Status Pages | exit1.dev"
        seoDescription="Create beautiful public status pages to share your service health with customers. Real-time updates, 30-day history, custom branding, and custom domains."
        comparisonTable={comparisonTable}
        faq={faq}
        technicalDetails={technicalDetails}
        relatedFeatures={relatedFeatures}
        nanoUpgrade={{
          title: "Want custom branding and your own domain?",
          description: "Make your status page truly yours with custom logo, colors, favicon, and host it on status.yourcompany.com. Nano includes unlimited status pages for just $3/month."
        }}
      />
    </>
  );
};

export default StatusPages;
