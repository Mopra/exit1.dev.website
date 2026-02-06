import Link from 'next/link';
import { ArrowLeft, ArrowRight, MessageSquare, Palette, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHero } from '@/components/PageHero';
import { PageContainer, PageSection, PageShell, SectionContent } from '@/components/PageLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Why Nano? | exit1.dev',
  description: 'SMS alerts at 3am. Professional status pages with your brand. All for less than a coffee per week.',
  openGraph: {
    title: 'Why Nano? | exit1.dev',
    description: 'SMS alerts at 3am. Professional status pages with your brand. All for less than a coffee per week.',
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
            The free tier is great. But some problems need more than email alerts and generic status pages.
          </p>
        </PageHero>

        {/* The 3am Problem */}
        <PageSection className="py-16">
          <SectionContent size="md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold">The 3am Problem</h2>
            </div>
            
            <p className="text-lg text-white/70 mb-8">
              You&apos;re a developer. You&apos;re asleep. Your client&apos;s e-commerce site goes down.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-red-500/20 bg-red-500/5">
                <h3 className="font-semibold text-red-400 mb-4">Without Nano</h3>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">-</span>
                    Email arrives at 3:12am
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">-</span>
                    You see it at 7:30am when you check your phone
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">-</span>
                    Client already called. Twice. They&apos;re not happy.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">-</span>
                    You lost them $4,000 in sales overnight.
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl border border-green-500/20 bg-green-500/5">
                <h3 className="font-semibold text-green-400 mb-4">With Nano</h3>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">+</span>
                    SMS arrives at 3:12am
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">+</span>
                    Your phone buzzes. You wake up.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">+</span>
                    You fix it in 10 minutes.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">+</span>
                    Client never knows. You&apos;re a hero.
                  </li>
                </ul>
              </div>
            </div>
          </SectionContent>
        </PageSection>

        {/* The Professional Problem */}
        <PageSection className="py-16 border-t border-white/10">
          <SectionContent size="md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold">The Professional Problem</h2>
            </div>
            
            <p className="text-lg text-white/70 mb-8">
              Your client asks: &quot;Where can I see our uptime status?&quot;
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-red-500/20 bg-red-500/5">
                <h3 className="font-semibold text-red-400 mb-4">Without Nano</h3>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">-</span>
                    You share a link to status.exit1.dev/abc123
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">-</span>
                    They ask why it doesn&apos;t match their brand
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">-</span>
                    You look amateur
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl border border-green-500/20 bg-green-500/5">
                <h3 className="font-semibold text-green-400 mb-4">With Nano</h3>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">+</span>
                    You share status.theircompany.com
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">+</span>
                    Their logo, their colors
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">+</span>
                    You look like you&apos;ve got your act together
                  </li>
                </ul>
              </div>
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
              Nano costs <strong className="text-white">$3/month</strong> (annual) or <strong className="text-white">$4/month</strong> (monthly).
            </p>

            <div className="p-6 rounded-xl border border-white/10 bg-white/5 mb-8">
              <h3 className="font-semibold mb-4">What this would cost elsewhere:</h3>
              <ul className="space-y-3 text-white/70">
                <li className="flex items-start gap-2">
                  <span className="text-white/40">-</span>
                  <span><strong className="text-white">SMS via Twilio:</strong> ~$0.0079/message + $20+ platform fees/month</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white/40">-</span>
                  <span><strong className="text-white">Custom domain setup:</strong> $5-15/month with other tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white/40">-</span>
                  <span><strong className="text-white">Professional status page tools:</strong> $20-50/month</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-xl border border-green-500/30 bg-green-500/10">
              <p className="text-xl font-semibold text-center">
                Nano: <span className="text-green-400">$3/month</span>. Everything included.
              </p>
            </div>
          </SectionContent>
        </PageSection>

        {/* CTA */}
        <PageSection className="py-20 border-t border-white/10">
          <SectionContent size="sm" className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to upgrade?</h2>
            <p className="text-lg text-white/70 mb-8">
              Less than a coffee per week. Cancel anytime.
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
