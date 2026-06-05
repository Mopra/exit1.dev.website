import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import { InsetCard } from "@/components/InsetCard";
import { PageHero } from "@/components/PageHero";
import { PageContainer, PageSection, PageShell, SectionContent } from "@/components/PageLayout";
import { UptimeHeartbeat } from "@/components/status/UptimeHeartbeat";
import { UptimeStatCards } from "@/components/status/UptimeStatCards";
import { ResponseTimeChart } from "@/components/status/ResponseTimeChart";
import { StatusAnswer } from "@/components/status/StatusAnswer";
import { IncidentHistory } from "@/components/status/IncidentHistory";
import { StatusFaq } from "@/components/status/StatusFaq";
import { RelatedStatusList } from "@/components/status/RelatedStatusList";
import {
  buildFaqs,
  displayName,
  formatResponse,
  getAllPublicMonitors,
  getPublicMonitor,
  isMonitorPageMature,
  lastCheckedLabel,
  statusPresentation,
  formatUptime,
} from "@/lib/publicMonitors";

export const revalidate = 900;
export const dynamicParams = true;

export async function generateStaticParams() {
  const monitors = await getAllPublicMonitors();
  return monitors.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const monitor = await getPublicMonitor(slug);

  if (!monitor) {
    return { title: "Status Not Found" };
  }

  const name = displayName(monitor);
  const uptime = formatUptime(monitor.stats.uptime30d);
  // Question-form title matches the dominant search intent ("is X down") and
  // wins CTR; "status & uptime" still captures the informational variants.
  const title = `Is ${name} Down? ${name} Status & Uptime`;
  const description = `Is ${name} down right now? Live status, ${uptime} 30-day uptime, response times and a 90-day outage history for ${monitor.host} — independently monitored by exit1.dev.`;

  // Thin-content guard: pages without enough history are crawlable for users but
  // kept out of the index until they mature (links still followed).
  const mature = isMonitorPageMature(monitor);

  return {
    title,
    description,
    ...(mature ? {} : { robots: { index: false, follow: true } }),
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://exit1.dev/status/${monitor.slug}`,
    },
    alternates: {
      canonical: `https://exit1.dev/status/${monitor.slug}`,
    },
  };
}

const dotTone: Record<"up" | "down" | "muted", string> = {
  up: "bg-emerald-500",
  down: "bg-red-500",
  muted: "bg-foreground/30",
};

export default async function MonitorStatusPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [monitor, allMonitors] = await Promise.all([
    getPublicMonitor(slug),
    getAllPublicMonitors(),
  ]);

  if (!monitor) {
    notFound();
  }

  const name = displayName(monitor);
  const { label, tone } = statusPresentation(monitor.status);
  const faqs = buildFaqs(monitor);
  // MonitorPage is a superset of MonitorIndexEntry, so it's a safe fallback.
  const indexEntry = allMonitors.find((m) => m.slug === monitor.slug) ?? monitor;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Is ${name} down? ${name} status & uptime`,
    description: `Live uptime status, response times and 90-day outage history for ${monitor.host}.`,
    url: `https://exit1.dev/status/${monitor.slug}`,
    dateModified: new Date(monitor.updatedAt || monitor.lastChecked || Date.now()).toISOString(),
    isPartOf: {
      "@type": "WebSite",
      name: "exit1.dev",
      url: "https://exit1.dev",
    },
    about: {
      "@type": "WebSite",
      name,
      url: monitor.url,
    },
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  // Dataset schema — the uptime/response-time series is genuinely a dataset, and
  // marking it up makes it eligible for Google Dataset Search and signals these
  // are real, free, measured data (not a thin template). temporalCoverage uses
  // the actual heartbeat window.
  const firstDay = monitor.heartbeat[0]?.day;
  const lastDay = monitor.heartbeat[monitor.heartbeat.length - 1]?.day;
  const datasetStructuredData = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${name} uptime & response time history`,
    description: `Independently measured uptime percentage and response time for ${monitor.host}, recorded continuously by exit1.dev over a rolling 90-day window.`,
    url: `https://exit1.dev/status/${monitor.slug}`,
    isAccessibleForFree: true,
    // CC BY 4.0: data is free to reuse with attribution to exit1.dev. Required by
    // Google's Dataset guidelines (the "Missing field license" Search Console warning).
    license: {
      "@type": "CreativeWork",
      name: "Creative Commons Attribution 4.0",
      url: "https://creativecommons.org/licenses/by/4.0/",
    },
    creator: { "@type": "Organization", name: "exit1.dev", url: "https://exit1.dev" },
    variableMeasured: ["Uptime percentage", "Average response time (ms)"],
    measurementTechnique: "Automated HTTP uptime monitoring",
    dateModified: new Date(monitor.updatedAt || monitor.lastChecked || Date.now()).toISOString(),
    ...(firstDay && lastDay
      ? {
          temporalCoverage: `${new Date(firstDay).toISOString().slice(0, 10)}/${new Date(lastDay).toISOString().slice(0, 10)}`,
        }
      : {}),
  };

  return (
    <>
      <StructuredData type="WebPage" data={structuredData} />
      <StructuredData type="FAQPage" data={faqStructuredData} />
      <StructuredData type="Dataset" data={datasetStructuredData} />
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
                  ]}
                />
              }
            >
              <div className="mb-5 flex items-center gap-2.5">
                <span className={`inline-block h-2.5 w-2.5 rounded-full ${dotTone[tone]}`} />
                <span className="text-sm font-medium text-foreground/80">{label}</span>
                <span className="text-sm text-muted-foreground">
                  · checked {lastCheckedLabel(monitor.lastChecked)}
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
                {name} status
              </h1>

              <StatusAnswer monitor={monitor} />

              <a
                href={monitor.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors interactive"
              >
                {monitor.url}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </PageHero>

            <PageSection className="py-12 sm:py-16">
              <SectionContent size="lg">
                <UptimeStatCards stats={monitor.stats} />

                <div className="mt-10">
                  <h2 className="mb-1 text-lg font-semibold">90-day uptime history</h2>
                  <p className="mb-5 text-sm text-muted-foreground">
                    Each bar is one day. Green = no incidents, red = downtime detected.
                  </p>
                  <InsetCard className="p-5 sm:p-6">
                    <UptimeHeartbeat days={monitor.heartbeat} />
                  </InsetCard>
                </div>

                <div className="mt-10">
                  <h2 className="mb-1 text-lg font-semibold">Response time</h2>
                  <p className="mb-5 text-sm text-muted-foreground">
                    {monitor.stats.avgResponseMs != null ? (
                      <>
                        {name} responds in about{" "}
                        <span className="text-foreground">
                          {formatResponse(monitor.stats.avgResponseMs)}
                        </span>{" "}
                        on average. Daily average response time over the monitored window:
                      </>
                    ) : (
                      <>Average daily response time over the monitored window.</>
                    )}
                  </p>
                  <InsetCard className="p-5 sm:p-6 text-foreground">
                    <ResponseTimeChart days={monitor.heartbeat} />
                  </InsetCard>
                </div>

                <div className="mt-10">
                  <h2 className="mb-1 text-lg font-semibold">Recent outages</h2>
                  <p className="mb-5 text-sm text-muted-foreground">
                    Downtime detected by exit1.dev over the last 90 days.
                  </p>
                  <IncidentHistory monitor={monitor} />
                </div>

                <div className="mt-12">
                  <h2 className="mb-6 text-lg font-semibold">
                    Frequently asked questions about {name}
                  </h2>
                  <StatusFaq faqs={faqs} />
                </div>

                <div className="mt-12">
                  <h2 className="mb-1 text-lg font-semibold">Other monitored services</h2>
                  <p className="mb-5 text-sm text-muted-foreground">
                    Live status and uptime for more popular sites and APIs.
                  </p>
                  <RelatedStatusList current={indexEntry} all={allMonitors} />
                </div>

                <div className="mt-12">
                  <Link href="/status" className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors interactive">
                    <ArrowRight className="h-4 w-4 rotate-180" />
                    All monitored sites
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
