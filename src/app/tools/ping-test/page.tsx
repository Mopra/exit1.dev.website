import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import PingTestTool from "./PingTestTool";
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
    "Free Ping Test Tool — Check Latency & Packet Loss to Any Host | exit1.dev",
  description:
    "Free online ping test tool. Instantly check latency, packet loss, jitter, and response time to any server or website. No signup required.",
  keywords:
    "ping test, online ping, free ping tool, ping website, check latency, packet loss test, ping server, network latency test, jitter test, response time checker, tcp ping",
  openGraph: {
    title:
      "Free Ping Test Tool — Check Latency & Packet Loss to Any Host | exit1.dev",
    description:
      "Free online ping test tool. Instantly check latency, packet loss, jitter, and response time to any server or website. No signup required.",
    type: "website",
    url: "https://exit1.dev/tools/ping-test",
  },
  twitter: {
    title:
      "Free Ping Test Tool — Check Latency & Packet Loss to Any Host | exit1.dev",
    description:
      "Free online ping test tool. Instantly check latency, packet loss, jitter, and response time to any server or website. No signup required.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://exit1.dev/tools/ping-test",
  },
};

const LAST_UPDATED_ISO = "2026-05-04";
const LAST_UPDATED_DISPLAY = "May 4, 2026";

const howToSteps = [
  {
    name: "Enter a host",
    text: "Type any hostname, domain, or IP — example.com, 1.1.1.1, or my-server.internal. Pick how many pings to send (1–10).",
  },
  {
    name: "Run the test",
    text: "Our server resolves the hostname and opens TCP connections one at a time, recording the round-trip time for each attempt.",
  },
  {
    name: "Read the report",
    text: "See min/avg/max latency, jitter, packet loss, and a per-ping breakdown. Spot regional latency, instability, and outages at a glance.",
  },
];

const pingResults = [
  {
    code: "Latency under 50 ms",
    title: "Excellent — same-region performance",
    body: "Typical of a server in the same city or country. Real-time apps (gaming, voice, live trading) feel instant. If a critical user-facing endpoint is over 50 ms, consider edge deployment or a closer region.",
  },
  {
    code: "Latency 50–150 ms",
    title: "Good — typical cross-region",
    body: "Normal for cross-country or transatlantic traffic. Web browsing and most apps feel responsive. Above ~120 ms, voice and video start to feel slightly sluggish.",
  },
  {
    code: "Latency 150–300 ms",
    title: "Acceptable — long-haul connection",
    body: "Cross-continental traffic (Europe ↔ Asia, US ↔ Australia). Web works fine; real-time interactivity is noticeably degraded. CDN edges and regional replicas help close the gap.",
  },
  {
    code: "Latency over 300 ms",
    title: "Poor — investigate the path",
    body: "Either a genuinely long path (satellite link, far region) or a routing problem. Check whether the result is consistent. If it spikes only sometimes, the path has congestion or an unstable hop.",
  },
  {
    code: "Jitter over 20 ms",
    title: "Unstable connection",
    body: "Even when average latency is fine, high jitter wrecks voice, video, and any app expecting steady packet delivery. Common causes: WiFi interference, congested ISP link, or buffer-bloated router on the path.",
  },
  {
    code: "Packet loss above 1%",
    title: "Network is dropping packets",
    body: "Anything above 1% degrades real-time apps and slows TCP throughput (TCP retransmits + reduces congestion window). 5%+ is broken. Investigate which hop is dropping with a traceroute.",
  },
  {
    code: "100% packet loss",
    title: "Host is unreachable",
    body: "Either the host is down, a firewall is blocking the chosen port, or there is no route to it. TCP ping (this tool) checks ports 80/443 — many servers respond on those even when ICMP is filtered.",
  },
  {
    code: "TCP timeout",
    title: "Connection never completed",
    body: "The TCP three-way handshake did not finish in time. Often a stateful firewall silently dropping SYN, the server overwhelmed, or routing returning to a black hole. Try ICMP ping or a different port.",
  },
];

const glossary = [
  {
    term: "Latency (RTT)",
    body: "Round-trip time — the time for a packet to travel from your machine to the server and back. Bound by physics: light through fibre is roughly 2/3 the speed of light in vacuum, so any path adds a real, unavoidable floor.",
  },
  {
    term: "Jitter",
    body: "Variation in latency between consecutive packets. Calculated as the average absolute difference between successive RTTs. Low jitter (< 5 ms) means a steady connection; high jitter (> 20 ms) means VoIP and video will struggle even when average latency looks OK.",
  },
  {
    term: "Packet loss",
    body: "Percentage of packets that never received a response. A small amount (< 1%) is tolerable; anything more degrades streaming, calls, and TCP throughput. Always measured over a sample — a single missing packet on a 5-ping test is 20% loss but probably noise.",
  },
  {
    term: "TCP ping vs ICMP ping",
    body: "ICMP ping (the classic ping command) uses ICMP Echo. TCP ping opens a TCP connection on a real port (usually 80 or 443) and times the handshake. TCP is more useful for web work because many firewalls block ICMP but allow TCP, and it tests the same path your traffic actually uses.",
  },
  {
    term: "Hop",
    body: "Each router along the path between you and the destination. Latency accumulates per hop. A traceroute shows them all; a ping just shows the round-trip total. Most internet paths cross 10–20 hops.",
  },
  {
    term: "MTU",
    body: "Maximum Transmission Unit — the largest packet a link will carry. Default for Ethernet is 1500 bytes. PMTU mismatches cause fragmentation or black-hole drops, which look like inexplicable timeouts on otherwise healthy paths.",
  },
];

const faq = [
  {
    question: "What does this ping test do?",
    answer:
      "This tool sends multiple TCP connection requests to any server or website and measures the round-trip time for each one. It reports individual ping times, packet loss percentage, jitter, and min/avg/max latency statistics — similar to the ping command but from your browser.",
  },
  {
    question: "Is this ping test free?",
    answer:
      "Yes, completely free with no signup required. Just enter a hostname or IP address and ping instantly. There are no daily limits.",
  },
  {
    question: "What is the difference between TCP ping and ICMP ping?",
    answer:
      "Traditional ping uses ICMP (Internet Control Message Protocol) packets. This tool uses TCP connections, which measure the time to establish a connection on port 443 (HTTPS) or 80 (HTTP). TCP ping is often more useful for web developers because it tests the same network path your users experience, and many servers block ICMP but allow TCP connections.",
  },
  {
    question: "What is a good ping time?",
    answer:
      "Under 50ms is excellent (typically same region), 50-100ms is good (nearby regions), 100-200ms is acceptable (cross-continent), and over 200ms may cause noticeable delays. For real-time applications like gaming or video calls, under 50ms is ideal.",
  },
  {
    question: "What is jitter and why does it matter?",
    answer:
      "Jitter is the variation in ping times between consecutive requests. Low jitter (under 5ms) means a stable connection, while high jitter (over 20ms) indicates an unstable network. High jitter can cause issues with video calls, VoIP, and real-time applications even if the average latency is acceptable.",
  },
  {
    question: "What does packet loss mean?",
    answer:
      "Packet loss is the percentage of ping requests that didn't receive a response. 0% loss is ideal. Any packet loss above 1-2% can indicate network problems and may cause noticeable issues with web browsing, streaming, and real-time communications.",
  },
  {
    question: "Can I monitor ping continuously?",
    answer:
      "Yes! exit1.dev offers continuous uptime and latency monitoring on every plan. Free runs 5-minute checks, Nano 2-minute, Pro 30-second, and Agency 15-second. You'll get alerted instantly when your servers go down, respond slowly, or experience packet loss.",
  },
];

export default function PingTestPage() {
  return (
    <>
      <StructuredData
        type="WebPage"
        data={{
          name: "Free Ping Test Tool",
          description:
            "Free online ping test tool to instantly check latency, packet loss, jitter, and response time to any server or website.",
          url: "https://exit1.dev/tools/ping-test",
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
          name: "Free Ping Test Tool",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Web",
          url: "https://exit1.dev/tools/ping-test",
          description:
            "Free online ping test. Measures latency, jitter, and packet loss to any server using TCP connections — works even when ICMP is blocked.",
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
          name: "How to ping a server from your browser",
          description:
            "Use the exit1.dev ping test to measure latency, jitter, and packet loss to any host without installing tools.",
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
            toolName="Ping Test"
            href="/tools/ping-test"
            title="Ping Test"
            description="Instantly test latency, packet loss, and jitter to any server or website. Free, no signup required."
          />

          {/* Tools Navigation */}
          <PageSection>
            <SectionContent size="md" className="py-6">
              <ToolsNav current="/tools/ping-test" />
            </SectionContent>
          </PageSection>

          {/* Tool Section */}
          <PageSection>
            <SectionContent size="md" className="py-12 sm:py-16">
              <Suspense>
                <PingTestTool />
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
                Here&apos;s an example of the latency report this tool provides.
                Try it above with any host.
              </p>
              <div className="bg-foreground/[0.02] border border-foreground/10 rounded-xl p-6 sm:p-8" aria-label="Example ping test result">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-foreground/10">
                  <div className="w-8 h-8 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-success">5/5</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-success">All Pings Successful</p>
                    <p className="text-xs text-muted-foreground">example.com — 0% packet loss</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="bg-foreground/[0.03] rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Min</p>
                    <p className="text-lg font-semibold">12 ms</p>
                  </div>
                  <div className="bg-foreground/[0.03] rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Avg</p>
                    <p className="text-lg font-semibold">18 ms</p>
                  </div>
                  <div className="bg-foreground/[0.03] rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Max</p>
                    <p className="text-lg font-semibold">24 ms</p>
                  </div>
                  <div className="bg-foreground/[0.03] rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Jitter</p>
                    <p className="text-lg font-semibold">3.2 ms</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm py-1.5 border-b border-foreground/5">
                    <span className="text-muted-foreground">Ping 1</span>
                    <span className="font-medium">14 ms</span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-1.5 border-b border-foreground/5">
                    <span className="text-muted-foreground">Ping 2</span>
                    <span className="font-medium">12 ms</span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-1.5 border-b border-foreground/5">
                    <span className="text-muted-foreground">Ping 3</span>
                    <span className="font-medium">18 ms</span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-1.5 border-b border-foreground/5">
                    <span className="text-muted-foreground">Ping 4</span>
                    <span className="font-medium">24 ms</span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-1.5 border-b border-foreground/5">
                    <span className="text-muted-foreground">Ping 5</span>
                    <span className="font-medium">21 ms</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 space-y-4 text-sm text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                <p>
                  <strong className="text-foreground">Latency</strong> (ping time) measures
                  the round-trip time for a TCP connection to the server. Under 50
                  ms is excellent for most regions, 50-100 ms is good for
                  cross-region connections, and anything over 200 ms may cause
                  noticeable delays for real-time applications like video calls or
                  online gaming.
                </p>
                <p>
                  <strong className="text-foreground">Jitter</strong> is the variation
                  between consecutive ping times. Low jitter (under 5 ms) means a
                  stable connection, while high jitter (over 20 ms) indicates
                  network instability that can degrade VoIP, streaming, and
                  real-time communications even when average latency is acceptable.{" "}
                  <strong className="text-foreground">Packet loss</strong> above 1-2%
                  usually signals a network problem and should be investigated.
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
                  <h3 className="font-semibold text-lg mb-2">Enter Host</h3>
                  <p className="text-sm text-muted-foreground">
                    Type any hostname, domain, or IP address. Choose how many
                    pings to send (1-10).
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold text-lg">2</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">We Ping It</h3>
                  <p className="text-sm text-muted-foreground">
                    Our server resolves the hostname and sends TCP connection
                    requests, measuring the round-trip time for each one.
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
                    View individual ping times, packet loss, jitter, and
                    min/avg/max statistics at a glance.
                  </p>
                </div>
              </div>
            </SectionContent>
          </PageSection>

          {/* Network Glossary */}
          <PageSection>
            <SectionContent size="md" className="py-16 sm:py-20">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                Network Glossary
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
                The terms behind every ping result — explained without the textbook detour.
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

          {/* What Ping Results Mean */}
          <PageSection>
            <SectionContent size="md" className="py-16 sm:py-20">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                What Your Ping Results Actually Mean
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
                The latency, jitter, and loss numbers you will see — and what action they should trigger.
              </p>
              <div className="space-y-4 max-w-3xl mx-auto">
                {pingResults.map((r) => (
                  <div
                    key={r.code}
                    id={`result-${r.code.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`}
                    className="p-5 rounded-xl border border-foreground/10 bg-foreground/[0.02]"
                  >
                    <code className="inline-block text-xs font-mono px-2 py-1 rounded-md bg-primary/10 border border-primary/20 text-primary mb-3">
                      {r.code}
                    </code>
                    <h3 className="font-semibold mb-2">{r.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{r.body}</p>
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
                Learn More About Network Monitoring
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
                Guides on ping testing, latency measurement, and infrastructure monitoring.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <Link href="/blog/online-ping-test-guide" className="group block p-6 rounded-xl border border-foreground/10 hover:border-primary/30 transition-colors">
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Online Ping Test Guide</h3>
                  <p className="text-sm text-muted-foreground">How to measure latency, jitter, and packet loss — and what the results actually mean.</p>
                </Link>
                <Link href="/blog/what-is-network-jitter" className="group block p-6 rounded-xl border border-foreground/10 hover:border-primary/30 transition-colors">
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">What Is Network Jitter?</h3>
                  <p className="text-sm text-muted-foreground">Understanding and fixing connection instability that affects VoIP, video, and real-time apps.</p>
                </Link>
                <Link href="/blog/free-icmp-ping-monitoring-guide" className="group block p-6 rounded-xl border border-foreground/10 hover:border-primary/30 transition-colors">
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Free ICMP Ping Monitoring Guide</h3>
                  <p className="text-sm text-muted-foreground">Set up continuous ping monitoring for servers, routers, and network devices.</p>
                </Link>
                <Link href="/blog/icmp-vs-http-monitoring-when-to-use-each" className="group block p-6 rounded-xl border border-foreground/10 hover:border-primary/30 transition-colors">
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">ICMP vs HTTP Monitoring</h3>
                  <p className="text-sm text-muted-foreground">When to use ping checks vs HTTP checks, and why you need both for full-stack visibility.</p>
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

          {/* CTA */}
          <PageSection>
            <SectionContent size="md" className="py-16 sm:py-20">
              <div className="text-center bg-primary/5 border border-primary/10 rounded-2xl p-8 sm:p-12">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  Need Continuous Latency Monitoring?
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                  Stop checking manually. exit1.dev monitors your servers 24/7
                  and alerts you instantly when latency spikes, packet loss
                  occurs, or your services go down.
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
