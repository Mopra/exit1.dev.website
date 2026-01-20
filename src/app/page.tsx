"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle2,
  Globe,
  Lock,
  Shield,
  Zap,
} from "lucide-react";
import { validateDomain } from "@/lib/domainUtils";
import { FeatureGridItem } from "@/components/FeatureGridItem";
import { PageContainer, PageSection, PageShell, SectionContent } from "@/components/PageLayout";

export default function NewHomePage() {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const cursorPositionRef = useRef<number>(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    cursorPositionRef.current = e.target.selectionStart || 0;

    // Auto-prepend https:// if user types a domain without protocol
    if (value && !value.startsWith("http://") && !value.startsWith("https://")) {
      // Check if it looks like they're typing a domain (has at least one character)
      if (value.length > 0) {
        value = `https://${value}`;
        // Adjust cursor position to account for added "https://"
        const newCursorPos = cursorPositionRef.current + 8;
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
          }
        }, 0);
      }
    }

    setWebsiteUrl(value);

    if (error) {
      setError("");
    }

    if (value.trim()) {
      const validation = validateDomain(value);
      if (!validation.isValid) {
        setError(validation.error || "");
      }
    }
  };

  const handleStartMonitoring = (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteUrl.trim()) return;

    const validation = validateDomain(websiteUrl);
    if (!validation.isValid) {
      setError(validation.error || "");
      return;
    }

    setIsLoading(true);

    let cleanUrl = websiteUrl.trim();
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = `https://${cleanUrl}`;
    }

    const monitoringAppUrl = `https://app.exit1.dev/?website=${encodeURIComponent(cleanUrl)}`;
    window.open(monitoringAppUrl, "_blank");

    setIsLoading(false);
  };

  const isFormValid = websiteUrl.trim() && !error;

  return (
    <PageShell>
      <PageContainer>
        <PageSection id="hero" className="pt-36 pb-20">
          <SectionContent className="p-8 sm:p-12 text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              Free uptime monitoring.
              <br />
              No limits. No catches.
            </h1>
            <p className="text-xl sm:text-2xl text-white/70 mb-16 max-w-2xl mx-auto leading-relaxed">
              Check every site, storefront, and API every minute. Unlimited monitors, instant alerts, SSL coverage. No bait-and-switch.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 py-6 text-lg font-semibold bg-white text-black hover:bg-white/90 cursor-pointer"
              >
                <a href="https://app.exit1.dev" target="_blank" rel="noopener noreferrer">
                  Start Monitoring
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 py-6 text-lg font-semibold border-white/20 hover:bg-white/5 cursor-pointer"
              >
                <Link href="/getting-started">
                  See How It Works
                </Link>
              </Button>
            </div>
          </SectionContent>
        </PageSection>

        <PageSection id="start-monitoring" className="py-16">
          <SectionContent size="sm" className="p-8 sm:p-12">
            <form onSubmit={handleStartMonitoring}>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <div className="relative flex-1">
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="example.com"
                    value={websiteUrl}
                    onChange={handleInputChange}
                    className={`h-12 bg-white/15 border-white/40 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-white/60 transition-all duration-300 cursor-pointer rounded-lg ${
                      error ? "border-red-400 focus:border-red-400" : ""
                    }`}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading || !isFormValid}
                  className="h-12 px-8 font-semibold bg-white/20 hover:bg-white/30 border border-white/40 text-white rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isLoading ? "Starting..." : "Start Monitoring"}
                </Button>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm mt-3">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <p className="text-base sm:text-lg text-white/70 mt-6 text-center font-medium">
                Enter your website URL and we&apos;ll set up monitoring in seconds
              </p>
            </form>
          </SectionContent>
        </PageSection>

        <PageSection className="!px-0">
          <div className="md:grid md:grid-cols-3 md:grid-rows-2">
            <FeatureGridItem
              href="/real-time-monitoring"
              title="1-minute checks"
              description="Default interval. No throttling. No paywall. Know when things break, not when your billing cycle resets."
              icon={<Zap className="w-6 h-6 text-white" />}
            />
            <FeatureGridItem
              href="/free-uptime-monitor"
              title="Unlimited monitors"
              description="Add as many sites as you need. No artificial limits. No upgrade prompts. Just monitoring that works."
              icon={<Globe className="w-6 h-6 text-white" />}
            />
            <FeatureGridItem
              href="/ssl-monitoring"
              title="SSL monitoring"
              description="Certificate expiry alerts. Domain validation. Full coverage without the enterprise price tag."
              icon={<Shield className="w-6 h-6 text-white" />}
            />
            <FeatureGridItem
              href="/analytics"
              title="Real-time analytics"
              description="Response times, uptime percentages, incident logs. All exportable. No data lock-in."
              icon={<BarChart3 className="w-6 h-6 text-white" />}
            />
            <FeatureGridItem
              href="/alerting"
              title="Smart Alerting"
              description="Webhook integration. Email alerts. SMS alerts. Custom rules."
              icon={<Bell className="w-6 h-6 text-white" />}
            />
            <FeatureGridItem
              href="/data-privacy"
              title="Data Privacy"
              description="GDPR compliant. No trackers. No ads. No data lock-in."
              icon={<Lock className="w-6 h-6 text-white" />}
            />
          </div>
        </PageSection>

        <PageSection className="py-12">
          <SectionContent className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Multi-region Monitoring, Real-time Map View
            </h2>
          </SectionContent>
        </PageSection>

        <PageSection className="!px-0">
          <div className="relative w-full aspect-video overflow-hidden">
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="https://i.gyazo.com/2e4d2a41faee50fd0013e5c146502f40.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="pointer-events-none absolute inset-0 border-inset" aria-hidden="true" />
          </div>
        </PageSection>

        <PageSection className="py-12">
          <SectionContent className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Analytics That Cut Through Noise
            </h2>
          </SectionContent>
        </PageSection>

        <PageSection className="!px-0">
          <div className="relative w-full aspect-video overflow-hidden">
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="https://i.gyazo.com/2c3ef8c205a6e7ea51d06bbae3e16ad1.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="pointer-events-none absolute inset-0 border-inset" aria-hidden="true" />
          </div>
        </PageSection>

        <PageSection id="infrastructure" className="py-20">
          <SectionContent size="sm" className="text-center p-8 sm:p-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
              Monitor everywhere.
            </h2>
            <p className="text-xl text-white/70 mb-8 leading-relaxed">
              Global monitoring locations. Instant alerts via email, webhooks and SMS. API access for automation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                variant="outline"
                className="rounded-full px-6 py-3 border-white/20 hover:bg-white/5 cursor-pointer"
              >
                <Link href="/global-monitoring">
                  More about infrastructure
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full px-6 py-3 border-white/20 hover:bg-white/5 cursor-pointer"
              >
                <Link href="/api-webhooks">
                  API Documentation
                </Link>
              </Button>
            </div>
          </SectionContent>
        </PageSection>

        <PageSection className="px-0 lg:px-0">
          <div className="text-center py-20 px-6 lg:px-8">
            <SectionContent className="p-8 sm:p-12">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
                Why it&apos;s free
              </h2>
              <p className="text-xl text-white/70 leading-relaxed">
                Uptime monitoring is table stakes. You shouldn&apos;t pay $20-50/month for basic HTTP checks and email alerts.
              </p>
            </SectionContent>
          </div>

          <div className="md:grid md:grid-cols-3">
            <FeatureGridItem
              href="/about"
              title="Built for ourselves first"
              description="We built this because the competition couldn&apos;t keep our side projects online without nagging us to upgrade. So we rolled our own."
              icon={<CheckCircle2 className="w-6 h-6 text-white" />}
            />
            <FeatureGridItem
              href="/global-monitoring"
              title="Boring infrastructure"
              description="Serverless at scale. Modern cloud infrastructure makes this cheap to run. We pass the savings to you."
              icon={<CheckCircle2 className="w-6 h-6 text-white" />}
            />
            <FeatureGridItem
              href="/data-privacy"
              title="No dark patterns"
              description="No bait-and-switch. No &ldquo;upgrade for alerts&rdquo; fine print. The free tier is the real tier."
              icon={<CheckCircle2 className="w-6 h-6 text-white" />}
            />
          </div>
        </PageSection>

      </PageContainer>
    </PageShell>
  );
}
