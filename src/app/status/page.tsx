import Link from "next/link";
import { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { InsetCard } from "@/components/InsetCard";
import { PageHero } from "@/components/PageHero";
import { PageContainer, PageSection, PageShell, SectionContent } from "@/components/PageLayout";
import {
  getAllPublicMonitors,
  statusPresentation,
  formatUptime,
} from "@/lib/publicMonitors";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Live Status & Uptime of Popular Sites",
  description:
    "Real-time status and 90-day uptime history for popular websites and APIs, monitored continuously by exit1.dev. Check if a site is down right now.",
  alternates: { canonical: "https://exit1.dev/status" },
  openGraph: {
    title: "Live Status & Uptime of Popular Sites — exit1.dev",
    description:
      "Real-time status and 90-day uptime history for popular websites and APIs, monitored by exit1.dev.",
    type: "website",
    url: "https://exit1.dev/status",
  },
};

const dotTone: Record<"up" | "down" | "muted", string> = {
  up: "bg-emerald-500",
  down: "bg-red-500",
  muted: "bg-foreground/30",
};

export default async function StatusHubPage() {
  const monitors = await getAllPublicMonitors();

  return (
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
              Real-time status and 90-day uptime history for {monitors.length > 0 ? monitors.length : "hundreds of"} popular
              sites and APIs — monitored continuously by exit1.dev.
            </p>
          </PageHero>

          <PageSection className="py-12 sm:py-16">
            <SectionContent size="lg">
              {monitors.length === 0 ? (
                <p className="text-muted-foreground">No public monitors are available yet. Check back soon.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {monitors.map((m) => {
                    const { label, tone } = statusPresentation(m.status);
                    return (
                      <Link key={m.slug} href={`/status/${m.slug}`} className="group block cursor-pointer">
                        <InsetCard className="h-full p-5 transition-colors group-hover:bg-foreground/[0.03]">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${dotTone[tone]}`} />
                              <span className="truncate font-medium">{m.host}</span>
                            </div>
                            <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                              {formatUptime(m.uptime30d)}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                            <span>{label}</span>
                            <span>30-day uptime</span>
                          </div>
                        </InsetCard>
                      </Link>
                    );
                  })}
                </div>
              )}
            </SectionContent>
          </PageSection>
        </PageContainer>
      </main>
    </PageShell>
  );
}
