'use client';

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

export function LogoMarquee() {
  return (
    <section
      aria-label="Tech stack we monitor and integrate with"
      className="relative py-12 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden">
          {/* Edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-24" />

          <div className="logo-marquee group flex w-max items-center gap-12 sm:gap-16">
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                aria-hidden={copy === 1}
                className="flex shrink-0 items-center gap-12 sm:gap-16"
              >
                {LOGOS.map((logo) => (
                  <li key={`${copy}-${logo.label}`} className="shrink-0">
                    <img
                      src={logo.src}
                      alt={copy === 0 ? logo.label : ''}
                      loading="lazy"
                      decoding="async"
                      className="h-7 w-auto select-none opacity-40 grayscale transition-all duration-300 hover:opacity-90 hover:grayscale-0 sm:h-8"
                      draggable={false}
                    />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .logo-marquee {
          animation: logo-marquee-scroll 40s linear infinite;
          will-change: transform;
        }
        .logo-marquee:hover {
          animation-play-state: paused;
        }
        @keyframes logo-marquee-scroll {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            /* Translate by exactly one copy width (half the duplicated track) */
            transform: translate3d(-50%, 0, 0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .logo-marquee {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
