import { Globe } from "@/components/magicui/globe";

export default function AccuracySection() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
             {/* Background Globe */}
       <div className="absolute inset-0 flex items-center justify-center opacity-20">
                   <Globe 
            className="w-[1200px] h-[1200px]" 
          />
       </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-slate-500 to-slate-200 bg-clip-text text-transparent">
            Accuracy, not noise
            <br />
            <span className="bg-gradient-to-r from-slate-400 to-slate-100 bg-clip-text text-transparent">(trust via tech)</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Fewer false alarms. Faster signal. No noisy dashboards screaming about phantom downtime.
          </p>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mt-4">
            We triangulate every incident across regions, confirm failures before we shout, and give you logs and analytics that make a postmortem take minutes instead of afternoons. The <a href="/analytics" className="underline decoration-dotted underline-offset-4 hover:text-primary transition-colors">Analytics</a> and <a href="/logs" className="underline decoration-dotted underline-offset-4 hover:text-primary transition-colors">Logs</a> pages show exactly what happened.
          </p>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-start gap-3 justify-center">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-muted-foreground">Consecutive failure confirmation before we fire an alert (flap suppression requiring N consecutive failures).</p>
              </div>
              <div className="flex items-start gap-3 justify-center">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-muted-foreground">Smart retry logic with exponential backoff for domain lookups (for RDAP requests) plus JSON body validation so APIs don&apos;t fake a 200.</p>
              </div>
              <div className="flex items-start gap-3 justify-center">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-muted-foreground">Email and webhook throttling so you get the signal once, not 40 copies. Bring your own <a href="/alerting" className="text-foreground underline decoration-dotted underline-offset-4 hover:text-primary transition-colors">Alerting</a> workflow and keep your PagerDuty sanity intact.</p>
              </div>
              <div className="flex items-start gap-3 justify-center">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-muted-foreground">Zero-config monitoring — no agents, tags, or complex setup required. Deploy it faster than you can explain another vendor&apos;s pricing bundle.</p>
              </div>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-500/10 rounded-full border border-blue-500/20 backdrop-blur-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Smart detection, not spam. Start with the <a href="/real-time-monitoring" className="underline decoration-dotted underline-offset-4 hover:text-primary transition-colors">real-time uptime monitor</a>.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
