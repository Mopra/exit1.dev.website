"use client";

import { Fragment } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHero } from '@/components/PageHero';
import { PageContainer, PageSection, PageShell, SectionContent } from '@/components/PageLayout';
import { PricingCards, type TierKey } from '@/components/PricingCards';

type Value = string | boolean;
type FeatureRow = { label: string; values: Record<TierKey, Value>; comingSoon?: boolean };
type FeatureGroup = { title: string; rows: FeatureRow[] };

const featureGroups: FeatureGroup[] = [
  {
    title: "Monitoring",
    rows: [
      { label: "Monitors", values: { free: "10", nano: "50", pro: "500", agency: "1,000" } },
      { label: "Minimum check interval", values: { free: "5 min", nano: "2 min", pro: "30 sec", agency: "15 sec" } },
      { label: "Multi-region checks", values: { free: false, nano: true, pro: true, agency: true } },
      { label: "HTTP/HTTPS, TCP, UDP, WebSocket, ICMP", values: { free: true, nano: true, pro: true, agency: true } },
      { label: "SSL certificate monitoring", values: { free: true, nano: true, pro: true, agency: true } },
      { label: "Response validation (JSON, headers, body)", values: { free: true, nano: true, pro: true, agency: true } },
      { label: "Bulk import + bulk edit", values: { free: true, nano: true, pro: true, agency: true } },
      { label: "Maintenance mode", values: { free: false, nano: true, pro: true, agency: true } },
    ],
  },
  {
    title: "Alerting",
    rows: [
      { label: "Email alerts", values: { free: "10/hr, 10/mo", nano: "50/hr, 1,000/mo", pro: "500/hr, 10,000/mo", agency: "1,000/hr, 50,000/mo" } },
      { label: "SMS alerts", values: { free: false, nano: false, pro: "25/hr, 50/mo", agency: "50/hr, 100/mo" } },
      { label: "Webhook integrations", values: { free: "1", nano: "5", pro: "25", agency: "50" } },
      { label: "Slack / Discord / Microsoft Teams", values: { free: false, nano: false, pro: true, agency: true } },
      { label: "Flap detection + smart verification", values: { free: true, nano: true, pro: true, agency: true } },
    ],
  },
  {
    title: "Status pages",
    rows: [
      { label: "Public status pages", values: { free: "1", nano: "5", pro: "25", agency: "50" } },
      { label: "Drag-and-drop builder", values: { free: false, nano: true, pro: true, agency: true } },
      { label: "Custom branding (logo, colors, favicon)", values: { free: false, nano: true, pro: true, agency: true } },
      { label: "Remove exit1.dev badge branding", values: { free: false, nano: true, pro: true, agency: true } },
      { label: "Custom domain", values: { free: false, nano: false, pro: false, agency: true }, comingSoon: true },
    ],
  },
  {
    title: "Domains & intelligence",
    rows: [
      { label: "Domain Intelligence (WHOIS, DNS)", values: { free: false, nano: true, pro: true, agency: true } },
      { label: "Domain expiry alerts", values: { free: false, nano: true, pro: true, agency: true } },
    ],
  },
  {
    title: "API & integrations",
    rows: [
      { label: "REST API access", values: { free: false, nano: false, pro: true, agency: true } },
      { label: "API keys", values: { free: "—", nano: "—", pro: "10", agency: "25" } },
      { label: "MCP (Claude, Cursor, Windsurf)", values: { free: false, nano: false, pro: true, agency: true } },
      { label: "CSV bulk export", values: { free: false, nano: false, pro: true, agency: true } },
    ],
  },
  {
    title: "Data & reporting",
    rows: [
      { label: "Log retention", values: { free: "60 days", nano: "60 days", pro: "365 days", agency: "1,095 days (3 yr)" } },
      { label: "Analytics dashboards", values: { free: true, nano: true, pro: true, agency: true } },
      { label: "SLA reporting", values: { free: false, nano: false, pro: false, agency: true }, comingSoon: true },
    ],
  },
  {
    title: "Team",
    rows: [
      { label: "Team seats", values: { free: "—", nano: "—", pro: "—", agency: "10" }, comingSoon: true },
    ],
  },
];

const tierOrder: TierKey[] = ['free', 'nano', 'pro', 'agency'];
const tierLabels: Record<TierKey, string> = { free: 'Free', nano: 'Nano', pro: 'Pro', agency: 'Agency' };

const PricingPage = () => {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Pricing - exit1.dev",
            "description": "Simple, transparent pricing for uptime monitoring.",
            "offers": [
              { "@type": "Offer", "name": "Free", "price": "0", "priceCurrency": "USD", "description": "10 monitors, 5-minute checks" },
              { "@type": "Offer", "name": "Nano (Annual)", "price": "7", "priceCurrency": "USD", "billingIncrement": "P1M", "description": "50 monitors, 2-minute checks — billed annually ($84/yr)" },
              { "@type": "Offer", "name": "Nano (Monthly)", "price": "9", "priceCurrency": "USD", "billingIncrement": "P1M", "description": "50 monitors, 2-minute checks — billed monthly" },
              { "@type": "Offer", "name": "Pro (Annual)", "price": "20", "priceCurrency": "USD", "billingIncrement": "P1M", "description": "500 monitors, 30-second checks, SMS, API + MCP — billed annually ($240/yr)" },
              { "@type": "Offer", "name": "Pro (Monthly)", "price": "24", "priceCurrency": "USD", "billingIncrement": "P1M", "description": "500 monitors, 30-second checks, SMS, API + MCP — billed monthly" },
              { "@type": "Offer", "name": "Agency (Annual)", "price": "37", "priceCurrency": "USD", "billingIncrement": "P1M", "description": "1,000 monitors, 15-second checks, 3-year retention — billed annually ($444/yr)" },
              { "@type": "Offer", "name": "Agency (Monthly)", "price": "49", "priceCurrency": "USD", "billingIncrement": "P1M", "description": "1,000 monitors, 15-second checks, 3-year retention — billed monthly" },
            ],
          }),
        }}
      />

      <PageContainer>
        <PageHero size="lg">
          <div className="mb-6 sm:mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-white/70 hover:text-white transition-colors duration-200 mb-4 sm:mb-6 text-sm sm:text-base cursor-pointer interactive"
            >
              <ArrowLeft className="mr-2 w-3 h-3 sm:w-4 sm:h-4" />
              Back to Home
            </Link>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
            Simple pricing.
            <br />
            No surprises.
          </h1>

          <p className="text-xl sm:text-2xl text-white/70 leading-relaxed max-w-2xl">
            Start free. Scale up when you need faster checks, SMS, API access, or more monitors.
          </p>
        </PageHero>

        <PageSection className="py-16">
          <SectionContent size="lg">
            <PricingCards />

            {/* Feature comparison table */}
            <div className="mt-20">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold mb-3">Compare every feature</h2>
                <p className="text-white/60">
                  Every limit and capability across all four plans.
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-black/60 backdrop-blur-sm">
                    <tr className="border-b border-white/10">
                      <th className="text-left font-semibold px-4 py-4 min-w-[240px]">Feature</th>
                      {tierOrder.map((t) => (
                        <th key={t} className="text-left font-semibold px-4 py-4 min-w-[120px]">
                          {tierLabels[t]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {featureGroups.map((group) => (
                      <Fragment key={group.title}>
                        <tr className="bg-white/[0.03]">
                          <td
                            colSpan={5}
                            className="px-4 py-3 text-xs uppercase tracking-wider font-semibold text-white/50"
                          >
                            {group.title}
                          </td>
                        </tr>
                        {group.rows.map((row) => (
                          <tr key={`${group.title}-${row.label}`} className="border-b border-white/5">
                            <td className="px-4 py-3 text-white/80 align-top">
                              {row.label}
                              {row.comingSoon && (
                                <span className="ml-2 text-[10px] uppercase tracking-wider text-blue-400/80 bg-blue-500/10 border border-blue-500/20 rounded px-1.5 py-0.5 align-middle">
                                  Coming soon
                                </span>
                              )}
                            </td>
                            {tierOrder.map((t) => (
                              <td key={t} className="px-4 py-3 align-top">
                                <ValueCell value={row.values[t]} />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* FAQ/Additional info */}
            <div className="mt-20 text-center">
              <h2 className="text-2xl font-bold mb-4">Questions?</h2>
              <p className="text-white/70 mb-6 max-w-xl mx-auto">
                The Free plan is genuinely free — no credit card, no trial period.
                Save 25% on any paid plan with annual billing. Cancel or change plans anytime.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full px-6 py-3 border-white/20 hover:bg-white/5"
                >
                  <Link href="/compare">
                    Compare to alternatives
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full px-6 py-3 border-white/20 hover:bg-white/5"
                >
                  <a href="https://docs.exit1.dev/billing/faq" target="_blank" rel="noopener noreferrer">
                    Read the Docs
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full px-6 py-3 border-white/20 hover:bg-white/5"
                >
                  <a href="https://discord.com/invite/uZvWbpwJZS" target="_blank" rel="noopener noreferrer">
                    Ask in Discord
                  </a>
                </Button>
              </div>
            </div>
          </SectionContent>
        </PageSection>
      </PageContainer>
    </PageShell>
  );
};

function ValueCell({ value }: { value: Value }) {
  if (value === true) return <Check className="w-4 h-4 text-green-400" />;
  if (value === false) return <Minus className="w-4 h-4 text-white/20" />;
  return <span className="text-white/80">{value}</span>;
}

export default PricingPage;
