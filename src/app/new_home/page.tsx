import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { PageContainer, PageSection, PageShell, SectionContent } from "@/components/PageLayout";

type CarouselItem = { src: string; alt: string } | { label: string };

const carouselItems: CarouselItem[] = [
  { src: "/integrations/datadog.svg", alt: "Datadog" },
  { label: "Acme Co" },
  { src: "/integrations/github.svg", alt: "GitHub" },
  { src: "/integrations/gitlab.svg", alt: "GitLab" },
  { label: "Contoso" },
  { src: "/integrations/jira.svg", alt: "Jira" },
  { src: "/integrations/linear.svg", alt: "Linear" },
  { label: "Fabrikam" },
  { src: "/integrations/notion.svg", alt: "Notion" },
  { src: "/integrations/opsgenie.svg", alt: "Opsgenie" },
  { label: "Northwind" },
  { src: "/integrations/pagerduty.svg", alt: "PagerDuty" },
  { src: "/integrations/splunk.svg", alt: "Splunk" },
  { label: "Lumen" },
  { src: "/integrations/teams.svg", alt: "Microsoft Teams" },
  { src: "/integrations/telegram.svg", alt: "Telegram" },
  { label: "Vertex" },
  { src: "/integrations/zapier.svg", alt: "Zapier" },
  { src: "/slack.svg", alt: "Slack" },
  { label: "Apex" },
  { src: "/discord.svg", alt: "Discord" },
  { label: "Helio" },
];

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

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
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

            <Image
              src="/exit1-mockup.webp"
              alt="Exit1 dashboard preview"
              width={2400}
              height={1500}
              priority
              className="w-full h-auto rounded-xl [mask-image:linear-gradient(to_bottom,black_15%,transparent_85%)] [-webkit-mask-image:linear-gradient(to_bottom,black_15%,transparent_85%)]"
            />
          </SectionContent>

          <div className="overflow-hidden w-full">
            <div className="flex w-max animate-marquee">
              {[...carouselItems, ...carouselItems].map((item, i) => (
                <div
                  key={`${"src" in item ? item.alt : item.label}-${i}`}
                  className="flex items-center justify-center shrink-0 w-32 sm:w-40 h-12"
                >
                  {"src" in item ? (
                    <div
                      role="img"
                      aria-label={item.alt}
                      className="h-7 sm:h-8 w-24 sm:w-28 bg-foreground opacity-70 hover:opacity-100 transition-opacity"
                      style={{
                        maskImage: `url(${item.src})`,
                        WebkitMaskImage: `url(${item.src})`,
                        maskRepeat: "no-repeat",
                        WebkitMaskRepeat: "no-repeat",
                        maskPosition: "center",
                        WebkitMaskPosition: "center",
                        maskSize: "contain",
                        WebkitMaskSize: "contain",
                      }}
                    />
                  ) : (
                    <span className="text-base sm:text-lg font-bold uppercase tracking-wider opacity-70 hover:opacity-100 transition-opacity whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </PageSection>
      </PageContainer>
    </PageShell>
  );
}
