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
  Check,
  CheckCircle2,
  Globe,
  Shield,
  Zap,
  Search,
} from "lucide-react";
import { validateDomain } from "@/lib/domainUtils";
import { FeatureGridItem } from "@/components/FeatureGridItem";
import { PageContainer, PageSection, PageShell, SectionContent } from "@/components/PageLayout";
import Image from "next/image";

export default function NewHomePage() {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAnnual, setIsAnnual] = useState(true);
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
              Uptime monitoring.
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

        {/* Social Proof Section */}
        <PageSection className="py-6 border-y border-white/10 bg-white/[0.02]">
          <SectionContent>
            <div className="flex flex-col sm:grid sm:grid-cols-3 items-center gap-6 sm:gap-0">
              <div className="flex items-center justify-center gap-3 sm:border-r sm:border-white/20">
                <Image
                  src="/eu.svg"
                  alt="European Union flag"
                  width={48}
                  height={32}
                  className="rounded-sm"
                />
                <div className="flex flex-col">
                  <span className="text-xs text-white/60 font-medium">Made and hosted in the</span>
                  <span className="text-xs text-white/60 font-bold">European Union</span>
                </div>
              </div>
              <a
                href="https://peerpush.net/p/exit1dev"
                target="_blank"
                rel="noopener"
                className="flex justify-center sm:border-r sm:border-white/20 opacity-70 hover:opacity-100 transition-opacity"
              >
                <Image
                  src="https://peerpush.net/p/exit1dev/badge"
                  alt="Exit1.dev badge"
                  width={130}
                  height={32}
                  unoptimized
                />
              </a>
              <div className="flex justify-center">
                <a
                  href="https://discord.com/invite/uZvWbpwJZS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#5865F2] hover:bg-[#4752C4] rounded-md transition-colors duration-200"
                >
                  <Image
                    src="/discord.svg"
                    alt="Discord"
                    width={16}
                    height={16}
                  />
                  <span className="text-sm font-medium text-white">Join Discord</span>
                </a>
              </div>
            </div>
          </SectionContent>
        </PageSection>

        <PageSection>
          <SectionContent size="xl">
            <div className="overflow-hidden rounded-lg border border-white/10 shadow-2xl">
              <video
                className="w-full h-auto scale-[1.6]"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="/adding-checks.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
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
              href="/domain-intelligence"
              title="Domain Intelligence"
              description="Know when domains expire before they become someone else's problem. Automatic tracking, smart alerts."
              icon={<Search className="w-6 h-6 text-white" />}
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

        <PageSection id="pricing" className="py-20">
          <SectionContent className="text-center p-8 sm:p-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
              Simple pricing
            </h2>
            <p className="text-xl text-white/70 leading-relaxed max-w-2xl mx-auto mb-12">
              Start free with everything you need. Upgrade when you want more.
            </p>

            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Free Plan */}
              <div className="p-8 rounded-2xl border border-white/10 bg-white/5 text-left flex flex-col">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold">$0</span>
                </div>
                <p className="text-white/60 mb-6">Always free</p>
                <ul className="space-y-2 mb-6 flex-grow">
                  <li className="flex items-center gap-2 text-white/80">
                    <Check className="w-4 h-4 text-green-400" />
                    Unlimited monitors
                  </li>
                  <li className="flex items-center gap-2 text-white/80">
                    <Check className="w-4 h-4 text-green-400" />
                    1-minute checks
                  </li>
                  <li className="flex items-center gap-2 text-white/80">
                    <Check className="w-4 h-4 text-green-400" />
                    SSL monitoring
                  </li>
                  <li className="flex items-center gap-2 text-white/80">
                    <Check className="w-4 h-4 text-green-400" />
                    Email & webhook alerts
                  </li>
                </ul>
                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-full py-5 font-semibold border-white/20 hover:bg-white/5 mt-auto"
                >
                  <a href="https://app.exit1.dev" target="_blank" rel="noopener noreferrer">
                    Get Started
                  </a>
                </Button>
              </div>

              {/* Nano Plan */}
              <div className="p-8 rounded-2xl border border-white/20 bg-white/10 text-left flex flex-col">
                <h3 className="text-2xl font-bold mb-2">Nano</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold">${isAnnual ? 3 : 4}</span>
                  <span className="text-white/60">/month</span>
                </div>
                <p className="text-white/60 mb-3">{isAnnual ? "Billed annually" : "Billed monthly"}</p>
                
                {/* Billing toggle */}
                <div className="flex items-center gap-3 mb-6">
                  <button
                    onClick={() => setIsAnnual(false)}
                    className={`text-sm font-medium transition-colors ${
                      !isAnnual ? 'text-white' : 'text-white/50 hover:text-white/70'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setIsAnnual(!isAnnual)}
                    className="relative w-12 h-6 rounded-full bg-white/20 transition-colors cursor-pointer"
                    aria-label="Toggle billing period"
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                        isAnnual ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => setIsAnnual(true)}
                    className={`text-sm font-medium transition-colors ${
                      isAnnual ? 'text-white' : 'text-white/50 hover:text-white/70'
                    }`}
                  >
                    Annually
                    {isAnnual && (
                      <span className="ml-1 text-xs text-green-400">Save 25%</span>
                    )}
                  </button>
                </div>

                <ul className="space-y-2 mb-6 flex-grow">
                  <li className="flex items-center gap-2 text-white/80">
                    <Check className="w-4 h-4 text-green-400" />
                    Everything in Free
                  </li>
                  <li className="flex items-center gap-2 text-white/80">
                    <Check className="w-4 h-4 text-green-400" />
                    SMS alerts — know in seconds
                  </li>
                  <li className="flex items-center gap-2 text-white/80">
                    <Check className="w-4 h-4 text-green-400" />
                    Your domain (status.yourbrand.com)
                  </li>
                  <li className="flex items-center gap-2 text-white/80">
                    <Check className="w-4 h-4 text-green-400" />
                    Your logo, your colors
                  </li>
                  <li className="flex items-center gap-2 text-white/80">
                    <Check className="w-4 h-4 text-green-400" />
                    Domain expiry monitoring
                  </li>
                </ul>
                <Button
                  asChild
                  className="w-full rounded-full py-5 font-semibold bg-white text-black hover:bg-white/90 mt-auto"
                >
                  <a href="https://app.exit1.dev" target="_blank" rel="noopener noreferrer">
                    Get SMS Alerts
                  </a>
                </Button>
              </div>
            </div>

            <div className="mt-8">
              <Button
                asChild
                variant="link"
                className="text-white/70 hover:text-white"
              >
                <Link href="/pricing">
                  View full pricing details
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </SectionContent>
        </PageSection>

        <PageSection className="px-0 lg:px-0">
          <div className="text-center py-20 px-6 lg:px-8">
            <SectionContent className="p-8 sm:p-12">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
                A generous free tier
              </h2>
              <p className="text-xl text-white/70 leading-relaxed">
                Core monitoring shouldn&apos;t cost $20-50/month. We keep the essentials free because they should be.
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
              href="/pricing"
              title="Pay only for extras"
              description="Free covers everything hobbyists need. Nano is for professionals who monitor client sites, need SMS at 3am, or want branded status pages."
              icon={<CheckCircle2 className="w-6 h-6 text-white" />}
            />
          </div>
        </PageSection>

      </PageContainer>
    </PageShell>
  );
}
