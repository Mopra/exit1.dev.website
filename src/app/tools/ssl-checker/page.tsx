import { Metadata } from "next";
import StructuredData from "@/components/StructuredData";
import SSLCheckerTool from "./SSLCheckerTool";
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
  title: "Free SSL Checker Tool — Check SSL Certificate Instantly | exit1.dev",
  description:
    "Free SSL checker tool. Instantly check any website's SSL certificate status, expiration date, issuer, and security details. No signup required.",
  keywords:
    "free ssl checker, ssl checker tool, ssl certificate checker, check ssl certificate, ssl test, ssl certificate expiration, ssl validation, ssl security check",
  openGraph: {
    title: "Free SSL Checker Tool — Check SSL Certificate Instantly | exit1.dev",
    description:
      "Free SSL checker tool. Instantly check any website's SSL certificate status, expiration date, issuer, and security details. No signup required.",
    type: "website",
    url: "https://exit1.dev/tools/ssl-checker",
  },
  twitter: {
    title: "Free SSL Checker Tool — Check SSL Certificate Instantly | exit1.dev",
    description:
      "Free SSL checker tool. Instantly check any website's SSL certificate status, expiration date, issuer, and security details. No signup required.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://exit1.dev/tools/ssl-checker",
  },
};

const faq = [
  {
    question: "What does this SSL checker do?",
    answer:
      "This tool connects to any website and retrieves its SSL/TLS certificate details. It shows you the certificate validity, issuer, expiration date, days until expiry, TLS protocol version, and fingerprint — all in real time.",
  },
  {
    question: "Is this SSL checker free?",
    answer:
      "Yes, completely free with no signup required. Just enter a domain and check instantly. There are no daily limits.",
  },
  {
    question: "What is an SSL certificate?",
    answer:
      "An SSL (Secure Sockets Layer) certificate is a digital certificate that authenticates a website's identity and enables an encrypted connection. When you see the padlock icon in your browser, that means the site has a valid SSL certificate.",
  },
  {
    question: "How often should I check my SSL certificate?",
    answer:
      "You should check your SSL certificate at least monthly, or whenever you make changes to your server configuration. For continuous monitoring, exit1.dev offers automated SSL monitoring that checks your certificates with every uptime check and alerts you before they expire.",
  },
  {
    question: "What does 'days until expiry' mean?",
    answer:
      "This shows how many days remain before your SSL certificate expires. Most certificates are valid for 90 days (Let's Encrypt) or 1 year. You should renew before expiration to avoid browser security warnings that will scare away your visitors.",
  },
  {
    question: "Why is my SSL certificate showing as invalid?",
    answer:
      "Common reasons include: the certificate has expired, the certificate was issued for a different domain, the certificate chain is incomplete, or the certificate was issued by an untrusted authority. Check the error message for specific details.",
  },
  {
    question: "What TLS versions are secure?",
    answer:
      "TLS 1.2 and TLS 1.3 are considered secure. TLS 1.0 and 1.1 are deprecated and should not be used. TLS 1.3 is the latest version and offers the best security and performance.",
  },
  {
    question: "Can I monitor my SSL certificates automatically?",
    answer:
      "Yes! exit1.dev includes automatic SSL monitoring with every website you monitor. You'll get alerts before certificates expire — no manual checking needed. It's included free with all plans.",
  },
];

export default function SSLCheckerPage() {
  return (
    <>
      <StructuredData
        type="WebPage"
        data={{
          name: "Free SSL Checker Tool",
          description:
            "Free SSL checker tool to instantly verify any website's SSL certificate status, expiration date, issuer, and security details.",
          url: "https://exit1.dev/tools/ssl-checker",
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
                SSL Certificate Checker
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Instantly check any website&apos;s SSL certificate. See
                expiration dates, issuer details, TLS version, and more. Free, no signup required.
              </p>
            </div>
          </PageHero>

          {/* Tool Section */}
          <PageSection>
            <SectionContent size="md" className="py-12 sm:py-16">
              <SSLCheckerTool />
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
                    Type any domain name or URL. We&apos;ll extract the hostname
                    automatically.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold text-lg">2</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    We Check the Certificate
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Our server connects via TLS and retrieves the full SSL
                    certificate chain.
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
                    View certificate validity, issuer, expiration, TLS protocol,
                    and fingerprint instantly.
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
                  Need Continuous SSL Monitoring?
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                  Stop checking manually. exit1.dev monitors your SSL
                  certificates automatically and alerts you before they expire.
                  Free for unlimited websites.
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
