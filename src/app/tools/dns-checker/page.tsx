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

const LAST_UPDATED_ISO = "2026-05-04";
const LAST_UPDATED_DISPLAY = "May 4, 2026";

const howToSteps = [
  {
    name: "Enter a domain",
    text: "Type any domain or full URL — example.com or https://example.com/path. The tool extracts the registrable hostname for you.",
  },
  {
    name: "Run the lookup",
    text: "Our server queries authoritative nameservers for every standard record type in parallel — A, AAAA, CNAME, MX, NS, TXT, SOA, CAA, plus the _dmarc subdomain.",
  },
  {
    name: "Inspect the report",
    text: "See every record, an email-security analysis (SPF + DMARC), a CAA check, and an overall DNS health grade. Copy, share, or download the report.",
  },
];

const dnsIssues = [
  {
    code: "NXDOMAIN",
    title: "Non-existent domain",
    body: "The DNS resolver returned NXDOMAIN — the domain has no record at all. Either the domain is unregistered, the nameservers do not know it, or the apex record is missing. Confirm the domain is spelled correctly and the registrar's nameservers match what is configured at the registry.",
  },
  {
    code: "SERVFAIL",
    title: "Server failure",
    body: "The authoritative nameserver could not produce an answer — usually a DNSSEC validation failure, an unreachable upstream, or a misconfigured zone. Re-check zone data and DNSSEC signing if you have it enabled.",
  },
  {
    code: "No MX record",
    title: "Domain cannot receive email",
    body: "Without MX records, mail servers fall back to the A record (or refuse delivery entirely). If the domain should receive email, add MX records pointing at your mail provider with appropriate priorities (10, 20, ...).",
  },
  {
    code: "Missing SPF",
    title: "Anyone can spoof email from your domain",
    body: "An SPF TXT record (v=spf1 ...) tells receivers which servers are allowed to send mail as you. Without it, your domain is trivial to spoof in phishing campaigns and your legitimate mail is more likely to land in spam.",
  },
  {
    code: "Missing DMARC",
    title: "No policy for failed authentication",
    body: "DMARC tells receiving servers what to do with email that fails SPF or DKIM checks (reject, quarantine, or none). A _dmarc TXT record with at least p=none gives you reporting; p=quarantine or p=reject actually stops spoofing.",
  },
  {
    code: "Missing CAA",
    title: "Any CA can issue a certificate for your domain",
    body: "CAA records restrict which certificate authorities can issue SSL/TLS certificates for your domain. Without CAA, a misissuance attack against any trusted CA can produce a valid cert for your domain. Adding 'CAA 0 issue \"letsencrypt.org\"' (or your CA of choice) closes that gap.",
  },
  {
    code: "Single nameserver",
    title: "No DNS redundancy",
    body: "Best practice is at least two nameservers, ideally on different networks. A single NS is a single point of failure — when it goes down, your entire domain becomes unreachable.",
  },
];

const glossary = [
  {
    term: "A vs AAAA",
    body: "A records map a hostname to an IPv4 address (4 bytes, e.g. 93.184.216.34). AAAA records map to IPv6 (16 bytes). Modern domains should publish both — IPv6 traffic is now significant on every major network.",
  },
  {
    term: "CNAME",
    body: "An alias that points one hostname at another hostname (not an IP). The resolver follows the chain until it finds an A or AAAA. CNAMEs cannot coexist with most other record types at the same name and cannot live at the apex (use ALIAS or ANAME at the apex).",
  },
  {
    term: "MX",
    body: "Mail exchanger records — where email for the domain should be delivered. Each record has a priority (lower = preferred) and a target hostname. The target must itself resolve to an A/AAAA — never to a CNAME.",
  },
  {
    term: "TXT, SPF, DKIM, DMARC",
    body: "TXT records hold arbitrary text. Email authentication uses three of them: SPF (v=spf1 ...) lists allowed sending servers, DKIM publishes a public key for signing outgoing mail, and DMARC (_dmarc subdomain) tells receivers what to do when SPF or DKIM fails.",
  },
  {
    term: "NS and SOA",
    body: "NS records list the authoritative nameservers for the zone. SOA (Start of Authority) holds zone metadata — primary nameserver, admin email, serial number, and refresh/retry timers used by secondary nameservers.",
  },
  {
    term: "CAA",
    body: "Certificate Authority Authorization. Restricts which CAs are allowed to issue certificates for the domain. Without a CAA record, any public CA can issue. With one, only the listed CAs can — a cheap and effective defense against misissuance.",
  },
  {
    term: "TTL (Time To Live)",
    body: "How long resolvers may cache a record before re-querying. Low TTL (60s) makes changes propagate fast but increases DNS load. High TTL (24h) reduces load but means changes take longer to take effect. Lower TTLs before planned migrations.",
  },
];

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
          name: "Free DNS Lookup Tool",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Web",
          url: "https://exit1.dev/tools/dns-checker",
          description:
            "Free online DNS lookup tool. Resolves A, AAAA, CNAME, MX, NS, TXT, SOA, CAA records, plus SPF and DMARC checks, with an overall DNS health grade.",
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
          name: "How to look up DNS records for any domain",
          description:
            "Use the exit1.dev DNS checker to retrieve every record type and analyze email security in seconds.",
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
            toolName="DNS Checker"
            href="/tools/dns-checker"
            title="DNS Lookup Tool"
            description="Look up all DNS records for any domain - A, AAAA, MX, NS, TXT, SOA, CAA, and CNAME. Analyze email security and get a DNS health grade. Free, no signup required."
          />

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
                className="bg-foreground/[0.02] border border-foreground/10 rounded-xl p-6 sm:p-8"
                aria-label="Example DNS lookup result"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-foreground/10">
                  <div className="w-8 h-8 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center text-xs font-bold text-success">
                    A
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-success">
                      DNS Health: A
                    </p>
                    <p className="text-xs text-muted-foreground">
                      example.com — 14 records found in 42ms
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                  <div className="flex justify-between py-2 border-b border-foreground/5">
                    <span className="text-xs text-muted-foreground">
                      A Record
                    </span>
                    <span className="text-sm font-medium font-mono">
                      93.184.216.34
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-foreground/5">
                    <span className="text-xs text-muted-foreground">
                      AAAA Record
                    </span>
                    <span className="text-sm font-medium font-mono">
                      2606:2800:21f:...
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-foreground/5">
                    <span className="text-xs text-muted-foreground">
                      Nameservers
                    </span>
                    <span className="text-sm font-medium">
                      a.iana-servers.net
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-foreground/5">
                    <span className="text-xs text-muted-foreground">
                      MX Records
                    </span>
                    <span className="text-sm font-medium">
                      10 mail.example.com
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-foreground/5">
                    <span className="text-xs text-muted-foreground">SPF</span>
                    <span className="text-sm font-medium text-success">
                      Found
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-foreground/5">
                    <span className="text-xs text-muted-foreground">
                      DMARC
                    </span>
                    <span className="text-sm font-medium text-success">
                      Found
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-8 space-y-4 text-sm text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                <p>
                  The DNS lookup queries authoritative nameservers to retrieve
                  every record type configured for your domain. You&apos;ll see{" "}
                  <strong className="text-foreground">A and AAAA records</strong>{" "}
                  (your domain&apos;s IP addresses with TTL values),{" "}
                  <strong className="text-foreground">
                    nameservers and SOA data
                  </strong>{" "}
                  (who manages your DNS zone), and{" "}
                  <strong className="text-foreground">MX records</strong> (where your
                  email is routed).
                </p>
                <p>
                  The tool also performs an{" "}
                  <strong className="text-foreground">
                    email security analysis
                  </strong>
                  , checking for SPF and DMARC records that protect your domain
                  from email spoofing and impersonation. Combined with{" "}
                  <strong className="text-foreground">CAA record checks</strong>{" "}
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

          {/* DNS Glossary */}
          <PageSection>
            <SectionContent size="md" className="py-16 sm:py-20">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                DNS Record Glossary
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
                Plain-language definitions of every record type you will see in a DNS lookup.
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

          {/* Common DNS Issues */}
          <PageSection>
            <SectionContent size="md" className="py-16 sm:py-20">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                Common DNS Issues
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
                The misconfigurations and resolver errors that hurt DNS health — and how to spot them.
              </p>
              <div className="space-y-4 max-w-3xl mx-auto">
                {dnsIssues.map((err) => (
                  <div
                    key={err.code}
                    id={`issue-${err.code.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`}
                    className="p-5 rounded-xl border border-foreground/10 bg-foreground/[0.02]"
                  >
                    <code className="inline-block text-xs font-mono px-2 py-1 rounded-md bg-warning/10 border border-warning/20 text-warning mb-3">
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
                Learn More About DNS
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
                Guides on DNS record types, email authentication, propagation,
                and domain security.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <Link
                  href="/blog/dns-record-types-explained"
                  className="group block p-6 rounded-xl border border-foreground/10 hover:border-primary/30 transition-colors"
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
                  className="group block p-6 rounded-xl border border-foreground/10 hover:border-primary/30 transition-colors"
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
                  className="group block p-6 rounded-xl border border-foreground/10 hover:border-primary/30 transition-colors"
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
                  className="group block p-6 rounded-xl border border-foreground/10 hover:border-primary/30 transition-colors"
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
                  Need Continuous DNS Monitoring?
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                  Stop checking manually. exit1.dev monitors your DNS records
                  around the clock and alerts you when something changes. Catch
                  misconfigurations and hijacking attempts before they affect
                  your users.
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
