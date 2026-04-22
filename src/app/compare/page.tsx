import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Minus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHero } from '@/components/PageHero';
import { PageContainer, PageSection, PageShell, SectionContent } from '@/components/PageLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare Uptime Monitors | exit1.dev vs UptimeRobot vs Better Stack vs Hyperping',
  description:
    'Tier-by-tier comparison of exit1.dev against UptimeRobot, Better Stack, Hyperping, and Pingdom. Matching free plans against free plans, and similarly-priced paid plans against each other.',
  openGraph: {
    title: 'Compare Uptime Monitors | exit1.dev',
    description:
      'See how exit1.dev stacks up against UptimeRobot, Better Stack, Hyperping, and Pingdom — priced tier against priced tier.',
  },
};

type Cell = string | boolean;
type Row = { feature: string; values: Cell[] };

type Column = {
  key: string;
  product: string;
  plan: string;
  price: string;
  highlight?: 'exit1' | 'hero';
  note?: string;
};

const freeColumns: Column[] = [
  { key: 'exit1', product: 'exit1.dev', plan: 'Free', price: '$0', highlight: 'exit1' },
  { key: 'ur', product: 'UptimeRobot', plan: 'Free', price: '$0' },
  { key: 'bs', product: 'Better Stack', plan: 'Free', price: '$0' },
  { key: 'hp', product: 'Hyperping', plan: 'Free', price: '$0' },
];

const freeRows: Row[] = [
  { feature: 'Monitors', values: ['10', '50', '10', '20'] },
  { feature: 'Check interval', values: ['5 min', '5 min', '3 min', '5 min'] },
  { feature: 'Multi-region checks', values: [false, true, false, false] },
  { feature: 'HTTP / TCP / UDP / ICMP / WebSocket', values: [true, 'HTTP only', 'HTTP only', 'HTTP only'] },
  { feature: 'SSL certificate monitoring', values: [true, true, false, false] },
  { feature: 'Domain expiry alerts', values: [false, true, false, false] },
  { feature: 'Public status page', values: ['1', '1', '1', '1'] },
  { feature: 'Webhooks', values: ['1', false, false, true] },
  { feature: 'Slack / Discord / Teams', values: [false, 'Slack only', 'Slack only', 'Basic'] },
  { feature: 'SMS alerts', values: [false, false, false, false] },
  { feature: 'REST API', values: [false, false, true, true] },
  { feature: 'Log retention', values: ['60 days', '90 days', '3 days', 'Limited'] },
];

const paidColumns: Column[] = [
  {
    key: 'exit1',
    product: 'exit1.dev',
    plan: 'Pro',
    price: '$24/mo',
    note: '$20/mo annual',
    highlight: 'hero',
  },
  { key: 'ur', product: 'UptimeRobot', plan: 'Team', price: '$34/mo', note: 'From $29 annual' },
  { key: 'bs', product: 'Better Stack', plan: 'Responder', price: '$34/mo', note: '$29 annual' },
  { key: 'hp', product: 'Hyperping', plan: 'Essentials', price: '$24/mo', note: 'Annual only' },
];

const paidRows: Row[] = [
  { feature: 'Monitors included', values: ['500', '100', '10 (add-ons extra)', '50'] },
  { feature: 'Minimum check interval', values: ['30 sec', '60 sec', '30 sec', '30 sec'] },
  { feature: 'Multi-region checks', values: [true, true, true, true] },
  { feature: 'HTTP / TCP / UDP / ICMP / WebSocket', values: [true, 'HTTP + keyword', 'HTTP + TCP + DNS', 'HTTP + TCP + DNS'] },
  { feature: 'SSL certificate monitoring', values: [true, true, true, true] },
  { feature: 'Domain expiry alerts', values: [true, true, true, true] },
  { feature: 'SMS alerts', values: ['50 / month', 'Credits — $0.03+ each', 'Unlimited', 'Unclear'] },
  { feature: 'Slack / Discord / Teams', values: [true, true, true, true] },
  { feature: 'Webhooks', values: ['25', true, true, true] },
  { feature: 'REST API', values: [true, true, true, true] },
  { feature: 'MCP (Claude, Cursor, Windsurf)', values: [true, false, false, false] },
  { feature: 'Branded status pages', values: ['25', 'Unlimited', 'Multiple', '1 + custom domain'] },
  { feature: 'CSV bulk export', values: [true, false, false, false] },
  { feature: 'Log retention', values: ['365 days', '24 months', 'Unlimited incidents', 'Unclear'] },
];

function CellValue({ value }: { value: Cell }) {
  if (value === true) {
    return <Check className="w-4 h-4 text-emerald-400 mx-auto" />;
  }
  if (value === false) {
    return <Minus className="w-4 h-4 text-white/25 mx-auto" />;
  }
  return <span className="text-sm text-white/85">{value}</span>;
}

function ColumnHeader({ column }: { column: Column }) {
  const isHero = column.highlight === 'hero';
  const isExit1 = column.highlight === 'exit1';
  const highlightClass = isHero
    ? 'text-amber-300'
    : isExit1
      ? 'text-white'
      : 'text-white/70';
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={`text-xs uppercase tracking-wider ${column.highlight ? 'text-white/60' : 'text-white/40'}`}>
        {column.product}
      </span>
      <span className={`text-sm font-semibold ${highlightClass}`}>{column.plan}</span>
      <span className="text-xs text-white/50 font-normal">{column.price}</span>
      {column.note && <span className="text-[10px] text-white/40">{column.note}</span>}
    </div>
  );
}

function ComparisonTable({
  columns,
  rows,
}: {
  columns: Column[];
  rows: Row[];
}) {
  const heroIdx = columns.findIndex((c) => c.highlight === 'hero');
  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-5 px-5 font-semibold text-white/80 text-sm w-[32%]">
                Feature
              </th>
              {columns.map((col, idx) => (
                <th
                  key={col.key}
                  className={`py-5 px-4 text-center ${
                    idx === heroIdx ? 'bg-amber-400/[0.06]' : ''
                  }`}
                >
                  <ColumnHeader column={col} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => (
              <tr
                key={row.feature}
                className={rIdx === rows.length - 1 ? '' : 'border-b border-white/5'}
              >
                <td className="py-3.5 px-5 text-sm text-white/75">{row.feature}</td>
                {row.values.map((value, cIdx) => (
                  <td
                    key={cIdx}
                    className={`py-3.5 px-4 text-center ${
                      cIdx === heroIdx ? 'bg-amber-400/[0.06]' : ''
                    }`}
                  >
                    <CellValue value={value} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: per-column cards, each listing all features */}
      <div className="md:hidden space-y-4">
        {columns.map((col) => {
          const isHero = col.highlight === 'hero';
          return (
            <div
              key={col.key}
              className={`rounded-xl border ${
                isHero ? 'border-amber-400/40 bg-amber-400/[0.04]' : 'border-white/10 bg-white/[0.03]'
              } overflow-hidden`}
            >
              <div className="px-4 py-3 border-b border-white/10 flex items-baseline justify-between gap-3">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-white/50">
                    {col.product}
                  </div>
                  <div
                    className={`text-base font-semibold ${
                      isHero ? 'text-amber-300' : 'text-white'
                    }`}
                  >
                    {col.plan}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white/80">{col.price}</div>
                  {col.note && <div className="text-[10px] text-white/40">{col.note}</div>}
                </div>
              </div>
              <dl className="divide-y divide-white/5">
                {rows.map((row) => {
                  const idx = columns.indexOf(col);
                  return (
                    <div
                      key={row.feature}
                      className="flex items-center justify-between px-4 py-2.5 gap-4"
                    >
                      <dt className="text-xs text-white/60 flex-1">{row.feature}</dt>
                      <dd className="text-right">
                        <CellValue value={row.values[idx]} />
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          );
        })}
      </div>
    </>
  );
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
            Tier against tier. Free plans compared to free plans, similarly-priced paid plans next
            to each other — so you can actually tell who wins.
          </p>
        </PageHero>

        {/* Free tier comparison */}
        <PageSection className="pt-8 pb-12">
          <SectionContent size="lg">
            <div className="mb-6 flex items-baseline justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">Free tier</h2>
                <p className="text-white/60 text-sm mt-1">
                  What you get without paying a cent.
                </p>
              </div>
              <p className="text-xs text-white/40">
                Pingdom has no free tier — 14-day trial only.
              </p>
            </div>

            <ComparisonTable columns={freeColumns} rows={freeRows} />

            <p className="mt-4 text-xs text-white/40">
              UptimeRobot lets you put 50 monitors on a free account, but the check interval tops
              out at 5 minutes and SSL/alerting depth is thinner than it looks.
            </p>
          </SectionContent>
        </PageSection>

        {/* Paid tier comparison — the upsell */}
        <PageSection className="pt-12 pb-12">
          <SectionContent size="lg">
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-300 mb-3">
                <Sparkles className="w-3 h-3" />
                Best value
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold">Around $24–$34 / month</h2>
              <p className="text-white/60 text-sm mt-1">
                The tier where most teams actually land. Apples-to-apples against the cheapest
                real paid plan from each competitor.
              </p>
            </div>

            <ComparisonTable columns={paidColumns} rows={paidRows} />

            <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/70">
              <strong className="text-white">A fair comparison note:</strong> Better Stack&apos;s
              Responder plan includes just 10 monitors at its base price — scaling to 50 adds
              roughly $21–$25/month. UptimeRobot caps SMS via prepaid credits rather than a monthly
              allowance. Hyperping doesn&apos;t publish SMS quotas. Exit1 Pro bundles 50 SMS, REST
              API, and MCP for AI assistants at the lowest sticker price in this row.
            </div>
          </SectionContent>
        </PageSection>

        {/* Scaling beyond */}
        <PageSection className="pt-8 pb-12">
          <SectionContent size="lg">
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/[0.04] p-6 sm:p-8">
              <div className="flex items-start gap-4 flex-col sm:flex-row">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Running 500+ monitors?</h3>
                  <p className="text-white/70 text-sm">
                    Exit1 Agency is $49/month (or $37 billed annually) for 1,000 monitors,
                    15-second checks, and 3-year retention. For comparison: Hyperping Pro is
                    $74/mo for 100 monitors, Checkly Team is $64/mo for 75 monitors.
                  </p>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-emerald-400/40 text-emerald-300 hover:bg-emerald-400/10 hover:text-emerald-200"
                >
                  <Link href="/pricing">
                    See all plans
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </SectionContent>
        </PageSection>

        {/* Bottom line */}
        <PageSection className="pt-4 pb-20">
          <SectionContent size="lg">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold mb-5">The bottom line</h2>
              <ul className="space-y-3.5 text-white/70 text-sm sm:text-base">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong className="text-white">Exit1 Free</strong> is the only free tier with
                    TCP, UDP, WebSocket, and ICMP checks — not just HTTP pings.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-amber-300 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong className="text-white">Exit1 Pro at $24/mo</strong> is the cheapest
                    plan in this comparison that ships with 30-second checks, 50 SMS, REST API,
                    and MCP — all bundled, no add-ons.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-amber-300 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong className="text-white">500 monitors</strong> on Pro vs. 10–100 on the
                    same-priced tier from competitors.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-amber-300 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong className="text-white">MCP access</strong> means you can query your
                    checks directly from Claude, Cursor, or Windsurf — nobody else offers this.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white/70 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong className="text-white">Where others win:</strong> Better Stack ships
                    unlimited SMS at its paid tier. UptimeRobot gives you 50 monitors on the free
                    plan. We&apos;re being honest about that.
                  </span>
                </li>
              </ul>
            </div>
          </SectionContent>
        </PageSection>
      </PageContainer>
    </PageShell>
  );
}
