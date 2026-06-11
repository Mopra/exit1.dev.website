import { Eyebrow } from './Eyebrow';
import { Reveal } from './Reveal';

type Capability = {
  n: string;
  title: string;
  body: string;
  meta?: string[];
};

const CAPABILITIES: Capability[] = [
  {
    n: '01',
    title: 'Every protocol your stack speaks.',
    body: 'HTTP and HTTPS endpoints, raw TCP and UDP ports, WebSocket handshakes, and ICMP ping — one monitor type for each layer your product actually runs on.',
    meta: ['HTTP/S', 'TCP', 'UDP', 'WebSocket', 'ICMP'],
  },
  {
    n: '02',
    title: 'Watched from both sides of the Atlantic.',
    body: 'Probes can run from both the US and EU, so a regional outage looks like a regional outage — not a false alarm from a single vantage point.',
    meta: ['US', 'EU', 'Multi-region'],
  },
  {
    n: '03',
    title: 'Domains, fully accounted for.',
    body: 'SSL certificate expiry, WHOIS registrar data, and DNS records tracked alongside your uptime — so a renewal never surprises you at 2am.',
    meta: ['SSL', 'WHOIS', 'DNS'],
  },
  {
    n: '04',
    title: 'A status page without the design ticket.',
    body: 'Drag-and-drop builder, real-time updates, uptime history, and your own domain. Show customers you are up in a few minutes, not a sprint.',
    meta: ['Real-time', 'Custom domain', 'Uptime history'],
  },
];

/**
 * The breadth moment, done calmly: a few large editorial rows separated by
 * hairlines, left-aligned to break the centered column that runs above it.
 */
export function Capabilities() {
  return (
    <section className="px-4 sm:px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>Capabilities</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
              One quiet pane for everything you depend on.
            </h2>
          </Reveal>
        </div>

        <div className="mt-14 space-y-12 sm:mt-16 lg:space-y-16">
          {CAPABILITIES.map((cap, i) => (
            <Reveal key={cap.n} delay={i * 0.04}>
              <div className="grid gap-6 md:grid-cols-12 md:gap-10">
                <div className="md:col-span-5">
                  <span className="font-mono text-sm text-muted-foreground">
                    {cap.n}
                  </span>
                  <h3 className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">
                    {cap.title}
                  </h3>
                </div>
                <div className="md:col-span-6 md:col-start-7">
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    {cap.body}
                  </p>
                  {cap.meta && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {cap.meta.map((m) => (
                        <span
                          key={m}
                          className="rounded-full bg-white/[0.05] px-3 py-1 font-mono text-xs text-muted-foreground"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
