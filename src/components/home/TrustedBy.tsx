'use client';

import { Eyebrow } from './Eyebrow';
import { Reveal } from './Reveal';

type Logo = {
  label: string;
  src: string;
};

const LOGOS: Logo[] = [
  { label: 'Next.js', src: 'https://cdn.simpleicons.org/nextdotjs/ffffff' },
  { label: 'Vercel', src: 'https://cdn.simpleicons.org/vercel/ffffff' },
  { label: 'Cloudflare', src: 'https://cdn.simpleicons.org/cloudflare/ffffff' },
  { label: 'AWS', src: '/aws.svg' },
  { label: 'Stripe', src: 'https://cdn.simpleicons.org/stripe/ffffff' },
  { label: 'GitHub', src: 'https://cdn.simpleicons.org/github/ffffff' },
  { label: 'Firebase', src: 'https://cdn.simpleicons.org/firebase/ffffff' },
  { label: 'Supabase', src: 'https://cdn.simpleicons.org/supabase/ffffff' },
  { label: 'Shopify', src: 'https://cdn.simpleicons.org/shopify/ffffff' },
  { label: 'Slack', src: '/slack.svg' },
  { label: 'Discord', src: 'https://cdn.simpleicons.org/discord/ffffff' },
  { label: 'Linear', src: 'https://cdn.simpleicons.org/linear/ffffff' },
  { label: 'Notion', src: 'https://cdn.simpleicons.org/notion/ffffff' },
  { label: 'Figma', src: 'https://cdn.simpleicons.org/figma/ffffff' },
];

/**
 * Calm proof-of-fit band. Logos drift slowly past on a long loop — present
 * motion without the urgency of the old fast marquee. Pauses on hover and
 * holds still for prefers-reduced-motion.
 */
export function TrustedBy() {
  return (
    <section
      aria-label="Tech stack we monitor and integrate with"
      className="px-4 sm:px-6 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal className="flex justify-center">
          <Eyebrow>Watches the stack you already run</Eyebrow>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="relative mt-12 overflow-hidden sm:mt-14">
            {/* Edge fades */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-28" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-28" />

            <div className="trustedby-marquee flex w-max items-center gap-14 sm:gap-20">
              {[0, 1].map((copy) => (
                <ul
                  key={copy}
                  aria-hidden={copy === 1}
                  className="flex shrink-0 items-center gap-14 sm:gap-20"
                >
                  {LOGOS.map((logo) => (
                    <li key={`${copy}-${logo.label}`} className="shrink-0">
                      <img
                        src={logo.src}
                        alt={copy === 0 ? logo.label : ''}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className="h-7 w-auto select-none opacity-30 grayscale transition-all duration-500 hover:opacity-80 hover:grayscale-0 sm:h-8"
                      />
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <style jsx>{`
        .trustedby-marquee {
          animation: trustedby-scroll 55s linear infinite;
          will-change: transform;
        }
        .trustedby-marquee:hover {
          animation-play-state: paused;
        }
        @keyframes trustedby-scroll {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .trustedby-marquee {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
