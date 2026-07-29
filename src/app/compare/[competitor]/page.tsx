import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, Check, Minus, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHero } from '@/components/PageHero';
import { PageContainer, PageSection, PageShell, SectionContent } from '@/components/PageLayout';
import StructuredData from '@/components/StructuredData';
import { buildSignupUrl } from '@/lib/cta';
import {
  competitors,
  getCompetitor,
  type Cell,
  type CompareTier,
  type Competitor,
} from '@/content/competitors';

export function generateStaticParams() {
  return competitors.map((c) => ({ competitor: c.slug }));
}

export const dynamicParams = false;

type Props = { params: Promise<{ competitor: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { competitor: slug } = await params;
  const c = getCompetitor(slug);
  if (!c) return {};

  const url = `https://exit1.dev/compare/${c.slug}`;
  return {
    title: c.seoTitle,
    description: c.seoDescription,
    keywords: c.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: c.seoTitle,
      description: c.seoDescription,
      type: 'website',
      url,
      images: ['/e_-logo-large.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: c.seoTitle,
      description: c.seoDescription,
      images: ['/e_-logo-large.png'],
    },
  };
}

function CellValue({ value }: { value: Cell }) {
  if (value === true) return <Check className="w-4 h-4 text-success mx-auto" />;
  if (value === false) return <Minus className="w-4 h-4 text-foreground/25 mx-auto" />;
  return <span className="text-sm text-foreground/85">{value}</span>;
}

function ComparisonTable({ tier, competitorName }: { tier: CompareTier; competitorName: string }) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-foreground/10 bg-foreground/[0.02]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-foreground/10">
              <th className="text-left py-5 px-5 font-semibold text-foreground/80 text-sm w-[40%]">
                Feature
              </th>
              <th className="py-5 px-4 text-center bg-success/[0.06]">
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-xs uppercase tracking-wider text-foreground/60">exit1.dev</span>
                  <span className="text-sm font-semibold text-foreground">{tier.exit1Plan.replace('exit1.dev ', '')}</span>
                </div>
              </th>
              <th className="py-5 px-4 text-center">
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-xs uppercase tracking-wider text-foreground/40">{competitorName}</span>
                  <span className="text-sm font-semibold text-foreground/70">
                    {tier.competitorPlan.replace(`${competitorName} `, '')}
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {tier.rows.map((row, rIdx) => (
              <tr key={row.feature} className={rIdx === tier.rows.length - 1 ? '' : 'border-b border-foreground/5'}>
                <td className="py-3.5 px-5 text-sm text-foreground/75">{row.feature}</td>
                <td className="py-3.5 px-4 text-center bg-success/[0.06]">
                  <CellValue value={row.exit1} />
                </td>
                <td className="py-3.5 px-4 text-center">
                  <CellValue value={row.competitor} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: two stacked cards */}
      <div className="md:hidden space-y-4">
        {(
          [
            { label: 'exit1.dev', plan: tier.exit1Plan.replace('exit1.dev ', ''), key: 'exit1' as const, hero: true },
            { label: competitorName, plan: tier.competitorPlan.replace(`${competitorName} `, ''), key: 'competitor' as const, hero: false },
          ]
        ).map((col) => (
          <div
            key={col.key}
            className={`rounded-xl border ${
              col.hero ? 'border-success/40 bg-success/[0.04]' : 'border-foreground/10 bg-foreground/[0.03]'
            } overflow-hidden`}
          >
            <div className="px-4 py-3 border-b border-foreground/10">
              <div className="text-[11px] uppercase tracking-wider text-foreground/50">{col.label}</div>
              <div className={`text-base font-semibold ${col.hero ? 'text-foreground' : 'text-foreground/80'}`}>
                {col.plan}
              </div>
            </div>
            <dl className="divide-y divide-foreground/5">
              {tier.rows.map((row) => (
                <div key={row.feature} className="flex items-center justify-between px-4 py-2.5 gap-4">
                  <dt className="text-xs text-foreground/60 flex-1">{row.feature}</dt>
                  <dd className="text-right">
                    <CellValue value={col.key === 'exit1' ? row.exit1 : row.competitor} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </>
  );
}

function WinsList({ title, items, tone }: { title: string; items: string[]; tone: 'exit1' | 'competitor' }) {
  const accent = tone === 'exit1' ? 'text-success' : 'text-foreground/60';
  return (
    <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-6 sm:p-7 h-full">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ul className="space-y-3 text-sm sm:text-base text-foreground/70">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${accent}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function CompareCompetitorPage({ params }: Props) {
  const { competitor: slug } = await params;
  const c: Competitor | undefined = getCompetitor(slug);
  if (!c) notFound();

  const heroCtaHref = buildSignupUrl({
    campaign: `compare_${c.slug}`,
    medium: 'compare_hero',
  });

  return (
    <PageShell>
      <StructuredData
        type="FAQPage"
        data={{
          mainEntity: c.faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          })),
        }}
      />
      <StructuredData
        type="BreadcrumbList"
        data={{
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Compare', item: 'https://exit1.dev/compare' },
            {
              '@type': 'ListItem',
              position: 2,
              name: `${c.name} vs exit1.dev`,
              item: `https://exit1.dev/compare/${c.slug}`,
            },
          ],
        }}
      />

      <PageContainer>
        <PageHero size="lg">
          <div className="mb-6 sm:mb-8">
            <Link
              href="/compare"
              className="inline-flex items-center text-foreground/70 hover:text-foreground transition-colors duration-200 mb-4 sm:mb-6 text-sm sm:text-base cursor-pointer interactive"
            >
              <ArrowLeft className="mr-2 w-3 h-3 sm:w-4 sm:h-4" />
              All comparisons
            </Link>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
            {c.name} vs <span className="text-primary">exit1.dev</span>
          </h1>

          <p className="text-xl sm:text-2xl text-foreground/70 leading-relaxed max-w-2xl">
            {c.heroSubtitle}
          </p>

          <p className="mt-6 text-base sm:text-lg text-foreground/60 leading-relaxed max-w-2xl">
            {c.intro}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 py-6 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
            >
              <a href={heroCtaHref}>
                Start monitoring free
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8 py-6 text-lg font-semibold border-foreground/20 hover:bg-foreground/5 cursor-pointer"
            >
              <Link href="/pricing">See all plans</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-foreground/50">{c.bestKnownFor}</p>
        </PageHero>

        {/* Discontinued warning (Freshping) */}
        {c.discontinuedNote && (
          <PageSection className="pt-4 pb-8">
            <SectionContent size="lg">
              <div className="rounded-2xl border border-warning/30 bg-warning/[0.06] p-5 sm:p-6 flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0 mt-0.5" />
                <p className="text-sm sm:text-base text-foreground/80">{c.discontinuedNote}</p>
              </div>
            </SectionContent>
          </PageSection>
        )}

        {/* Verdict */}
        <PageSection className="pt-6 pb-10">
          <SectionContent size="md">
            <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-6 sm:p-8">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/50 mb-3">
                The short version
              </h2>
              <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed">{c.verdict}</p>
            </div>
          </SectionContent>
        </PageSection>

        {/* No free tier callout (Pingdom) */}
        {!c.free && !c.discontinuedNote && (
          <PageSection className="pt-2 pb-8">
            <SectionContent size="lg">
              <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-5 sm:p-6 text-sm text-foreground/70">
                <strong className="text-foreground">{c.name} has no free tier.</strong> exit1.dev&apos;s
                free plan is free forever — 5 monitors, every protocol, SSL monitoring, no credit card.
              </div>
            </SectionContent>
          </PageSection>
        )}

        {/* Free tier table */}
        {c.free && (
          <PageSection className="pt-2 pb-12">
            <SectionContent size="lg">
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold">{c.free.heading}</h2>
                {c.free.subheading && (
                  <p className="text-foreground/60 text-sm mt-1">{c.free.subheading}</p>
                )}
              </div>
              <ComparisonTable tier={c.free} competitorName={c.name} />
            </SectionContent>
          </PageSection>
        )}

        {/* Paid tier table */}
        {c.paid && (
          <PageSection className="pt-4 pb-12">
            <SectionContent size="lg">
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold">{c.paid.heading}</h2>
                {c.paid.subheading && (
                  <p className="text-foreground/60 text-sm mt-1">{c.paid.subheading}</p>
                )}
              </div>
              <ComparisonTable tier={c.paid} competitorName={c.name} />
              {c.pricingNote && (
                <p className="mt-4 text-xs text-foreground/40 leading-relaxed">{c.pricingNote}</p>
              )}
            </SectionContent>
          </PageSection>
        )}

        {/* Honest wins/losses */}
        <PageSection className="pt-4 pb-12">
          <SectionContent size="lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <WinsList title={`Where exit1.dev wins`} items={c.exit1Wins} tone="exit1" />
              <WinsList title={`Where ${c.name} wins`} items={c.competitorWins} tone="competitor" />
            </div>
          </SectionContent>
        </PageSection>

        {/* FAQ */}
        <PageSection className="pt-4 pb-12">
          <SectionContent size="md">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">
              {c.name} vs exit1.dev — FAQ
            </h2>
            <div className="space-y-3">
              {c.faq.map((item, i) => (
                <details
                  key={i}
                  className="group rounded-xl border border-foreground/10 bg-foreground/[0.03] px-5 py-4"
                >
                  <summary className="cursor-pointer list-none font-semibold text-foreground/90 flex items-center justify-between gap-4 interactive">
                    {item.question}
                    <ArrowRight className="w-4 h-4 text-foreground/40 transition-transform group-open:rotate-90 flex-shrink-0" />
                  </summary>
                  <p className="mt-3 text-sm sm:text-base text-foreground/70 leading-relaxed">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </SectionContent>
        </PageSection>

        {/* Cross-link + CTA */}
        <PageSection className="pt-4 pb-20">
          <SectionContent size="lg">
            <div className="rounded-2xl border border-success/30 bg-success/[0.04] p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">
                    Try exit1.dev free — no credit card
                  </h3>
                  <p className="text-foreground/70 text-sm sm:text-base">
                    5 monitors, every protocol, SSL monitoring, and instant alerts on the free plan.
                    Scale to 1,000 monitors and 15-second checks on Pro whenever you&apos;re ready.
                  </p>
                  {c.relatedPost && (
                    <p className="mt-3 text-sm">
                      <Link
                        href={`/blog/${c.relatedPost.slug}`}
                        className="text-primary hover:underline interactive cursor-pointer"
                      >
                        Read the full guide: {c.relatedPost.title} →
                      </Link>
                    </p>
                  )}
                </div>
                <Button
                  asChild
                  size="lg"
                  className="rounded-full px-8 py-6 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  <a href={buildSignupUrl({ campaign: `compare_${c.slug}`, medium: 'compare_footer' })}>
                    Get started free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Other comparisons */}
            <div className="mt-10">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/50 mb-4">
                Compare exit1.dev to others
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {competitors
                  .filter((other) => other.slug !== c.slug)
                  .map((other) => (
                    <Link
                      key={other.slug}
                      href={`/compare/${other.slug}`}
                      className="rounded-full border border-foreground/15 bg-foreground/[0.03] px-4 py-1.5 text-sm text-foreground/75 hover:bg-foreground/[0.06] hover:text-foreground transition-colors cursor-pointer interactive"
                    >
                      {other.name} vs exit1.dev
                    </Link>
                  ))}
              </div>
            </div>
          </SectionContent>
        </PageSection>
      </PageContainer>
    </PageShell>
  );
}
