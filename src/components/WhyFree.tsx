import { Badge } from "@/components/ui/badge";

export default function WhyFree() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-slate-500 to-slate-200 bg-clip-text text-transparent">
            Why it&apos;s free
            <br />
            <span className="bg-gradient-to-r from-slate-400 to-slate-100 bg-clip-text text-transparent">(and stays free)</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Uptime is table stakes. You shouldn&apos;t have to swipe a card or babysit a &ldquo;starter&rdquo; tier to know when your shop faceplants. We run a lean, boring stack—no VC, no ads, no tracking—so the free uptime monitor and free website monitor stay wide open.
          </p>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mt-4">
            Unlimited sites, 1-minute checks, SSL and domain coverage, webhook and email alerts. That&apos;s the core. No trial clock, no throttled &ldquo;lite&rdquo; experience. We built this to protect our own launches, and we refuse to play the upsell circus.
          </p>
        </div>

        {/* Main content grid */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Our Promise */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Your data isn&apos;t the product</h3>
                <Badge variant="outline" className="mt-1">Our Promise</Badge>
              </div>
            </div>
            
            <div className="space-y-4 pl-11">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-muted-foreground">No dark patterns, no bait-and-switch. We don&apos;t sandbag free uptime monitoring with &ldquo;upgrade for alerts&rdquo; fine print.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-muted-foreground">Abuse gets blocked; everyone else keeps the free ride. Ship real projects, not scraping scripts, and you&apos;re welcome.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-muted-foreground">Simple, transparent pricing with no hidden costs. Pay only if you want concierge support or custom retention.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-muted-foreground">Need deeper proof? Read the <a href="/free-uptime-monitor" className="text-foreground underline decoration-dotted underline-offset-4 hover:text-primary transition-colors">Free Uptime Monitor</a> manifesto and see where the bodies are buried.</p>
              </div>
            </div>
          </div>

          {/* Our Story */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Built for ourselves first</h3>
                <Badge variant="outline" className="mt-1">Our Story</Badge>
              </div>
            </div>
            
            <div className="space-y-4 pl-11">
              <p className="text-muted-foreground leading-relaxed">
                We built exit1.dev because the &ldquo;free&rdquo; competition couldn&apos;t keep a side project online without nagging us to upgrade. So we rolled our own uptime, SSL, domain, and log stack on boring infrastructure we control.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                If it helps you too, great. If someday there&apos;s a tip jar, toss a coin if you feel like it—monitoring stays free. We&apos;d rather earn trust than invoice.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Want a full tour of the website monitoring playbook? The <a href="/free-website-monitor" className="text-foreground underline decoration-dotted underline-offset-4 hover:text-primary transition-colors">Free Website Monitor</a> page spells out how we keep storefronts and landing pages awake without charging for oxygen.
              </p>
            </div>
          </div>
        </div>

        {/* Comparison */}
        <div className="mt-16">
          <div className="max-w-5xl mx-auto bg-card/60 border border-primary/20 rounded-2xl backdrop-blur-md p-6 sm:p-10 shadow-xl">
            <h3 className="text-2xl sm:text-3xl font-semibold text-center mb-6">Why even bother with the others?</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="text-muted-foreground uppercase tracking-wide text-xs">
                    <th className="pb-3">Feature</th>
                    <th className="pb-3">exit1.dev</th>
                    <th className="pb-3">UptimeRobot / Pingdom / StatusCake</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/10">
                  <tr>
                    <td className="py-3 font-medium">Unlimited monitors</td>
                    <td className="py-3 text-green-400">Included, forever</td>
                    <td className="py-3">Capped or &ldquo;business&rdquo; plan only</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium">1-minute checks</td>
                    <td className="py-3 text-green-400">Default</td>
                    <td className="py-3">Paywall or throttled</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium">Webhook + email alerts</td>
                    <td className="py-3 text-green-400">Free tier</td>
                    <td className="py-3">Upgrade required</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium">Full log &amp; analytics export</td>
                    <td className="py-3 text-green-400">Open access</td>
                    <td className="py-3">Pay or pray</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium">Privacy-first</td>
                    <td className="py-3 text-green-400">No trackers, no ads</td>
                    <td className="py-3">Third-party scripts everywhere</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-center text-sm sm:text-base text-muted-foreground mt-6">
              Save the time you&apos;d spend comparing pricing grids and set up real monitoring instead. <a href="/getting-started" className="underline decoration-dotted underline-offset-4 hover:text-primary transition-colors">Get the setup guide</a> and stop overpaying for uptime basics.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
