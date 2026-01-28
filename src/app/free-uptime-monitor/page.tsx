import React from 'react';
import { Metadata } from 'next';
import ProductPage from '@/components/ProductPage';
import StructuredData from '@/components/StructuredData';
import {
  Clock,
  Globe,
  Shield,
  Bell,
  Database,
  FileText,
  BarChart3,
  Cable,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free Uptime Monitor - Unlimited Checks & Fast Intervals | exit1.dev',
  description:
    'exit1.dev is the blunt, free uptime monitor. Unlimited websites and APIs, 5-minute checks (1-minute with Nano), instant webhook + email alerts, SSL coverage. No fake free tier.',
  keywords:
    'free uptime monitor, unlimited uptime monitoring, uptime robot alternative, free website uptime monitoring, free api monitoring',
  openGraph: {
    title: 'Free Uptime Monitor - Unlimited Checks & Fast Intervals | exit1.dev',
    description:
      'Unlimited monitors, fast intervals, webhook + email alerts, SSL, and analytics. The free uptime monitor built for people who actually ship.',
    type: 'website',
    url: 'https://exit1.dev/free-uptime-monitor',
  },
  twitter: {
    title: 'Free Uptime Monitor - Unlimited Checks & Fast Intervals | exit1.dev',
    description:
      'Unlimited monitors, fast intervals, webhook + email alerts, SSL, and analytics. The free uptime monitor built for people who actually ship.',
    card: 'summary_large_image',
  },
  alternates: {
    canonical: 'https://exit1.dev/free-uptime-monitor',
  },
};

const FreeUptimeMonitorPage = () => {
  const features = [
    {
      title: 'Unlimited monitors, zero invoices',
      description: 'Track every site, API, cron endpoint, and landing page. No caps, no nagging upgrade banners.',
      icon: <Globe className="w-6 h-6 text-white" />,
    },
    {
      title: 'Fast check intervals',
      description: '5-minute checks free, 1-minute with Nano. Real polling across regions, not artificial limits.',
      icon: <Clock className="w-6 h-6 text-white" />,
    },
    {
      title: 'Webhook + email alerts free forever',
      description: 'Plug straight into Slack, PagerDuty, Opsgenie, or your own webhook automation without hitting a paywall.',
      icon: <Bell className="w-6 h-6 text-white" />,
    },
    {
      title: 'Advanced checks without upsells',
      description: 'Custom headers, auth tokens, JSON body assertions, keyword checks. All in the free tier because it should be.',
      icon: <Shield className="w-6 h-6 text-white" />,
    },
    {
      title: 'Instant data exports',
      description: '90 days retention max, CSV/Excel exports, and API access so you can run real audits and SLAs without premium lock-in.',
      icon: <Database className="w-6 h-6 text-white" />,
    },
    {
      title: 'Privacy-first by default',
      description: 'No trackers, no ad pixels, no reselling. We care about uptime, not your audience data.',
      icon: <Shield className="w-6 h-6 text-white" />,
    },
  ];

  const comparisonTable = [
    {
      feature: 'Unlimited monitors',
      exit1: 'Yes, always',
      competitors: 'Capped unless you pay',
    },
    {
      feature: '1-minute intervals',
      exit1: 'Nano plan',
      competitors: 'Locked behind premium',
    },
    {
      feature: 'Webhook + email alerts',
      exit1: 'Included',
      competitors: 'Upgrade required',
    },
    {
      feature: 'Full log retention',
      exit1: '90 days retention max',
      competitors: '30-90 days max',
    },
    {
      feature: 'JSON/content validation',
      exit1: true,
      competitors: false,
    },
    {
      feature: 'SSL monitoring',
      exit1: true,
      competitors: 'Premium only',
    },
    {
      feature: 'API access',
      exit1: true,
      competitors: 'Enterprise add-on',
    },
    {
      feature: 'Transparent pricing',
      exit1: 'Free core, optional support',
      competitors: 'Freemium maze',
    },
  ];

  const faq = [
    {
      question: 'Is this really a free uptime monitor with unlimited checks?',
      answer:
        'Yes. Track as many URLs as you want. We built exit1.dev for our own projects and never wanted to meter monitors. Abuse gets throttled, legitimate usage stays free.',
    },
    {
      question: 'How fast are the uptime checks?',
      answer:
        'Every monitor can run as frequently as once per minute. If you prefer a calmer cadence, switch to 5-minute, hourly, or daily checks. No artificial delays just because you are on a free plan.',
    },
    {
      question: 'Do I need to pay extra for alerts or integrations?',
      answer:
        'No. Email and webhook alerts are included. Send payloads to Slack, Discord, PagerDuty, Opsgenie, or your own automation without hitting a paywall.',
    },
    {
      question: 'What about SSL certificate expiry checks?',
      answer:
        'They are baked in. We watch SSL validity alongside uptime, so you do not lose traffic to an expired certificate.',
    },
    {
      question: 'Can I migrate from UptimeRobot or Pingdom easily?',
      answer:
        'Absolutely. Import your URLs, keep your existing alert endpoints, and you are done. Check out the migration checklist below for a step-by-step plan.',
    },
  ];

  const technicalDetails = {
    architecture:
      'Serverless checks running across multiple regions with redundant storage. Built on boring tech we control so uptime monitoring stays fast and predictable.',
    performance:
      'Sub-200ms HTTP checks, instant webhook dispatch, and aggressive retry logic to confirm outages without spamming you.',
    api:
      'REST API with HMAC auth for creating monitors, fetching historical data, and exporting logs in bulk. Unlimited access on the free tier.',
  };

  const relatedFeatures = [
    {
      title: 'Analytics & Reports',
      description: 'Turn uptime history into SLA-ready charts without buying another dashboard.',
      href: '/analytics',
      icon: <BarChart3 className="w-6 h-6 text-white" />,
    },
    {
      title: 'Comprehensive Logs',
      description: 'Search every request, export CSVs, and build honest postmortems fast.',
      href: '/logs',
      icon: <FileText className="w-6 h-6 text-white" />,
    },
    {
      title: 'Automation Webhooks',
      description: 'Trigger PagerDuty, Opsgenie, or custom workflows with signed webhook payloads.',
      href: '/alerting',
      icon: <Cable className="w-6 h-6 text-white" />,
    },
  ];

  return (
    <>
      <StructuredData
        type="Product"
        data={{
          name: 'Free Uptime Monitor',
          description:
            'Unlimited free uptime monitoring for websites, APIs, and SSL with fast checks and instant alerts.',
          url: 'https://exit1.dev/free-uptime-monitor',
          brand: {
            '@type': 'Brand',
            name: 'exit1.dev',
          },
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          },
          category: 'Website Monitoring',
          features: features.map((feature) => feature.title),
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            reviewCount: '210',
          },
        }}
      />

      <StructuredData
        type="FAQPage"
        data={{
          mainEntity: faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }}
      />

      <ProductPage
        title="Free Uptime Monitor"
        subtitle="Unlimited monitors. Fast checks. No strings."
        description="The incumbents sell rationed uptime as a freebie. We give you the whole stack—alerts, SSL monitoring, analytics—without a paywall."
        features={features}
        ctaText="Start monitoring for free"
        ctaHref="https://app.exit1.dev/"
        comparisonTable={comparisonTable}
        faq={faq}
        technicalDetails={technicalDetails}
        relatedFeatures={relatedFeatures}
      />
    </>
  );
};

export default FreeUptimeMonitorPage;
