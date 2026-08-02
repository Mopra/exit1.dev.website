import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import NameserverLookupTool from "./NameserverLookupTool";
import {
  PageShell,
  PageContainer,
  PageSection,
  SectionContent,
} from "@/components/PageLayout";
import { ToolPageHero } from "@/components/ToolPageHero";
import { buildSignupUrl } from "@/lib/cta";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ToolsNav } from "@/components/ToolsNav";

// Title is deliberately exact-match and brand-suffix-free: this page exists to
// intercept the "nameserver lookup" / "check nameservers" cluster, which was
// previously landing on a blog post at ~0.1% CTR.
export const metadata: Metadata = {
  title: "Nameserver Lookup — Check Any Domain's Nameservers Free",
  description:
    "Free nameserver lookup. Check NS records for any domain, see the IP addresses behind each nameserver, identify the DNS provider, and get a delegation health grade. No signup required.",
  keywords:
    "nameserver lookup, check nameservers, nameserver check, ns record lookup, check domain nameservers, find nameservers for domain, ns lookup, dns delegation check, who hosts my dns, soa record lookup",
  openGraph: {
    title: "Nameserver Lookup — Check Any Domain's Nameservers Free",
    description:
      "Free nameserver lookup. Check NS records for any domain, see the IPs behind each nameserver, identify the DNS provider, and get a delegation health grade.",
    type: "website",
    url: "https://exit1.dev/tools/nameserver-lookup",
  },
  twitter: {
    title: "Nameserver Lookup — Check Any Domain's Nameservers Free",
    description:
      "Free nameserver lookup. Check NS records for any domain, see the IPs behind each nameserver, identify the DNS provider, and get a delegation health grade.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://exit1.dev/tools/nameserver-lookup",
  },
};

const LAST_UPDATED_ISO = "2026-07-29";
const LAST_UPDATED_DISPLAY = "July 29, 2026";

const howToSteps = [
  {
    name: "Enter a domain",
    text: "Type any domain or full URL — example.com or https://example.com/path. The tool extracts the registrable hostname for you.",
  },
  {
    name: "Run the nameserver lookup",
    text: "Our server queries the domain's NS records, then resolves each nameserver hostname to its IPv4 and IPv6 addresses and reads the zone's SOA record.",
  },
  {
    name: "Read the delegation report",
    text: "See every nameserver with its IPs and detected DNS provider, whether the SOA primary agrees with the NS set, how many separate networks the nameservers span, and an overall health grade.",
  },
];

const nameserverIssues = [
  {
    code: "Single nameserver",
    title: "One nameserver is one point of failure",
    body: "Every RFC and every registry recommends at least two nameservers. With one, a single host or network outage makes your entire domain unresolvable — the website, the API, and the email all go dark at once. Add a second nameserver, ideally on a different network.",
  },
  {
    code: "Lame delegation",
    title: "A listed nameserver does not answer for the zone",
    body: "The parent zone delegates your domain to a nameserver that either does not resolve or does not hold the zone. Resolvers that happen to pick that nameserver get no answer, so the domain fails intermittently — which is far harder to debug than a total outage. If a nameserver here shows as not resolving, that is a lame delegation.",
  },
  {
    code: "SOA mismatch",
    title: "SOA primary is not in the NS record set",
    body: "The SOA record names the zone's primary nameserver. When that hostname does not appear in the NS records, it is usually a leftover from a migration you thought was finished. It rarely breaks resolution outright, but it confuses secondary-DNS transfers and monitoring tools, and it is a reliable sign that the zone was never fully cleaned up.",
  },
  {
    code: "Single network",
    title: "All nameservers sit in the same network",
    body: "Two nameservers in one /16 give you host redundancy but not network redundancy — a routing problem takes them down together. One important exception: anycast providers like Cloudflare and Route 53 deliberately serve every nameserver from a single announced prefix, which is reachable from hundreds of locations worldwide. This tool knows the difference and only flags a shared network when it is genuinely a shared failure domain.",
  },
  {
    code: "No IPv6",
    title: "No nameserver has an AAAA record",
    body: "IPv6-only resolvers cannot reach an IPv4-only nameserver directly and must rely on translation, which adds latency and a failure mode you do not control. Every major managed DNS provider publishes IPv6 addresses for its nameservers — if yours does not, that is worth asking about.",
  },
  {
    code: "Unexpected change",
    title: "Nameservers changed and nobody noticed",
    body: "A nameserver change is exactly what a domain hijack looks like — an attacker who gains registrar access repoints delegation to their own DNS and takes over your traffic and email. It is also what a fumbled migration looks like. Either way, you want to find out from an alert, not from a customer.",
  },
];

// Preserved from the former /blog/free-nameserver-lookup post, which now 301s
// here — these are the parts the tool page did not already cover.
const cliCommands = [
  {
    label: "Find a domain's nameservers",
    command: "dig example.com NS +short",
    body: "The quickest check on macOS or Linux. On Windows, use nslookup -type=ns example.com instead.",
  },
  {
    label: "Ask the registry directly",
    command: "dig example.com NS @a.gtld-servers.net +short",
    body: "Queries the .com TLD servers directly, bypassing every cache. This is what the registry actually publishes — use it when a change seems not to have taken effect.",
  },
  {
    label: "Test one specific nameserver",
    command: "dig @ns1.example-dns.com example.com A +short",
    body: "Asks a single nameserver for a record. If this returns nothing while other nameservers answer, that nameserver is lame — it is listed in the delegation but does not serve the zone.",
  },
];

const providerNameservers = [
  { provider: "Cloudflare", pattern: "*.ns.cloudflare.com (assigned per domain)" },
  { provider: "AWS Route 53", pattern: "ns-*.awsdns-*.com / .net / .org / .co.uk" },
  { provider: "Google Cloud DNS", pattern: "ns-cloud-*.googledomains.com" },
  { provider: "Azure DNS", pattern: "ns*-*.azure-dns.com / .net / .org / .info" },
  { provider: "DigitalOcean", pattern: "ns1-3.digitalocean.com" },
  { provider: "GoDaddy", pattern: "ns*.domaincontrol.com" },
  { provider: "Namecheap", pattern: "dns1-2.registrar-servers.com" },
  { provider: "NS1", pattern: "dns*.p*.nsone.net" },
];

const glossary = [
  {
    term: "NS record",
    body: "The record type that declares which nameservers are authoritative for a domain's DNS zone. Resolvers read the NS records from the parent zone (the TLD registry) to learn where to send every subsequent query for your domain.",
  },
  {
    term: "Registry vs zone delegation",
    body: "NS records are set in two places: at the registry (via your registrar, telling .com where to find your DNS) and inside your own DNS zone. Both should agree. If your registrar points at Cloudflare but your zone still claims Route 53, the delegation is inconsistent — and registry-level NS changes carry TTLs of 24–48 hours, so there is no way to rush the fix.",
  },
  {
    term: "Authoritative vs recursive",
    body: "Authoritative nameservers hold the actual zone data and give definitive answers — those are the ones in your NS records. Recursive resolvers (like 1.1.1.1 or 8.8.8.8) are what your devices talk to; they walk the chain to the authoritative servers and cache the answer.",
  },
  {
    term: "Glue records",
    body: "The IP addresses of your nameservers, stored at the registry alongside the delegation. Without glue, a resolver looking for ns1.example.com would need to resolve example.com first — which requires ns1.example.com. Glue breaks that circle. This tool resolves each nameserver hostname to show you whether that lookup works at all.",
  },
  {
    term: "SOA record",
    body: "Start of Authority. Holds the zone's metadata: the primary nameserver, the admin contact, a serial number that increments on every change, and the refresh/retry/expire timers that secondary nameservers use to decide when to pull a fresh copy of the zone.",
  },
  {
    term: "Registrar vs DNS host",
    body: "Two separate jobs that are often — but not always — the same company. Your registrar controls the domain registration and which nameservers the registry publishes. Your DNS host runs those nameservers and holds the actual records. Pointing NS records at a new provider moves the DNS without moving the registration.",
  },
  {
    term: "Secondary DNS",
    body: "A second, independent set of nameservers that keeps a synchronised copy of your zone, usually via AXFR/IXFR zone transfers. It is the standard defence against a single DNS provider having a bad day — the 2016 Dyn outage taught a lot of large sites this lesson at once.",
  },
  {
    term: "Delegation and propagation",
    body: "Changing nameservers updates the delegation at the registry. Resolvers worldwide keep caching the old NS records until their TTL expires, so both old and new nameservers must serve correct data during the overlap — typically up to 48 hours.",
  },
];

const faq = [
  {
    question: "What is a nameserver lookup?",
    answer:
      "A nameserver lookup queries a domain's NS records to find out which servers are authoritative for its DNS. Those nameservers hold every other record for the domain — A, AAAA, MX, TXT — so they determine where your website, API, and email traffic actually goes. This tool shows the NS records, resolves each nameserver to its IPv4 and IPv6 addresses, reads the SOA record, and grades how resilient the delegation is.",
  },
  {
    question: "How do I check the nameservers for a domain?",
    answer:
      "Enter the domain above and the lookup runs instantly — no signup. On the command line the equivalents are 'dig NS example.com +short' on macOS and Linux, or 'nslookup -type=ns example.com' on Windows. This tool goes further than either by also resolving each nameserver's addresses, identifying the DNS provider, and flagging redundancy problems.",
  },
  {
    question: "Is this nameserver checker free?",
    answer:
      "Yes, completely free with no signup and no daily limits. Enter any domain and get results immediately. You can copy the report, download it as a text file, or share a direct link to the result.",
  },
  {
    question: "How many nameservers should a domain have?",
    answer:
      "At least two, and they should not share a single point of failure. Two nameservers in the same network protect you from one host dying but not from a network or provider incident. Most managed DNS providers give you two to four nameservers spread across separate infrastructure; domains where downtime is expensive often add a second, independent provider as secondary DNS.",
  },
  {
    question: "Why do my nameservers differ from what my registrar shows?",
    answer:
      "Usually caching. The registry publishes the delegation, and resolvers worldwide cache the old NS records until their TTL expires — up to 48 hours after a change. If the difference persists well beyond that, the change was probably never saved at the registrar, or it was saved on a different domain than you think. A genuinely unexpected difference is more serious: nameserver changes you did not make are the classic signature of a domain hijack.",
  },
  {
    question: "What does it mean if a nameserver does not resolve?",
    answer:
      "It means the domain is delegated to a nameserver whose own hostname has no A or AAAA record, so resolvers cannot reach it. This is called a lame delegation. Resolvers that happen to pick that nameserver get no answer, so the domain fails for some visitors and works for others — an intermittent failure that is much harder to diagnose than a clean outage.",
  },
  {
    question: "Can I get alerted when my nameservers change?",
    answer:
      "Yes. A manual lookup tells you the state right now, which is no help at 3am. exit1.dev monitors your domains continuously and alerts you when uptime, SSL, or domain records change — so an unexpected nameserver change reaches you as a notification rather than as a support ticket.",
  },
];

export default function NameserverLookupPage() {
  return (
    <>
      <StructuredData
        type="WebPage"
        data={{
          name: "Free Nameserver Lookup Tool",
          description:
            "Free nameserver lookup tool. Check NS records for any domain, resolve each nameserver's IP addresses, identify the DNS provider, and grade delegation health.",
          url: "https://exit1.dev/tools/nameserver-lookup",
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
          name: "Free Nameserver Lookup Tool",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Web",
          url: "https://exit1.dev/tools/nameserver-lookup",
          description:
            "Free online nameserver lookup. Resolves NS records, nameserver IPv4/IPv6 addresses, and SOA data, detects the DNS provider, and grades delegation redundancy.",
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
          name: "How to check the nameservers for any domain",
          description:
            "Use the exit1.dev nameserver lookup to find a domain's NS records, the IPs behind them, and whether the delegation is redundant.",
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
            toolName="Nameserver Lookup"
            href="/tools/nameserver-lookup"
            title="Nameserver Lookup"
            description="Check the nameservers for any domain. See NS records, the IP addresses behind each nameserver, the DNS provider running them, and a delegation health grade. Free, no signup required."
          />

          {/* Tools Navigation */}
          <PageSection>
            <SectionContent size="md" className="py-6">
              <ToolsNav current="/tools/nameserver-lookup" />
            </SectionContent>
          </PageSection>

          {/* Tool Section */}
          <PageSection>
            <SectionContent size="md" className="py-12 sm:py-16">
              <Suspense>
                <NameserverLookupTool />
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
                Here&apos;s an example of a nameserver report. Try it above with
                any domain.
              </p>
              <div
                className="bg-foreground/[0.02] border border-foreground/10 rounded-xl p-6 sm:p-8"
                aria-label="Example nameserver lookup result"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-foreground/10">
                  <div className="w-8 h-8 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center text-xs font-bold text-success">
                    A
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-success">
                      Nameserver Health: A
                    </p>
                    <p className="text-xs text-muted-foreground">
                      example.com — 2 nameservers found in 38ms · Cloudflare
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-background/40 border border-foreground/5">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <span className="text-sm font-mono">
                        ada.ns.cloudflare.com
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary">
                        Cloudflare
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-foreground/5 border border-foreground/10 text-foreground/80">
                        173.245.58.108
                      </span>
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-foreground/5 border border-foreground/10 text-foreground/80">
                        2803:f800:50::6ca2:...
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-background/40 border border-foreground/5">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <span className="text-sm font-mono">
                        kip.ns.cloudflare.com
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary">
                        Cloudflare
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-foreground/5 border border-foreground/10 text-foreground/80">
                        172.64.33.152
                      </span>
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-foreground/5 border border-foreground/10 text-foreground/80">
                        2606:4700:58::adf5:...
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mt-6 pt-4 border-t border-foreground/10">
                  <div className="flex justify-between py-2">
                    <span className="text-xs text-muted-foreground">
                      SOA primary
                    </span>
                    <span className="text-sm font-medium font-mono">
                      ada.ns.cloudflare.com
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-xs text-muted-foreground">
                      IPv4 networks
                    </span>
                    <span className="text-sm font-medium text-success">2</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 space-y-4 text-sm text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                <p>
                  A nameserver lookup starts with the domain&apos;s{" "}
                  <strong className="text-foreground">NS records</strong> — the
                  servers the registry says are authoritative for your DNS. Those
                  nameservers hold every other record you have, so if they are
                  wrong or unreachable, nothing else about your DNS matters.
                </p>
                <p>
                  This tool then does the part a plain <code>dig NS</code> skips:
                  it{" "}
                  <strong className="text-foreground">
                    resolves each nameserver hostname
                  </strong>{" "}
                  to its IPv4 and IPv6 addresses, so you can see immediately
                  whether a listed nameserver is actually reachable, how many
                  separate networks your delegation spans, and{" "}
                  <strong className="text-foreground">
                    which provider runs your DNS
                  </strong>
                  . It also compares the{" "}
                  <strong className="text-foreground">SOA primary</strong>{" "}
                  against the NS set to catch half-finished migrations.
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
                    and query its nameservers.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold text-lg">2</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    We Resolve the Delegation
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We read the NS records, resolve every nameserver to its IPv4
                    and IPv6 addresses, and fetch the zone&apos;s SOA record.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold text-lg">3</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    Get Your Report
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    See each nameserver, its provider, redundancy across
                    networks, SOA consistency, and a health grade. Copy,
                    download, or share.
                  </p>
                </div>
              </div>
            </SectionContent>
          </PageSection>

          {/* Nameserver Glossary */}
          <PageSection>
            <SectionContent size="md" className="py-16 sm:py-20">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                Nameserver Glossary
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
                Plain-language definitions of the terms that come up in a
                nameserver lookup.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {glossary.map((item) => (
                  <div
                    key={item.term}
                    id={`glossary-${item.term.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`}
                    className="p-5 rounded-xl border border-foreground/10 bg-foreground/[0.02]"
                  >
                    <h3 className="font-semibold mb-1.5">{item.term}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </SectionContent>
          </PageSection>

          {/* Common Nameserver Problems */}
          <PageSection>
            <SectionContent size="md" className="py-16 sm:py-20">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                Common Nameserver Problems
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
                What a nameserver lookup can tell you is broken — and why each one
                matters.
              </p>
              <div className="space-y-4 max-w-3xl mx-auto">
                {nameserverIssues.map((err) => (
                  <div
                    key={err.code}
                    id={`issue-${err.code.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`}
                    className="p-5 rounded-xl border border-foreground/10 bg-foreground/[0.02]"
                  >
                    <code className="inline-block text-xs font-mono px-2 py-1 rounded-md bg-warning/10 border border-warning/20 text-warning mb-3">
                      {err.code}
                    </code>
                    <h3 className="font-semibold mb-2">{err.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {err.body}
                    </p>
                  </div>
                ))}
              </div>
            </SectionContent>
          </PageSection>

          {/* Command line */}
          <PageSection>
            <SectionContent size="md" className="py-16 sm:py-20">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                Check Nameservers From the Command Line
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
                Prefer a terminal? These are the equivalent lookups — including
                the one that bypasses every cache.
              </p>
              <div className="space-y-4 max-w-3xl mx-auto">
                {cliCommands.map((c) => (
                  <div
                    key={c.command}
                    className="p-5 rounded-xl border border-foreground/10 bg-foreground/[0.02]"
                  >
                    <h3 className="font-semibold mb-3">{c.label}</h3>
                    <pre className="text-xs sm:text-sm font-mono text-foreground/80 bg-background/40 border border-foreground/5 rounded-lg p-3 mb-3 overflow-x-auto">
                      <code>{c.command}</code>
                    </pre>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {c.body}
                    </p>
                  </div>
                ))}
              </div>
            </SectionContent>
          </PageSection>

          {/* Provider fingerprints */}
          <PageSection>
            <SectionContent size="md" className="py-16 sm:py-20">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                Common DNS Providers and Their Nameservers
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
                Your nameserver hostnames reveal who runs your DNS. The tool
                above recognises these and many more automatically.
              </p>
              <div className="max-w-3xl mx-auto overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="py-3 pr-4 font-semibold">Provider</th>
                      <th className="py-3 font-semibold">Nameserver pattern</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providerNameservers.map((p) => (
                      <tr key={p.provider}>
                        <td className="py-3 pr-4 font-medium whitespace-nowrap">
                          {p.provider}
                        </td>
                        <td className="py-3 font-mono text-xs text-muted-foreground break-all">
                          {p.pattern}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionContent>
          </PageSection>

          {/* Related tool */}
          <PageSection>
            <SectionContent size="md" className="py-8">
              <div className="max-w-3xl mx-auto p-5 rounded-xl border border-primary/15 bg-primary/[0.03] text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">
                  Need more than nameservers?
                </strong>{" "}
                The{" "}
                <Link
                  href="/tools/dns-checker"
                  className="text-primary underline underline-offset-2"
                >
                  full DNS lookup tool
                </Link>{" "}
                returns every record type — A, AAAA, MX, TXT, CAA, CNAME — with
                SPF and DMARC analysis. For registration data and expiry dates,
                use the{" "}
                <Link
                  href="/tools/domain-expiration-checker"
                  className="text-primary underline underline-offset-2"
                >
                  domain expiration checker
                </Link>
                .
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
                Learn More About Nameservers &amp; DNS
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
                Guides on NS records, delegation risk, propagation, and DNS
                hijack detection.
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
                  href="/blog/dns-provider-concentration-risk"
                  className="group block p-6 rounded-xl border border-foreground/10 hover:border-primary/30 transition-colors"
                >
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    DNS Provider Concentration Risk
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Why putting every nameserver at one provider is a single
                    point of failure — and what secondary DNS fixes.
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
                    Why nameserver changes take up to 48 hours, how TTL and
                    caching work, and how to plan a migration.
                  </p>
                </Link>
                <Link
                  href="/blog/catching-dns-hijacks-without-crying-wolf"
                  className="group block p-6 rounded-xl border border-foreground/10 hover:border-primary/30 transition-colors"
                >
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    Catching DNS Hijacks
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Unexpected nameserver changes are the signature of a domain
                    takeover. How to detect them without false alarms.
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
                <Link
                  href="/"
                  className="underline underline-offset-2 hover:text-foreground transition-colors"
                >
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
                  Know When Your Nameservers Change
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                  A manual lookup tells you the state right now. exit1.dev
                  monitors your domains around the clock and alerts you the
                  moment something changes — so a hijack or a fumbled migration
                  reaches you as a notification, not a support ticket.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="rounded-full px-8 text-base font-semibold"
                >
                  <a
                    href={buildSignupUrl({
                      campaign: "tool_nameserver",
                      medium: "tool_footer",
                    })}
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
