"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageContainer, PageSection, PageShell, SectionContent } from "@/components/PageLayout";
import { ArrowRight, Clock, Mail, Smartphone, Upload, Webhook } from "lucide-react";
import Link from "next/link";

export default function GettingStartedPage() {
  return (
    <PageShell>
      <main>
        <PageContainer>
          <PageSection className="pt-24 sm:pt-28 pb-16">
            <SectionContent size="lg" className="text-center py-12 sm:py-16 lg:py-20">
              <Badge
                variant="secondary"
                className="mb-4 sm:mb-6 text-sm font-medium bg-white/10 text-white border border-white/10"
              >
                <Clock className="w-3 h-3 mr-1" />
                Getting started
              </Badge>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
                Get your first checks live fast
              </h1>

              <p className="text-xl text-white/70 mb-8 max-w-3xl mx-auto px-4 leading-relaxed">
                This page is a simple guide to get your first monitoring checks live, configure alerts,
                and understand the core settings.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                  <Link href="#quick-start">Quick start</Link>
                </Button>
              </div>
            </SectionContent>
          </PageSection>

          <PageSection id="quick-start" className="py-8 scroll-mt-20">
            <SectionContent size="lg">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">Quick start (5 minutes)</h2>
                <ol className="mt-6 space-y-4 text-white/70 text-lg list-decimal pl-6">
                  <li>
                    <span className="text-white font-semibold">Create your first check:</span> Add a URL or host:port to
                    monitor.
                  </li>
                  <li>
                    <span className="text-white font-semibold">Pick the right interval:</span> Use longer intervals unless
                    the service is truly critical.
                  </li>
                  <li>
                    <span className="text-white font-semibold">Enable alerts:</span> Turn on Email, SMS, or Webhooks (or
                    all three).
                  </li>
                  <li>
                    <span className="text-white font-semibold">Verify delivery:</span> Send a test Email/SMS or test a
                    webhook.
                  </li>
                  <li>
                    <span className="text-white font-semibold">Watch Logs:</span> Confirm your first events and understand
                    how logs are stored.
                  </li>
                </ol>
              </div>
            </SectionContent>
          </PageSection>

          <PageSection id="bulk-import" className="py-8">
            <SectionContent size="lg">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Upload className="w-5 h-5 text-white" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold text-white">Made for scale</h3>
                      <p className="text-white/70 text-lg">
                        Exit1 is built to handle hundreds of checks. Bulk import lets you bring all your monitors over from
                        UptimeRobot, Freshping, Better Uptime, or any other service in minutes — no manual re-entry.
                        Once they&apos;re in, bulk edit lets you update intervals, alerts, and settings across all your checks at once.
                      </p>
                      <Button
                        asChild
                        size="lg"
                        className="rounded-full px-6 py-5 text-base font-semibold bg-white text-black hover:bg-white/90 cursor-pointer"
                      >
                        <a href="https://app.exit1.dev" target="_blank" rel="noopener noreferrer">
                          Open Bulk Import
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </SectionContent>
          </PageSection>

          <PageSection id="create-check" className="py-12">
            <SectionContent size="lg">
              <div className="max-w-4xl mx-auto space-y-10">
                <div className="space-y-3">
                  <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">Create your first check</h2>
                  <p className="text-lg text-white/60">Go to Checks &gt; Add Check and fill in:</p>
                </div>

                <div className="space-y-6 text-white/70">
                  <div className="space-y-2">
                    <div className="text-white font-semibold">URL / Host:Port</div>
                    <ul className="space-y-2 list-disc pl-6">
                      <li>For HTTP/HTTPS: enter a domain or full URL.</li>
                      <li>For TCP/UDP: enter host:port (example: db.example.com:5432).</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <div className="text-white font-semibold">Display name</div>
                    <p>Friendly label for dashboards and alerts.</p>
                  </div>

                  <div className="space-y-2">
                    <div className="text-white font-semibold">Check type</div>
                    <ul className="space-y-2 list-disc pl-6">
                      <li>Website or REST endpoint for HTTP/HTTPS.</li>
                      <li>TCP / UDP to verify a port is reachable.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <div className="text-white font-semibold">Check frequency</div>
                    <p>Choose how often we probe the target.</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Recommended defaults</h3>
                  <ul className="space-y-2 text-white/70 list-disc pl-6">
                    <li>Frequency: 5-15 minutes for most sites; 1-2 minutes only for critical paths.</li>
                    <li>Immediate re-check: Keep enabled for fewer false alarms.</li>
                    <li>Down confirmation attempts: Default is 4 consecutive failures.</li>
                  </ul>
                </div>
              </div>
            </SectionContent>
          </PageSection>

          <PageSection id="important-settings" className="py-12">
            <SectionContent size="lg">
              <div className="max-w-5xl mx-auto space-y-10">
                <div className="space-y-3">
                  <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">Important settings explained</h2>
                  <p className="text-lg text-white/60">Use these settings to tune accuracy vs. noise.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-3">
                    <h3 className="text-xl font-semibold text-white">Check frequency</h3>
                    <p className="text-white/70">Pick from 1, 2, 5, 10, 15, 30, 60 minutes, or 24 hours.</p>
                    <ul className="space-y-2 text-white/70 list-disc pl-6">
                      <li>Short intervals detect incidents faster but can increase noise.</li>
                      <li>Longer intervals smooth out brief DNS or network hiccups.</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-3">
                    <h3 className="text-xl font-semibold text-white">Immediate re-check (recommended)</h3>
                    <p className="text-white/70">
                      When enabled, Exit1 re-checks a failed endpoint after 30 seconds to confirm it is a real outage
                      before alerting.
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-3">
                    <h3 className="text-xl font-semibold text-white">Down confirmation attempts</h3>
                    <p className="text-white/70">
                      How many consecutive failed checks are required before marking a target as down.
                    </p>
                    <ul className="space-y-2 text-white/70 list-disc pl-6">
                      <li>Default: 4</li>
                      <li>Range: 1-99</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-3">
                    <h3 className="text-xl font-semibold text-white">HTTP method</h3>
                    <p className="text-white/70">For HTTP/HTTPS checks you can choose GET, POST, PUT, PATCH, DELETE, or HEAD.</p>
                    <p className="text-white/70">GET is recommended for uptime checks (some hosts block HEAD).</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-3">
                    <h3 className="text-xl font-semibold text-white">Request headers</h3>
                    <p className="text-white/70">Add custom headers (one per line). Example:</p>
                    <pre className="text-xs sm:text-sm font-mono text-white/70 bg-black/40 border border-white/10 rounded-md p-3">
{`Authorization: Bearer YOUR_TOKEN
Accept: application/json`}
                    </pre>
                    <p className="text-white/70">Default User-Agent is Exit1-Website-Monitor/1.0.</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-3">
                    <h3 className="text-xl font-semibold text-white">Request body</h3>
                    <p className="text-white/70">For POST/PUT/PATCH, provide a JSON body (or any plain text) that your endpoint expects.</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-3">
                    <h3 className="text-xl font-semibold text-white">Response validation</h3>
                    <p className="text-white/70">Provide comma-separated keywords (for example: success,online,healthy).</p>
                    <p className="text-white/70">If none are found in the response body, the check is treated as failed.</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-3">
                    <h3 className="text-xl font-semibold text-white">Force no-cache</h3>
                    <p className="text-white/70">Adds Cache-Control: no-cache to the request. Use this if your site is heavily cached.</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-3">
                    <h3 className="text-xl font-semibold text-white">Status handling</h3>
                    <p className="text-white/70">
                      For HTTP checks, 2xx and 3xx are treated as Up, and 401/403 also count as Up for protected endpoints.
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-3">
                    <h3 className="text-xl font-semibold text-white">TCP/UDP checks</h3>
                    <p className="text-white/70">
                      TCP/UDP checks only verify that a port is reachable. No HTTP headers, bodies, or SSL rules apply.
                    </p>
                  </div>
                </div>
              </div>
            </SectionContent>
          </PageSection>

          <PageSection id="alerts" className="py-12">
            <SectionContent size="lg">
              <div className="max-w-5xl mx-auto space-y-12">
                <div className="text-center space-y-3">
                  <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">Alerts basics</h2>
                  <p className="text-lg text-white/60">
                    Exit1 supports Email, SMS, and Webhook notifications. All channels can be configured globally and per-check.
                  </p>
                </div>

                <div className="space-y-10">
                  <div className="bg-black/40 border border-white/10 rounded-lg p-6 space-y-6">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-white/60" />
                      <h3 className="text-2xl font-semibold">Email alerts</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="text-white font-semibold">Setup</div>
                      <ol className="space-y-2 text-white/70 list-decimal pl-6">
                        <li>Go to Emails.</li>
                        <li>Add your email address.</li>
                        <li>Choose alert types: Down, Up, SSL Error, SSL Warning.</li>
                        <li>Optionally customize per-check alerts.</li>
                        <li>Send a Test Email to confirm delivery.</li>
                      </ol>
                    </div>
                    <div className="space-y-4">
                      <div className="text-white font-semibold">How email alerts behave</div>
                      <ul className="space-y-2 text-white/70 list-disc pl-6">
                        <li>Alerts send only when a check flips states.</li>
                        <li>Down/Up alerts can resend roughly a minute after the last one.</li>
                        <li>You get a shared budget of up to 10 alert emails per hour.</li>
                        <li>Flap suppression waits for the number of consecutive results you choose (1-5).</li>
                        <li>SSL and domain reminders use longer windows and count toward the budget.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-black/40 border border-white/10 rounded-lg p-6 space-y-6">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-white/60" />
                      <h3 className="text-2xl font-semibold">SMS alerts</h3>
                    </div>
                    <p className="text-white/70">Availability: SMS alerts are available on the Nano plan or for administrators.</p>
                    <div className="space-y-4">
                      <div className="text-white font-semibold">Setup</div>
                      <ol className="space-y-2 text-white/70 list-decimal pl-6">
                        <li>Go to SMS.</li>
                        <li>Add a phone number.</li>
                        <li>Choose alert types (Down, Up, SSL Error, SSL Warning).</li>
                        <li>Optionally customize per-check alerts.</li>
                        <li>Send a Test SMS.</li>
                      </ol>
                    </div>
                    <div className="space-y-4">
                      <div className="text-white font-semibold">How SMS alerts behave</div>
                      <ul className="space-y-2 text-white/70 list-disc pl-6">
                        <li>Texts send only when a check flips states.</li>
                        <li>Down/Up alerts can resend roughly a minute after the last one.</li>
                        <li>SMS uses a separate hourly budget to avoid spam.</li>
                        <li>Flap suppression waits for the number of consecutive results you choose (1-5).</li>
                        <li>SSL and domain reminders use longer windows and count toward the budget.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-black/40 border border-white/10 rounded-lg p-6 space-y-6">
                    <div className="flex items-center gap-3">
                      <Webhook className="w-5 h-5 text-white/60" />
                      <h3 className="text-2xl font-semibold">Webhook alerts</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="text-white font-semibold">Setup</div>
                      <ol className="space-y-2 text-white/70 list-decimal pl-6">
                        <li>Go to Webhooks and click New Webhook.</li>
                        <li>Provide an HTTPS URL for your endpoint.</li>
                        <li>Select events (Down, Up, SSL Error, SSL Warning).</li>
                        <li>Choose All checks or Include specific checks only.</li>
                        <li>Optional: add a secret and custom headers (JSON).</li>
                        <li>Choose a webhook type: Slack, Discord, or Generic.</li>
                        <li>Save and Test Webhook.</li>
                      </ol>
                    </div>
                    <div className="space-y-4">
                      <div className="text-white font-semibold">Notes</div>
                      <ul className="space-y-2 text-white/70 list-disc pl-6">
                        <li>Use a secret to help your receiver validate requests.</li>
                        <li>
                          Custom headers must be valid JSON (for example:{" "}
                          <span className="font-mono text-white/80">{`{\"Authorization\": \"Bearer TOKEN\"}`}</span>).
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </SectionContent>
          </PageSection>

          <PageSection id="logs" className="py-12">
            <SectionContent size="lg">
              <div className="max-w-4xl mx-auto space-y-10">
                <div className="space-y-3 text-center">
                  <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">Logs basics</h2>
                  <p className="text-lg text-white/60">Logs help you understand why an alert fired.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-3">
                    <h3 className="text-xl font-semibold text-white">How logs work</h3>
                    <ul className="space-y-2 text-white/70 list-disc pl-6">
                      <li>Logs are stored only when a check changes state or errors.</li>
                      <li>If a service is stable, logs will be quiet.</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-3">
                    <h3 className="text-xl font-semibold text-white">How to use logs</h3>
                    <ol className="space-y-2 text-white/70 list-decimal pl-6">
                      <li>Go to Logs.</li>
                      <li>Select a check and time range.</li>
                      <li>Review status, response time, and any error details.</li>
                    </ol>
                  </div>
                </div>
              </div>
            </SectionContent>
          </PageSection>

          <PageSection id="next" className="py-12">
            <SectionContent size="lg">
              <div className="max-w-4xl mx-auto space-y-6">
                <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-center">What to do next</h2>
                <ul className="space-y-3 text-white/70 text-lg list-disc pl-6">
                  <li>Add checks for every critical endpoint.</li>
                  <li>Enable at least one alert channel (Email is the fastest to set up).</li>
                  <li>Use Webhooks to connect alerts to incident workflows (Slack, Discord, custom systems).</li>
                  <li>Watch Logs after your first alert to confirm everything is configured correctly.</li>
                  <li>Read the <a href="https://docs.exit1.dev/getting-started" target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-4 hover:text-white/80 transition-colors">full documentation</a> for in-depth guides on every feature.</li>
                </ul>
              </div>
            </SectionContent>
          </PageSection>
        </PageContainer>
      </main>
    </PageShell>
  );
}
