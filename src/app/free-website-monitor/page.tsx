import React from 'react';
import { Metadata } from 'next';
import ProductPage from '@/components/ProductPage';
import StructuredData from '@/components/StructuredData';
import {
  ShoppingBag,
  Code,
  Globe,
  Shield,
  Bell,
  Sparkle,
  Layers,
  FileText,
  BarChart3,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free Website Monitor - Keep Shopify, WooCommerce & Jamstack Online | exit1.dev',
  description:
    'exit1.dev delivers a free website monitor for ecommerce, landing pages, Jamstack, and marketing sites. Unlimited URLs, 1-minute checks, SSL coverage, content validation, instant alerts.',
  keywords:
    'free website monitor, shopify uptime monitoring, woocommerce monitoring, jamstack uptime, landing page monitoring, free ecommerce monitoring',
  openGraph: {
    title: 'Free Website Monitor - Keep Shopify, WooCommerce & Jamstack Online | exit1.dev',
    description:
      'Monitor storefronts, landing pages, and static sites for free. Unlimited URLs, 1-minute checks, content validation, SSL tracking, instant alerts.',
    type: 'website',
    url: 'https://exit1.dev/free-website-monitor',
  },
  twitter: {
    title: 'Free Website Monitor - Keep Shopify, WooCommerce & Jamstack Online | exit1.dev',
    description:
      'Monitor storefronts, landing pages, and static sites for free. Unlimited URLs, 1-minute checks, content validation, SSL tracking, instant alerts.',
    card: 'summary_large_image',
  },
  alternates: {
    canonical: 'https://exit1.dev/free-website-monitor',
  },
};

const FreeWebsiteMonitorPage = () => {
  const features = [
    {
      title: 'Built for storefront uptime',
      description: 'Shopify, WooCommerce, custom carts—watch product pages, checkout flows, and promo landing pages without limits.',
      icon: <ShoppingBag className="w-6 h-6 text-white" />,
    },
    {
      title: 'Jamstack and static sites welcome',
      description: 'Monitor GitHub Pages, Netlify, Vercel, Cloudflare Pages, and any CDN edge without installing agents.',
      icon: <Code className="w-6 h-6 text-white" />,
    },
    {
      title: 'Content validation baked in',
      description: 'Confirm hero copy, pricing snippets, and CTA buttons render correctly by asserting keywords or JSON payloads.',
      icon: <Sparkle className="w-6 h-6 text-white" />,
    },
    {
      title: 'SSL and DNS checks',
      description: 'Never lose sales to an expired certificate. We track the boring stuff so you do not have to.',
      icon: <Shield className="w-6 h-6 text-white" />,
    },
    {
      title: 'Real alerts, not vanity emails',
      description: 'Instant webhooks and emails that only fire after we confirm the issue. Tie directly into PagerDuty, Opsgenie, or Slack.',
      icon: <Bell className="w-6 h-6 text-white" />,
    },
    {
      title: 'Unlimited regions & rollups',
      description: 'Probe your pages from multiple continents and aggregate the data in analytics and logs for proper postmortems.',
      icon: <Globe className="w-6 h-6 text-white" />,
    },
  ];

  const comparisonTable = [
    {
      feature: 'Ecommerce monitoring coverage',
      exit1: 'Unlimited URLs + product pages',
      competitors: 'Single homepage unless you upgrade',
    },
    {
      feature: 'Content keyword validation',
      exit1: true,
      competitors: 'Premium feature',
    },
    {
      feature: 'Jamstack-friendly checks',
      exit1: 'Agentless',
      competitors: 'Agent installs or manual scripts',
    },
    {
      feature: 'SSL expiry',
      exit1: true,
      competitors: 'Locked behind paid plans',
    },
    {
      feature: 'Global regions',
      exit1: 'All free tier',
      competitors: 'Regional add-ons',
    },
    {
      feature: 'Webhook + email alerts',
      exit1: 'Included',
      competitors: 'Upgrade required',
    },
    {
      feature: '90 days retention max',
      exit1: 'Full export anytime',
      competitors: '30-60 day retention',
    },
  ];

  const faq = [
    {
      question: 'Can I monitor specific Shopify or WooCommerce pages?',
      answer:
        'Yes. Add every product URL, checkout endpoint, and marketing landing page. We run headless-friendly HTTP checks and validate the exact text or JSON you expect.',
    },
    {
      question: 'Does it work with static Jamstack deployments?',
      answer:
        'Absolutely. We monitor Netlify, Vercel, GitHub Pages, Cloudflare Pages, or any CDN-backed site. No agents, no cron scripts, just HTTP checks from multiple regions.',
    },
    {
      question: 'How do alerts work for marketing teams?',
      answer:
        'Route alerts to email, Slack, Discord, PagerDuty, Opsgenie, or any webhook. Configure different channels per site or campaign so the right crew hears about trouble first.',
    },
    {
      question: 'Do you track SSL certificates and domains for my sites?',
      answer:
        'Yes. Every monitor automatically watches SSL validity. You get notified before customers see the warning screens.',
    },
    {
      question: 'Is there a limit to the number of pages I can watch?',
      answer:
        'No. Monitor every microsite, promo page, and shop. Unlimited URLs are part of the core free plan.',
    },
  ];

  const technicalDetails = {
    architecture:
      'Serverless monitors across multiple regions with redundant storage. Each check hits the real HTTP endpoints and validates content signatures.',
    performance:
      '1-minute polling available globally with multi-step verification before alerts fire. Response data stored for analytics and export.',
    api:
      'REST API and webhooks for managing monitors, syncing with CMS workflows, and exporting uptime data into your warehouse.',
  };

  const relatedFeatures = [
    {
      title: 'Analytics & Reports',
      description: 'Slice uptime, response times, and campaign performance without another BI license.',
      href: '/analytics',
      icon: <BarChart3 className="w-6 h-6 text-white" />,
    },
    {
      title: 'Comprehensive Logs',
      description: 'Pull request-by-request history to debug CDN rules, caching issues, and DNS hiccups.',
      href: '/logs',
      icon: <FileText className="w-6 h-6 text-white" />,
    },
    {
      title: 'Global Monitoring',
      description: 'See how fast your site responds from every region we cover and tune for international buyers.',
      href: '/global-monitoring',
      icon: <Layers className="w-6 h-6 text-white" />,
    },
  ];

  return (
    <>
      <StructuredData
        type="Product"
        data={{
          name: 'Free Website Monitor',
          description:
            'Free website monitoring for ecommerce, landing pages, and Jamstack sites with unlimited URLs, 1-minute checks, SSL, and content validation.',
          url: 'https://exit1.dev/free-website-monitor',
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
        title="Free Website Monitor"
        subtitle="Keep storefronts, landing pages, and Jamstack builds honest—without spending a cent."
        description="Your website is a revenue engine, not a brochure. exit1.dev watches every pixel that matters, fires real alerts, and gives you the data to prove reliability."
        features={features}
        ctaText="Monitor my sites for free"
        ctaHref="https://app.exit1.dev/"
        comparisonTable={comparisonTable}
        faq={faq}
        technicalDetails={technicalDetails}
        relatedFeatures={relatedFeatures}
      />
    </>
  );
};

export default FreeWebsiteMonitorPage;
