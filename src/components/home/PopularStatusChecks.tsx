import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Eyebrow } from './Eyebrow';
import { Reveal } from './Reveal';
import {
  formatUptime,
  getAllPublicMonitors,
  isIndexEntryMature,
  makeComparator,
  statusGradientClass,
  statusPresentation,
  uptimeColorClass,
} from '@/lib/publicMonitors';
import { cn } from '@/lib/utils';
import { BrandLogo } from '@/components/status/BrandLogo';

const FEATURED = 9;
const MIN_TO_SHOW = 6;

/**
 * Curated brands for the homepage proof grid — recognizable names across our
 * three core audiences (developers, agencies, store owners), so the wall reads
 * as "tools you already depend on" rather than a random sample. Matched by host
 * against the live public-monitor index; anything not public or not yet mature
 * is simply skipped, and if too few are live we fall back to the global
 * highest-uptime set so the section never goes sparse.
 */
const HOMEPAGE_FEATURED_HOSTS = new Set<string>([
  // Developer infra & tooling
  'github.com',
  'cloudflare.com',
  'vercel.com',
  'stripe.com',
  'openai.com',
  'anthropic.com',
  'supabase.com',
  'docker.com',
  'npmjs.com',
  'sentry.io',
  'mongodb.com',
  'figma.com',
  'linear.app',
  // Agencies & site builders
  'webflow.com',
  'wordpress.com',
  'semrush.com',
  'ahrefs.com',
  'notion.so',
  'sanity.io',
  'contentful.com',
  // Store owners / commerce
  'shopify.com',
  'woocommerce.com',
  'squarespace.com',
  'wix.com',
]);

/**
 * Living proof beat. Turns the static logo wall above into something real: the
 * actual uptime we measure for tools people know, in public. Reinforces the
 * green/red signal motif and seeds internal links into the /status section from
 * the highest-authority page on the site.
 *
 * Async server component — fetches the curated index (ISR-cached) and renders
 * nothing if there isn't a healthy set of mature pages yet, so the homepage
 * never shows a sparse module.
 */
export async function PopularStatusChecks() {
  const monitors = (await getAllPublicMonitors()).filter(isIndexEntryMature);

  if (monitors.length < MIN_TO_SHOW) return null;

  // Prefer the curated audience-relevant brands; fall back to the full set if
  // too few of them are live so the section never goes sparse.
  const curated = monitors.filter((m) => HOMEPAGE_FEATURED_HOSTS.has(m.host));
  const pool = curated.length >= MIN_TO_SHOW ? curated : monitors;

  // Highest uptime first — show our best, capped to a tidy grid.
  const featured = [...pool].sort(makeComparator('uptime-desc')).slice(0, FEATURED);

  return (
    <section
      aria-label="Live status of popular sites and APIs"
      className="px-4 sm:px-6 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal className="flex justify-center">
          <Eyebrow dot>Monitoring in public</Eyebrow>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="mx-auto mt-6 max-w-2xl text-center text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
            The uptime we measure, in the open
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-5 max-w-xl text-center text-base leading-relaxed text-muted-foreground sm:text-lg">
            Live status and 90-day uptime for tools you already depend on —
            independently measured, not self-reported.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <ul className="mt-12 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((m) => {
              const { label } = statusPresentation(m.status);
              return (
                <li key={m.slug}>
                  <Link
                    href={`/status/${m.slug}`}
                    aria-label={`${m.host}: ${label}, ${formatUptime(m.uptime30d)} 30-day uptime`}
                    className={cn(
                      'group flex items-center justify-between gap-3 rounded-xl border border-border/60 px-4 py-3.5 transition-colors hover:border-foreground/30 hover:bg-foreground/[0.02] interactive',
                      statusGradientClass(m.status),
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <BrandLogo host={m.host} name={m.name} size={28} />
                      <span className="truncate text-sm font-medium text-foreground">
                        {m.host}
                      </span>
                    </span>
                    <span className={cn('shrink-0 text-sm tabular-nums', uptimeColorClass(m.uptime30d))}>
                      {formatUptime(m.uptime30d)}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Reveal>

        <Reveal delay={0.2} className="mt-10 flex justify-center">
          <Link
            href="/status"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground interactive"
          >
            See all live status pages
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
