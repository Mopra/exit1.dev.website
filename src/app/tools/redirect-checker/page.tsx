import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import RedirectCheckerTool from "./RedirectCheckerTool";
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
  title: "Free Redirect Checker Tool — Trace HTTP Redirect Chains | exit1.dev",
  description:
    "Free redirect checker tool. Trace the full HTTP redirect chain for any URL. See every hop, status code, Location header, and response time. No signup required.",
  keywords:
    "redirect checker, http redirect checker, redirect chain, 301 redirect checker, 302 redirect, redirect trace, url redirect tester, redirect validator, free redirect tool",
  openGraph: {
    title:
      "Free Redirect Checker Tool — Trace HTTP Redirect Chains | exit1.dev",
    description:
      "Free redirect checker tool. Trace the full HTTP redirect chain for any URL. See every hop, status code, Location header, and response time. No signup required.",
    type: "website",
    url: "https://exit1.dev/tools/redirect-checker",
  },
  twitter: {
    title:
      "Free Redirect Checker Tool — Trace HTTP Redirect Chains | exit1.dev",
    description:
      "Free redirect checker tool. Trace the full HTTP redirect chain for any URL. See every hop, status code, Location header, and response time. No signup required.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://exit1.dev/tools/redirect-checker",
  },
};

const LAST_UPDATED_ISO = "2026-05-04";
const LAST_UPDATED_DISPLAY = "May 4, 2026";

const howToSteps = [
  {
    name: "Enter a URL",
    text: "Type any URL — http or https, with or without www. The tool starts the trace from exactly the URL you give it.",
  },
  {
    name: "Trace the chain",
    text: "Our server follows each 3xx response, recording status code, the Location header, and timing for every hop until it reaches a non-redirect response.",
  },
  {
    name: "Inspect the result",
    text: "See every hop, the final destination, and total time. Spot redundant chains (HTTP→HTTPS→www→/path), redirect loops, and downgrades.",
  },
];

const redirectErrors = [
  {
    code: "ERR_TOO_MANY_REDIRECTS",
    title: "Redirect loop detected",
    body: "The server is redirecting in a circle — usually a misconfigured load balancer, a missing trailing slash rule, or a CDN-level redirect that conflicts with an origin redirect. Trace the chain above to see exactly where the loop closes.",
  },
  {
    code: "301 Moved Permanently",
    title: "Permanent redirect",
    body: "The original URL is gone for good. Search engines transfer link equity to the destination. Use this when content has permanently moved or for HTTPS upgrades.",
  },
  {
    code: "302 Found",
    title: "Temporary redirect (legacy)",
    body: "The redirect is temporary — search engines keep the original URL indexed. Often misused where 301 was intended, which loses SEO equity. Some clients also change the request method on a 302; use 307 if you need to preserve POST.",
  },
  {
    code: "307 Temporary Redirect",
    title: "Method-preserving temporary redirect",
    body: "Like 302 but guarantees the HTTP method is preserved. A POST stays a POST after the redirect. The right choice for temporary moves of API endpoints.",
  },
  {
    code: "308 Permanent Redirect",
    title: "Method-preserving permanent redirect",
    body: "The modern equivalent of 301 that preserves the HTTP method. Recommended over 301 for API endpoints that accept POST/PUT/PATCH.",
  },
  {
    code: "Mixed redirect chain",
    title: "HTTP and HTTPS hops together",
    body: "If your chain bounces between HTTP and HTTPS along the way, you have a configuration problem. The redirect from HTTP should go directly to the final HTTPS URL — bouncing exposes a window for downgrade attacks and adds latency.",
  },
];

const glossary = [
  {
    term: "301 vs 302",
    body: "301 = permanent (search engines transfer link equity, browsers cache aggressively). 302 = temporary (search engines keep the old URL, browsers do not cache). Mixing these up is one of the most common SEO mistakes.",
  },
  {
    term: "307 and 308",
    body: "Modern method-preserving versions. 307 = temporary like 302 but the request method survives. 308 = permanent like 301 but method-preserving. Use these for API endpoints.",
  },
  {
    term: "Location header",
    body: "The HTTP response header that tells the client where to go next. Can be absolute (https://...) or relative (/new-path). The browser follows it automatically when paired with a 3xx status code.",
  },
  {
    term: "Redirect loop",
    body: "A→B→A or any chain that returns to a URL it has already visited. Browsers give up after ~20 hops and show ERR_TOO_MANY_REDIRECTS. Common causes: HTTP→HTTPS rule plus an HTTPS→HTTP rule, or trailing-slash mismatches.",
  },
  {
    term: "Canonical URL",
    body: "The single URL you want search engines to treat as authoritative. Redirects help enforce this — bare-domain → www, HTTP → HTTPS, /path/ → /path. The canonical URL should always be the final destination, not an intermediate hop.",
  },
  {
    term: "Link equity (PageRank)",
    body: "The SEO value passed from one page to another via a link or redirect. 301 redirects pass nearly all of it. 302 redirects historically passed less, though Google has narrowed that gap. Each extra hop in a chain still dilutes equity slightly.",
  },
];

const faq = [
  {
    question: "What does this redirect checker do?",
    answer:
      "This tool follows the full HTTP redirect chain for any URL you enter. It shows every hop in the chain, including the status code (301, 302, 307, 308), the Location header, response time for each hop, and the final destination URL.",
  },
  {
    question: "Is this redirect checker free?",
    answer:
      "Yes, completely free with no signup required. Just enter a URL and trace the redirect chain instantly. There are no daily limits.",
  },
  {
    question: "What is an HTTP redirect?",
    answer:
      "An HTTP redirect is a server response that tells the browser to go to a different URL instead of the one originally requested. The server sends a 3xx status code (like 301 or 302) along with a Location header pointing to the new URL. This happens automatically and is usually invisible to the user.",
  },
  {
    question: "What is the difference between 301 and 302 redirects?",
    answer:
      "A 301 redirect means the resource has moved permanently — search engines will transfer link equity to the new URL and update their index. A 302 redirect means the move is temporary — search engines keep the original URL in their index. Using the wrong type can hurt your SEO.",
  },
  {
    question: "Why do too many redirects cause problems?",
    answer:
      "Each redirect adds an extra HTTP round-trip, increasing page load time. Long redirect chains can also confuse search engine crawlers, dilute link equity, and in some cases cause redirect loops where the browser gives up entirely with an ERR_TOO_MANY_REDIRECTS error.",
  },
  {
    question: "How do redirects affect SEO?",
    answer:
      "Redirects directly impact SEO. A 301 redirect passes most link equity to the destination URL, while 302 redirects may not. Redirect chains (multiple hops) dilute PageRank with each hop. For best SEO, keep redirect chains as short as possible — ideally a single hop from the old URL to the final destination.",
  },
  {
    question: "Does this tool follow JavaScript or meta refresh redirects?",
    answer:
      "No, this tool follows server-side HTTP redirects only (3xx status codes). JavaScript redirects (window.location) and HTML meta refresh redirects happen in the browser and are not visible at the HTTP level. For those, you would need a browser-based testing tool.",
  },
  {
    question: "Can I monitor my redirects automatically?",
    answer:
      "Yes! exit1.dev includes automatic uptime and redirect monitoring for every website you monitor. You'll get alerts if redirect chains change or break — no manual checking needed. It's included free with all plans.",
  },
];

export default function RedirectCheckerPage() {
  return (
    <>
      <StructuredData
        type="WebPage"
        data={{
          name: "Free Redirect Checker Tool",
          description:
            "Free redirect checker tool to trace the full HTTP redirect chain for any URL. See every hop, status code, Location header, and response time.",
          url: "https://exit1.dev/tools/redirect-checker",
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
          name: "Free Redirect Checker",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Web",
          url: "https://exit1.dev/tools/redirect-checker",
          description:
            "Free online redirect tracer. Follows the full HTTP redirect chain hop by hop, reporting status codes, Location headers, and timing for any URL.",
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
          name: "How to trace an HTTP redirect chain",
          description:
            "Use the exit1.dev redirect checker to follow every hop from a starting URL to the final destination, with status codes and timing.",
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
            toolName="Redirect Checker"
            href="/tools/redirect-checker"
            title="Redirect Checker"
            description="Trace the full HTTP redirect chain for any URL. See every hop, status code, Location header, and response time. Free, no signup required."
          />

          {/* Tools Navigation */}
          <PageSection>
            <SectionContent size="md" className="py-6">
              <ToolsNav current="/tools/redirect-checker" />
            </SectionContent>
          </PageSection>

          {/* Tool Section */}
          <PageSection>
            <SectionContent size="md" className="py-12 sm:py-16">
              <Suspense fallback={null}>
                <RedirectCheckerTool />
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
                Here&apos;s an example of a redirect chain this tool reveals.
                Try it above with any URL.
              </p>
              <div
                className="bg-foreground/[0.02] border border-foreground/10 rounded-xl p-6 sm:p-8"
                aria-label="Example redirect chain result"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-foreground/10">
                  <div className="w-8 h-8 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center text-xs font-bold text-success">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-success">
                      Redirect Chain Complete
                    </p>
                    <p className="text-xs text-muted-foreground">
                      http://example.com — 2 redirects to final destination
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {/* Hop 1 */}
                  <div className="flex items-start gap-4 p-3 rounded-lg bg-foreground/[0.02] border border-foreground/5">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">
                        1
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-primary">
                          301
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Moved Permanently
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          45ms
                        </span>
                      </div>
                      <p className="text-sm font-medium truncate">
                        http://example.com
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Location: https://example.com
                      </p>
                    </div>
                  </div>
                  {/* Hop 2 */}
                  <div className="flex items-start gap-4 p-3 rounded-lg bg-foreground/[0.02] border border-foreground/5">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">
                        2
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-primary">
                          301
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Moved Permanently
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          38ms
                        </span>
                      </div>
                      <p className="text-sm font-medium truncate">
                        https://example.com
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Location: https://www.example.com
                      </p>
                    </div>
                  </div>
                  {/* Final destination */}
                  <div className="flex items-start gap-4 p-3 rounded-lg bg-success/5 border border-success/10">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-success/10 border border-success/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-success">
                        ✓
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-success">
                          200
                        </span>
                        <span className="text-xs text-muted-foreground">
                          OK
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          120ms
                        </span>
                      </div>
                      <p className="text-sm font-medium truncate">
                        https://www.example.com
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Final destination — Total time: 203ms
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 space-y-4 text-sm text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                <p>
                  The redirect chain shows every hop from the initial URL to the
                  final destination. Each hop displays the HTTP status code (
                  <strong className="text-foreground">301</strong> for permanent,{" "}
                  <strong className="text-foreground">302</strong> for temporary),
                  the Location header that tells the browser where to go next,
                  and the response time for that individual hop.
                </p>
                <p>
                  In this example, the URL goes through two redirects: first
                  from HTTP to HTTPS (enforcing a secure connection), then from
                  the bare domain to the www subdomain. This is a common and
                  healthy redirect pattern. Chains with more than 3 hops may
                  indicate misconfiguration and can slow down page loads.
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
                  <h3 className="font-semibold text-lg mb-2">Enter URL</h3>
                  <p className="text-sm text-muted-foreground">
                    Type any URL you want to trace. We&apos;ll follow every
                    redirect from the starting point.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold text-lg">2</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    We Follow the Chain
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Our server follows each redirect hop, recording the status
                    code, Location header, and response time.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold text-lg">3</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    See Every Hop
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    View the complete redirect chain from start to finish, with
                    every status code, header, and timing detail.
                  </p>
                </div>
              </div>
            </SectionContent>
          </PageSection>

          {/* HTTP Redirect Glossary */}
          <PageSection>
            <SectionContent size="md" className="py-16 sm:py-20">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                HTTP Redirect Glossary
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
                The terms that show up in any redirect chain — explained without the spec-speak.
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

          {/* Redirect Status Codes & Issues */}
          <PageSection>
            <SectionContent size="md" className="py-16 sm:py-20">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                Redirect Status Codes &amp; Common Issues
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
                What each redirect code means, when to use it, and the chain problems to watch for.
              </p>
              <div className="space-y-4 max-w-3xl mx-auto">
                {redirectErrors.map((err) => (
                  <div
                    key={err.code}
                    id={`code-${err.code.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`}
                    className="p-5 rounded-xl border border-foreground/10 bg-foreground/[0.02]"
                  >
                    <code className="inline-block text-xs font-mono px-2 py-1 rounded-md bg-primary/10 border border-primary/20 text-primary mb-3">
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
                  Need Continuous Redirect Monitoring?
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                  Stop checking manually. exit1.dev monitors your URLs
                  automatically and alerts you when redirect chains change or
                  break. 10 free monitors. Unlimited with Nano.
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
