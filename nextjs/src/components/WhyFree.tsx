import { Badge } from "@/components/ui/badge";

export default function WhyFree() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
                     <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-slate-500 to-slate-200 bg-clip-text text-transparent">
             Why it's free
             <br />
             <span className="bg-gradient-to-r from-slate-400 to-slate-100 bg-clip-text text-transparent">(and stays free)</span>
           </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Uptime is basic hygiene. We run a lean, boring stack—no VC, no ads, no tracking. 
            The core is free forever: unlimited sites, 1-minute checks, SSL checks, email alerts.
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
                <h3 className="text-xl font-semibold">Your data isn't the product</h3>
                <Badge variant="outline" className="mt-1">Our Promise</Badge>
              </div>
            </div>
            
            <div className="space-y-4 pl-11">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-muted-foreground">No dark patterns, no bait-and-switch</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-muted-foreground">Abuse gets blocked; everyone else keeps the free ride</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-muted-foreground">Simple, transparent pricing with no hidden costs</p>
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
                 We built exit1.dev for ourselves first. If it helps you too, great. 
                 We'll keep shipping the good, simple stuff. 
               </p>
               <p className="text-muted-foreground leading-relaxed">
                If there's a tip jar someday, toss a coin if you like—monitoring stays free.
               </p>
             </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-500/10 rounded-full border border-green-500/20">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700 dark:text-green-400">Core features free forever</span>
          </div>
        </div>
      </div>
    </section>
  );
}
