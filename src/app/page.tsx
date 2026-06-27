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

export default function HomePage() {
  return (
    <>
      <section className="lg:min-h-screen pt-40 lg:pt-[20vh] pb-20 overflow-x-clip">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <h1 className="text-[2.5rem] leading-[1.05] sm:text-6xl sm:leading-[0.95] md:text-7xl lg:text-8xl font-bold tracking-tight">
            Your sites are online.
            <br />
            Until they aren’t.
          </h1>

          <div className="mt-20 lg:mt-40 flex justify-center">
            <HeroBadge />
          </div>

          {/* Spacer scales with the badge font-size so the CTA always lands
              below the laser's tail. Nudge this single value if the gap drifts. */}
          <div aria-hidden className="text-5xl sm:text-6xl lg:text-7xl h-[5.5em]" />

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
