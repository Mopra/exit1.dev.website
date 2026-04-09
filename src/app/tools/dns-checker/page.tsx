import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import DnsCheckerTool from "./DnsCheckerTool";
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
import { ToolsNav } from "@/components/ToolsNav";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title:
    "Free DNS Lookup Tool — Check All DNS Records Instantly | exit1.dev",
  description:
    "Free DNS lookup tool. Check A, AAAA, MX, NS, TXT, SOA, CAA, and CNAME records for any domain. Analyze email security (SPF & DMARC) and get a DNS health grade. No signup required.",
  keywords:
    "free dns lookup, dns checker, check dns records, dns lookup tool, mx record checker, spf record checker, dmarc checker, dns health check, nslookup online, dns record lookup, caa record check, nameserver lookup",
  openGraph: {
    title:
      "Free DNS Lookup Tool — Check All DNS Records Instantly | exit1.dev",
    description:
      "Free DNS lookup tool. Check A, AAAA, MX, NS, TXT, SOA, CAA, and CNAME records for any domain. Analyze email security and get a DNS health grade. No signup required.",
    type: "website",
    url: "https://exit1.dev/tools/dns-checker",
  },
  twitter: {
    title:
      "Free DNS Lookup Tool — Check All DNS Records Instantly | exit1.dev",
    description:
      "Free DNS lookup tool. Check A, AAAA, MX, NS, TXT, SOA, CAA, and CNAME records for any domain. Analyze email security and get a DNS health grade. No signup required.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://exit1.dev/tools/dns-checker",
  },
};

const faq = [
  {
    question: "What does this DNS lookup tool do?",
    answer:
      "This tool queries DNS servers to retrieve all DNS records for a domain. It shows A (IPv4), AAAA (IPv6), CNAME, MX (mail), NS (nameservers), TXT, SOA (start of authority), and CAA records. It also analyzes your email security configuration (SPF and DMARC) and gives your DNS setup a health grade.",
  },
  {
    question: "Is this DNS checker free?",
    answer:
      "Yes, completely free with no signup required. Enter any domain and get instant results. There are no daily limits.",
  },
  {
    question: "What are the different DNS record types?",
    answer:
      "A records map a domain to an IPv4 address. AAAA records map to IPv6. CNAME creates an alias pointing to another domain. MX records specify mail servers and their priority. NS records define the authoritative nameservers for the domain. TXT records hold text data often used for email authentication (SPF, DKIM, DMARC). SOA contains zone authority information like the primary nameserver and admin contact. CAA restricts which certificate authorities can issue SSL certificates for the domain.",
  },
  {
    question: "What is the DNS health grade based on?",
    answer:
      "The grade evaluates your DNS configuration across several criteria: whether you have A/AAAA records for availability, multiple nameservers for redundancy, MX records for email delivery, SPF and DMARC records for email security, CAA records for certificate security, and a proper SOA record. An A+ grade means your DNS is well-configured across all categories.",
  },
  {
    question: "What are SPF and DMARC?",
    answer:
      "SPF (Sender Policy Framework) is a TXT record that specifies which mail servers are authorized to send email for your domain, helping prevent spoofing. DMARC (Domain-based Message Authentication, Reporting & Conformance) builds on SPF and DKIM to tell receiving servers what to do with unauthenticated emails. Both are essential for protecting your domain from email impersonation and improving deliverability.",
  },
  {
    question: "What are CAA records and why do they matter?",
    answer:
      "CAA (Certificate Authority Authorization) records specify which certificate authorities (CAs) are allowed to issue SSL/TLS certificates for your domain. Without CAA records, any CA can issue a certificate, increasing the risk of unauthorized certificate issuance. Adding CAA records is a simple but effective security measure.",
  },
  {
    question: "Why might my DNS records look different from what I expect?",
    answer:
      "DNS records can vary depending on which DNS resolver you query, due to caching and propagation delays. After making DNS changes, it can take anywhere from minutes to 48 hours for changes to propagate globally, depending on the record's TTL (Time To Live). This tool queries from the server's perspective, which may differ from your local resolver.",
  },
  {
    question: "Can I monitor my DNS continuously?",
    answer:
      "Yes! exit1.dev is rolling out continuous DNS monitoring. You can track DNS record changes, get alerts when records change unexpectedly, and monitor DNS resolution health around the clock — catching misconfigurations and hijacking attempts before they affect your users.",
  },
];

export default function DnsCheckerPage() {
  return (
    <>
      <StructuredData
        type="WebPage"
        data={{
          name: "Free DNS Lookup Tool",
          description:
            "Free DNS lookup tool to check all DNS records for any domain — A, AAAA, MX, NS, TXT, SOA, CAA, CNAME — with email security analysis and DNS health grading.",
          url: "https://exit1.dev/tools/dns-checker",
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
          <PageHero size="lg" breadcrumb={
            <Breadcrumbs
              items={[
                { name: "Tools", href: "/tools" },
                { name: "DNS Checker", href: "/tools/dns-checker" },
              ]}
            />
          }>
            <div className="text-center">
              <p className="text-sm font-mono text-primary mb-4 tracking-wide uppercase">
                Free Tool
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                DNS Lookup Tool
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Look up all DNS records for any domain — A, AAAA, MX, NS, TXT,
                SOA, CAA, and CNAME. Analyze email security and get a DNS health
                grade. Free, no signup required.
              </p>
            </div>
          </PageHero>

          {/* Tools Navigation */}
          <PageSection>
            <SectionContent size="md" className="py-6">
              <ToolsNav current="/tools/dns-checker" />
            </SectionContent>
          </PageSection>

          {/* Tool Section */}
          <PageSection>
            <SectionContent size="md" className="py-12 sm:py-16">
              <Suspense>
                <DnsCheckerTool />
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
                Here&apos;s an example of the DNS records this tool reveals. Try
                it above with any domain.
              </p>
              <div
                className="bg-white/[0.02] border border-white/10 rounded-xl p-6 sm:p-8"
                aria-label="Example DNS lookup result"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-400">
                    A
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-400">
                      DNS Health: A
                    </p>
                    <p className="text-xs text-muted-foreground">
                      example.com — 14 records found in 42ms
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-muted-foreground">
                      A Record
                    </span>
                    <span className="text-sm font-medium font-mono">
                      93.184.216.34
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-muted-foreground">
                      AAAA Record
                    </span>
                    <span className="text-sm font-medium font-mono">
                      2606:2800:21f:...
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-muted-foreground">
                      Nameservers
                    </span>
                    <span className="text-sm font-medium">
                      a.iana-servers.net
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-muted-foreground">
                      MX Records
                    </span>
                    <span className="text-sm font-medium">
                      10 mail.example.com
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-muted-foreground">SPF</span>
                    <span className="text-sm font-medium text-emerald-400">
                      Found
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-muted-foreground">
                      DMARC
                    </span>
                    <span className="text-sm font-medium text-emerald-400">
                      Found
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-8 space-y-4 text-sm text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                <p>
                  The DNS lookup queries authoritative nameservers to retrieve
                  every record type configured for your domain. You&apos;ll see{" "}
                  <strong className="text-white">A and AAAA records</strong>{" "}
                  (your domain&apos;s IP addresses with TTL values),{" "}
                  <strong className="text-white">
                    nameservers and SOA data
                  </strong>{" "}
                  (who manages your DNS zone), and{" "}
                  <strong className="text-white">MX records</strong> (where your
                  email is routed).
                </p>
                <p>
                  The tool also performs an{" "}
                  <strong className="text-white">
                    email security analysis
                  </strong>
                  , checking for SPF and DMARC records that protect your domain
                  from email spoofing and impersonation. Combined with{" "}
                  <strong className="text-white">CAA record checks</strong>{" "}
                  (which restrict certificate issuance), this gives you a
                  comprehensive picture of your domain&apos;s DNS health.
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
                    and look up its DNS records.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold text-lg">2</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    We Query DNS Servers
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Our server resolves all record types in parallel — A, AAAA,
                    MX, NS, TXT, SOA, CAA, and CNAME — plus DMARC.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold text-lg">3</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    Get Your DNS Report
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    View every record, email security analysis, and an overall
                    health grade. Copy, download, or share results instantly.
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

          {/* Related Articles */}
          <PageSection>
            <SectionContent size="md" className="py-16 sm:py-20">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                Learn More About DNS
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
                Guides on DNS record types, email authentication, propagation,
                and domain security.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <Link
                  href="/blog/dns-record-types-explained"
                  className="group block p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-colors"
                >
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    DNS Record Types Explained
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    A, AAAA, MX, CNAME, TXT, NS, SOA, CAA — what every record
                    type does and when you need it.
                  </p>
                </Link>
                <Link
                  href="/blog/spf-dkim-dmarc-email-authentication-guide"
                  className="group block p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-colors"
                >
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    SPF, DKIM, and DMARC Guide
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Protect your domain from email spoofing with three DNS
                    records. Step-by-step setup guide.
                  </p>
                </Link>
                <Link
                  href="/blog/how-to-check-dns-records"
                  className="group block p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-colors"
                >
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    How to Check DNS Records
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Three free methods to look up DNS records for any domain —
                    web tools, command line, and more.
                  </p>
                </Link>
                <Link
                  href="/blog/dns-propagation-how-long-do-changes-take"
                  className="group block p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-colors"
                >
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    DNS Propagation Explained
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Why DNS changes take time, how TTL and caching work, and how
                    to speed up propagation.
                  </p>
                </Link>
              </div>
            </SectionContent>
          </PageSection>

          {/* CTA to full monitoring */}
          <PageSection>
            <SectionContent size="md" className="py-16 sm:py-20">
              <div className="text-center bg-primary/5 border border-primary/10 rounded-2xl p-8 sm:p-12">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  Need Continuous DNS Monitoring?
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                  Stop checking manually. exit1.dev monitors your DNS records
                  around the clock and alerts you when something changes. Catch
                  misconfigurations and hijacking attempts before they affect
                  your users.
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
