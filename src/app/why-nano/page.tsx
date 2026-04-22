import Link from 'next/link';
import { ArrowLeft, ArrowRight, Timer, Palette, Globe, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHero } from '@/components/PageHero';
import { PageContainer, PageSection, PageShell, SectionContent } from '@/components/PageLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Why Nano? | exit1.dev',
  description: 'Nano unlocks 2-minute checks, 50 monitors, a custom status page builder, and Domain Intelligence for $9/mo. The step up from Free you actually notice.',
  openGraph: {
    title: 'Why Nano? | exit1.dev',
    description: 'Nano unlocks 2-minute checks, 50 monitors, a custom status page builder, and Domain Intelligence for $9/mo.',
  },
};

export default function WhyNanoPage() {
  return (
    <PageShell>
      <PageContainer>
        <PageHero size="lg">
          <div className="mb-6 sm:mb-8">
            <Link
              href="/pricing"
              className="inline-flex items-center text-white/70 hover:text-white transition-colors duration-200 mb-4 sm:mb-6 text-sm sm:text-base cursor-pointer interactive"
            >
              <ArrowLeft className="mr-2 w-3 h-3 sm:w-4 sm:h-4" />
              Back to Pricing
            </Link>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
            Why Nano?
          </h1>

          <p className="text-xl sm:text-2xl text-white/70 leading-relaxed max-w-2xl">
            Free is great to try things out. Nano is the step up you actually notice — faster checks, more monitors, and a status page you can be proud to share.
          </p>
        </PageHero>

        {/* Faster detection */}
        <PageSection className="py-16">
          <SectionContent size="md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                <Timer className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold">Find out sooner</h2>
            </div>

            <p className="text-lg text-white/70 mb-8">
              Free runs checks every 5 minutes. Nano runs them every 2 minutes — you see outages sooner, and you get 50 monitors instead of 10.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-red-500/20 bg-red-500/5">
                <h3 className="font-semibold text-red-400 mb-4">On Free</h3>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">-</span>
                    5-minute check intervals
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">-</span>
                    Cap at 10 monitors
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">-</span>
                    1 webhook, 1 status page
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">-</span>
                    Email quota: 10/hr, 10/mo
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl border border-green-500/20 bg-green-500/5">
                <h3 className="font-semibold text-green-400 mb-4">On Nano</h3>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">+</span>
                    2-minute check intervals
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">+</span>
                    50 monitors
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">+</span>
                    5 webhooks, 5 status pages
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">+</span>
                    Email quota: 50/hr, 1,000/mo
                  </li>
                </ul>
              </div>
            </div>
          </SectionContent>
        </PageSection>

        {/* Status page branding */}
        <PageSection className="py-16 border-t border-white/10">
          <SectionContent size="md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold">Status pages you can share</h2>
            </div>

            <p className="text-lg text-white/70 mb-8">
              Your client asks: &quot;Where can I see our uptime status?&quot;
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-red-500/20 bg-red-500/5">
                <h3 className="font-semibold text-red-400 mb-4">On Free</h3>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">-</span>
                    One generic status page
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">-</span>
                    No logo, no brand colors, no customization
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">-</span>
                    exit1.dev branding shown on badges
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl border border-green-500/20 bg-green-500/5">
                <h3 className="font-semibold text-green-400 mb-4">On Nano</h3>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">+</span>
                    Up to 5 status pages
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">+</span>
                    Drag-and-drop builder — your logo, your colors, your favicon
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">+</span>
                    Remove exit1.dev branding from badges
                  </li>
                </ul>
              </div>
            </div>
          </SectionContent>
        </PageSection>

        {/* Domain Intelligence */}
        <PageSection className="py-16 border-t border-white/10">
          <SectionContent size="md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold">Domain Intelligence</h2>
            </div>

            <p className="text-lg text-white/70 mb-8">
              Nano adds domain tracking on top of uptime monitoring — so an expired domain never takes you by surprise.
            </p>

            <div className="p-6 rounded-xl border border-white/10 bg-white/5">
              <ul className="space-y-3 text-white/70">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">+</span>
                  WHOIS lookups and DNS records at a glance
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">+</span>
                  Domain expiry alerts before renewal windows close
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">+</span>
                  Maintenance mode to mute alerts during planned deployments
                </li>
              </ul>
            </div>
          </SectionContent>
        </PageSection>

        {/* The Math */}
        <PageSection className="py-16 border-t border-white/10">
          <SectionContent size="md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold">The Math</h2>
            </div>

            <p className="text-lg text-white/70 mb-8">
              Nano is <strong className="text-white">$9/month</strong> billed monthly or <strong className="text-white">$84/year</strong> ($7/mo) billed annually.
            </p>

            <div className="p-6 rounded-xl border border-white/10 bg-white/5 mb-8">
              <h3 className="font-semibold mb-4">Need SMS, Slack, API access, or faster checks?</h3>
              <p className="text-white/70 mb-4">
                Those live on <strong className="text-white">Pro ($24/mo)</strong> — 500 monitors, 30-second checks, SMS alerts, Slack/Discord/Teams, API + MCP access, and a full year of history. Or go all-in with <strong className="text-white">Agency ($49/mo)</strong>: 1,000 monitors, 15-second checks, and 3 years of retention.
              </p>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/20 hover:bg-white/5"
              >
                <Link href="/pricing">
                  Compare all plans
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>

            <div className="p-6 rounded-xl border border-green-500/30 bg-green-500/10">
              <p className="text-xl font-semibold text-center">
                Nano: <span className="text-green-400">$9/month</span>. 50 monitors, 2-minute checks, full status page builder.
              </p>
            </div>
          </SectionContent>
        </PageSection>

        {/* CTA */}
        <PageSection className="py-20 border-t border-white/10">
          <SectionContent size="sm" className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to upgrade?</h2>
            <p className="text-lg text-white/70 mb-8">
              Cancel anytime. Save 25% with annual billing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 py-6 text-lg font-semibold bg-white text-black hover:bg-white/90"
              >
                <a href="https://app.exit1.dev/billing" target="_blank" rel="noopener noreferrer">
                  Get Nano
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 py-6 text-lg font-semibold border-white/20 hover:bg-white/5"
              >
                <Link href="/pricing">
                  Compare Plans
                </Link>
              </Button>
            </div>
          </SectionContent>
        </PageSection>
      </PageContainer>
    </PageShell>
  );
}
