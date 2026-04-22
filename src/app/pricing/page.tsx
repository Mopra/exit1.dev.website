"use client";

import { Fragment, useState, type ComponentType } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  CircleCheck,
  Clock,
  Crown,
  Gem,
  type LucideProps,
  Minus,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHero } from '@/components/PageHero';
import { PageContainer, PageSection, PageShell, SectionContent } from '@/components/PageLayout';

type TierKey = 'free' | 'nano' | 'pro' | 'agency';

type Highlight = { label: string; comingSoon?: boolean };

const tierHighlights: Record<TierKey, Highlight[]> = {
  free: [
    { label: "10 monitors" },
    { label: "5-minute check intervals" },
    { label: "1 webhook integration" },
    { label: "10 emails / month" },
    { label: "1 public status page" },
    { label: "60-day data retention" },
  ],
  nano: [
    { label: "50 monitors" },
    { label: "2-minute check intervals" },
    { label: "5 webhook integrations" },
    { label: "1,000 emails / month" },
    { label: "5 custom-branded status pages" },
    { label: "Domain intelligence & expiry alerts" },
    { label: "Maintenance mode" },
    { label: "60-day data retention" },
  ],
  pro: [
    { label: "500 monitors" },
    { label: "30-second check intervals" },
    { label: "25 webhook integrations" },
    { label: "10 API keys + MCP access" },
    { label: "SMS alerts (50 / month)" },
    { label: "10,000 emails / month" },
    { label: "25 custom-branded status pages" },
    { label: "CSV export" },
    { label: "365-day data retention" },
  ],
  agency: [
    { label: "1,000 monitors" },
    { label: "15-second check intervals" },
    { label: "50 webhook integrations" },
    { label: "25 API keys + MCP access" },
    { label: "SMS alerts (100 / month)" },
    { label: "50,000 emails / month" },
    { label: "50 custom-branded status pages" },
    { label: "All alert channels" },
    { label: "3-year data retention" },
    { label: "Team members & roles", comingSoon: true },
    { label: "Custom status page domain", comingSoon: true },
    { label: "SLA reporting", comingSoon: true },
  ],
};

type TierTheme = {
  icon: ComponentType<LucideProps>;
  iconClass: string;
  border: string;
  bg: string;
  shadow: string;
  buttonPrimary: string;
  buttonOutline: string;
  checkClass: string;
};

const tierTheme: Record<TierKey, TierTheme> = {
  free: {
    icon: Sparkles,
    iconClass: "text-white/70",
    border: "border-white/10",
    bg: "bg-white/[0.03]",
    shadow: "",
    buttonPrimary: "",
    buttonOutline: "border-white/20 text-white/90 hover:bg-white/5",
    checkClass: "text-white/60",
  },
  nano: {
    icon: Zap,
    iconClass: "text-violet-300",
    border: "border-violet-400/40",
    bg: "bg-violet-400/[0.04]",
    shadow: "shadow-lg shadow-violet-500/10",
    buttonPrimary: "bg-violet-400 text-black hover:bg-violet-300",
    buttonOutline: "border-violet-400/50 text-violet-300 hover:bg-violet-400/10 hover:text-violet-200",
    checkClass: "text-violet-300",
  },
  pro: {
    icon: Gem,
    iconClass: "text-amber-300",
    border: "border-amber-400/50",
    bg: "bg-amber-400/[0.05]",
    shadow: "shadow-lg shadow-amber-500/15",
    buttonPrimary: "bg-amber-400 text-black hover:bg-amber-300",
    buttonOutline: "border-amber-400/50 text-amber-300 hover:bg-amber-400/10 hover:text-amber-200",
    checkClass: "text-amber-300",
  },
  agency: {
    icon: Crown,
    iconClass: "text-emerald-300",
    border: "border-emerald-400/40",
    bg: "bg-emerald-400/[0.04]",
    shadow: "shadow-lg shadow-emerald-500/10",
    buttonPrimary: "bg-emerald-400 text-black hover:bg-emerald-300",
    buttonOutline: "border-emerald-400/50 text-emerald-300 hover:bg-emerald-400/10 hover:text-emerald-200",
    checkClass: "text-emerald-300",
  },
};

const tierTagline: Record<TierKey, string> = {
  free: "Hobby projects & experiments",
  nano: "Production monitoring for small teams",
  pro: "Serious uptime monitoring at scale",
  agency: "High-volume fleets & client work",
};

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

type PaidTierKey = Exclude<TierKey, 'free'>;

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  // Annual price shown is the effective monthly rate when billed annually.
  const monthlyPrice: Record<PaidTierKey, number> = {
    nano: isAnnual ? 7 : 9,
    pro: isAnnual ? 20 : 24,
    agency: isAnnual ? 37 : 49,
  };
  const annualTotal: Record<PaidTierKey, number> = {
    nano: monthlyPrice.nano * 12,
    pro: monthlyPrice.pro * 12,
    agency: monthlyPrice.agency * 12,
  };
  const billingText = (t: PaidTierKey) =>
    isAnnual ? `Billed $${annualTotal[t]}/year` : 'Billed monthly';

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
            {/* Billing toggle — pill style matching the app */}
            <div className="flex justify-center mb-10">
              <div
                role="tablist"
                aria-label="Billing period"
                className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] backdrop-blur p-1 text-sm"
              >
                <button
                  role="tab"
                  aria-selected={!isAnnual}
                  onClick={() => setIsAnnual(false)}
                  className={`px-4 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
                    !isAnnual ? 'bg-white text-black' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  role="tab"
                  aria-selected={isAnnual}
                  onClick={() => setIsAnnual(true)}
                  className={`px-4 py-1.5 rounded-full font-medium transition-colors cursor-pointer inline-flex items-center gap-2 ${
                    isAnnual ? 'bg-white text-black' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Annual
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full border ${
                      isAnnual
                        ? 'bg-emerald-400/15 border-emerald-400/30 text-emerald-600'
                        : 'border-white/15 text-white/50'
                    }`}
                  >
                    Save ~20%
                  </span>
                </button>
              </div>
            </div>

            {/* Pricing cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tierOrder.map((t) => (
                <PricingCard
                  key={t}
                  tier={t}
                  isAnnual={isAnnual}
                  priceLabel={t === 'free' ? '$0' : `$${monthlyPrice[t]}`}
                  priceSuffix="/mo"
                  billingText={t === 'free' ? 'Always free' : billingText(t)}
                  ctaLabel={t === 'free' ? 'Get Started' : `Get ${tierLabels[t]}`}
                  ctaHref={t === 'free' ? 'https://app.exit1.dev' : 'https://app.exit1.dev/billing'}
                  highlighted={t === 'pro'}
                />
              ))}
            </div>

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

type PricingCardProps = {
  tier: TierKey;
  isAnnual: boolean;
  priceLabel: string;
  priceSuffix: string;
  billingText: string;
  ctaLabel: string;
  ctaHref: string;
  highlighted: boolean;
};

function PricingCard({
  tier,
  priceLabel,
  priceSuffix,
  billingText,
  ctaLabel,
  ctaHref,
  highlighted,
}: PricingCardProps) {
  const theme = tierTheme[tier];
  const Icon = theme.icon;
  const isFree = tier === 'free';

  return (
    <div
      className={`relative p-6 rounded-2xl border ${theme.border} ${theme.bg} ${theme.shadow} flex flex-col`}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 bg-amber-400 text-black text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full">
            <Sparkles className="w-3 h-3" />
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Icon className={`w-5 h-5 ${theme.iconClass}`} />
          <h3 className="text-xl font-bold">{tierLabels[tier]}</h3>
        </div>
        <p className="text-white/60 text-sm mb-5">{tierTagline[tier]}</p>

        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold">{priceLabel}</span>
          {!isFree && <span className="text-white/60">{priceSuffix}</span>}
        </div>
        <p className="text-white/60 mt-2 text-sm">{billingText}</p>
      </div>

      <Button
        asChild
        className={`w-full rounded-full py-5 font-semibold mb-6 ${
          isFree
            ? `border ${theme.buttonOutline} bg-transparent`
            : theme.buttonPrimary
        }`}
      >
        <a href={ctaHref} target="_blank" rel="noopener noreferrer">
          {ctaLabel}
        </a>
      </Button>

      <ul className="space-y-2.5 flex-grow">
        {tierHighlights[tier].map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <CircleCheck className={`w-4 h-4 ${theme.checkClass} mt-0.5 flex-shrink-0`} />
            <div className="flex flex-col gap-1">
              <span className="text-white/85">{f.label}</span>
              {f.comingSoon && (
                <span className="inline-flex items-center gap-1 self-start text-[10px] font-medium uppercase tracking-wide text-white/50 border border-white/15 bg-white/5 rounded px-1.5 py-0.5">
                  <Clock className="w-3 h-3" />
                  Coming soon
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PricingPage;
