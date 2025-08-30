"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Obfuscate email to prevent bot scraping
    const emailParts = ['mortenprads', '@', 'gmail', '.', 'com'];
    const obfuscatedEmail = emailParts.join('');
    setEmail(obfuscatedEmail);
  }, []);

  return (
    <>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": ["Organization","SoftwareApplication"],
                "name": "exit1.dev",
                "url": "https://exit1.dev",
                "applicationCategory": "MonitoringApplication",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
                "description": "Free uptime monitoring with unlimited websites, 1-minute checks, SSL and domain expiry alerts, and instant notifications.",
                "publisher": { "@id": "#org" }
              },
              {
                "@type": "Person",
                "@id": "#founder",
                "name": "Morten Pradsgaard",
                "jobTitle": "Founder & CTO",
                "url": "https://exit1.dev/about",
                "email": "mailto:mortenprads@gmail.com"
              },
              {
                "@type": "WebSite",
                "name": "exit1.dev",
                "url": "https://exit1.dev",
                "inLanguage": "en",
                "publisher": { "@id": "#org" },
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://exit1.dev/blog?search={query}",
                  "query-input": "required name=query"
                }
              },
              {
                "@type": "Blog",
                "name": "Exit1.dev Blog",
                "url": "https://exit1.dev/blog",
                "about": { "@id": "#org" },
                "author": { "@id": "#founder" }
              }
            ]
          })
        }}
      />

      <main className="min-h-screen bg-background pt-24 sm:pt-28">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-background via-background/95 to-background/90 py-20 sm:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6 sm:mb-8">
              <Link
                href="/"
                className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors duration-200 mb-4 sm:mb-6 text-sm sm:text-base interactive"
              >
                <ArrowLeft className="mr-2 w-3 h-3 sm:w-4 sm:h-4" />
                Back to Home
              </Link>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-6 sm:mb-8 leading-tight tracking-tight">
              About Exit1.dev & The Person Behind It
            </h1>

            <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8">
                I&apos;m <strong>Morten Pradsgaard</strong>. I build software that ships and stays up. I created <strong>exit1.dev</strong> because uptime monitoring is basic hygiene, and the &quot;free tier&quot; bait-and-switch everywhere else annoyed me.
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
              
              <div className="mb-12">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">What exit1.dev is</h2>
                <p className="text-base sm:text-lg text-muted-foreground mb-4">
                  Free, no-nonsense uptime monitoring. <strong>Unlimited websites. 1-minute checks. SSL and domain expiry monitoring. Instant alerts.</strong> The essentials—done right, and actually free.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">Why it&apos;s free</h2>
                <p className="text-base sm:text-lg text-muted-foreground mb-4">
                  We run a lean, boring stack and don&apos;t sell your data. No dark patterns, no tricks. Abuse is blocked; everyone else rides free. If there&apos;s ever a tip jar, toss a coin if you feel like it—<strong>monitoring stays free</strong>.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">How it works (short version)</h2>
                <p className="text-base sm:text-lg text-muted-foreground mb-4">
                  Global checks every minute. Smart flap-suppression (confirm N consecutive failures). Retry/backoff on lookups. Email throttling so you&apos;re not spammed. Zero-config setup. It just works.
                </p>
              </div>

              <hr className="my-12 border-primary/20" />

              <div className="mb-12">
                <h2 className="text-xl sm:text-2xl font-semibold mb-6">Who I Am</h2>
                
                {/* Author Hero Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-6">
                    <Image
                      src="/Morten-Pradsgaard.jpg"
                      alt="Morten Pradsgaard - Founder & CTO of exit1.dev"
                      width={80}
                      height={80}
                      className="rounded-full shadow-lg border-2 border-primary/20"
                      priority
                    />
                    <div>
                      <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-1">Morten Pradsgaard</h3>
                      <p className="text-base sm:text-lg text-primary font-medium">Founder & CTO</p>
                    </div>
                  </div>
                </div>
                
                {/* Bio Text */}
                <div className="bg-card/50 backdrop-blur-md border border-primary/20 rounded-xl p-6 sm:p-8 shadow-lg">
                  <p className="text-base sm:text-lg text-muted-foreground mb-4 leading-relaxed">
                    CTO, software architect, and the person responsible when things break. I&apos;ve led teams, shipped products, and cleaned up more &quot;clever&quot; over-engineering than I care to remember. I prefer clarity over ceremony, shipping over showmanship, and reliability over resume-driven design.
                  </p>
                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                    When I write on the <strong>Blog</strong>, it&apos;s not to chase keywords—it&apos;s to share what works: how to monitor properly, comparisons with the usual suspects, and pragmatic takes on AI/automation in monitoring. <strong>Expect straight talk, not marketing fog.</strong>
                  </p>
                </div>
              </div>

              <div className="mb-12">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">What You Get Here</h2>
                <ul className="space-y-3 text-base sm:text-lg text-muted-foreground">
                  <li><strong>Real monitoring, not marketing.</strong> Unlimited sites, 1-min checks, instant alerts.</li>
                  <li><strong>Setup in minutes.</strong> Create account → add site → get alerts. No BS.</li>
                  <li><strong>Useful features.</strong> SSL/expiry, logs, analytics, API, webhooks.</li>
                  <li><strong>A community you can ping.</strong> Discord for help, ideas, and calling out nonsense.</li>
                </ul>
              </div>

              <div className="mb-12">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">Trust & Transparency</h2>
                <ul className="space-y-3 text-base sm:text-lg text-muted-foreground">
                  <li><strong>Privacy & Data:</strong> We don&apos;t play games with your data.</li>
                  <li><strong>Docs & API:</strong> Full docs and webhooks so you can integrate it into your workflow.</li>
                  <li><strong>Status:</strong> Want to see how we&apos;re doing? Check the status page. Hold us to it.</li>
                </ul>
              </div>

              <div className="mb-12">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">Talk To Me</h2>
                <p className="text-base sm:text-lg text-muted-foreground mb-4">
                  Have a feature request, integration idea, or gripe? Great—<strong>I want the tough feedback</strong>.
                </p>
                <ul className="space-y-2 text-base sm:text-lg text-muted-foreground">
                  <li>Email: {email && (
                    <a 
                      href={`mailto:${email}`} 
                      className="text-primary hover:underline"
                      onClick={(e) => {
                        // Additional protection: decode on click
                        const decodedEmail = email.replace(/[at]/g, '@').replace(/[dot]/g, '.');
                        e.currentTarget.href = `mailto:${decodedEmail}`;
                      }}
                    >
                      {email}
                    </a>
                  )}</li>
                  <li>LinkedIn: <a href="https://www.linkedin.com/in/mopradk/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Morten Pradsgaard</a></li>
                  <li>GitHub: <a href="https://github.com/Mopra" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@Mopra</a></li>
                  <li>X (Twitter): <a href="https://x.com/m_prads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@m_prads</a></li>
                  <li>Discord: <a href="https://discord.gg/uZvWbpwJZS" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Join the community and say hi</a></li>
                </ul>
              </div>

            </div>
          </div>
        </section>

        {/* CTA Section - matching home page design */}
        <section id="get-started" className="py-12 sm:py-16 lg:py-20 bg-card/50 backdrop-blur-md border-t border-primary/20 scroll-mt-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6 tracking-tight">
              Ready to get started?
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 px-2 sm:px-4">
              Join our community of developers and enthusiasts who trust exit1.dev for their monitoring needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-semibold glass-primary border backdrop-blur-md hover:scale-105 transition-all duration-300 w-full sm:w-auto interactive"
              >
                <a href="https://app.exit1.dev" target="_blank" rel="noopener noreferrer">
                  Sign Up Now
                  <ArrowRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                asChild
                size="lg"
                className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-semibold backdrop-blur-md hover:scale-105 transition-all duration-300 w-full sm:w-auto interactive"
              >
                <Link href="/getting-started">
                  Learn How
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
