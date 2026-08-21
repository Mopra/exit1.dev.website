import type { Metadata } from "next";
import { siteGraph } from "@/lib/siteSchema";
import { HeroBadge } from "@/components/HeroBadge";
import { FeatureCarousel } from "@/components/FeatureCarousel";
import { Speed } from "@/components/home/Speed";
import { TrustedBy } from "@/components/home/TrustedBy";
import { PopularStatusChecks } from "@/components/home/PopularStatusChecks";
import { Capabilities } from "@/components/home/Capabilities";
import { AIReady } from "@/components/home/AIReady";
import { SignalStatement } from "@/components/home/SignalStatement";
import { Integrations } from "@/components/home/Integrations";
import { Testimonials } from "@/components/Testimonials";
import { CommunityProof } from "@/components/home/CommunityProof";
import { ClosingCTA } from "@/components/home/ClosingCTA";
import { HeroCTA } from "@/components/home/HeroCTA";
import { AgentSetupPrompt } from "@/components/home/AgentSetupPrompt";

const title = "Free Uptime Monitor & Website Monitoring — exit1.dev";
const description =
  "Uptime monitoring with checks down to 15 seconds and live probe streaming: watch DNS, connect, TLS and TTFB land in real time. 50 monitors free, no credit card. Paid plans from $3/mo.";

// The homepage previously exported no metadata at all, so it inherited the
// root layout wholesale: no canonical of its own, and `card: "summary"` —
// the small X card. It also had no opengraph-image, falling back to the
// 500x500 logo.
export const metadata: Metadata = {
  title: { absolute: title },
  description,
  openGraph: {
    title,
    description,
    type: "website",
    url: "https://exit1.dev",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  alternates: {
    canonical: "https://exit1.dev",
  },
};

export default function HomePage() {
  return (
    <>
      {/* Site-wide entity graph — Organization, WebSite, founder, product.
          Belongs on the canonical root, not on /about where it used to sit. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteGraph) }}
      />

      <section className="lg:min-h-screen pt-28 lg:pt-[12vh] pb-20 overflow-x-clip">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <h1 className="text-[2.5rem] leading-[1.05] sm:text-6xl sm:leading-[0.95] md:text-7xl lg:text-8xl font-bold tracking-tight">
            Uptime monitoring,
            <br />
            15 seconds at a time.
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg sm:text-xl text-muted-foreground">
            Watch every probe land as it happens, with DNS, connect, TLS and TTFB
            timings on each one.
          </p>

          {/* Carries the claims the sentence above doesn't: speed, scale, price.
              Nothing here restates the subhead, which is what let this drop to
              one line. Same middot rhythm as the reassurance line under the CTA. */}
          <p className="mx-auto mt-6 text-sm sm:text-base text-muted-foreground/80">
            Checks down to 15s · Up to 1,000 monitors · Paid plans from $3/mo
          </p>

          {/* One-line route for devs who'd rather set this up from their editor. */}
          <AgentSetupPrompt />

          {/* Desktop-only decoration. Hovering the badge is the whole effect
              and touch never fires it, so on a phone the hero goes straight
              from the copy to the CTA rather than spending most of a viewport
              on an inert pill and the beam's clearance. */}
          <div className="hidden justify-center lg:mt-40 lg:flex">
            <HeroBadge />
          </div>

          {/* Gap between the hero copy and the CTA. At lg it also has to clear
              the laser's tail, hence the em height read against text-7xl; nudge
              that single value if the beam and the button drift together. */}
          <div aria-hidden className="h-12 sm:h-16 lg:text-7xl lg:h-[7.5em]" />

          <HeroCTA />
        </div>
      </section>

      <FeatureCarousel />
      <Speed />
      <TrustedBy />
      <PopularStatusChecks />
      <Capabilities />
      <AIReady />
      <SignalStatement />
      <Integrations />
      <Testimonials />
      <CommunityProof />
      <ClosingCTA />
    </>
  );
}
