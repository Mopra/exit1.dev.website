import { Metadata } from "next";
import StructuredData from "@/components/StructuredData";
import DomainCheckerTool from "./DomainCheckerTool";
import {
  PageShell,
  PageContainer,
  PageSection,
  SectionContent,
} from "@/components/PageLayout";
import { PageHero } from "@/components/PageHero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Free Domain Expiration Checker Tool — Check Domain Expiry Instantly | exit1.dev",
  description:
    "Free domain expiration checker tool. Instantly check any domain's expiry date, registrar, nameservers, and registration details. No signup required.",
  keywords:
    "free domain checker, domain expiration checker, domain expiry checker, check domain expiration, domain whois lookup, domain age checker, domain registration checker, whois lookup tool, domain name checker, domain expiry date",
  openGraph: {
    title: "Free Domain Expiration Checker Tool — Check Domain Expiry Instantly | exit1.dev",
    description:
      "Free domain expiration checker tool. Instantly check any domain's expiry date, registrar, nameservers, and registration details. No signup required.",
    type: "website",
    url: "https://exit1.dev/tools/domain-expiration-checker",
  },
  twitter: {
    title: "Free Domain Expiration Checker Tool — Check Domain Expiry Instantly | exit1.dev",
    description:
      "Free domain expiration checker tool. Instantly check any domain's expiry date, registrar, nameservers, and registration details. No signup required.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://exit1.dev/tools/domain-expiration-checker",
  },
};

const faq = [
  {
    question: "What does this domain expiration checker do?",
    answer:
      "This tool queries RDAP and WHOIS databases to retrieve your domain's registration details. It shows you the expiry date, days until expiry, registrar, nameservers, creation date, and registry status codes — all in real time.",
  },
  {
    question: "Is this domain checker free?",
    answer:
      "Yes, completely free with no signup required. Just enter a domain and check instantly. There are no daily limits.",
  },
  {
    question: "What happens when a domain expires?",
    answer:
      "When a domain expires, it typically goes through several stages: a grace period (usually 30-45 days) where the owner can still renew at regular price, a redemption period (30 days) where renewal is possible but at a premium, and finally deletion where the domain becomes available for anyone to register. During expiry, your website and email will stop working.",
  },
  {
    question: "How often should I check my domain expiration?",
    answer:
      "You should check at least monthly, especially if auto-renewal isn't enabled. For critical business domains, continuous monitoring is recommended. exit1.dev offers automated domain expiration monitoring that alerts you 30, 14, 7, and 1 day before expiry.",
  },
  {
    question: "What is RDAP and how is it different from WHOIS?",
    answer:
      "RDAP (Registration Data Access Protocol) is the modern replacement for WHOIS. It returns structured JSON data, supports HTTPS, and has better internationalization. This tool uses RDAP as the primary lookup method and falls back to WHOIS for registries that don't yet support RDAP.",
  },
  {
    question: "What are EPP status codes?",
    answer:
      "EPP (Extensible Provisioning Protocol) status codes indicate the current state of a domain. Common codes include 'clientTransferProhibited' (transfer locked), 'clientDeleteProhibited' (deletion locked), and 'ok' (no restrictions). These codes help you understand what actions are currently allowed on the domain.",
  },
  {
    question: "Why can't I find information for my domain?",
    answer:
      "Some registries have rate limits or don't expose all data publicly. Country-code TLDs (like .de, .fr) may have stricter privacy policies. If a lookup fails, try again after a minute. For some TLDs, only basic information like expiry date and nameservers may be available.",
  },
  {
    question: "Can I monitor my domain expiration automatically?",
    answer:
      "Yes! exit1.dev includes automatic domain expiration monitoring. You'll receive alerts at configurable thresholds before your domains expire — so you never miss a renewal. It's available on all paid plans.",
  },
];

export default function DomainExpirationCheckerPage() {
  return (
    <>
      <StructuredData
        type="WebPage"
        data={{
          name: "Free Domain Expiration Checker Tool",
          description:
            "Free domain expiration checker tool to instantly verify any domain's expiry date, registrar, nameservers, and registration details.",
          url: "https://exit1.dev/tools/domain-expiration-checker",
          publisher: {
            "@type": "Organization",
            name: "exit1.dev",
            url: "https://exit1.dev",
          },
        }}
      />
      <StructuredData
        type="FAQPage"
        data={{
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }}
      />

      <PageShell>
        <PageContainer>
          <PageHero size="lg">
            <div className="text-center">
              <p className="text-sm font-mono text-primary mb-4 tracking-wide uppercase">
                Free Tool
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Domain Expiration Checker
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Instantly check any domain&apos;s expiry date, registrar,
                nameservers, and registration details. Free, no signup required.
              </p>
            </div>
          </PageHero>

          {/* Tool Section */}
          <PageSection>
            <SectionContent size="md" className="py-12 sm:py-16">
              <DomainCheckerTool />
            </SectionContent>
          </PageSection>

          {/* How It Works */}
          <PageSection>
            <SectionContent size="md" className="py-16 sm:py-20">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
                How It Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold text-lg">1</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Enter Domain</h3>
                  <p className="text-sm text-muted-foreground">
                    Type any domain name or URL. We&apos;ll extract the
                    registrable domain automatically.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold text-lg">2</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    We Query the Registry
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Our server queries RDAP and WHOIS databases to retrieve the
                    full domain registration record.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold text-lg">3</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    See the Results
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    View expiry date, registrar, nameservers, registration age,
                    and status codes instantly.
                  </p>
                </div>
              </div>
            </SectionContent>
          </PageSection>

          {/* FAQ Section */}
          <PageSection>
            <SectionContent size="md" className="py-16 sm:py-20">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
                Frequently Asked Questions
              </h2>
              <div className="max-w-3xl mx-auto">
                <Accordion type="single" collapsible className="w-full">
                  {faq.map((item, i) => (
                    <AccordionItem
                      key={i}
                      value={`faq-${i}`}
                      className="border-primary/10"
                    >
                      <AccordionTrigger className="text-left text-base hover:text-primary hover:no-underline">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </SectionContent>
          </PageSection>

          {/* CTA to full monitoring */}
          <PageSection>
            <SectionContent size="md" className="py-16 sm:py-20">
              <div className="text-center bg-primary/5 border border-primary/10 rounded-2xl p-8 sm:p-12">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  Need Continuous Domain Monitoring?
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                  Stop checking manually. exit1.dev monitors your domain
                  expirations automatically and alerts you before they lapse.
                  Never lose a domain again.
                </p>
                <a
                  href="https://app.exit1.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full px-8 py-3 text-base font-semibold bg-white text-black hover:bg-white/90 transition-all duration-200"
                >
                  Start Free Monitoring
                </a>
              </div>
            </SectionContent>
          </PageSection>
        </PageContainer>
      </PageShell>
    </>
  );
}
