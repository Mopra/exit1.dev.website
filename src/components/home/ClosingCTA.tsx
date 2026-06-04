import Link from 'next/link';
import { OnlineBadge } from '@/components/OnlineBadge';
import { Reveal } from './Reveal';

/**
 * Closing bookend. The line leads; below it sits a single badge-styled pill —
 * same glowing treatment as the "Online" badge, but it simply reads
 * "Start Monitoring" and links to sign-up. No separate button, no icon,
 * nothing above the headline: one calm, confident close in a single green key.
 */
export function ClosingCTA() {
  return (
    <section className="relative overflow-hidden px-4 py-32 sm:px-6 sm:py-44">
      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Your sites are online.
            <br />
            Until they aren&rsquo;t.
          </h2>
        </Reveal>

        <Reveal delay={0.05}>
          <p className="mt-5 text-lg text-muted-foreground">
            Start monitoring in under a minute. No credit card — 10 monitors free.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12 flex justify-center">
          <Link
            href="https://app.exit1.dev/sign-up"
            aria-label="Start monitoring"
            className="group relative inline-flex cursor-pointer items-center justify-center rounded-full outline-none transition-transform duration-300 hover:scale-[1.04] focus-visible:ring-2 focus-visible:ring-[#22F0B5] focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          >
            {/* Glow anchored behind the badge — its own halo extended into the scene. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[16rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(34,240,181,0.10)] blur-[80px]"
            />
            <OnlineBadge
              hovered={false}
              label="Start Monitoring"
              icon={null}
              className="relative text-2xl sm:text-3xl lg:text-4xl"
            />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
