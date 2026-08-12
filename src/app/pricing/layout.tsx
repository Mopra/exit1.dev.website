import type { Metadata } from 'next';

// `page.tsx` is a client component (the monthly/annual toggle holds state), so
// it cannot export `metadata` itself. Without this the primary commercial page
// inherited the root layout's title and description verbatim — it shipped with
// the exact same title tag as the homepage and had no canonical.
export const metadata: Metadata = {
  title: 'Pricing — Free Uptime Monitoring, Paid Plans From $3/mo',
  description:
    'Transparent uptime monitoring pricing. Free forever: 50 monitors, 5-minute checks, SSL monitoring, API + MCP access and a status page. Paid from $3/mo for 1-minute checks, scaling to 1,000 monitors, 15-second checks, SMS alerts and 3-year retention. No credit card to start.',
  keywords:
    'uptime monitoring pricing, website monitoring pricing, free uptime monitoring, cheap uptime monitor, uptime monitoring cost, website monitoring plans',
  openGraph: {
    title: 'Pricing — Free Uptime Monitoring, Paid Plans From $3/mo',
    description:
      'Free forever: 50 monitors, 5-minute checks, SSL monitoring, API + MCP access and a status page. Paid from $3/mo for 1-minute checks, scaling to 1,000 monitors and 15-second checks.',
    type: 'website',
    url: 'https://exit1.dev/pricing',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing — Free Uptime Monitoring, Paid Plans From $3/mo',
    description:
      'Free forever: 50 monitors, 5-minute checks, SSL monitoring, API + MCP access and a status page. Paid from $3/mo for 1-minute checks, scaling to 1,000 monitors and 15-second checks.',
  },
  alternates: {
    canonical: 'https://exit1.dev/pricing',
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
