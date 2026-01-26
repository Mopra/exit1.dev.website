import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHero } from '@/components/PageHero';
import { PageContainer, PageSection, PageShell, SectionContent } from '@/components/PageLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare Uptime Monitors | exit1.dev vs UptimeRobot vs Better Uptime',
  description: 'See how exit1.dev compares to UptimeRobot, Better Uptime, and other monitoring tools. Unlimited monitors, 1-minute checks, and SMS alerts at a fraction of the cost.',
  openGraph: {
    title: 'Compare Uptime Monitors | exit1.dev',
    description: 'See how exit1.dev compares to UptimeRobot, Better Uptime, and other monitoring tools.',
  },
};

const comparisonData = [
  {
    feature: 'Check interval (free)',
    exit1Free: '1 min',
    exit1Nano: '1 min',
    uptimeRobotFree: '5 min',
    uptimeRobotPro: '1 min',
    betterUptimeFree: '3 min',
  },
  {
    feature: 'Monitors (free)',
    exit1Free: 'Unlimited',
    exit1Nano: 'Unlimited',
    uptimeRobotFree: '50',
    uptimeRobotPro: '50+',
    betterUptimeFree: '10',
  },
  {
    feature: 'SMS alerts',
    exit1Free: false,
    exit1Nano: true,
    uptimeRobotFree: false,
    uptimeRobotPro: 'Extra cost',
    betterUptimeFree: false,
  },
  {
    feature: 'Team alerts (add others)',
    exit1Free: false,
    exit1Nano: true,
    uptimeRobotFree: false,
    uptimeRobotPro: true,
    betterUptimeFree: false,
  },
  {
    feature: 'Custom status page domain',
    exit1Free: false,
    exit1Nano: true,
    uptimeRobotFree: false,
    uptimeRobotPro: 'Pro+ only',
    betterUptimeFree: false,
  },
  {
    feature: 'Status page branding',
    exit1Free: false,
    exit1Nano: true,
    uptimeRobotFree: false,
    uptimeRobotPro: 'Pro+ only',
    betterUptimeFree: false,
  },
  {
    feature: 'SSL monitoring',
    exit1Free: true,
    exit1Nano: true,
    uptimeRobotFree: true,
    uptimeRobotPro: true,
    betterUptimeFree: true,
  },
  {
    feature: 'Webhook alerts',
    exit1Free: true,
    exit1Nano: true,
    uptimeRobotFree: true,
    uptimeRobotPro: true,
    betterUptimeFree: true,
  },
  {
    feature: 'API access',
    exit1Free: true,
    exit1Nano: true,
    uptimeRobotFree: true,
    uptimeRobotPro: true,
    betterUptimeFree: 'Limited',
  },
  {
    feature: 'Data retention',
    exit1Free: '90 days',
    exit1Nano: '1 year',
    uptimeRobotFree: '30 days',
    uptimeRobotPro: '2 years',
    betterUptimeFree: '30 days',
  },
  {
    feature: 'Price',
    exit1Free: '$0',
    exit1Nano: '$3/mo',
    uptimeRobotFree: '$0',
    uptimeRobotPro: '$14+/mo',
    betterUptimeFree: '$0',
  },
];

function CellValue({ value }: { value: boolean | string }) {
  if (value === true) {
    return <Check className="w-5 h-5 text-green-400 mx-auto" />;
  }
  if (value === false) {
    return <X className="w-5 h-5 text-red-400/60 mx-auto" />;
  }
  if (value === 'Extra cost' || value === 'Pro+ only' || value === 'Limited') {
    return <span className="text-yellow-400 text-sm">{value}</span>;
  }
  return <span>{value}</span>;
}

export default function ComparePage() {
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
            Compare uptime monitors
          </h1>

          <p className="text-xl sm:text-2xl text-white/70 leading-relaxed max-w-2xl">
            See how exit1.dev stacks up against the competition. Spoiler: we offer more for less.
          </p>
        </PageHero>

        <PageSection className="py-16">
          <SectionContent size="lg">
            {/* Mobile-friendly cards */}
            <div className="md:hidden space-y-6">
              {comparisonData.map((row, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-white/10 bg-white/5">
                  <h3 className="font-semibold mb-3">{row.feature}</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex flex-col">
                      <span className="text-white/50 text-xs mb-1">Exit1 Free</span>
                      <CellValue value={row.exit1Free} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white/50 text-xs mb-1">Exit1 Nano</span>
                      <CellValue value={row.exit1Nano} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white/50 text-xs mb-1">UptimeRobot Free</span>
                      <CellValue value={row.uptimeRobotFree} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white/50 text-xs mb-1">UptimeRobot Pro</span>
                      <CellValue value={row.uptimeRobotPro} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-4 font-semibold">Feature</th>
                    <th className="text-center py-4 px-4 font-semibold bg-white/5 rounded-t-lg">
                      <div className="text-green-400">Exit1 Free</div>
                    </th>
                    <th className="text-center py-4 px-4 font-semibold bg-green-500/10 rounded-t-lg border border-green-500/30 border-b-0">
                      <div className="text-green-400">Exit1 Nano</div>
                      <div className="text-xs text-white/50 font-normal mt-1">Recommended</div>
                    </th>
                    <th className="text-center py-4 px-4 font-semibold text-white/70">UptimeRobot Free</th>
                    <th className="text-center py-4 px-4 font-semibold text-white/70">UptimeRobot Pro</th>
                    <th className="text-center py-4 px-4 font-semibold text-white/70">Better Uptime Free</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, idx) => (
                    <tr key={idx} className="border-b border-white/5">
                      <td className="py-4 px-4 text-white/80">{row.feature}</td>
                      <td className="py-4 px-4 text-center bg-white/5">
                        <CellValue value={row.exit1Free} />
                      </td>
                      <td className="py-4 px-4 text-center bg-green-500/10 border-x border-green-500/30">
                        <CellValue value={row.exit1Nano} />
                      </td>
                      <td className="py-4 px-4 text-center text-white/60">
                        <CellValue value={row.uptimeRobotFree} />
                      </td>
                      <td className="py-4 px-4 text-center text-white/60">
                        <CellValue value={row.uptimeRobotPro} />
                      </td>
                      <td className="py-4 px-4 text-center text-white/60">
                        <CellValue value={row.betterUptimeFree} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="mt-12 p-6 rounded-xl border border-white/10 bg-white/5">
              <h2 className="text-xl font-semibold mb-4">The bottom line</h2>
              <ul className="space-y-3 text-white/70">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">Exit1 Free</strong> beats UptimeRobot Free on check intervals (1 min vs 5 min) and monitor limits (unlimited vs 50).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">Exit1 Nano at $3/mo</strong> includes SMS alerts, custom domains, and branding that cost $14-50/mo elsewhere.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">No hidden costs.</strong> SMS is included in Nano. No per-message fees. No surprise bills.</span>
                </li>
              </ul>
            </div>
          </SectionContent>
        </PageSection>

        {/* CTA */}
        <PageSection className="py-20 border-t border-white/10">
          <SectionContent size="sm" className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to switch?</h2>
            <p className="text-lg text-white/70 mb-8">
              Start free. Upgrade to Nano when you need SMS and branding.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 py-6 text-lg font-semibold bg-white text-black hover:bg-white/90"
              >
                <a href="https://app.exit1.dev" target="_blank" rel="noopener noreferrer">
                  Start Monitoring
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 py-6 text-lg font-semibold border-white/20 hover:bg-white/5"
              >
                <Link href="/why-nano">
                  Why Nano?
                </Link>
              </Button>
            </div>
          </SectionContent>
        </PageSection>
      </PageContainer>
    </PageShell>
  );
}
