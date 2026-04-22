"use client";

import { useState } from "react";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PricingCards() {
  const [isAnnual, setIsAnnual] = useState(true);

  // Effective monthly rate when billed annually.
  const price = {
    nano: isAnnual ? 7 : 9,
    pro: isAnnual ? 20 : 24,
    agency: isAnnual ? 37 : 49,
  };

  return (
    <div>
      {/* Shared billing toggle */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <button
          onClick={() => setIsAnnual(false)}
          className={`text-sm font-medium transition-colors cursor-pointer ${
            !isAnnual ? "text-white" : "text-white/50 hover:text-white/70"
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
              isAnnual ? "left-7" : "left-1"
            }`}
          />
        </button>
        <button
          onClick={() => setIsAnnual(true)}
          className={`text-sm font-medium transition-colors cursor-pointer ${
            isAnnual ? "text-white" : "text-white/50 hover:text-white/70"
          }`}
        >
          Annually
          {isAnnual && <span className="ml-1 text-xs text-green-400">Save 25%</span>}
        </button>
      </div>

      {/* 4-column pricing grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
        {/* Free */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5 flex flex-col">
          <h3 className="text-xl font-bold mb-2">Free</h3>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-4xl font-bold">$0</span>
          </div>
          <p className="text-white/60 mb-6 text-sm">Always free</p>
          <ul className="space-y-2 mb-6 flex-grow text-sm">
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              10 monitors
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              5-min check intervals
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              Email alerts
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              1 webhook, 1 status page
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              SSL monitoring
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              60 days of history
            </li>
          </ul>
          <Button
            asChild
            variant="outline"
            className="w-full rounded-full py-5 font-semibold border-white/20 hover:bg-white/5 mt-auto"
          >
            <a href="https://app.exit1.dev/sign-up" target="_blank" rel="noopener noreferrer">
              Get Started
            </a>
          </Button>
        </div>

        {/* Nano */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5 flex flex-col">
          <h3 className="text-xl font-bold mb-2">Nano</h3>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-4xl font-bold">${price.nano}</span>
            <span className="text-white/60">/mo</span>
          </div>
          <p className="text-white/60 mb-6 text-sm">
            {isAnnual ? "Billed annually" : "Billed monthly"}
          </p>
          <ul className="space-y-2 mb-6 flex-grow text-sm">
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              50 monitors
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              2-min check intervals
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              5 webhooks, 5 status pages
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              Status page builder
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              Domain Intelligence
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              Maintenance mode
            </li>
          </ul>
          <Button
            asChild
            variant="outline"
            className="w-full rounded-full py-5 font-semibold border-white/20 hover:bg-white/5 mt-auto"
          >
            <a href="https://app.exit1.dev/billing" target="_blank" rel="noopener noreferrer">
              Choose Nano
            </a>
          </Button>
        </div>

        {/* Pro — highlighted */}
        <div className="p-6 rounded-2xl border border-white/20 bg-white/10 flex flex-col relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full">
              Popular
            </span>
          </div>
          <h3 className="text-xl font-bold mb-2">Pro</h3>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-4xl font-bold">${price.pro}</span>
            <span className="text-white/60">/mo</span>
          </div>
          <p className="text-white/60 mb-2 text-sm">
            {isAnnual ? "Billed annually" : "Billed monthly"}
          </p>
          <p className="text-sm text-green-400 mb-6">
            SMS, API, 30-sec checks.
          </p>
          <ul className="space-y-2 mb-6 flex-grow text-sm">
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              500 monitors
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              30-sec check intervals
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              SMS alerts (50/mo)
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              Slack / Discord / Teams
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              API + MCP (10 keys)
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              365 days of history
            </li>
          </ul>
          <Button
            asChild
            className="w-full rounded-full py-5 font-semibold bg-white text-black hover:bg-white/90 mt-auto"
          >
            <a href="https://app.exit1.dev/billing" target="_blank" rel="noopener noreferrer">
              Choose Pro
            </a>
          </Button>
        </div>

        {/* Agency */}
        <div className="p-6 rounded-2xl border border-blue-500/30 bg-blue-500/5 flex flex-col relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Agency
            </span>
          </div>
          <h3 className="text-xl font-bold mb-2">Agency</h3>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-4xl font-bold">${price.agency}</span>
            <span className="text-white/60">/mo</span>
          </div>
          <p className="text-white/60 mb-2 text-sm">
            {isAnnual ? "Billed annually" : "Billed monthly"}
          </p>
          <p className="text-sm text-blue-400 mb-6">
            Monitor at scale. 15-sec checks.
          </p>
          <ul className="space-y-2 mb-6 flex-grow text-sm">
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
              1,000 monitors
            </li>
            <li className="flex items-center gap-2 text-white/80 font-semibold">
              <Zap className="w-4 h-4 text-blue-400 flex-shrink-0" />
              15-sec check intervals
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
              SMS alerts (100/mo)
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
              50 webhooks, 50 status pages
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
              API + MCP (25 keys)
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
              3 years of history
            </li>
          </ul>
          <Button
            asChild
            className="w-full rounded-full py-5 font-semibold bg-blue-500 text-white hover:bg-blue-600 mt-auto"
          >
            <a href="https://app.exit1.dev/billing" target="_blank" rel="noopener noreferrer">
              Choose Agency
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
