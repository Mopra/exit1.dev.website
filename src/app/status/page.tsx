import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import { PageHero } from "@/components/PageHero";
import { PageContainer, PageSection, PageShell, SectionContent } from "@/components/PageLayout";
import { StatusDirectory } from "@/components/status/StatusDirectory";
import { classifyStatus, getAllPublicMonitors, isIndexEntryMature, makeComparator } from "@/lib/publicMonitors";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Live Status & Uptime of Popular Sites",
  description:
    "Real-time status and 90-day uptime history for popular websites and APIs, monitored continuously by exit1.dev. Search and check if a site is down right now.",
  alternates: { canonical: "https://exit1.dev/status" },
  openGraph: {
    title: "Live Status & Uptime of Popular Sites — exit1.dev",
    description:
      "Real-time status and 90-day uptime history for popular websites and APIs, monitored by exit1.dev.",
    type: "website",
    url: "https://exit1.dev/status",
  },
};

export default async function StatusHubPage() {
  const monitors = await getAllPublicMonitors();
  // Worst-first so the (usually few) incidents lead the SSR'd HTML; the client
  // island re-sorts on demand but defaults to this same order.
  const sorted = [...monitors].sort(makeComparator("worst"));

  const counts = { operational: 0, down: 0, degraded: 0, other: 0 };
  for (const m of monitors) counts[classifyStatus(m.status)]++;
  const total = monitors.length;

  // Only point the ItemList at pages mature enough to index — no sense
  // advertising thin, noindexed pages to crawlers.
  const indexable = sorted.filter(isIndexEntryMature);
  const itemListData = {
    name: "Live status & uptime of popular sites",
    description: "Curated uptime monitors tracked by exit1.dev.",
    numberOfItems: indexable.length,
    itemListElement: indexable.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://exit1.dev/status/${m.slug}`,
      name: m.host,
    })),
  };

  return (
    <>
      {indexable.length > 0 && <StructuredData type="ItemList" data={itemListData} />}
      <PageShell>
        <main>
          <PageContainer>
            <PageHero
              size="lg"
              breadcrumb={<Breadcrumbs items={[{ name: "Status", href: "/status" }]} />}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
                Live status &amp; uptime
              </h1>
              <p className="text-xl sm:text-2xl text-foreground/70 leading-relaxed">
                Real-time status and 90-day uptime history for {total > 0 ? total : "hundreds of"} popular
                sites and APIs — monitored continuously by exit1.dev.
              </p>
              <p className="mt-6 text-base text-foreground/60">
                Want this for your own site?{" "}
                <Link
                  href="https://app.exit1.dev"
                  className="inline-flex items-center gap-1 font-medium text-foreground hover:underline interactive"
                >
                  Monitor it free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </p>
            </PageHero>

            <PageSection className="py-12 sm:py-16">
              <SectionContent size="lg">
                {total === 0 ? (
                  <p className="text-muted-foreground">No public monitors are available yet. Check back soon.</p>
                ) : (
                  <>
                    {/* Server-rendered overview (crawlable, no-JS friendly) */}
                    <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                      <span>
                        <strong className="tabular-nums text-foreground">{counts.operational}</strong>{" "}
                        <span className="text-muted-foreground">of {total} operational</span>
                      </span>
                      {counts.degraded > 0 && (
                        <span className="flex items-center gap-1.5 text-amber-500">
                          <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
                          <strong className="tabular-nums">{counts.degraded}</strong> degraded
                        </span>
                      )}
                      {counts.down > 0 && (
                        <span className="flex items-center gap-1.5 text-red-500">
                          <span className="h-2 w-2 rounded-full bg-red-500" aria-hidden="true" />
                          <strong className="tabular-nums">{counts.down}</strong> down
                        </span>
                      )}
                    </div>

                    <StatusDirectory monitors={sorted} />
                  </>
                )}

                {/* Crawlable explainer — targets "website status checker",
                    "is it down right now", "real-time uptime" intent. */}
                <div className="mt-16 max-w-3xl">
                  <h2 className="mb-3 text-xl font-semibold">Is it down right now?</h2>
                  <p className="text-sm leading-relaxed text-foreground/70">
                    Pick any site or API above to see whether it&apos;s down right now, its live
                    uptime percentage, average response time and a 90-day outage history. Every
                    figure is an independent, third-party measurement — exit1.dev probes each
                    target continuously from multiple regions, so the numbers aren&apos;t
                    self-reported by the services themselves.
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-foreground/70">
                    Want this for your own website or API?{" "}
                    <Link href="https://app.exit1.dev" className="font-medium text-foreground hover:underline interactive">
                      Start monitoring free
                    </Link>{" "}
                    — 5-minute checks, instant alerts and a public{" "}
                    <Link href="/status-pages" className="font-medium text-foreground hover:underline interactive">
                      status page
                    </Link>{" "}
                    of your own, no credit card required.
                  </p>
                </div>
              </SectionContent>
            </PageSection>
          </PageContainer>
        </main>
      </PageShell>
    </>
  );
}
