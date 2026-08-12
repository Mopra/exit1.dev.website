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
  "Know before your customers do. Free uptime monitoring for websites, APIs and services with instant alerts, SSL and domain expiry tracking, and public status pages. 50 monitors free, no credit card. Faster checks from $3/mo.";

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
            Your sites are online.
            <br />
            Until they aren’t.
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg sm:text-xl text-muted-foreground">
            Know before your customers do. Get an alert the second something breaks.
          </p>

          {/* One-line route for devs who'd rather set this up from their editor. */}
          <AgentSetupPrompt />

          <div className="mt-20 lg:mt-40 flex justify-center">
            <HeroBadge />
          </div>

          {/* Spacer scales with the badge font-size so the CTA always lands
              below the laser's tail. Nudge this single value if the gap drifts. */}
          <div aria-hidden className="text-5xl sm:text-6xl lg:text-7xl h-[7.5em]" />

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
