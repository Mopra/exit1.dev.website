"use client";

import { useState, type ComponentType } from "react";
import {
  CircleCheck,
  Clock,
  Crown,
  Gem,
  type LucideProps,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type TierKey = "free" | "nano" | "pro" | "agency";
type PaidTierKey = Exclude<TierKey, "free">;

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
    iconClass: "text-tier-free",
    border: "border-tier-free/20",
    bg: "bg-tier-free/[0.03]",
    shadow: "",
    buttonPrimary: "",
    buttonOutline: "border-tier-free/30 text-foreground/90 hover:bg-foreground/5",
    checkClass: "text-tier-free",
  },
  nano: {
    icon: Zap,
    iconClass: "text-tier-nano",
    border: "border-tier-nano/40",
    bg: "bg-tier-nano/[0.04]",
    shadow: "shadow-lg shadow-tier-nano/10",
    buttonPrimary: "bg-tier-nano text-tier-nano-foreground hover:bg-tier-nano/90",
    buttonOutline: "border-tier-nano/50 text-tier-nano hover:bg-tier-nano/10 hover:text-tier-nano",
    checkClass: "text-tier-nano",
  },
  pro: {
    icon: Gem,
    iconClass: "text-tier-pro",
    border: "border-tier-pro/50",
    bg: "bg-tier-pro/[0.05]",
    shadow: "shadow-lg shadow-tier-pro/15",
    buttonPrimary: "bg-tier-pro text-tier-pro-foreground hover:bg-tier-pro/90",
    buttonOutline: "border-tier-pro/50 text-tier-pro hover:bg-tier-pro/10 hover:text-tier-pro",
    checkClass: "text-tier-pro",
  },
  agency: {
    icon: Crown,
    iconClass: "text-tier-agency",
    border: "border-tier-agency/40",
    bg: "bg-tier-agency/[0.04]",
    shadow: "shadow-lg shadow-tier-agency/10",
    buttonPrimary: "bg-tier-agency text-tier-agency-foreground hover:bg-tier-agency/90",
    buttonOutline: "border-tier-agency/50 text-tier-agency hover:bg-tier-agency/10 hover:text-tier-agency",
    checkClass: "text-tier-agency",
  },
};

const tierTagline: Record<TierKey, string> = {
  free: "Hobby projects & experiments",
  nano: "Production monitoring for small teams",
  pro: "Serious uptime monitoring at scale",
  agency: "High-volume fleets & client work",
};

const tierLabels: Record<TierKey, string> = {
  free: "Free",
  nano: "Nano",
  pro: "Pro",
  agency: "Agency",
};

const tierOrder: TierKey[] = ["free", "nano", "pro", "agency"];

export function PricingCards() {
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
    isAnnual ? `Billed $${annualTotal[t]}/year` : "Billed monthly";

  return (
    <div>
      {/* Billing toggle — pill style matching the app */}
      <div className="flex justify-center mb-10">
        <div
          role="tablist"
          aria-label="Billing period"
          className="inline-flex items-center rounded-full border border-border bg-foreground/[0.04] backdrop-blur p-1 text-sm"
        >
          <button
            role="tab"
            aria-selected={!isAnnual}
            onClick={() => setIsAnnual(false)}
            className={`px-4 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
              !isAnnual ? "bg-foreground text-background" : "text-foreground/60 hover:text-foreground"
            }`}
          >
            Monthly
          </button>
          <button
            role="tab"
            aria-selected={isAnnual}
            onClick={() => setIsAnnual(true)}
            className={`px-4 py-1.5 rounded-full font-medium transition-colors cursor-pointer inline-flex items-center gap-2 ${
              isAnnual ? "bg-foreground text-background" : "text-foreground/60 hover:text-foreground"
            }`}
          >
            Annual
            <span
              className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full border ${
                isAnnual
                  ? "bg-success/15 border-success/30 text-success"
                  : "border-border text-foreground/50"
              }`}
            >
              Save ~20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
        {tierOrder.map((t) => (
          <PricingCard
            key={t}
            tier={t}
            priceLabel={t === "free" ? "$0" : `$${monthlyPrice[t]}`}
            priceSuffix="/mo"
            billingText={t === "free" ? "Always free" : billingText(t)}
            ctaLabel={t === "free" ? "Get Started" : `Get ${tierLabels[t]}`}
            ctaHref={t === "free" ? "https://app.exit1.dev" : "https://app.exit1.dev/billing"}
            highlighted={t === "pro"}
          />
        ))}
      </div>
    </div>
  );
}

type PricingCardProps = {
  tier: TierKey;
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
  const isFree = tier === "free";

  return (
    <div
      className={`relative p-6 rounded-2xl border ${theme.border} ${theme.bg} ${theme.shadow} flex flex-col`}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 bg-tier-pro text-tier-pro-foreground text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full">
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
        <p className="text-foreground/60 text-sm mb-5">{tierTagline[tier]}</p>

        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold">{priceLabel}</span>
          {!isFree && <span className="text-foreground/60">{priceSuffix}</span>}
        </div>
        <p className="text-foreground/60 mt-2 text-sm">{billingText}</p>
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
              <span className="text-foreground/85">{f.label}</span>
              {f.comingSoon && (
                <span className="inline-flex items-center gap-1 self-start text-[10px] font-medium uppercase tracking-wide text-foreground/50 border border-border bg-foreground/5 rounded px-1.5 py-0.5">
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
