import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { PageContainer, PageSection, PageShell, SectionContent } from "@/components/PageLayout";

export default function NewHomePage() {
  return (
    <PageShell>
      <PageContainer>
        <PageSection id="hero" className="pt-36 pb-20">
          <SectionContent className="p-8 sm:p-12 text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              Monitor everything.
              <br />
              Miss Nothing.
            </h1>
            <p className="text-xl sm:text-2xl text-foreground/70 mb-10 max-w-2xl mx-auto leading-relaxed">
              Check every site, storefront, and API — down to every 15 seconds. Instant alerts, SSL coverage. No bait-and-switch.
            </p>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-14">
              {[
                "Up to 1,000 monitors",
                "15-second checks",
                "MCP / AI access",
                "SSL & domain monitoring",
              ].map((item) => (
                <span key={item} className="flex items-center gap-2 text-sm sm:text-base text-foreground/80">
                  <Check className="w-5 h-5 text-success shrink-0" />
                  {item}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 py-6 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
              >
                <a href="https://app.exit1.dev/sign-up" target="_blank" rel="noopener noreferrer">
                  Start Monitoring
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 py-6 text-lg font-semibold text-primary border-primary/20 bg-primary/[0.04] shadow-sm backdrop-blur-md hover:bg-primary/[0.08] hover:border-primary/30 cursor-pointer"
              >
                <Link href="/getting-started">
                  See How It Works
                </Link>
              </Button>
            </div>
          </SectionContent>
        </PageSection>
      </PageContainer>
    </PageShell>
  );
}
