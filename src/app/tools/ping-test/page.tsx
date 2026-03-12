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
      "Yes! exit1.dev offers continuous uptime and latency monitoring with 1-minute check intervals. You'll get alerted instantly when your servers go down, respond slowly, or experience packet loss. Available on all plans including Free.",
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
          <div className="px-4 sm:px-0 pt-8">
            <Breadcrumbs
              items={[
                { name: "Tools", href: "/tools" },
                { name: "Ping Test", href: "/tools/ping-test" },
              ]}
            />
          </div>
          <PageHero size="lg">
            <div className="text-center">
              <p className="text-sm font-mono text-primary mb-4 tracking-wide uppercase">
                Free Tool
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Ping Test
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Instantly test latency, packet loss, and jitter to any server or
                website. Free, no signup required.
              </p>
            </div>
          </PageHero>

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
              <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 sm:p-8" aria-label="Example ping test result">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-emerald-400">5/5</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-400">All Pings Successful</p>
                    <p className="text-xs text-muted-foreground">example.com — 0% packet loss</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white/[0.03] rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Min</p>
                    <p className="text-lg font-semibold">12 ms</p>
                  </div>
                  <div className="bg-white/[0.03] rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Avg</p>
                    <p className="text-lg font-semibold">18 ms</p>
                  </div>
                  <div className="bg-white/[0.03] rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Max</p>
                    <p className="text-lg font-semibold">24 ms</p>
                  </div>
                  <div className="bg-white/[0.03] rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Jitter</p>
                    <p className="text-lg font-semibold">3.2 ms</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm py-1.5 border-b border-white/5">
                    <span className="text-muted-foreground">Ping 1</span>
                    <span className="font-medium">14 ms</span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-1.5 border-b border-white/5">
                    <span className="text-muted-foreground">Ping 2</span>
                    <span className="font-medium">12 ms</span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-1.5 border-b border-white/5">
                    <span className="text-muted-foreground">Ping 3</span>
                    <span className="font-medium">18 ms</span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-1.5 border-b border-white/5">
                    <span className="text-muted-foreground">Ping 4</span>
                    <span className="font-medium">24 ms</span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-1.5 border-b border-white/5">
                    <span className="text-muted-foreground">Ping 5</span>
                    <span className="font-medium">21 ms</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 space-y-4 text-sm text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                <p>
                  <strong className="text-white">Latency</strong> (ping time) measures
                  the round-trip time for a TCP connection to the server. Under 50
                  ms is excellent for most regions, 50-100 ms is good for
                  cross-region connections, and anything over 200 ms may cause
                  noticeable delays for real-time applications like video calls or
                  online gaming.
                </p>
                <p>
                  <strong className="text-white">Jitter</strong> is the variation
                  between consecutive ping times. Low jitter (under 5 ms) means a
                  stable connection, while high jitter (over 20 ms) indicates
                  network instability that can degrade VoIP, streaming, and
                  real-time communications even when average latency is acceptable.{" "}
                  <strong className="text-white">Packet loss</strong> above 1-2%
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
                <Link href="/blog/online-ping-test-guide" className="group block p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-colors">
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Online Ping Test Guide</h3>
                  <p className="text-sm text-muted-foreground">How to measure latency, jitter, and packet loss — and what the results actually mean.</p>
                </Link>
                <Link href="/blog/what-is-network-jitter" className="group block p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-colors">
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">What Is Network Jitter?</h3>
                  <p className="text-sm text-muted-foreground">Understanding and fixing connection instability that affects VoIP, video, and real-time apps.</p>
                </Link>
                <Link href="/blog/free-icmp-ping-monitoring-guide" className="group block p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-colors">
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Free ICMP Ping Monitoring Guide</h3>
                  <p className="text-sm text-muted-foreground">Set up continuous ping monitoring for servers, routers, and network devices.</p>
                </Link>
                <Link href="/blog/icmp-vs-http-monitoring-when-to-use-each" className="group block p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-colors">
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">ICMP vs HTTP Monitoring</h3>
                  <p className="text-sm text-muted-foreground">When to use ping checks vs HTTP checks, and why you need both for full-stack visibility.</p>
                </Link>
              </div>
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
