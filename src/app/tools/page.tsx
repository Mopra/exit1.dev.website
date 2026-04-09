import { Metadata } from "next";
import Link from "next/link";
import { Shield, Globe, Activity, Wifi, ArrowRight, Network } from "lucide-react";
import StructuredData from "@/components/StructuredData";
import {
  PageShell,
  PageContainer,
  PageSection,
  SectionContent,
} from "@/components/PageLayout";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Free Website & Server Tools — SSL, Domain, DNS, API, Ping & Redirect Checkers | exit1.dev",
  description:
    "Free online tools for developers and sysadmins. Check SSL certificates, domain expiration, DNS records, API endpoint status, server latency, and redirect chains. No signup required.",
  keywords:
    "free ssl checker, domain expiration checker, dns lookup tool, api status checker, ping test, free web tools, server monitoring tools, website checker, developer tools",
  openGraph: {
    title: "Free Website & Server Tools — SSL, Domain, DNS, API, Ping & Redirect Checkers | exit1.dev",
    description:
      "Free online tools for developers and sysadmins. Check SSL certificates, domain expiration, DNS records, API endpoint status, server latency, and redirect chains. No signup required.",
    type: "website",
    url: "https://exit1.dev/tools",
  },
  twitter: {
    title: "Free Website & Server Tools — SSL, Domain, DNS, API, Ping & Redirect Checkers | exit1.dev",
    description:
      "Free online tools for developers and sysadmins. Check SSL certificates, domain expiration, DNS records, API endpoint status, server latency, and redirect chains. No signup required.",
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
      "Look up any domain's registration details. See expiry date, registrar, nameservers, and WHOIS data — all from RDAP and WHOIS databases.",
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
      "Measure latency, packet loss, and jitter to any server or website. TCP-based ping from your browser — no command line needed.",
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
      "Trace the full HTTP redirect chain for any URL. See every hop, status code, Location header, and response time — find broken or unnecessary redirects.",
    href: "/tools/redirect-checker",
    icon: ArrowRight,
    features: [
      "Full redirect chain visualization",
      "Status codes for every hop",
      "Response time per redirect",
      "Response headers inspection",
    ],
  },
];

export default function ToolsPage() {
  return (
    <>
      <StructuredData
        type="WebPage"
        data={{
          name: "Free Website & Server Tools",
          description:
            "Free online tools for developers and sysadmins. Check SSL certificates, domain expiration, API endpoint status, and server latency.",
          url: "https://exit1.dev/tools",
          publisher: {
            "@type": "Organization",
            name: "exit1.dev",
            url: "https://exit1.dev",
          },
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
                records, API health, server latency, and redirect chains. No signup required.
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
                      className="group block p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all"
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
                    10 free monitors with 5-minute checks. Unlimited with Nano.
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
                  SSL certificates, and API endpoints automatically — with
                  instant alerts when something goes wrong.
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
