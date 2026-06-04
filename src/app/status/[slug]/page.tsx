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
import {
  getAllPublicMonitors,
  getPublicMonitor,
  statusPresentation,
  formatUptime,
} from "@/lib/publicMonitors";

export const revalidate = 3600;
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

  const uptime = formatUptime(monitor.stats.uptime30d);
  const title = `${monitor.host} Status — Live Uptime & 90-Day History`;
  const description = `Is ${monitor.host} down? Live status, ${uptime} 30-day uptime, response times, and a 90-day incident timeline — monitored by exit1.dev.`;

  return {
    title,
    description,
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

function lastCheckedLabel(ms: number): string {
  if (!ms) return "—";
  const mins = Math.round((Date.now() - ms) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.round(hrs / 24)} d ago`;
}

export default async function MonitorStatusPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const monitor = await getPublicMonitor(slug);

  if (!monitor) {
    notFound();
  }

  const { label, tone } = statusPresentation(monitor.status);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${monitor.host} Status`,
    description: `Live uptime status and 90-day history for ${monitor.host}.`,
    url: `https://exit1.dev/status/${monitor.slug}`,
    isPartOf: {
      "@type": "WebSite",
      name: "exit1.dev",
      url: "https://exit1.dev",
    },
    about: {
      "@type": "WebSite",
      name: monitor.name,
      url: monitor.url,
    },
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Is ${monitor.host} down right now?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `As of the last check (${lastCheckedLabel(monitor.lastChecked)}), ${monitor.host} is ${label.toLowerCase()}. exit1.dev probes it continuously and updates this page automatically.`,
        },
      },
      {
        "@type": "Question",
        name: `What is the uptime of ${monitor.host}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${monitor.host} has ${formatUptime(monitor.stats.uptime30d)} uptime over the last 30 days and ${formatUptime(monitor.stats.uptime90d)} over the last 90 days, according to exit1.dev's monitoring.`,
        },
      },
    ],
  };

  return (
    <>
      <StructuredData type="WebPage" data={structuredData} />
      <StructuredData type="FAQPage" data={faqStructuredData} />
      <PageShell>
        <main>
          <PageContainer>
            <PageHero
              size="lg"
              breadcrumb={
                <Breadcrumbs
                  items={[
                    { name: "Status", href: "/status" },
                    { name: monitor.host, href: `/status/${monitor.slug}` },
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
                {monitor.host} status
              </h1>

              <p className="text-xl sm:text-2xl text-foreground/70 leading-relaxed">
                Live uptime, response times, and a 90-day incident timeline for{" "}
                <span className="text-foreground">{monitor.name}</span>, monitored
                continuously by exit1.dev.
              </p>

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
                  <h2 className="mb-1 text-lg font-semibold">90-day uptime</h2>
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
                    Average daily response time over the monitored window.
                  </p>
                  <InsetCard className="p-5 sm:p-6 text-foreground">
                    <ResponseTimeChart days={monitor.heartbeat} />
                  </InsetCard>
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
