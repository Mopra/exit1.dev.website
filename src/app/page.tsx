import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { LazyVideo } from "@/components/LazyVideo";

// Dark theme tokens mirrored from the app (exit1.dev/src/style.css .dark block).
// Scoped to this page only via an inline style on the root wrapper so the rest
// of the marketing site keeps its current light theme during the redesign.
const appDarkTheme: React.CSSProperties & Record<string, string> = {
  "--background": "#15151B",
  "--foreground": "oklch(0.9851 0 0)",
  "--card": "oklch(0.235 0.014 285)",
  "--card-foreground": "oklch(0.9851 0 0)",
  "--popover": "oklch(0.155 0.014 285)",
  "--popover-foreground": "oklch(0.9851 0 0)",
  "--primary": "oklch(0.5854 0.1022 167.0051)",
  "--primary-foreground": "oklch(0 0 0)",
  "--secondary": "oklch(0.235 0.014 285)",
  "--secondary-foreground": "oklch(0.9851 0 0)",
  "--muted": "oklch(0.278 0.014 285)",
  "--muted-foreground": "oklch(0.7090 0 0)",
  "--accent": "oklch(0.3715 0 0)",
  "--accent-foreground": "oklch(0.9851 0 0)",
  "--success": "oklch(0.78 0.17 152)",
  "--success-foreground": "oklch(0 0 0)",
  "--warning": "oklch(0.85 0.16 80)",
  "--warning-foreground": "oklch(0 0 0)",
  "--destructive": "oklch(0.7036 0.1881 22.1462)",
  "--destructive-foreground": "oklch(0.9851 0 0)",
  "--border": "oklch(0.2768 0 0)",
  "--input": "oklch(0.3250 0 0)",
  "--ring": "oklch(0.5854 0.1022 167.0051)",
};

export default function HomePage() {
  return (
    <div
      style={appDarkTheme}
      className="min-h-screen bg-background text-foreground"
    >
      {/* Hero */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            Monitor everything.
            <br />
            Miss nothing.
          </h1>
          <p className="text-xl sm:text-2xl text-foreground/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            Check every site, storefront, and API — down to every 15 seconds.
            Instant alerts, SSL coverage. No bait-and-switch.
          </p>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-12">
            {[
              "Up to 1,000 monitors",
              "15-second checks",
              "MCP / AI access",
              "SSL & domain monitoring",
            ].map((item) => (
              <span
                key={item}
                className="flex items-center gap-2 text-sm sm:text-base text-foreground/80"
              >
                <Check className="w-5 h-5 text-success shrink-0" />
                {item}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 py-6 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <a
                href="https://app.exit1.dev/sign-up"
                target="_blank"
                rel="noopener noreferrer"
              >
                Start Monitoring
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8 py-6 text-lg font-semibold bg-transparent text-foreground border-border hover:bg-muted hover:text-foreground"
            >
              <Link href="/getting-started">See how it works</Link>
            </Button>
          </div>
        </div>

        {/* Video — the centerpiece. Card surface uses the app's elevation
            language (bg-card, border, shadow-2xl) instead of decorative glows. */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-2xl">
            <div className="aspect-video w-full">
              <LazyVideo
                src="/adding-checks.mp4"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
