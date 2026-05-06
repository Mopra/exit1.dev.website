import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import SSLCheckerTool from "./SSLCheckerTool";
import {
  PageShell,
  PageContainer,
  PageSection,
  SectionContent,
} from "@/components/PageLayout";
import { ToolPageHero } from "@/components/ToolPageHero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ToolsNav } from "@/components/ToolsNav";

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

const LAST_UPDATED_ISO = "2026-05-04";
const LAST_UPDATED_DISPLAY = "May 4, 2026";

const howToSteps = [
  {
    name: "Enter a domain",
    text: "Type any domain or full URL into the input above. The tool extracts the hostname automatically — both example.com and https://example.com/path work.",
  },
  {
    name: "Run the check",
    text: "Click Check SSL. The server opens a TLS connection to port 443, completes the handshake, and retrieves the full certificate chain.",
  },
  {
    name: "Review the certificate",
    text: "Inspect validity, issuer, expiration, TLS protocol, cipher suite, HSTS, and the full chain from leaf to root CA. The grade summarises overall posture.",
  },
];

const sslErrors = [
  {
    code: "NET::ERR_CERT_DATE_INVALID",
    title: "Certificate expired or not yet valid",
    body: "Either your certificate has passed its validTo date, or your machine's clock is wrong. Run the checker above to see the current expiration; if it is in the future, fix the system clock. If it has expired, renew immediately — browsers block the page.",
  },
  {
    code: "NET::ERR_CERT_AUTHORITY_INVALID",
    title: "Issuer is not trusted",
    body: "The certificate is self-signed, issued by an internal CA, or by a CA the browser does not recognise. The chain check above will show whether the issuer is a public CA. For public sites, use Let's Encrypt or another trusted CA.",
  },
  {
    code: "NET::ERR_CERT_COMMON_NAME_INVALID",
    title: "Hostname does not match the certificate",
    body: "The certificate was issued for a different domain than the one being visited. Check the Subject Alternative Names in the result above — your hostname must appear there (a wildcard like *.example.com only covers one level).",
  },
  {
    code: "ERR_SSL_PROTOCOL_ERROR",
    title: "TLS handshake failed",
    body: "Usually a protocol or cipher mismatch — your server is offering only TLS 1.0/1.1 or weak ciphers the browser refuses. Upgrade to TLS 1.2 or 1.3 and disable legacy ciphers.",
  },
  {
    code: "SEC_ERROR_UNKNOWN_ISSUER",
    title: "Firefox: unknown issuer",
    body: "Firefox's equivalent of authority invalid. Common cause: missing intermediate certificate. Make sure your server sends the full chain (leaf + intermediates), not just the leaf.",
  },
  {
    code: "ERR_CERT_REVOKED",
    title: "Certificate revoked by the CA",
    body: "The CA marked this certificate as revoked, often after a key compromise. You must reissue. Until then the site will be blocked in modern browsers.",
  },
  {
    code: "ERR_SSL_VERSION_OR_CIPHER_MISMATCH",
    title: "No common protocol or cipher",
    body: "Client and server cannot agree on a TLS version or cipher suite. Modern browsers no longer support TLS 1.0/1.1 or RC4, 3DES, and similar legacy ciphers — update your server's TLS configuration.",
  },
];

const glossary = [
  {
    term: "TLS vs SSL",
    body: "SSL is the original protocol; it was renamed to TLS at version 3.1 (which became TLS 1.0). Everyone still says SSL, but every modern certificate is technically a TLS certificate. TLS 1.2 and 1.3 are the only versions you should use today.",
  },
  {
    term: "DV, OV, EV",
    body: "Domain Validated proves you control the domain (Let's Encrypt is DV). Organization Validated additionally verifies the legal entity. Extended Validation requires the strictest vetting and used to show a green address bar — modern browsers no longer differentiate visually.",
  },
  {
    term: "HSTS",
    body: "HTTP Strict Transport Security tells browsers to refuse HTTP for your domain — even on the first visit if you are on the preload list. Eliminates downgrade attacks and the brief window before a redirect to HTTPS.",
  },
  {
    term: "Certificate chain",
    body: "Browsers only trust a small set of root CAs. Your leaf certificate is signed by an intermediate, which is signed by a root. The server must send leaf + intermediates so the browser can complete the chain to a trusted root.",
  },
  {
    term: "Cipher suite",
    body: "The combination of algorithms used for the connection — key exchange, authentication, bulk encryption, and MAC. TLS 1.3 simplified this to a small set of strong, modern suites; TLS 1.2 still has many legacy options to avoid.",
  },
  {
    term: "Subject Alternative Name (SAN)",
    body: "The list of hostnames a certificate is valid for. Modern browsers ignore the legacy Common Name field — only the SAN list matters. A wildcard SAN like *.example.com covers one level (api.example.com but not v1.api.example.com).",
  },
];

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
          dateModified: LAST_UPDATED_ISO,
          publisher: {
            "@type": "Organization",
            name: "exit1.dev",
            url: "https://exit1.dev",
          },
        }}
      />
      <StructuredData
        type="SoftwareApplication"
        data={{
          name: "Free SSL Checker",
          applicationCategory: "SecurityApplication",
          operatingSystem: "Web",
          url: "https://exit1.dev/tools/ssl-checker",
          description:
            "Free online SSL/TLS certificate checker. Inspects the full certificate chain, expiration, TLS version, cipher suite, HSTS, and trust status for any public hostname.",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          publisher: {
            "@type": "Organization",
            name: "exit1.dev",
            url: "https://exit1.dev",
          },
        }}
      />
      <StructuredData
        type="HowTo"
        data={{
          name: "How to check an SSL certificate online",
          description:
            "Use the exit1.dev SSL checker to inspect any website's TLS certificate, expiration, chain, and security posture in seconds.",
          step: howToSteps.map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.name,
            text: s.text,
          })),
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
          <ToolPageHero
            toolName="SSL Checker"
            href="/tools/ssl-checker"
            title="SSL Certificate Checker"
            description="Instantly check any website&apos;s SSL certificate. See expiration dates, issuer details, TLS version, and more. Free, no signup required."
          />

          {/* Tools Navigation */}
          <PageSection>
            <SectionContent size="md" className="py-6">
              <ToolsNav current="/tools/ssl-checker" />
            </SectionContent>
          </PageSection>

          {/* Tool Section */}
          <PageSection>
            <SectionContent size="md" className="py-12 sm:py-16">
              <Suspense fallback={null}>
                <SSLCheckerTool />
              </Suspense>
            </SectionContent>
          </PageSection>

          {/* Example Result — static, crawlable by Google */}
          <PageSection>
            <SectionContent size="md" className="py-16 sm:py-20">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                What You Get
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
                Here&apos;s an example of the SSL certificate details this tool
                reveals. Try it above with any domain.
              </p>
              <div className="bg-foreground/[0.02] border border-foreground/10 rounded-xl p-6 sm:p-8" aria-label="Example SSL check result">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-foreground/10">
                  <div className="w-8 h-8 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center text-xs font-bold text-success">
                    A
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-success">SSL Certificate Valid</p>
                    <p className="text-xs text-muted-foreground">example.com — Expires in 82 days</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                  <div className="flex justify-between py-2 border-b border-foreground/5">
                    <span className="text-xs text-muted-foreground">Subject</span>
                    <span className="text-sm font-medium">*.example.com</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-foreground/5">
                    <span className="text-xs text-muted-foreground">Issuer</span>
                    <span className="text-sm font-medium">Let&apos;s Encrypt R3</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-foreground/5">
                    <span className="text-xs text-muted-foreground">TLS Protocol</span>
                    <span className="text-sm font-medium">TLSv1.3</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-foreground/5">
                    <span className="text-xs text-muted-foreground">Key Size</span>
                    <span className="text-sm font-medium">2048 bits</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-foreground/5">
                    <span className="text-xs text-muted-foreground">Valid From</span>
                    <span className="text-sm font-medium">Jan 15, 2026</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-foreground/5">
                    <span className="text-xs text-muted-foreground">Valid Until</span>
                    <span className="text-sm font-medium">Apr 15, 2026</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-foreground/5">
                    <span className="text-xs text-muted-foreground">Browser Trusted</span>
                    <span className="text-sm font-medium text-success">Yes</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-foreground/5">
                    <span className="text-xs text-muted-foreground">HSTS Enabled</span>
                    <span className="text-sm font-medium text-success">Yes</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 space-y-4 text-sm text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                <p>
                  The SSL grade is calculated from your TLS protocol version, key
                  strength, and certificate validity. A grade of <strong className="text-foreground">A</strong> means
                  the site uses TLS 1.3 with a strong key and the certificate is
                  not close to expiring. Lower grades indicate outdated protocols
                  like TLS 1.0 or 1.1, weak key sizes, or certificates nearing
                  expiration.
                </p>
                <p>
                  The checker also verifies whether the certificate is trusted by
                  browsers, confirms the domain name matches the certificate
                  subject, and inspects the full certificate chain from the server
                  certificate through intermediates to the root CA. HSTS
                  (HTTP Strict Transport Security) is checked to ensure browsers
                  are forced to use HTTPS, preventing downgrade attacks.
                </p>
              </div>
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

          {/* SSL/TLS Glossary */}
          <PageSection>
            <SectionContent size="md" className="py-16 sm:py-20">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                SSL &amp; TLS Glossary
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
                Plain-language definitions of the terms that show up in any SSL check result.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {glossary.map((item) => (
                  <div
                    key={item.term}
                    id={`glossary-${item.term.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`}
                    className="p-5 rounded-xl border border-foreground/10 bg-foreground/[0.02]"
                  >
                    <h3 className="font-semibold mb-1.5">{item.term}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                  </div>
                ))}
              </div>
            </SectionContent>
          </PageSection>

          {/* Common SSL Errors */}
          <PageSection>
            <SectionContent size="md" className="py-16 sm:py-20">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                Common SSL Certificate Errors
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
                The errors browsers actually throw, what causes them, and how to diagnose with the checker above.
              </p>
              <div className="space-y-4 max-w-3xl mx-auto">
                {sslErrors.map((err) => (
                  <div
                    key={err.code}
                    id={`error-${err.code.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`}
                    className="p-5 rounded-xl border border-foreground/10 bg-foreground/[0.02]"
                  >
                    <code className="inline-block text-xs font-mono px-2 py-1 rounded-md bg-destructive/10 border border-destructive/20 text-destructive mb-3">
                      {err.code}
                    </code>
                    <h3 className="font-semibold mb-2">{err.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{err.body}</p>
                  </div>
                ))}
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

          {/* Related Articles */}
          <PageSection>
            <SectionContent size="md" className="py-16 sm:py-20">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                Learn More About SSL Certificates
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
                Guides and best practices for managing SSL certificates and keeping your sites secure.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <Link href="/blog/how-to-check-ssl-certificate" className="group block p-6 rounded-xl border border-foreground/10 hover:border-primary/30 transition-colors">
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">How to Check an SSL Certificate</h3>
                  <p className="text-sm text-muted-foreground">Complete guide to verifying SSL certificates using browsers, command line, and online tools.</p>
                </Link>
                <Link href="/blog/ssl-certificate-errors-explained" className="group block p-6 rounded-xl border border-foreground/10 hover:border-primary/30 transition-colors">
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">SSL Certificate Errors Explained</h3>
                  <p className="text-sm text-muted-foreground">Every SSL error your browser can throw — what causes it and how to fix it fast.</p>
                </Link>
                <Link href="/blog/free-ssl-certificate-monitoring" className="group block p-6 rounded-xl border border-foreground/10 hover:border-primary/30 transition-colors">
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Free SSL Certificate Monitoring</h3>
                  <p className="text-sm text-muted-foreground">Set up automated SSL monitoring with alerts before your certificates expire.</p>
                </Link>
                <Link href="/blog/ssl-certificate-expiration-other-deadline" className="group block p-6 rounded-xl border border-foreground/10 hover:border-primary/30 transition-colors">
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">SSL Expiration: The Other Deadline</h3>
                  <p className="text-sm text-muted-foreground">Why SSL certificate expiry deserves the same attention as domain expiration.</p>
                </Link>
              </div>
            </SectionContent>
          </PageSection>

          {/* Trust & freshness */}
          <PageSection>
            <SectionContent size="md" className="py-6">
              <p className="text-center text-xs text-muted-foreground">
                Last updated{" "}
                <time dateTime={LAST_UPDATED_ISO}>{LAST_UPDATED_DISPLAY}</time>{" "}
                · Built and maintained by{" "}
                <Link href="/" className="underline underline-offset-2 hover:text-foreground transition-colors">
                  exit1.dev
                </Link>
                {" "}— uptime, SSL, and domain monitoring with instant alerts.
              </p>
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
                  10 free monitors. Unlimited with Nano.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="rounded-full px-8 text-base font-semibold"
                >
                  <a
                    href="https://app.exit1.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Start Free Monitoring
                  </a>
                </Button>
              </div>
            </SectionContent>
          </PageSection>
        </PageContainer>
      </PageShell>
    </>
  );
}
