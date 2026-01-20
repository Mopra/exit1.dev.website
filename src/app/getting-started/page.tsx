"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Clock,
  Globe,
  Shield,
  Bell,
  Zap,
  Users,
  AlertCircle,
  Settings,
  Smartphone,
  Code,
  BarChart3,
  Mail,
  Webhook,
} from "lucide-react";
import Link from "next/link";
import { FeatureGridItem } from "@/components/FeatureGridItem";
import { PageContainer, PageSection, PageShell, SectionContent } from "@/components/PageLayout";

export default function GettingStartedPage() {
  return (
    <PageShell>
      <main>
        <PageContainer>
          <PageSection className="pt-24 sm:pt-28 pb-16">
            <SectionContent size="lg" className="text-center py-12 sm:py-16 lg:py-20">
              <Badge variant="secondary" className="mb-4 sm:mb-6 text-sm font-medium bg-white/10 text-white border border-white/10">
                <Clock className="w-3 h-3 mr-1" />
                Setup Guide
              </Badge>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
                Get Your Website Monitored
              </h1>

              <p className="text-xl text-white/70 mb-8 max-w-3xl mx-auto px-4 leading-relaxed">
                Stop wondering if your site is down. Set up monitoring in 5 minutes. No bullshit, just working monitoring.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full px-8 py-6 text-lg font-semibold bg-white text-black hover:bg-white/90 cursor-pointer"
                >
                  <a href="https://app.exit1.dev" target="_blank" rel="noopener noreferrer">
                    Open Exit1 App
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  size="lg"
                  className="rounded-full px-8 py-6 text-lg font-semibold border-white/20 hover:bg-white/5 cursor-pointer"
                >
                  <Link href="#setup-steps">
                    View Setup Steps
                  </Link>
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Online</span>
                </div>
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Down</span>
                </div>
                <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Error</span>
                </div>
              </div>
            </SectionContent>
          </PageSection>

          <PageSection id="setup-steps" className="py-8 scroll-mt-20">
            <SectionContent size="xl">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl sm:text-5xl font-semibold mb-3 tracking-tight">
                  Three steps
                </h2>
                <p className="text-lg text-white/60">
                  No complex setup. No confusing options. Just monitoring that works.
                </p>
              </div>
            </SectionContent>
          </PageSection>

          <PageSection className="py-20 sm:py-24">
            <SectionContent size="xl">
              <div className="max-w-4xl mx-auto">
                <div className="space-y-12 sm:space-y-16">
                  {/* Step 1 */}
                  <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
                    <div className="flex-shrink-0">
                      <div className="text-6xl sm:text-7xl font-semibold text-white/10 leading-none">
                        01
                      </div>
                    </div>
                    <div className="flex-1 space-y-6">
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-semibold mb-2 tracking-tight">
                          Create account
                        </h3>
                        <p className="text-white/60 text-lg">
                          Sign up for your free account at app.exit1.dev
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                          <span className="text-white/70">Use email or SSO (Google, GitHub, Discord)</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                          <span className="text-white/70">Verify your email address</span>
                        </div>
                      </div>
                      <Button
                        className="rounded-full bg-white text-black hover:bg-white/90 cursor-pointer w-full sm:w-auto"
                        asChild
                      >
                        <a href="https://app.exit1.dev" target="_blank" rel="noopener noreferrer">
                          Go to app
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-white/10" />

                  {/* Step 2 */}
                  <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
                    <div className="flex-shrink-0">
                      <div className="text-6xl sm:text-7xl font-semibold text-white/10 leading-none">
                        02
                      </div>
                    </div>
                    <div className="flex-1 space-y-6">
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-semibold mb-2 tracking-tight">
                          Add your website
                        </h3>
                        <p className="text-white/60 text-lg">
                          Set up your first monitoring check
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                          <span className="text-white/70">Click &quot;Add Check&quot; and enter your website URL</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                          <span className="text-white/70">Choose check frequency (1 min, 5 min, 1 hour, 24 hours)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-white/10" />

                  {/* Step 3 */}
                  <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
                    <div className="flex-shrink-0">
                      <div className="text-6xl sm:text-7xl font-semibold text-white/10 leading-none">
                        03
                      </div>
                    </div>
                    <div className="flex-1 space-y-6">
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-semibold mb-2 tracking-tight">
                          Monitor & alert
                        </h3>
                        <p className="text-white/60 text-lg">
                          Configure notifications and watch your site
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                          <span className="text-white/70">Set up email alerts for downtime</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                          <span className="text-white/70">Configure webhooks for Slack, Discord, or Teams (optional)</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                          <span className="text-white/70">SSL monitoring and uptime tracking included</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SectionContent>
          </PageSection>

          <PageSection className="py-8">
            <SectionContent size="xl">
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  What You Get (Besides Peace of Mind)
                </h2>
                <p className="text-lg text-white/70">
                  Real monitoring. Real alerts. Real results.
                </p>
              </div>
            </SectionContent>
          </PageSection>

          <PageSection className="!px-0 pt-0">
            <SectionContent size="xl">
              <div className="md:grid md:grid-cols-3 md:grid-rows-2">
                <FeatureGridItem
                  href="/real-time-monitoring"
                  title="Real-Time Monitoring"
                  description="Check your website every minute with instant status updates and response time tracking."
                  icon={<Zap className="w-6 h-6 text-white" />}
                />
                <FeatureGridItem
                  href="/ssl-monitoring"
                  title="SSL Certificate Monitoring"
                  description="Automatic tracking of SSL certificate expiry dates with alerts before expiration."
                  icon={<Shield className="w-6 h-6 text-white" />}
                />
                <FeatureGridItem
                  href="/global-monitoring"
                  title="Global Monitoring"
                  description="Monitor from multiple locations worldwide to ensure global availability."
                  icon={<Globe className="w-6 h-6 text-white" />}
                />
                <FeatureGridItem
                  href="/alerting"
                  title="Smart Notifications"
                  description="Email alerts, webhooks, and Discord integration for instant issue notifications."
                  icon={<Bell className="w-6 h-6 text-white" />}
                />
                <FeatureGridItem
                  href="/analytics"
                  title="Performance Analytics"
                  description="Track uptime percentages, response times, and reliability scores over time."
                  icon={<BarChart3 className="w-6 h-6 text-white" />}
                />
                <FeatureGridItem
                  href="/api-webhooks"
                  title="API Access"
                  description="Full REST API with webhook support for integration with your existing tools."
                  icon={<Code className="w-6 h-6 text-white" />}
                />
              </div>
            </SectionContent>
          </PageSection>

          <PageSection className="py-8">
            <SectionContent size="xl">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl sm:text-5xl font-semibold mb-3 tracking-tight">
                  Set up alerts
                </h2>
                <p className="text-lg text-white/60">
                  Monitoring without alerts is like having a smoke detector without batteries.
                </p>
              </div>
            </SectionContent>
          </PageSection>

          <PageSection className="py-20 sm:py-24">
            <SectionContent size="xl">
              <div className="max-w-4xl mx-auto">
                <div className="space-y-16 sm:space-y-20">
                  {/* Email Alerts */}
                  <div className="space-y-8">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Mail className="w-5 h-5 text-white/60" />
                        <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                          Email alerts
                        </h3>
                      </div>
                      <p className="text-white/60 text-lg mb-6">
                        Get instant notifications when your site goes down or SSL certificates expire.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                        <span className="text-white/70">Navigate to &quot;Emails&quot; in the sidebar</span>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                        <span className="text-white/70">Add your email address</span>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                        <span className="text-white/70">Select alert types (Website Down, SSL Issues)</span>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                        <span className="text-white/70">Send a test email to verify setup</span>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-5 mt-8">
                      <div className="text-sm text-white/50 mb-3 font-medium">Email example</div>
                      <div className="space-y-2 text-sm font-mono text-white/70">
                        <div className="text-red-400 font-semibold">⚠ Website Down Alert</div>
                        <div>Site: example.com</div>
                        <div>Status: Offline</div>
                        <div>Last Check: 2 minutes ago</div>
                        <div>Response Time: Timeout</div>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-white/10" />

                  {/* Webhooks */}
                  <div className="space-y-8">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Webhook className="w-5 h-5 text-white/60" />
                        <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                          Webhooks
                        </h3>
                      </div>
                      <p className="text-white/60 text-lg mb-6">
                        Integrate with Slack, Discord, Teams, or custom endpoints for real-time notifications.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                        <span className="text-white/70">Go to &quot;Webhooks&quot; in the sidebar</span>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                        <span className="text-white/70">Create webhook with your endpoint URL</span>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                        <span className="text-white/70">Choose which events to send</span>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                        <span className="text-white/70">Test with sample payload</span>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-5 mt-8">
                      <div className="text-sm text-white/50 mb-3 font-medium">Webhook payload</div>
                      <pre className="text-xs font-mono text-white/70 overflow-x-auto">
{`{
  "event": "website.down",
  "site": "example.com",
  "status": "offline",
  "timestamp": "2024-01-15T10:30:00Z",
  "response_time": null
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </SectionContent>
          </PageSection>

          <PageSection className="py-8">
            <SectionContent size="xl">
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Perfect For Every Use Case
                </h2>
                <p className="text-lg text-white/70">
                  From personal blogs to enterprise applications.
                </p>
              </div>
            </SectionContent>
          </PageSection>

          <PageSection className="!px-0 pt-0">
            <SectionContent size="xl">
              <div className="md:grid md:grid-cols-3">
                <div className="bg-black px-20 py-20 border-inset space-y-4">
                  <h3 className="text-xl font-semibold mb-4 tracking-tight flex items-center gap-2">
                    <Users className="w-5 h-5 text-white/60" />
                    Personal Website
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                      <span className="text-white/70">Check frequency: 5 minutes</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                      <span className="text-white/70">Notifications: Email alerts</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                      <span className="text-white/70">Monitor: Main site + SSL</span>
                    </div>
                  </div>
                </div>

                <div className="bg-black px-20 py-20 border-inset space-y-4">
                  <h3 className="text-xl font-semibold mb-4 tracking-tight flex items-center gap-2">
                    <Settings className="w-5 h-5 text-white/60" />
                    Business Application
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                      <span className="text-white/70">Check frequency: 1 minute (Premium)</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                      <span className="text-white/70">Notifications: Email + Webhooks</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                      <span className="text-white/70">Monitor: APIs + Critical pages</span>
                    </div>
                  </div>
                </div>

                <div className="bg-black px-20 py-20 border-inset space-y-4">
                  <h3 className="text-xl font-semibold mb-4 tracking-tight flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-white/60" />
                    E-commerce Site
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                      <span className="text-white/70">Check frequency: 1 minute (Premium)</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                      <span className="text-white/70">Notifications: Email + Webhook + SMS</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                      <span className="text-white/70">Monitor: Homepage + Checkout + APIs</span>
                    </div>
                  </div>
                </div>
              </div>
            </SectionContent>
          </PageSection>

          <PageSection className="py-8">
            <SectionContent size="md">
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Common Issues (And How to Fix Them)
                </h2>
                <p className="text-lg text-white/70">
                  Most problems are simple. Here&apos;s how to solve them.
                </p>
              </div>
            </SectionContent>
          </PageSection>

          <PageSection className="!px-0 pt-0">
            <SectionContent size="md" className="max-w-none">
              <div className="space-y-0">
                <div className="bg-black px-20 py-20 border-inset space-y-4">
                  <h3 className="text-xl font-semibold mb-2 tracking-tight flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-white/60" />
                    Check Shows &quot;Unknown&quot; Status
                  </h3>
                  <p className="text-white/70 mb-4">
                    This is normal for the first few minutes. Here&apos;s what to check:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                      <span className="text-white/70">Wait 2-3 minutes for the first check to complete</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                      <span className="text-white/70">Ensure your URL is accessible from the internet</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                      <span className="text-white/70">Include https:// if your site requires it</span>
                    </div>
                  </div>
                </div>

                <div className="bg-black px-20 py-20 border-inset space-y-4">
                  <h3 className="text-xl font-semibold mb-2 tracking-tight flex items-center gap-2">
                    <Bell className="w-5 h-5 text-white/60" />
                    Notifications Not Working
                  </h3>
                  <p className="text-white/70 mb-4">
                    If alerts aren&apos;t coming through, check these:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                      <span className="text-white/70">Check your spam folder</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                      <span className="text-white/70">Verify webhook URL returns 200 status</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                      <span className="text-white/70">Test notification settings in the app</span>
                    </div>
                  </div>
                </div>

                <div className="bg-black px-20 py-20 border-inset space-y-4">
                  <h3 className="text-xl font-semibold mb-2 tracking-tight flex items-center gap-2">
                    <Clock className="w-5 h-5 text-white/60" />
                    High Response Times
                  </h3>
                  <p className="text-white/70 mb-4">
                    Slow response times? Don&apos;t worry:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                      <span className="text-white/70">First few checks may be slower (normal)</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                      <span className="text-white/70">Response times stabilize over time</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                      <span className="text-white/70">Check your website&apos;s actual performance</span>
                    </div>
                  </div>
                </div>
              </div>
            </SectionContent>
          </PageSection>

        </PageContainer>
      </main>
    </PageShell>
  );
}
