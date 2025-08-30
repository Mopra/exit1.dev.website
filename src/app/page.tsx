"use client";

import dynamic from 'next/dynamic';
import Hero from "@/components/Hero";
import WhyFree from "@/components/WhyFree";
import AccuracySection from "@/components/AccuracySection";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

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
        </div>
      </section>
    </div>
  );
}
