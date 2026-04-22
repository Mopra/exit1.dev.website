import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHero } from '@/components/PageHero';
import { PageContainer, PageSection, PageShell, SectionContent } from '@/components/PageLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare Uptime Monitors | exit1.dev vs UptimeRobot vs Better Uptime',
  description: 'See how exit1.dev compares to UptimeRobot, Better Uptime, and other monitoring tools. 10 free monitors, 2-minute checks on Nano ($9/mo), 30-second checks on Pro ($24/mo), 15-second checks on Agency ($49/mo) — with SMS alerts and API access included.',
  openGraph: {
    title: 'Compare Uptime Monitors | exit1.dev',
    description: 'See how exit1.dev compares to UptimeRobot, Better Uptime, and other monitoring tools.',
  },
};

const comparisonData = [
  {
    feature: 'Check interval',
    exit1Free: '5 min',
    exit1Nano: '2 min',
    exit1Pro: '30 sec',
    exit1Agency: '15 sec',
    uptimeRobotFree: '5 min',
    uptimeRobotPro: '1 min',
    betterUptimeFree: '3 min',
  },
  {
    feature: 'Monitors',
    exit1Free: '10',
    exit1Nano: '50',
    exit1Pro: '500',
    exit1Agency: '1,000',
    uptimeRobotFree: '50',
    uptimeRobotPro: '50+',
    betterUptimeFree: '10',
  },
  {
    feature: 'SMS alerts',
    exit1Free: false,
    exit1Nano: false,
    exit1Pro: '50/mo',
    exit1Agency: '100/mo',
    uptimeRobotFree: false,
    uptimeRobotPro: 'Extra cost',
    betterUptimeFree: false,
  },
  {
    feature: 'Slack / Discord / Teams',
    exit1Free: false,
    exit1Nano: false,
    exit1Pro: true,
    exit1Agency: true,
    uptimeRobotFree: false,
    uptimeRobotPro: true,
    betterUptimeFree: false,
  },
  {
    feature: 'Status page branding',
    exit1Free: false,
    exit1Nano: true,
    exit1Pro: true,
    exit1Agency: true,
    uptimeRobotFree: false,
    uptimeRobotPro: 'Pro+ only',
    betterUptimeFree: false,
  },
  {
    feature: 'Domain intelligence',
    exit1Free: false,
    exit1Nano: true,
    exit1Pro: true,
    exit1Agency: true,
    uptimeRobotFree: false,
    uptimeRobotPro: false,
    betterUptimeFree: false,
  },
  {
    feature: 'Domain expiry alerts',
    exit1Free: false,
    exit1Nano: true,
    exit1Pro: true,
    exit1Agency: true,
    uptimeRobotFree: false,
    uptimeRobotPro: false,
    betterUptimeFree: false,
  },
  {
    feature: 'SSL monitoring',
    exit1Free: true,
    exit1Nano: true,
    exit1Pro: true,
    exit1Agency: true,
    uptimeRobotFree: true,
    uptimeRobotPro: true,
    betterUptimeFree: true,
  },
  {
    feature: 'Webhooks',
    exit1Free: '1',
    exit1Nano: '5',
    exit1Pro: '25',
    exit1Agency: '50',
    uptimeRobotFree: true,
    uptimeRobotPro: true,
    betterUptimeFree: true,
  },
  {
    feature: 'API access + MCP',
    exit1Free: false,
    exit1Nano: false,
    exit1Pro: '10 keys',
    exit1Agency: '25 keys',
    uptimeRobotFree: true,
    uptimeRobotPro: true,
    betterUptimeFree: 'Limited',
  },
  {
    feature: 'Data retention',
    exit1Free: '60 days',
    exit1Nano: '60 days',
    exit1Pro: '1 year',
    exit1Agency: '3 years',
    uptimeRobotFree: '30 days',
    uptimeRobotPro: '2 years',
    betterUptimeFree: '30 days',
  },
  {
    feature: 'Price',
    exit1Free: '$0',
    exit1Nano: '$9/mo',
    exit1Pro: '$24/mo',
    exit1Agency: '$49/mo',
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
            See how exit1.dev stacks up against the competition.
          </p>
        </PageHero>

        <PageSection className="py-16">
          <SectionContent size="lg">
            {/* Mobile-friendly cards */}
            <div className="md:hidden space-y-6">
              {comparisonData.map((row, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-white/10 bg-white/5">
                  <h2 className="font-semibold mb-3 text-base">{row.feature}</h2>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex flex-col">
                      <span className="text-white/70 text-xs mb-1">Exit1 Free</span>
                      <CellValue value={row.exit1Free} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white/70 text-xs mb-1">Exit1 Nano</span>
                      <CellValue value={row.exit1Nano} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-green-400/70 text-xs mb-1">Exit1 Pro</span>
                      <CellValue value={row.exit1Pro} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-blue-400/70 text-xs mb-1">Exit1 Agency</span>
                      <CellValue value={row.exit1Agency} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white/70 text-xs mb-1">UptimeRobot Free</span>
                      <CellValue value={row.uptimeRobotFree} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white/70 text-xs mb-1">UptimeRobot Pro</span>
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
                    <th className="text-left py-4 px-3 font-semibold">Feature</th>
                    <th className="text-center py-4 px-3 font-semibold bg-white/5 rounded-t-lg">
                      <div className="text-green-400">Exit1 Free</div>
                    </th>
                    <th className="text-center py-4 px-3 font-semibold bg-white/5 rounded-t-lg">
                      <div className="text-white">Exit1 Nano</div>
                      <div className="text-xs text-white/50 font-normal mt-1">$9/mo</div>
                    </th>
                    <th className="text-center py-4 px-3 font-semibold bg-green-500/10 rounded-t-lg border border-green-500/30 border-b-0">
                      <div className="text-green-400">Exit1 Pro</div>
                      <div className="text-xs text-white/50 font-normal mt-1">Popular · $24/mo</div>
                    </th>
                    <th className="text-center py-4 px-3 font-semibold bg-blue-500/10 rounded-t-lg border border-blue-500/30 border-b-0">
                      <div className="text-blue-400">Exit1 Agency</div>
                      <div className="text-xs text-white/50 font-normal mt-1">$49/mo</div>
                    </th>
                    <th className="text-center py-4 px-3 font-semibold text-white/70">UptimeRobot Free</th>
                    <th className="text-center py-4 px-3 font-semibold text-white/70">UptimeRobot Pro</th>
                    <th className="text-center py-4 px-3 font-semibold text-white/70">Better Uptime Free</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, idx) => (
                    <tr key={idx} className="border-b border-white/5">
                      <td className="py-4 px-3 text-white/80">{row.feature}</td>
                      <td className="py-4 px-3 text-center bg-white/5">
                        <CellValue value={row.exit1Free} />
                      </td>
                      <td className="py-4 px-3 text-center bg-white/5">
                        <CellValue value={row.exit1Nano} />
                      </td>
                      <td className="py-4 px-3 text-center bg-green-500/10 border-x border-green-500/30">
                        <CellValue value={row.exit1Pro} />
                      </td>
                      <td className="py-4 px-3 text-center bg-blue-500/10 border-x border-blue-500/30">
                        <CellValue value={row.exit1Agency} />
                      </td>
                      <td className="py-4 px-3 text-center text-white/60">
                        <CellValue value={row.uptimeRobotFree} />
                      </td>
                      <td className="py-4 px-3 text-center text-white/60">
                        <CellValue value={row.uptimeRobotPro} />
                      </td>
                      <td className="py-4 px-3 text-center text-white/60">
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
                  <span><strong className="text-white">Exit1 Free</strong> gives you 10 monitors with SSL checks and a public status page. Always free.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">Exit1 Nano at $9/mo</strong> unlocks 2-minute checks, 50 monitors, custom status pages, and Domain Intelligence.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">Exit1 Pro at $24/mo</strong> adds 30-second checks, SMS alerts, API + MCP access, Slack/Discord/Teams, and 1-year retention. SMS and API access that cost $14-50/mo elsewhere.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">Exit1 Agency at $49/mo</strong> is built for scale: 1,000 monitors, 15-second checks, 3 years of retention.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">No hidden costs.</strong> SMS and API access are bundled into Pro and Agency — no per-message fees, no add-ons.</span>
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
              Start free. Step up to Nano, Pro, or Agency whenever you need more monitors, faster checks, or API access.
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
                <Link href="/pricing">
                  See full pricing
                </Link>
              </Button>
            </div>
          </SectionContent>
        </PageSection>
      </PageContainer>
    </PageShell>
  );
}
