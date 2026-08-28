import { Metadata } from "next";
import Link from "next/link";
import { Shield, Globe, Activity, Wifi, ArrowRight, Network, HeartPulse, Server } from "lucide-react";
import StructuredData from "@/components/StructuredData";
import {
  PageShell,
  PageContainer,
  PageSection,
  SectionContent,
} from "@/components/PageLayout";
import { PageHero } from "@/components/PageHero";
import { buildSignupUrl } from "@/lib/cta";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Free Website & Server Checkers: SSL, Domain, DNS, API, Ping",
  description:
    "Free online tools for developers and sysadmins. Check SSL certificates, domain expiration, DNS records, nameservers, API endpoint status, server latency, redirect chains, and website uptime health. No signup required.",
  keywords:
    "free ssl checker, domain expiration checker, dns lookup tool, nameserver lookup, check nameservers, api status checker, ping test, redirect checker, uptime checker, free web tools, server monitoring tools, website checker, developer tools",
  openGraph: {
    title: "Free Website & Server Checkers: SSL, Domain, DNS, API, Ping | exit1.dev",
    description:
      "Free online tools for developers and sysadmins. Check SSL certificates, domain expiration, DNS records, nameservers, API endpoint status, server latency, redirect chains, and website uptime health. No signup required.",
    type: "website",
    url: "https://exit1.dev/tools",
  },
  twitter: {
    title: "Free Website & Server Checkers: SSL, Domain, DNS, API, Ping | exit1.dev",
    description:
      "Free online tools for developers and sysadmins. Check SSL certificates, domain expiration, DNS records, nameservers, API endpoint status, server latency, redirect chains, and website uptime health. No signup required.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://exit1.dev/tools",
  },
};

const tools = [
  {
    name: "SSL Certificate Checker",
    description:
      "Check any website's SSL certificate instantly. See expiration dates, issuer details, TLS version, certificate chain, and security grade.",
    href: "/tools/ssl-checker",
    icon: Shield,
    features: [
      "Certificate validity & expiration",
      "TLS protocol version",
      "Issuer & subject details",
      "Security grade breakdown",
    ],
  },
  {
    name: "Domain Expiration Checker",
    description:
      "Look up any domain's registration details. See expiry date, registrar, nameservers, and WHOIS data, all from RDAP and WHOIS databases.",
    href: "/tools/domain-expiration-checker",
    icon: Globe,
    features: [
      "Domain expiry date & countdown",
      "Registrar & nameservers",
      "WHOIS creation & update dates",
      "Registry status codes",
    ],
  },
  {
    name: "DNS Lookup Tool",
    description:
      "Look up all DNS records for any domain. Check A, AAAA, MX, NS, TXT, SOA, CAA, and CNAME records with email security analysis and a DNS health grade.",
    href: "/tools/dns-checker",
    icon: Network,
    features: [
      "All record types (A, AAAA, MX, NS, TXT, SOA, CAA)",
      "Email security analysis (SPF & DMARC)",
      "DNS health grade",
      "TTL values & SOA details",
    ],
  },
  {
    name: "Nameserver Lookup",
    description:
      "Check the nameservers for any domain. See NS records, the IP addresses behind each nameserver, the DNS provider running them, and a delegation health grade.",
    href: "/tools/nameserver-lookup",
    icon: Server,
    features: [
      "NS records with IPv4 & IPv6 addresses",
      "DNS provider detection",
      "Redundancy & network diversity check",
      "SOA record & consistency check",
    ],
  },
  {
    name: "API Status Checker",
    description:
      "Test any API endpoint's health. Check response time, HTTP status, security headers, CORS configuration, and redirect chains in real time.",
    href: "/tools/api-status-checker",
    icon: Activity,
    features: [
      "Response time & status code",
      "Security headers audit",
      "CORS configuration check",
      "Redirect chain analysis",
    ],
  },
  {
    name: "Ping Test",
    description:
      "Measure latency, packet loss, and jitter to any server or website. TCP-based ping from your browser, with no command line needed.",
    href: "/tools/ping-test",
    icon: Wifi,
    features: [
      "Latency (min / avg / max)",
      "Packet loss percentage",
      "Jitter measurement",
      "Multiple ping rounds",
    ],
  },
  {
    name: "Redirect Checker",
    description:
      "Trace the full HTTP redirect chain for any URL. See every hop, status code, Location header, and response time. Finds broken or unnecessary redirects.",
    href: "/tools/redirect-checker",
    icon: ArrowRight,
    features: [
      "Full redirect chain visualization",
      "Status codes for every hop",
      "Response time per redirect",
      "Response headers inspection",
    ],
  },
  {
    name: "Uptime Checker",
    description:
      "Comprehensive website health check. Analyzes DNS, SSL, redirects, response time, security headers, and content health with detailed grades.",
    href: "/tools/uptime-checker",
    icon: HeartPulse,
    features: [
      "DNS, SSL & redirect analysis",
      "Security headers audit (HSTS, CSP)",
      "Performance metrics (TTFB, compression)",
      "Overall health score (A+ to F)",
    ],
  },
];

/**
 * Symptom-to-tool routing.
 *
 * This hub was `Crawled - currently not indexed` for months while all eight of
 * its children indexed fine (measured 2026-08-25 via the URL Inspection sweep in
 * scripts/seo/pull-index-coverage.mjs). A hub whose entire content is links plus
 * the same descriptions its children already carry gives Google nothing to index
 * that the children do not already cover.
 *
 * So this table is the page's own reason to exist: it starts from the symptom you
 * actually have rather than the tool name you would have to know already, and it
 * lives nowhere else on the site. Keep it that way. If a row's advice would fit
 * on the child tool page, it belongs there instead.
 */
const symptoms: Array<{
  symptom: string;
  cause: string;
  tool: string;
  href: string;
}> = [
  {
    symptom: "Browser warns visitors the connection is not private",
    cause:
      "The certificate expired, or the chain is missing an intermediate so only some clients trust it.",
    tool: "SSL Certificate Checker",
    href: "/tools/ssl-checker",
  },
  {
    symptom: "The site resolves for you but not for someone else",
    cause:
      "A stale record, or the registrar and the DNS host disagree about which nameservers are authoritative.",
    tool: "Nameserver Lookup",
    href: "/tools/nameserver-lookup",
  },
  {
    symptom: "Email to your domain silently stops arriving",
    cause:
      "An MX, SPF, DKIM or DMARC record was edited or dropped. None of it breaks the website, so nothing else alerts.",
    tool: "DNS Lookup Tool",
    href: "/tools/dns-checker",
  },
  {
    symptom: "The domain stops working entirely, all at once",
    cause:
      "The registration lapsed. Registrar reminders go to whichever mailbox registered it, which is rarely the one you read.",
    tool: "Domain Expiration Checker",
    href: "/tools/domain-expiration-checker",
  },
  {
    symptom: "Pages load, but slowly, and only sometimes",
    cause:
      "A redirect chain is adding a round trip per hop, or one hop leaves HTTPS and comes back.",
    tool: "Redirect Checker",
    href: "/tools/redirect-checker",
  },
  {
    symptom: "The app is up but an integration reports failures",
    cause:
      "The endpoint returns 200 with an error body, so anything that only checks status codes sees success.",
    tool: "API Status Checker",
    href: "/tools/api-status-checker",
  },
  {
    symptom: "Connections feel unstable rather than down",
    cause:
      "Packet loss or jitter on the path. Averages hide it; the variance is the symptom.",
    tool: "Ping Test",
    href: "/tools/ping-test",
  },
  {
    symptom: "Something is wrong and you cannot narrow it down yet",
    cause:
      "Start wide. One pass over DNS, TLS, redirects, headers and response time tells you which of the above to open.",
    tool: "Uptime Checker",
    href: "/tools/uptime-checker",
  },
];

const faq: Array<{ question: string; answer: string }> = [
  {
    question: "Do these tools need an account?",
    answer:
      "No. Every tool on this page runs without a signup, an email address, or a trial. Enter a domain and read the result. Continuous monitoring needs an account because it has to store your checks and reach you when one fails, but nothing here does.",
  },
  {
    question: "What is the difference between a check and monitoring?",
    answer:
      "A check is one measurement, right now, from wherever the request happens to originate. Monitoring is the same measurement repeated on a schedule from fixed regions, with the history kept so you can tell a blip from a trend, and an alert when the result changes. A check answers whether something is broken. Monitoring is what tells you it broke at 03:12 while you were asleep.",
  },
  {
    question: "How current are the results?",
    answer:
      "Every tool queries live: DNS resolvers, RDAP and WHOIS registries, and the target host itself. Nothing is served from a cache of a previous visitor's lookup. DNS answers are still bounded by the TTL on the record, so a change made seconds ago may not have propagated to the resolver that answers.",
  },
  {
    question: "Can I share or automate a result?",
    answer:
      "Each tool encodes its input in the URL, so a result page can be pasted into an issue or a chat and it will re-run for whoever opens it. For anything scripted, use the REST API instead of the browser tools.",
  },
];

export default function ToolsPage() {
  return (
    <>
      {/*
        CollectionPage + ItemList rather than WebPage: this route is a hub over
        eight child tools, and `WebPage` described it as a standalone document
        with no stated relationship to them. The ItemList names the children in
        order so the hub and its members are one entity group.
      */}
      <StructuredData
        type="CollectionPage"
        data={{
          name: "Free Website & Server Tools",
          description:
            "Free online tools for developers and sysadmins. Check SSL certificates, domain expiration, DNS records, nameservers, API endpoint status, server latency, and redirect chains.",
          url: "https://exit1.dev/tools",
          publisher: {
            "@type": "Organization",
            name: "exit1.dev",
            url: "https://exit1.dev",
          },
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: tools.length,
            itemListElement: tools.map((tool, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: tool.name,
              description: tool.description,
              url: `https://exit1.dev${tool.href}`,
            })),
          },
        }}
      />
      <StructuredData
        type="FAQPage"
        data={{
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }}
      />

      <PageShell>
        <PageContainer>
          <PageHero size="lg">
            <div className="text-center">
              <p className="text-sm font-mono text-primary mb-4 tracking-wide uppercase">
                Free Tools
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Website & Server Tools
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Free tools to check SSL certificates, domain expiration, DNS
                records, nameservers, API health, server latency, redirect chains, and website uptime. No signup required.
              </p>
            </div>
          </PageHero>

          {/* Tools Grid */}
          <PageSection>
            <SectionContent size="lg" className="py-16 sm:py-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="group block p-6 sm:p-8 rounded-2xl border border-foreground/10 bg-foreground/[0.02] hover:bg-foreground/[0.05] hover:border-foreground/20 transition-all"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                            {tool.name}
                          </h2>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                      <ul className="space-y-2 mb-6 ml-14">
                        {tool.features.map((feature) => (
                          <li
                            key={feature}
                            className="text-sm text-muted-foreground flex items-center gap-2"
                          >
                            <span className="w-1 h-1 rounded-full bg-primary/60 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="ml-14 inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                        Use tool
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </SectionContent>
          </PageSection>

          {/* Symptom -> tool. The reason this hub exists as its own page. */}
          <PageSection>
            <SectionContent size="lg" className="py-16 sm:py-20">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Start from the symptom
              </h2>
              <p className="text-muted-foreground max-w-2xl mb-12">
                Most of these failures look identical from the outside: the site
                is &ldquo;down&rdquo;. What separates them is which layer stopped
                answering. Find the symptom you actually have, and the tool that
                confirms it.
              </p>
              <div className="space-y-4">
                {symptoms.map((row) => (
                  <div
                    key={row.href + row.symptom}
                    className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr_auto] gap-4 md:gap-8 md:items-baseline p-5 sm:p-6 rounded-2xl bg-foreground/[0.02]"
                  >
                    <h3 className="font-semibold leading-snug">{row.symptom}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {row.cause}
                    </p>
                    <Link
                      href={row.href}
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all whitespace-nowrap"
                    >
                      {row.tool}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </SectionContent>
          </PageSection>

          {/* FAQ */}
          <PageSection>
            <SectionContent size="md" className="py-16 sm:py-20">
              <h2 className="text-2xl sm:text-3xl font-bold mb-12">
                Questions
              </h2>
              <div className="space-y-8">
                {faq.map((item) => (
                  <div key={item.question}>
                    <h3 className="font-semibold text-lg mb-2">
                      {item.question}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </SectionContent>
          </PageSection>

          {/* Why use these tools */}
          <PageSection>
            <SectionContent size="md" className="py-16 sm:py-20">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
                Why Use These Tools?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <h3 className="font-semibold text-lg mb-2">Instant Results</h3>
                  <p className="text-sm text-muted-foreground">
                    Get detailed results in seconds. No account, no email, no
                    paywall. Just enter a domain and go.
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg mb-2">
                    Developer Friendly
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Built for developers and sysadmins. Copy results, download
                    reports, and share via URL parameters.
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg mb-2">
                    Upgrade to Monitoring
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Need continuous checks? exit1.dev monitors your sites 24/7.
                    50 free monitors with 5-minute checks. Up to 1,000 on Pro.
                  </p>
                </div>
              </div>
            </SectionContent>
          </PageSection>

          {/* CTA */}
          <PageSection>
            <SectionContent size="md" className="py-16 sm:py-20">
              <div className="text-center bg-primary/5 border border-primary/10 rounded-2xl p-8 sm:p-12">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  Need Automated Monitoring?
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                  Stop running manual checks. exit1.dev monitors your websites,
                  SSL certificates, and API endpoints automatically, with
                  instant alerts when something goes wrong.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="rounded-full px-8 text-base font-semibold"
                >
                  <a
                    href={buildSignupUrl({ campaign: "tools_index", medium: "tool_footer" })}
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
