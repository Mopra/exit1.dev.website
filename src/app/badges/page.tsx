import React from 'react';
import { Metadata } from 'next';
import ProductPage from '@/components/ProductPage';
import StructuredData from '@/components/StructuredData';
import { PageSection, SectionContent } from '@/components/PageLayout';
import { UptimeBadge } from '@/components/UptimeBadge';
import {
  BadgeCheck,
  Clock,
  Activity,
  Code,
  Palette,
  Eye,
  Globe,
  Shield,
  BarChart3,
  FileText,
  Bell,
  Layers,
} from 'lucide-react';

export const metadata: Metadata = {
  title: "Embeddable Status Badges | exit1.dev",
  description: "Add real-time status, uptime percentage, and response time badges to your README, docs, or website. SVG badges that update automatically every 5 minutes.",
  keywords: "status badge, uptime badge, response time badge, embeddable badge, readme badge, uptime monitor badge, service status badge, svg status badge, website uptime badge",
  openGraph: {
    title: "Embeddable Status Badges | exit1.dev",
    description: "Add real-time status, uptime percentage, and response time badges to your README, docs, or website. SVG badges that update automatically every 5 minutes.",
    type: "website",
    url: "https://exit1.dev/badges",
  },
  twitter: {
    title: "Embeddable Status Badges | exit1.dev",
    description: "Add real-time status, uptime percentage, and response time badges to your README, docs, or website. SVG badges that update automatically every 5 minutes.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://exit1.dev/badges",
  },
};

const Badges = () => {
  const features = [
    {
      title: "Status Badges",
      description: "Show real-time up/down status for any monitored service. Green for online, red for offline, amber for maintenance — updates automatically.",
      icon: <BadgeCheck className="w-6 h-6 text-white" />
    },
    {
      title: "Uptime Badges",
      description: "Display your 30-day uptime percentage. Color-coded thresholds: green for 99%+, amber for 95%+, and red below 95%.",
      icon: <Clock className="w-6 h-6 text-white" />
    },
    {
      title: "Response Time Badges",
      description: "Show average response time for any check. Give visitors and contributors confidence in your service performance at a glance.",
      icon: <Activity className="w-6 h-6 text-white" />
    },
    {
      title: "Multiple Embed Formats",
      description: "Embed via script tag, HTML img tag, or Markdown. Works in GitHub READMEs, documentation sites, dashboards, and any webpage.",
      icon: <Code className="w-6 h-6 text-white" />
    },
    {
      title: "Removable Branding",
      description: "Free badges include a small exit1.dev footer. Nano and Scale users can remove branding for a clean, white-label look.",
      icon: <Palette className="w-6 h-6 text-white" />
    },
    {
      title: "Live Preview",
      description: "Preview all three badge types in the dashboard before embedding. Copy the snippet you need with one click.",
      icon: <Eye className="w-6 h-6 text-white" />
    },
    {
      title: "SVG Rendering",
      description: "Badges are rendered as crisp SVGs that look sharp on any screen. Lightweight, fast-loading, and retina-ready.",
      icon: <Layers className="w-6 h-6 text-white" />
    },
    {
      title: "Automatic Caching",
      description: "Badge responses are cached for 5 minutes with proper Cache-Control headers. Fast delivery worldwide without hammering your monitors.",
      icon: <Globe className="w-6 h-6 text-white" />
    }
  ];

  const comparisonTable = [
    {
      feature: "Real-time status badges",
      exit1: true,
      competitors: "Limited"
    },
    {
      feature: "Uptime percentage badges",
      exit1: true,
      competitors: false
    },
    {
      feature: "Response time badges",
      exit1: true,
      competitors: false
    },
    {
      feature: "Script, HTML & Markdown embed",
      exit1: true,
      competitors: "HTML only"
    },
    {
      feature: "SVG rendering",
      exit1: true,
      competitors: "PNG/raster"
    },
    {
      feature: "Removable branding",
      exit1: "Nano plan",
      competitors: "Enterprise only"
    },
    {
      feature: "Live preview in dashboard",
      exit1: true,
      competitors: false
    },
    {
      feature: "Free tier",
      exit1: true,
      competitors: "No free tier"
    },
    {
      feature: "Auto-refresh caching",
      exit1: "5-minute TTL",
      competitors: "Manual refresh"
    },
    {
      feature: "One-click copy",
      exit1: true,
      competitors: false
    }
  ];

  const faq = [
    {
      question: "What badge types are available?",
      answer: "Three types: Status (shows online/offline/maintenance state), Uptime (shows 30-day uptime percentage), and Response Time (shows average response time in milliseconds). Each badge auto-updates every 5 minutes."
    },
    {
      question: "How do I embed a badge?",
      answer: "Open any check in your dashboard and find the Badge Embed section. Choose your badge type and format (Script, HTML, or Markdown), then copy the snippet. Paste it into your README, docs, or website."
    },
    {
      question: "Can I use badges in a GitHub README?",
      answer: "Yes. Use the Markdown format to embed badges directly in any GitHub README, wiki, or documentation file. The badge renders as an image that links back to your monitoring."
    },
    {
      question: "How often do badges update?",
      answer: "Badge data is cached for 5 minutes. After the cache expires, the next request fetches fresh data from your monitors. This balances real-time accuracy with fast delivery."
    },
    {
      question: "Can I remove the exit1.dev branding?",
      answer: "Yes, Nano and Scale plan users can toggle branding off in the dashboard. Free plan badges include a small exit1.dev footer."
    },
    {
      question: "What happens if my check is paused or deleted?",
      answer: "Paused checks show a gray badge. If a check is deleted, the badge displays an 'unknown' state with a gray color. The badge endpoint never returns an error — it always renders a valid SVG."
    }
  ];

  const technicalDetails = {
    architecture: "Badges are rendered as inline SVGs by a dedicated Cloud Function. The endpoint reads check status from Firestore and uptime data from BigQuery daily summaries, then generates a crisp SVG with gradient styling.",
    performance: "Responses are cached with 5-minute TTL (Cache-Control: public, max-age=300). Error states cache for 1 minute. Rate limited to 60 requests per minute per IP. SVGs are typically under 2KB.",
    api: "GET /v1/badge/{checkId}?type=status|uptime|response&branding=true|false — returns image/svg+xml. Available embed formats: script tag (auto-injects img), raw HTML img tag, and Markdown image syntax."
  };

  const relatedFeatures = [
    {
      title: "Status Pages",
      description: "Full public status pages with real-time updates, 30-day history, and drag & drop builder.",
      href: "/status-pages",
      icon: <Globe className="w-6 h-6 text-white" />
    },
    {
      title: "Analytics & Reports",
      description: "Track uptime trends, response times, and performance metrics with detailed analytics.",
      href: "/analytics",
      icon: <BarChart3 className="w-6 h-6 text-white" />
    },
    {
      title: "API & Webhooks",
      description: "Integrate monitoring into your workflows with our comprehensive REST API.",
      href: "/api-webhooks",
      icon: <Code className="w-6 h-6 text-white" />
    },
    {
      title: "Smart Alerting",
      description: "Get notified via email, SMS, Slack, Discord, Teams, and webhooks when issues occur.",
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
      title: "Comprehensive Logs",
      description: "View detailed monitoring history with advanced search, filtering, and export capabilities.",
      href: "/logs",
      icon: <FileText className="w-6 h-6 text-white" />
    }
  ];

  return (
    <>
      <StructuredData
        type="Product"
        data={{
          name: "Embeddable Status Badges",
          description: "Add real-time status, uptime percentage, and response time badges to your README, docs, or website. SVG badges that update automatically every 5 minutes.",
          url: "https://exit1.dev/badges",
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
          category: "Status Badges",
          features: features.map(f => f.title),
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "72"
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
        title="Show Your Uptime Everywhere"
        subtitle="Embeddable status badges"
        description="Drop real-time status, uptime percentage, and response time badges into your README, docs, or website. SVG badges that update automatically — no maintenance required."
        heroExtra={
          <PageSection className="py-16">
            <SectionContent size="md">
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
                  Live Badges
                </h2>
                <p className="text-lg text-white/70 max-w-2xl mx-auto">
                  These are real badges, updating every 5 minutes
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <div className="flex flex-col items-center gap-3">
                  <span className="text-sm text-white/50 uppercase tracking-wide font-medium">Status</span>
                  <UptimeBadge type="status" />
                </div>
                <div className="flex flex-col items-center gap-3">
                  <span className="text-sm text-white/50 uppercase tracking-wide font-medium">Uptime</span>
                  <UptimeBadge type="uptime" />
                </div>
                <div className="flex flex-col items-center gap-3">
                  <span className="text-sm text-white/50 uppercase tracking-wide font-medium">Response Time</span>
                  <UptimeBadge type="response" />
                </div>
              </div>
            </SectionContent>
          </PageSection>
        }
        features={features}
        ctaText="Get Your Badge"
        ctaHref="https://app.exit1.dev/"
        seoTitle="Embeddable Status Badges | exit1.dev"
        seoDescription="Add real-time status, uptime percentage, and response time badges to your README, docs, or website. SVG badges that update automatically every 5 minutes."
        comparisonTable={comparisonTable}
        faq={faq}
        technicalDetails={technicalDetails}
        relatedFeatures={relatedFeatures}
        nanoUpgrade={{
          title: "Want clean, unbranded badges?",
          description: "Remove the exit1.dev footer from your badges with Nano. White-label status badges for your README and docs. Just $5/month."
        }}
      />
    </>
  );
};

export default Badges;
