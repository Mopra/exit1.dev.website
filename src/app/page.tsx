"use client";

import dynamic from 'next/dynamic';
import Link from 'next/link';
import Hero from "@/components/Hero";
import WhyFree from "@/components/WhyFree";
import AccuracySection from "@/components/AccuracySection";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import Image from "next/image";

// Lazy load heavy components
const MagicBento = dynamic(() => import('@/components/MagicBento'), {
  loading: () => (
    <div className="h-96 bg-card/20 animate-pulse rounded-lg flex items-center justify-center">
      <div className="text-muted-foreground">Loading features...</div>
    </div>
  ),
  ssr: false
});

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Hero />
      <section className="relative py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Social Proof Badge */}
          <div className="flex justify-center mb-12">
            <a 
              href="https://peerpush.net/p/exit1dev"
              target="_blank"
              rel="noopener"
              className="transition-all duration-300 hover:scale-105 cursor-pointer interactive"
              style={{ height: '50px' }}
            >
              <Image
                src="https://peerpush.net/p/exit1dev/badge"
                alt="Exit1.dev badge"
                width={200}
                height={50}
                style={{ height: '50px' }}
                className="opacity-90 hover:opacity-100 transition-opacity duration-300"
              />
            </a>
          </div>
          
          <MagicBento
            textAutoHide={true}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={false}
            enableMagnetism={false}
            clickEffect={false}
            spotlightRadius={300}
            particleCount={6}
          />
        </div>
      </section>
      <section className="py-12 sm:py-16 lg:py-20 border-t border-primary/20 bg-background/60 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
            <div className="p-6 sm:p-8 rounded-3xl border border-primary/20 bg-card/70 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 interactive">
              <h2 className="text-xl sm:text-2xl font-semibold mb-3">Free Uptime Monitor</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                This is the flagship. Unlimited monitors, 1-minute intervals, real alerting. No &ldquo;freemium&rdquo; throttles. We walk through the whole stack, why it&apos;s free, and how to migrate off the legacy robots without breaking a sweat.
              </p>
              <Link href="/free-uptime-monitor" className="inline-flex items-center text-primary font-semibold text-sm sm:text-base hover:underline underline-offset-4">
                Read the manifesto
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
            <div className="p-6 sm:p-8 rounded-3xl border border-primary/20 bg-card/70 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 interactive">
              <h2 className="text-xl sm:text-2xl font-semibold mb-3">Free Website Monitor</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                Landing pages, Shopify, Jamstack builds—if it responds over HTTP we keep it honest. Full SSL, domain, and content checks without the vendor circus. See exactly how we harden store uptime for free.
              </p>
              <Link href="/free-website-monitor" className="inline-flex items-center text-primary font-semibold text-sm sm:text-base hover:underline underline-offset-4">
                See the full breakdown
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <WhyFree />
      <AccuracySection />
      {/* CTA Section */}
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
    </div>
  );
}
