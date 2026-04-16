"use client";

import { useState } from "react";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PricingCards() {
  const [isAnnual, setIsAnnual] = useState(true);

  const nanoPrice = isAnnual ? 5 : 7;
  const scalePrice = isAnnual ? 24 : 32;

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
          {isAnnual && (
            <span className="ml-1 text-xs text-green-400">Save 25%</span>
          )}
        </button>
      </div>

      {/* 3-column pricing grid */}
      <div className="grid md:grid-cols-3 gap-8 text-left">
        {/* Free Plan */}
        <div className="p-8 rounded-2xl border border-white/10 bg-white/5 flex flex-col">
          <h3 className="text-2xl font-bold mb-2">Free</h3>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-4xl font-bold">$0</span>
          </div>
          <p className="text-white/60 mb-6">Always free</p>
          <ul className="space-y-2 mb-6 flex-grow">
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              10 monitors
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              5-minute check intervals
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              SSL certificate monitoring
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              Email alerts
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              1 webhook integration
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              1 public status page
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              Analytics & logs (30 days)
            </li>
          </ul>
          <Button
            asChild
            variant="outline"
            className="w-full rounded-full py-5 font-semibold border-white/20 hover:bg-white/5 mt-auto"
          >
            <a
              href="https://app.exit1.dev/sign-up"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Started
            </a>
          </Button>
        </div>

        {/* Nano Plan */}
        <div className="p-8 rounded-2xl border border-white/20 bg-white/10 flex flex-col relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full">
              Popular
            </span>
          </div>
          <h3 className="text-2xl font-bold mb-2">Nano</h3>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-4xl font-bold">${nanoPrice}</span>
            <span className="text-white/60">/month</span>
          </div>
          <p className="text-white/60 mb-2">
            {isAnnual ? "Billed annually" : "Billed monthly"}
          </p>
          <p className="text-sm text-green-400 mb-6">
            Less than a coffee per week.
          </p>
          <ul className="space-y-2 mb-6 flex-grow">
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              Everything in Free, plus:
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              Unlimited monitors
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              1-minute check intervals
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              SMS alerts
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              Team alerts
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              Unlimited webhooks & status pages
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              Custom status page branding
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              Domain intelligence & expiry alerts
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              MCP integration (AI assistants)
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              1 year data retention
            </li>
          </ul>
          <Button
            asChild
            className="w-full rounded-full py-5 font-semibold bg-white text-black hover:bg-white/90 mt-auto"
          >
            <a
              href="https://app.exit1.dev/billing"
              target="_blank"
              rel="noopener noreferrer"
            >
              Run Production Monitoring
            </a>
          </Button>
        </div>

        {/* Scale Plan */}
        <div className="p-8 rounded-2xl border border-blue-500/30 bg-blue-500/5 flex flex-col relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Performance
            </span>
          </div>
          <h3 className="text-2xl font-bold mb-2">Scale</h3>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-4xl font-bold">${scalePrice}</span>
            <span className="text-white/60">/month</span>
          </div>
          <p className="text-white/60 mb-2">
            {isAnnual ? "Billed annually" : "Billed monthly"}
          </p>
          <p className="text-sm text-blue-400 mb-6">
            Detect downtime before your users do.
          </p>
          <ul className="space-y-2 mb-6 flex-grow">
            <li className="flex items-center gap-2 text-white/80">
              <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
              Everything in Nano, plus:
            </li>
            <li className="flex items-center gap-2 text-white/80 font-semibold">
              <Zap className="w-4 h-4 text-blue-400 flex-shrink-0" />
              15-second check intervals
            </li>
            <li className="flex items-center gap-2 text-white/60 text-sm mt-2">
              <span className="w-4 flex-shrink-0" />
              4x faster than Nano. 20x faster than Free.
            </li>
            <li className="flex items-center gap-2 text-white/60 text-sm">
              <span className="w-4 flex-shrink-0" />
              Know about outages in seconds, not minutes.
            </li>
          </ul>
          <Button
            asChild
            className="w-full rounded-full py-5 font-semibold bg-blue-500 text-white hover:bg-blue-600 mt-auto"
          >
            <a
              href="https://app.exit1.dev/billing"
              target="_blank"
              rel="noopener noreferrer"
            >
              Go Sub-Minute
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
