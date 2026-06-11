import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SectionContent } from "@/components/PageLayout";
import { Eyebrow } from "@/components/home/Eyebrow";
import { Reveal } from "@/components/home/Reveal";
import { StatusDirectory } from "@/components/status/StatusDirectory";
import { FeaturedStatus } from "@/components/status/FeaturedStatus";
import { getCannesEventMonitors, selectCannesFeatured } from "@/lib/cannesEvents";
import { classifyStatus, makeComparator } from "@/lib/publicMonitors";

// Match the public-monitors fetch cache (REVALIDATE_SECONDS): regenerating more
// often than the data refreshes just burns ISR write units on identical output.
export const revalidate = 3600;

const title = "Live Event Status — Monitoring Summit Cannes 2026 | exit1.dev";
const description =
  "Live status and uptime for the industry events at the Monitoring Summit, Cannes 2026 — monitored continuously and independently by exit1.dev.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "https://exit1.dev/cannes-2026/status",
  },
  openGraph: {
    title,
    description,
    type: "website",
    url: "https://exit1.dev/cannes-2026/status",
    siteName: "Exit1.dev",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default async function CannesEventStatusPage() {
  const monitors = await getCannesEventMonitors();
  // Worst-first so any incident leads the SSR'd HTML; the client island
  // re-sorts on demand but defaults to this same order.
  const sorted = [...monitors].sort(makeComparator("worst"));
  // Marquee names, surfaced in a highlighted strip above the full directory.
  const featured = selectCannesFeatured(monitors);

  const counts = { operational: 0, down: 0, degraded: 0, other: 0 };
  for (const m of monitors) counts[classifyStatus(m.status)]++;
  const total = monitors.length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero — full-bleed Cannes photo blended with the brand aurora wash,
          matching the /cannes-2026 landing page. */}
      <section className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <Image
            src="/cannes-lions-hero.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_35%] opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/25 to-background" />
        </div>

        <SectionContent size="lg" className="px-4 py-32 text-center sm:py-44">
          <Reveal>
            <Eyebrow dot className="justify-center text-foreground">
              Live event status
            </Eyebrow>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="mt-3 text-[2.75rem] font-bold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">
              Everyone in the room,
              <br />
              <span className="text-foreground">monitored.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground sm:text-xl">
              Live status and 90-day uptime for the events joining us at the
              Monitoring Summit — measured independently by exit1.dev.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <Link
              href="/cannes-2026"
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors interactive"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to the summit
            </Link>
          </Reveal>
        </SectionContent>
      </section>

      {/* Status board — same functionality as /status, narrowed to the events. */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        {total === 0 ? (
          <Reveal className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              The board is warming up.
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              We&apos;re bringing the attending events online. Check back soon to
              see who&apos;s up — or{" "}
              <Link
                href="https://app.exit1.dev"
                className="font-medium text-foreground hover:underline interactive"
              >
                monitor your own site free
              </Link>
              .
            </p>
          </Reveal>
        ) : (
          <>
            <Reveal>
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
            </Reveal>

            {featured.length > 0 && (
              <Reveal>
                <div className="mb-12">
                  <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    Featured
                  </h2>
                  <FeaturedStatus monitors={featured} />
                </div>
              </Reveal>
            )}

            <StatusDirectory monitors={sorted} showControls={false} />

            <div className="mt-16 max-w-3xl">
              <h2 className="mb-3 text-xl font-semibold">How this board works</h2>
              <p className="text-sm leading-relaxed text-foreground/70">
                Each event above is probed continuously by exit1.dev from multiple
                regions — the status and uptime you see are independent,
                third-party measurements, not self-reported. Pick any event to see
                its live status, uptime percentage, average response time and a
                90-day outage history.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-foreground/70">
                Running an event of your own?{" "}
                <Link
                  href="https://app.exit1.dev"
                  className="inline-flex items-center gap-1 font-medium text-foreground hover:underline interactive"
                >
                  Start monitoring free
                  <ArrowRight className="h-4 w-4" />
                </Link>{" "}
                — 5-minute checks, instant alerts and a public status page of your
                own, no credit card required.
              </p>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
