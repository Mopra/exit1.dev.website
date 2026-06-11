import { Eyebrow } from './Eyebrow';
import { Reveal } from './Reveal';
import { LazyVideo } from './LazyVideo';

/**
 * The headline differentiator, told as one big number. exit1 checks down to
 * 15 seconds while most monitors stop at 30 — a calm, Apple-style stat moment.
 */
export function Speed() {
  return (
    <section className="px-4 sm:px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="grid items-center gap-12 md:grid-cols-12 md:gap-10">
          <Reveal className="md:col-span-5">
            <div className="relative overflow-hidden rounded-xl">
              <LazyVideo
                className="block h-auto w-full"
                width={1080}
                height={1080}
                poster="/exit1-data-stream-line.jpg"
                sources={[
                  { src: '/exit1-data-stream-line.webm', type: 'video/webm' },
                  { src: '/exit1-data-stream-line.mp4', type: 'video/mp4' },
                ]}
              />
              {/* Fade the lower half so the number stays legible over the stream */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-center p-5 sm:p-6"
              >
                <span className="flex items-baseline gap-1 leading-none">
                  <span className="text-7xl font-medium tracking-tight text-foreground drop-shadow-[0_2px_24px_rgba(0,0,0,0.7)] sm:text-8xl">
                    15
                  </span>
                  <span className="text-3xl font-medium tracking-tight text-primary sm:text-4xl">
                    s
                  </span>
                </span>
              </div>
            </div>
          </Reveal>

          <div className="md:col-span-6 md:col-start-7">
            <Reveal>
              <Eyebrow>Check frequency</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
                The fastest checks in monitoring.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Most tools check once a minute. exit1 goes down to{' '}
                <span className="font-medium text-primary">every 15 seconds</span> — so
                you catch incidents up to four times sooner, with four times the detail
                in every chart.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8 max-w-xs space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2.5 text-sm text-foreground">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    exit1.dev
                  </span>
                  <span className="font-mono text-sm text-foreground">15s</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                    Most monitors
                  </span>
                  <span className="font-mono text-sm text-muted-foreground/70">1m</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
