import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  CheckCircle2,
  Globe,
  Shield,
  Zap,
  Search,
  Webhook,
  Wrench,
} from "lucide-react";
import { FeatureGridItem } from "@/components/FeatureGridItem";
import { PageContainer, PageSection, PageShell, SectionContent } from "@/components/PageLayout";
import Image from "next/image";
import { MonitorForm } from "@/components/MonitorForm";
import { PricingToggle } from "@/components/PricingToggle";
import { LazyVideo } from "@/components/LazyVideo";

export default function NewHomePage() {
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
            <MonitorForm />
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
                  <span className="text-xs text-white/70 font-medium">Made and hosted in the</span>
                  <span className="text-xs text-white/70 font-bold">European Union</span>
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
              <LazyVideo
                src="/adding-checks.mp4"
                className="w-full h-auto scale-[1.6]"
              />
            </div>
          </SectionContent>
        </PageSection>

        {/* Testimonial Section */}
        <PageSection className="py-20">
          <SectionContent size="md">
            <div className="grid gap-6">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 sm:p-12">
                <p className="text-lg sm:text-xl text-white/90 leading-relaxed mb-8">
                  &ldquo;The support at exit1.dev is absolutely absurd—I&apos;ve never felt so backed by a tool, and the product itself is fabulous, delivering 10x the performance of our old stack at a mere fraction of the cost.&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <Image
                    src="/testimonials/Kerners Nicholas Schibuola.jpeg"
                    alt="Nicholas Schibuola"
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-white">Nicholas Schibuola</div>
                    <a
                      href="https://kerners.co/"
                      target="_blank"
                      rel="noopener"
                      className="flex items-center gap-2 text-white/60 text-sm hover:text-white/80 transition-colors"
                    >
                      <Image
                        src="/testimonials/Kerners Logo.jpeg"
                        alt="Kerners"
                        width={20}
                        height={20}
                        className="rounded-sm"
                      />
                      Kerners
                    </a>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 sm:p-12">
                <p className="text-lg sm:text-xl text-white/90 leading-relaxed mb-8">
                  &ldquo;We&apos;ve loved using Exit1 to provide distributed &amp; worldwide monitoring to our clients websites and critical business applications, with lightning fast SMS, Webhook and email alerts, reasonable no-nonsense pricing, and friendly support who will always lend a helping hand. There&apos;s not really a better choice&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <Image
                    src="/testimonials/4u Entertainment Kai Randles.jpg"
                    alt="Kai Randles"
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-white">Kai Randles</div>
                    <a
                      href="https://4umediagroup.co.uk/"
                      target="_blank"
                      rel="noopener"
                      className="flex items-center gap-2 text-white/60 text-sm hover:text-white/80 transition-colors"
                    >
                      <Image
                        src="/testimonials/4u Entertainment Logo.png"
                        alt="4u Entertainment"
                        width={20}
                        height={20}
                        className="rounded-sm"
                      />
                      4u Entertainment
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </SectionContent>
        </PageSection>

        <PageSection className="!px-0">
          <div className="md:grid md:grid-cols-3 md:grid-rows-2">
            <FeatureGridItem
              href="/real-time-monitoring"
              title="Fast check intervals"
              description="5-minute checks on Free, 1-minute on Nano. No throttling. Know when things break, not when your billing cycle resets."
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
            <FeatureGridItem
              href="/maintenance-mode"
              title="Maintenance Mode"
              description="Suppress alerts during planned work. Checks keep running, data keeps flowing, your phone stays silent."
              icon={<Wrench className="w-6 h-6 text-white" />}
              className="md:col-span-3"
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
            <LazyVideo
              src="https://i.gyazo.com/2e4d2a41faee50fd0013e5c146502f40.mp4"
              className="w-full h-full object-cover"
            />
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
            <LazyVideo
              src="https://i.gyazo.com/2c3ef8c205a6e7ea51d06bbae3e16ad1.mp4"
              className="w-full h-full object-cover"
            />
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

        {/* Integrations Section */}
        <PageSection id="integrations" className="py-20">
          <SectionContent className="text-center p-8 sm:p-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
              Integrate with your stack
            </h2>
            <p className="text-xl text-white/70 mb-12 leading-relaxed max-w-2xl mx-auto">
              Get alerts where your team already works. Native integrations plus webhooks for everything else.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {/* Slack */}
              <div className="p-8 rounded-2xl border border-white/10 bg-white/5 text-center hover:bg-white/[0.07] transition-colors">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-white/10 flex items-center justify-center">
                  <Image
                    src="/slack.svg"
                    alt="Slack"
                    width={32}
                    height={32}
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">Slack</h3>
                <p className="text-white/60 text-sm">
                  Instant alerts in your channels. No context switching.
                </p>
              </div>

              {/* Discord */}
              <div className="p-8 rounded-2xl border border-white/10 bg-white/5 text-center hover:bg-white/[0.07] transition-colors">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-white/10 flex items-center justify-center">
                  <Image
                    src="/discord.svg"
                    alt="Discord"
                    width={32}
                    height={32}
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">Discord</h3>
                <p className="text-white/60 text-sm">
                  Stay informed with your community or team server.
                </p>
              </div>

              {/* Teams */}
              <div className="p-8 rounded-2xl border border-white/10 bg-white/5 text-center hover:bg-white/[0.07] transition-colors">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-white/10 flex items-center justify-center">
                  <Image
                    src="/integrations/teams.svg"
                    alt="Microsoft Teams"
                    width={32}
                    height={32}
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">Teams</h3>
                <p className="text-white/60 text-sm">
                  Alerts directly in your Microsoft Teams channels.
                </p>
              </div>

              {/* Webhooks */}
              <div className="p-8 rounded-2xl border border-white/10 bg-white/5 text-center hover:bg-white/[0.07] transition-colors">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-white/10 flex items-center justify-center">
                  <Webhook className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Webhooks</h3>
                <p className="text-white/60 text-sm">
                  Connect to any platform. PagerDuty, Opsgenie, custom systems.
                </p>
              </div>
            </div>

            {/* Logo Wall */}
            <div className="mt-16 pt-12 border-t border-white/10">
              <p className="text-sm text-white/50 mb-8 uppercase tracking-wider font-medium">
                Works with any webhook-enabled platform
              </p>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-6 max-w-4xl mx-auto items-center justify-items-center">
                {[
                  { name: "PagerDuty", src: "/integrations/pagerduty.svg" },
                  { name: "Opsgenie", src: "/integrations/opsgenie.svg" },
                  { name: "Microsoft Teams", src: "/integrations/teams.svg" },
                  { name: "Zapier", src: "/integrations/zapier.svg" },
                  { name: "Make", src: "/integrations/make.svg" },
                  { name: "n8n", src: "/integrations/n8n.svg" },
                  { name: "Telegram", src: "/integrations/telegram.svg" },
                  { name: "Jira", src: "/integrations/jira.svg" },
                  { name: "Linear", src: "/integrations/linear.svg" },
                  { name: "GitHub", src: "/integrations/github.svg" },
                  { name: "GitLab", src: "/integrations/gitlab.svg" },
                  { name: "Notion", src: "/integrations/notion.svg" },
                  { name: "Datadog", src: "/integrations/datadog.svg" },
                  { name: "Splunk", src: "/integrations/splunk.svg" },
                ].map((integration) => (
                  <div
                    key={integration.name}
                    className="group flex items-center justify-center w-12 h-12 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    title={integration.name}
                  >
                    <Image
                      src={integration.src}
                      alt={integration.name}
                      width={24}
                      height={24}
                      className="opacity-90 group-hover:opacity-100 transition-opacity brightness-0 invert"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12">
              <Button
                asChild
                variant="outline"
                className="rounded-full px-6 py-3 border-white/20 hover:bg-white/5 cursor-pointer"
              >
                <Link href="/api-webhooks">
                  View integration docs
                  <ArrowRight className="ml-2 w-4 h-4" />
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
                    50 monitors
                  </li>
                  <li className="flex items-center gap-2 text-white/80">
                    <Check className="w-4 h-4 text-green-400" />
                    5-minute check intervals
                  </li>
                  <li className="flex items-center gap-2 text-white/80">
                    <Check className="w-4 h-4 text-green-400" />
                    SSL certificate monitoring
                  </li>
                  <li className="flex items-center gap-2 text-white/80">
                    <Check className="w-4 h-4 text-green-400" />
                    Email alerts (10/hour, 10/month)
                  </li>
                  <li className="flex items-center gap-2 text-white/80">
                    <Check className="w-4 h-4 text-green-400" />
                    1 webhook integration
                  </li>
                  <li className="flex items-center gap-2 text-white/80">
                    <Check className="w-4 h-4 text-green-400" />
                    1 public status page
                  </li>
                  <li className="flex items-center gap-2 text-white/80">
                    <Check className="w-4 h-4 text-green-400" />
                    Analytics & logs (30 days)
                  </li>
                  <li className="flex items-center gap-2 text-white/80">
                    <Check className="w-4 h-4 text-green-400" />
                    Bulk import — migrate from any service in minutes
                  </li>
                  <li className="flex items-center gap-2 text-white/80">
                    <Check className="w-4 h-4 text-green-400" />
                    Bulk edit — configure hundreds of checks at once
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
              <PricingToggle />
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
