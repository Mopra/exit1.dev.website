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
  title: 'Free Uptime Monitor - 50 Free Monitors & Fast Intervals',
  description:
    'exit1.dev is the blunt, free uptime monitor. 50 monitors with 5-minute checks, instant webhook + email alerts, SSL coverage, REST API + MCP. Upgrade to Indie ($4/mo) for 100 monitors and 1-minute checks, Nano ($9/mo) for 250 monitors at 30 seconds, or Pro ($24/mo) for 1,000 monitors at 15 seconds and 3-year retention. No fake free tier.',
  keywords:
    'free uptime monitor, uptime monitoring, uptime robot alternative, free website uptime monitoring, free api monitoring',
  openGraph: {
    title: 'Free Uptime Monitor - 50 Free Monitors & Fast Intervals | exit1.dev',
    description:
      '50 free monitors, fast intervals, webhook + email alerts, SSL, API access, and analytics. Paid plans scale to 1,000 monitors and 15-second checks. The free uptime monitor built for people who actually ship.',
    type: 'website',
    url: 'https://exit1.dev/free-uptime-monitor',
  },
  twitter: {
    title: 'Free Uptime Monitor - 50 Free Monitors & Fast Intervals | exit1.dev',
    description:
      '50 free monitors, fast intervals, webhook + email alerts, SSL, API access, and analytics. Paid plans scale to 1,000 monitors and 15-second checks. The free uptime monitor built for people who actually ship.',
    card: 'summary_large_image',
  },
  alternates: {
    canonical: 'https://exit1.dev/free-uptime-monitor',
  },
};

const FreeUptimeMonitorPage = () => {
  const features = [
    {
      title: '50 free monitors, zero invoices',
      description: 'Track up to 50 sites, APIs, or endpoints on the free tier. Need more? Indie gives 100 at 1-minute checks, Nano 250 at 30 seconds, Pro 1,000 at 15 seconds.',
      icon: <Globe className="w-6 h-6 text-foreground" />,
    },
    {
      title: 'Fast check intervals',
      description: '5-minute checks free, 1-minute on Indie, 30-second on Nano, 15-second on Pro. Real polling across regions, not artificial limits.',
      icon: <Clock className="w-6 h-6 text-foreground" />,
    },
    {
      title: 'Webhook + email alerts free forever',
      description: 'Plug straight into Slack, PagerDuty, Opsgenie, or your own webhook automation without hitting a paywall.',
      icon: <Bell className="w-6 h-6 text-foreground" />,
    },
    {
      title: 'Advanced checks without upsells',
      description: 'Custom headers, auth tokens, JSON body assertions, keyword checks. All in the free tier because it should be.',
      icon: <Shield className="w-6 h-6 text-foreground" />,
    },
    {
      title: 'Instant data exports',
      description: '60 days of history on Free and up to 3 years on Pro, plus CSV/Excel exports and API access so you can run real audits and SLAs without premium lock-in.',
      icon: <Database className="w-6 h-6 text-foreground" />,
    },
    {
      title: 'Privacy-first by default',
      description: 'No trackers, no ad pixels, no reselling. We care about uptime, not your audience data.',
      icon: <Shield className="w-6 h-6 text-foreground" />,
    },
  ];

  const comparisonTable = [
    {
      feature: 'Free monitors',
      exit1: '10 (up to 1,000 on paid)',
      competitors: 'Capped unless you pay',
    },
    {
      feature: 'Sub-minute intervals',
      exit1: '1-min from Indie ($4/mo), 15-sec on Pro',
      competitors: 'Locked behind premium',
    },
    {
      feature: 'Webhook + email alerts',
      exit1: 'Included',
      competitors: 'Upgrade required',
    },
    {
      feature: 'Log retention',
      exit1: '60 days free, 3 years on Pro',
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
      question: 'Is this really a free uptime monitor?',
      answer:
        'Yes. The free tier gives you 50 monitors with 5-minute checks, plus an API key and MCP access. Need more? Indie ($4/mo) unlocks 100 monitors and 1-minute checks, Nano ($9/mo) scales to 250 monitors at 30 seconds, and Pro ($24/mo) goes to 1,000 monitors at 15 seconds with 3-year retention and SMS. Abuse gets throttled, legitimate usage stays free.',
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
      'Serverless checks with redundant storage. Built on boring tech we control so uptime monitoring stays fast and predictable.',
    performance:
      'Sub-200ms HTTP checks, instant webhook dispatch, and aggressive retry logic to confirm outages without spamming you.',
    api:
      'REST API with HMAC auth for creating monitors, fetching historical data, and exporting logs in bulk. Free mints one API key; rate limits are 5 requests/minute and 500/day per key.',
  };

  const relatedFeatures = [
    {
      title: 'Analytics & Reports',
      description: 'Turn uptime history into SLA-ready charts without buying another dashboard.',
      href: '/analytics',
      icon: <BarChart3 className="w-6 h-6 text-foreground" />,
    },
    {
      title: 'Comprehensive Logs',
      description: 'Search every request, export CSVs, and build honest postmortems fast.',
      href: '/logs',
      icon: <FileText className="w-6 h-6 text-foreground" />,
    },
    {
      title: 'Automation Webhooks',
      description: 'Trigger PagerDuty, Opsgenie, or custom workflows with signed webhook payloads.',
      href: '/alerting',
      icon: <Cable className="w-6 h-6 text-foreground" />,
    },
  ];

  return (
    <>
      <StructuredData
        type="Product"
        data={{
          name: 'Free Uptime Monitor',
          description:
            'Free uptime monitoring with up to 50 monitors, 5-minute checks, API access, and instant alerts. Paid plans scale up to 1,000 monitors with 15-second checks.',
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
        subtitle="50 free monitors. Fast checks. No strings."
        description="The incumbents sell rationed uptime as a freebie. We give you the whole stack, alerts and SSL monitoring and analytics, without a paywall."
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
