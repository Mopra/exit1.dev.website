import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Eyebrow } from './Eyebrow';
import { Reveal } from './Reveal';
import {
  formatUptime,
  getAllPublicMonitors,
  isIndexEntryMature,
  makeComparator,
  statusPresentation,
  uptimeColorClass,
} from '@/lib/publicMonitors';
import { cn } from '@/lib/utils';

const dotTone = {
  up: 'bg-emerald-500',
  down: 'bg-red-500',
  muted: 'bg-foreground/30',
} as const;

const FEATURED = 9;
const MIN_TO_SHOW = 6;

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

  // Highest uptime first — show our best, capped to a tidy grid.
  const featured = [...monitors].sort(makeComparator('uptime-desc')).slice(0, FEATURED);

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
              const { label, tone } = statusPresentation(m.status);
              return (
                <li key={m.slug}>
                  <Link
                    href={`/status/${m.slug}`}
                    aria-label={`${m.host}: ${label}, ${formatUptime(m.uptime30d)} 30-day uptime`}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-border/60 px-4 py-3.5 transition-colors hover:border-foreground/30 hover:bg-foreground/[0.02] interactive"
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span
                        className={cn('h-2 w-2 shrink-0 rounded-full', dotTone[tone])}
                        aria-hidden="true"
                      />
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
