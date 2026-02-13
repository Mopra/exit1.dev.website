"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PricingToggle() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="p-8 rounded-2xl border border-white/20 bg-white/10 text-left flex flex-col">
      <h3 className="text-2xl font-bold mb-2">Nano</h3>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-4xl font-bold">${isAnnual ? 3 : 4}</span>
        <span className="text-white/60">/month</span>
      </div>
      <p className="text-white/60 mb-2">{isAnnual ? "Billed annually" : "Billed monthly"}</p>
      <p className="text-sm text-green-400 mb-3">Less than a coffee per week. SMS alerts alone cost $20+/mo elsewhere.</p>

      {/* Billing toggle */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setIsAnnual(false)}
          className={`text-sm font-medium transition-colors ${
            !isAnnual ? 'text-white' : 'text-white/50 hover:text-white/70'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setIsAnnual(!isAnnual)}
          className="relative w-12 h-6 rounded-full bg-white/20 transition-colors cursor-pointer"
          aria-label="Toggle billing period"
        >
          <span
            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
              isAnnual ? 'left-7' : 'left-1'
            }`}
          />
        </button>
        <button
          onClick={() => setIsAnnual(true)}
          className={`text-sm font-medium transition-colors ${
            isAnnual ? 'text-white' : 'text-white/50 hover:text-white/70'
          }`}
        >
          Annually
          {isAnnual && (
            <span className="ml-1 text-xs text-green-400">Save 25%</span>
          )}
        </button>
      </div>

      <ul className="space-y-2 mb-6 flex-grow">
        <li className="flex items-center gap-2 text-white/80">
          <Check className="w-4 h-4 text-green-400" />
          Everything in Free, plus:
        </li>
        <li className="flex items-center gap-2 text-white/80">
          <Check className="w-4 h-4 text-green-400" />
          Unlimited monitors
        </li>
        <li className="flex items-center gap-2 text-white/80">
          <Check className="w-4 h-4 text-green-400" />
          1-minute check intervals
        </li>
        <li className="flex items-center gap-2 text-white/80">
          <Check className="w-4 h-4 text-green-400" />
          Multi-region checks
        </li>
        <li className="flex items-center gap-2 text-white/80">
          <Check className="w-4 h-4 text-green-400" />
          SMS alerts — know in seconds, not hours
        </li>
        <li className="flex items-center gap-2 text-white/80">
          <Check className="w-4 h-4 text-green-400" />
          Team alerts — add your team to SMS & email
        </li>
        <li className="flex items-center gap-2 text-white/80">
          <Check className="w-4 h-4 text-green-400" />
          Higher alert budgets (1000 emails & 20 SMS/month)
        </li>
        <li className="flex items-center gap-2 text-white/80">
          <Check className="w-4 h-4 text-green-400" />
          Unlimited webhook integrations
        </li>
        <li className="flex items-center gap-2 text-white/80">
          <Check className="w-4 h-4 text-green-400" />
          Unlimited status pages
        </li>
        <li className="flex items-center gap-2 text-white/80">
          <Check className="w-4 h-4 text-green-400" />
          Custom drag & drop status page builder
        </li>
        <li className="flex items-center gap-2 text-white/80">
          <Check className="w-4 h-4 text-green-400" />
          Domain intelligence
        </li>
        <li className="flex items-center gap-2 text-white/80">
          <Check className="w-4 h-4 text-green-400" />
          Domain expiry alerts
        </li>
        <li className="flex items-center gap-2 text-white/80">
          <Check className="w-4 h-4 text-green-400" />
          Maintenance mode — suppress alerts during planned work
        </li>
        <li className="flex items-center gap-2 text-white/80">
          <Check className="w-4 h-4 text-green-400" />
          1 year data retention (vs 30 days)
        </li>
        <li className="flex items-center gap-2 text-white/80">
          <Check className="w-4 h-4 text-green-400" />
          API access
        </li>
        <li className="flex items-center gap-2 text-white/80">
          <Check className="w-4 h-4 text-green-400" />
          Bulk import — migrate from any service in minutes
        </li>
        <li className="flex items-center gap-2 text-white/80">
          <Check className="w-4 h-4 text-green-400" />
          Bulk edit — configure hundreds of checks at once
        </li>
        <li className="flex items-center gap-2 text-white/80">
          <Check className="w-4 h-4 text-green-400" />
          Priority support
        </li>
      </ul>
      <Button
        asChild
        className="w-full rounded-full py-5 font-semibold bg-white text-black hover:bg-white/90 mt-auto"
      >
        <a href="https://app.exit1.dev/billing" target="_blank" rel="noopener noreferrer">
          Run Production Monitoring
        </a>
      </Button>
    </div>
  );
}
