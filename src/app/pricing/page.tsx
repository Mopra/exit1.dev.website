"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Zap, Users, Phone, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHero } from '@/components/PageHero';
import { PageContainer, PageSection, PageShell, SectionContent } from '@/components/PageLayout';

const freeFeatures = [
  "50 monitors",
  "5-minute check intervals",
  "SSL certificate monitoring",
  "Email alerts (10/hour, 10/month)",
  "1 webhook integration",
  "1 public status page",
  "Analytics & logs (30 days)",
  "Bulk import — migrate from any service in minutes",
  "Bulk edit — configure hundreds of checks at once",
];

const nanoFeatures = [
  "Everything in Free, plus:",
  "Unlimited monitors",
  "1-minute check intervals",
  "Multi-region checks",
  "SMS alerts — know in seconds, not hours",
  "Team alerts — add your team to SMS & email",
  "Higher alert budgets (1000 emails & 20 SMS/month)",
  "Unlimited webhook integrations",
  "Unlimited status pages",
  "Custom drag & drop status page builder",
  "Domain intelligence",
  "Domain expiry alerts",
  "1 year data retention (vs 30 days)",
  "API access",
  "Bulk import — migrate from any service in minutes",
  "Bulk edit — configure hundreds of checks at once",
  "Priority support",
];

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const nanoPrice = isAnnual ? 3 : 4;
  const billingText = isAnnual ? "Billed annually" : "Billed monthly";

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
              {
                "@type": "Offer",
                "name": "Free",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Unlimited monitors with 5-minute checks"
              },
              {
                "@type": "Offer",
                "name": "Nano (Annual)",
                "price": "3",
                "priceCurrency": "USD",
                "billingIncrement": "P1M",
                "description": "Advanced features for power users - billed annually"
              },
              {
                "@type": "Offer",
                "name": "Nano (Monthly)",
                "price": "4",
                "priceCurrency": "USD",
                "billingIncrement": "P1M",
                "description": "Advanced features for power users - billed monthly"
              }
            ]
          })
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
            Start free with everything you need. Upgrade when you want more.
          </p>
        </PageHero>

        <PageSection className="py-16">
          <SectionContent size="lg">
            {/* USP banner */}
            <div className="mb-12 py-4 px-6 rounded-full border border-white/10 bg-white/5 text-center">
              <p className="text-white/90 text-lg font-medium">
                The only monitoring SaaS with truly unlimited monitors.
              </p>
            </div>

            {/* Nano recommendation banner */}
            <div className="mb-12 p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Recommended: Nano Plan</h2>
                  <p className="text-white/70 mb-4">Unlock advanced features with the Nano plan:</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Unlimited Monitors</div>
                        <div className="text-sm text-white/60">No cap on monitors. Add every site, API, and service you manage.</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium">1-Minute Check Intervals</div>
                        <div className="text-sm text-white/60">Detect issues 5x faster than the free tier. Know in 60 seconds, not 5 minutes.</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Multi-Region Checks</div>
                        <div className="text-sm text-white/60">Monitor from multiple locations worldwide. Avoid false positives from regional outages.</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Instant SMS Alerts</div>
                        <div className="text-sm text-white/60">Your site goes down at 3am. Your phone buzzes. You fix it before customers notice.</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Team Alerts</div>
                        <div className="text-sm text-white/60">Add team members or others to SMS and email alerts. Everyone who needs to know, gets notified.</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Higher Alert Budgets</div>
                        <div className="text-sm text-white/60">1000 emails and 20 SMS per month. Because outages don&apos;t wait for billing cycles.</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Unlimited Webhooks</div>
                        <div className="text-sm text-white/60">Connect as many integrations as you need. Slack, Discord, PagerDuty, and more.</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Your Brand, Your Look</div>
                        <div className="text-sm text-white/60">Professional status pages with your logo, favicon, and brand colors.</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Domain Intelligence</div>
                        <div className="text-sm text-white/60">WHOIS lookups, DNS records, and full domain analysis at your fingertips.</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Domain Expiry Alerts</div>
                        <div className="text-sm text-white/60">Get notified before your domains expire. Never let a domain lapse again.</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium">1 Year Data Retention</div>
                        <div className="text-sm text-white/60">365 days of logs and analytics vs 30 days on Free. See the full picture.</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Priority Support</div>
                        <div className="text-sm text-white/60">Get help fast when you need it most.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Free Plan */}
              <div className="p-8 rounded-2xl border border-white/10 bg-white/5 flex flex-col">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">Free</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">$0</span>
                  </div>
                  <p className="text-white/60 mt-2">Always free</p>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {freeFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-full py-6 text-lg font-semibold border-white/20 hover:bg-white/5 mt-auto"
                >
                  <a href="https://app.exit1.dev" target="_blank" rel="noopener noreferrer">
                    Get Started
                  </a>
                </Button>
              </div>

              {/* Nano Plan */}
              <div className="p-8 rounded-2xl border border-white/20 bg-white/10 flex flex-col">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">Nano</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">${nanoPrice}</span>
                    <span className="text-white/60">/month</span>
                  </div>
                  <p className="text-white/60 mt-2">{billingText}</p>
                  <p className="text-sm text-green-400 mt-2">Less than a coffee per week. SMS alerts alone cost $20+/mo elsewhere.</p>

                  {/* Billing toggle */}
                  <div className="flex items-center gap-3 mt-4">
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
                        <span className="ml-2 text-xs text-green-400">Save 25%</span>
                      )}
                    </button>
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {nanoFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className="w-full rounded-full py-6 text-lg font-semibold bg-white text-black hover:bg-white/90 mt-auto"
                >
                  <a href="https://app.exit1.dev/billing" target="_blank" rel="noopener noreferrer">
                    Run Production Monitoring
                  </a>
                </Button>
              </div>
            </div>

            {/* Who uses Nano section */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8 text-center">Who uses Nano?</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Freelancers & Agencies</h3>
                  <p className="text-sm text-white/60">
                    Monitoring client sites? Custom branding makes your status pages look professional. No &quot;powered by&quot; footers.
                  </p>
                </div>
                <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">On-Call Engineers</h3>
                  <p className="text-sm text-white/60">
                    You&apos;re not checking email at 3am. SMS alerts wake you up when it matters.
                  </p>
                </div>
                <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                    <Rocket className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">SaaS Founders</h3>
                  <p className="text-sm text-white/60">
                    Your customers expect professional status pages. Your brand, your colors, your reputation.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ/Additional info */}
            <div className="mt-16 text-center">
              <h2 className="text-2xl font-bold mb-4">Questions?</h2>
              <p className="text-white/70 mb-6 max-w-xl mx-auto">
                The free tier is genuinely free. No credit card required. No trial period. 
                Monitor unlimited sites with 5-minute checks forever.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full px-6 py-3 border-white/20 hover:bg-white/5"
                >
                  <Link href="/why-nano">
                    Why Nano?
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full px-6 py-3 border-white/20 hover:bg-white/5"
                >
                  <Link href="/compare">
                    Compare Plans
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

export default PricingPage;
