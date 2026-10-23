import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import { InsetCard } from "@/components/InsetCard";
import { PageHero } from "@/components/PageHero";
import { PageContainer, PageSection, PageShell, SectionContent } from "@/components/PageLayout";
import { BrandLogo } from "@/components/status/BrandLogo";
import { FollowCTA } from "@/components/status/FollowCTA";
import {
  formatDuration,
  formatUtc,
  formatUtcDate,
  incidentEnd,
  incidentFailure,
  outagePath,
  parseUtcDayKey,
  type PublicIncident,
} from "@/lib/publicMonitors";
import { ORG_ID } from "@/lib/siteSchema";
import { lastFactAt, leadSentence, loadOutageDay, shortSummary, startLabel, type OutageDay } from "./outageDay";

// Same cadence as the live status page and the data fetch behind it.
export const revalidate = 3600;
export const dynamicParams = true;

// Rendered on first request, then ISR. Prebuilding every outage day of ~600
// monitors would cost a fetch per monitor at build for pages few people open.
export async function generateStaticParams() {
  return [];
}

type Params = Promise<{ slug: string; date: string }>;

function titleFor(d: OutageDay): string {
  const base = `${d.name} Outage on ${d.dateLabel}`;
  // Start time dated when it falls on an earlier day, so a tail day never
  // claims the service went down at 23:50 on the page's own date.
  return d.ongoing
    ? `${base}: Down Since ${startLabel(d.ongoing, d.dayStart)}`
    : `${base}: Down ${formatDuration(d.totalMs, true)}`;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, date } = await params;
  const d = await loadOutageDay(slug, date);
  if (!d) return { title: "Outage Not Found" };

  const title = titleFor(d);
  const description = `${shortSummary(d)}. Exact timeline, HTTP status and error, measured independently by exit1.dev.`;
  const url = `https://exit1.dev${outagePath(d.monitor.slug, d.dayKey)}`;

  return {
    title,
    description,
    // A blip or a page without enough history is thin: crawlable, not indexed.
    ...(d.indexable ? {} : { robots: { index: false, follow: true } }),
    openGraph: { title, description, type: "article", url },
    // Explicit, or X falls back to the root layout's default card.
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: url },
  };
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <InsetCard className="p-5 sm:p-6">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 text-3xl sm:text-4xl font-bold tabular-nums">{value}</div>
    </InsetCard>
  );
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
      <dt className="w-32 shrink-0 text-muted-foreground">{label}</dt>
      <dd className="min-w-0 break-words text-foreground">{children}</dd>
    </div>
  );
}

function IncidentCard({ incident, index, total }: { incident: PublicIncident; index: number; total: number }) {
  return (
    <InsetCard className="p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2.5">
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${incident.ongoing ? "bg-red-500 animate-pulse" : "bg-red-500"}`}
          aria-hidden="true"
        />
        <h3 className="text-base font-semibold">
          {total > 1 ? `Outage ${index + 1} of ${total}` : "Outage"}
          {incident.ongoing && <span className="ml-2 text-sm font-medium text-red-500">ongoing</span>}
        </h3>
      </div>
      <dl className="space-y-2.5 text-sm">
        <Fact label="Started">{formatUtc(incident.startedAt)}</Fact>
        <Fact label="Ended">{incident.ongoing ? "Ongoing" : formatUtc(incidentEnd(incident))}</Fact>
        <Fact label="Duration">
          {formatDuration(incident.durationMs)}
          {incident.ongoing && " so far"}
        </Fact>
        <Fact label="What failed">
          {incident.error && incident.error.startsWith(incidentFailure(incident)) ? (
            // The backend's error text often already leads with "HTTP 503".
            <span className="font-medium">{incident.error}</span>
          ) : (
            <>
              <span className="font-medium">{incidentFailure(incident)}</span>
              {incident.error && <span className="text-foreground/70">: {incident.error}</span>}
            </>
          )}
        </Fact>
        <Fact label="Regions">
          {incident.confirmedFromTwoRegions ? "Confirmed from two regions" : "Seen from one region"}
        </Fact>
      </dl>
    </InsetCard>
  );
}

function DayLink({ slug, dayKey, direction }: { slug: string; dayKey: string; direction: "prev" | "next" }) {
  const label = formatUtcDate(parseUtcDayKey(dayKey)!);
  return (
    <Link
      href={outagePath(slug, dayKey)}
      className={`group flex cursor-pointer flex-col gap-1 interactive ${direction === "next" ? "items-end text-right" : ""}`}
    >
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {direction === "prev" && <ArrowLeft className="h-3.5 w-3.5" />}
        {direction === "prev" ? "Previous outage" : "Next outage"}
        {direction === "next" && <ArrowRight className="h-3.5 w-3.5" />}
      </span>
      <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">{label}</span>
    </Link>
  );
}

export default async function OutageDayPage({ params }: { params: Params }) {
  const { slug, date } = await params;
  const d = await loadOutageDay(slug, date);
  if (!d) notFound();

  const { monitor, name } = d;
  const canonical = `https://exit1.dev${outagePath(monitor.slug, d.dayKey)}`;
  const lead = leadSentence(d);
  // loadOutageDay only keeps an incident ongoing while the monitor is down now.
  const isDownNow = d.ongoing != null;

  const articleStructuredData = {
    headline: `${name} outage on ${d.dateLabel}`,
    description: lead,
    datePublished: new Date(d.incidents[0].startedAt).toISOString(),
    dateModified: new Date(lastFactAt(d)).toISOString(),
    author: { "@type": "Organization", "@id": ORG_ID, name: "exit1.dev", url: "https://exit1.dev" },
    publisher: { "@id": ORG_ID },
    about: { "@type": "WebSite", name, url: monitor.url },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    image: {
      "@type": "ImageObject",
      url: `${canonical}/opengraph-image`,
      width: 1200,
      height: 630,
    },
  };

  return (
    <>
      <StructuredData type="Article" data={articleStructuredData} />
      <PageShell>
        <main>
          <PageContainer>
            <PageHero
              size="lg"
              breadcrumb={
                <Breadcrumbs
                  items={[
                    { name: "Status", href: "/status" },
                    { name, href: `/status/${monitor.slug}` },
                    { name: `Outage ${d.dateLabel}`, href: outagePath(monitor.slug, d.dayKey) },
                  ]}
                />
              }
            >
              <div className="mb-5 flex items-center gap-2.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
                <span className="text-sm font-medium text-foreground/80">
                  {d.ongoing ? "Outage in progress" : "Outage resolved"}
                </span>
                <span className="text-sm text-muted-foreground">· {formatDuration(d.totalMs)} of downtime that day</span>
              </div>

              <div className="mb-6 flex items-center gap-4">
                <BrandLogo host={monitor.host} name={name} size={56} className="rounded-lg" />
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                  {name} outage on {d.dateLabel}
                </h1>
              </div>

              <p className="max-w-3xl text-lg sm:text-xl leading-relaxed text-foreground/85">{lead}</p>

              <FollowCTA slug={monitor.slug} name={name} host={monitor.host} placement="hero" isDown={isDownNow} />

              <Link
                href={`/status/${monitor.slug}`}
                className="mt-6 inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors interactive"
              >
                Live {name} status
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </PageHero>

            <PageSection className="py-12 sm:py-16">
              <SectionContent size="lg">
                {/* No "uptime that day": the daily summary comes from sparse history
                    and can read 82% next to 10 minutes of confirmed downtime. */}
                <div className="grid grid-cols-2">
                  <Stat label="Downtime that day" value={formatDuration(d.totalMs)} />
                  <Stat label="Outages" value={String(d.incidents.length)} />
                </div>

                <div className="mt-10">
                  <h2 className="mb-1 text-lg font-semibold">Timeline</h2>
                  <p className="mb-5 text-sm text-muted-foreground">
                    Every outage exit1.dev recorded for {monitor.host} on {d.dateLabel}. Times are UTC.
                  </p>
                  <div className="space-y-4">
                    {d.incidents.map((i, idx) => (
                      <IncidentCard key={i.id} incident={i} index={idx} total={d.incidents.length} />
                    ))}
                  </div>
                </div>

                {(d.prevKey || d.nextKey) && (
                  <nav aria-label="Other outages" className="mt-12 flex items-start justify-between gap-6">
                    <div>{d.prevKey && <DayLink slug={monitor.slug} dayKey={d.prevKey} direction="prev" />}</div>
                    <div>{d.nextKey && <DayLink slug={monitor.slug} dayKey={d.nextKey} direction="next" />}</div>
                  </nav>
                )}

                <div className="mt-12">
                  <h2 className="mb-1 text-lg font-semibold">How exit1.dev measured this</h2>
                  <p className="max-w-3xl text-sm leading-relaxed text-foreground/80">
                    exit1.dev checks {monitor.host} every few minutes from its own monitoring regions. It
                    marks the service down once a failure is confirmed and back up once a check succeeds
                    again, so the times above are those confirmed transitions. Brief blips and firewall
                    blocks are left out. These are exit1.dev&apos;s measurements. {name} has not published
                    them and may report the incident differently.
                  </p>
                </div>

                <FollowCTA slug={monitor.slug} name={name} host={monitor.host} placement="inline" isDown={isDownNow} />

                <div className="mt-12">
                  <Link
                    href={`/status/${monitor.slug}`}
                    className="group inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors interactive"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {name} status and 90-day history
                  </Link>
                </div>
              </SectionContent>
            </PageSection>
          </PageContainer>
        </main>
      </PageShell>
    </>
  );
}
