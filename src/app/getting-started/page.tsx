"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  CheckCircle, 
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
  Webhook
} from 'lucide-react';
import Link from 'next/link';

export default function GettingStartedPage() {
  return (
    <div className="min-h-screen bg-background">
             {/* Hero Section */}
       <section className="relative pt-16 sm:pt-20 md:pt-24 lg:pt-32 pb-12 sm:pb-16 overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-transparent to-transparent" />
         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center">
                           <Badge variant="default" className="mb-4 sm:mb-6 text-sm font-medium">
                <Clock className="w-3 h-3 mr-1" />
                Setup Guide
              </Badge>
             
             <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight">
               Get Your Website Monitored
             </h1>
             
             <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
               Stop wondering if your site is down. Set up monitoring in 5 minutes. No bullshit, just working monitoring.
             </p>

             <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12">
               <Button
                 asChild
                 size="lg"
                 className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-semibold glass-primary border backdrop-blur-md hover:scale-105 transition-all duration-300 w-full sm:w-auto interactive"
               >
                 <a href="https://app.exit1.dev" target="_blank" rel="noopener noreferrer">
                   Open Exit1 App
                   <ArrowRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                 </a>
               </Button>
               <Button
                 variant="outline"
                 asChild
                 size="lg"
                 className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-semibold backdrop-blur-md hover:scale-105 transition-all duration-300 w-full sm:w-auto interactive"
               >
                 <Link href="#setup-steps">
                   View Setup Steps
                 </Link>
               </Button>
             </div>

             {/* Status Indicators Preview */}
             <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
               <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 sm:px-4 py-2">
                 <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                 <span className="text-xs sm:text-sm font-medium">Online</span>
               </div>
               <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 sm:px-4 py-2">
                 <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></div>
                 <span className="text-xs sm:text-sm font-medium">Down</span>
               </div>
               <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 sm:px-4 py-2">
                 <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                 <span className="text-xs sm:text-sm font-medium">Error</span>
               </div>
             </div>
           </div>
         </div>
       </section>

             {/* Setup Steps */}
       <section id="setup-steps" className="py-12 sm:py-16 bg-card/50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-12 sm:mb-16">
             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
               Three Steps. That&apos;s It.
             </h2>
             <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
               No complex setup. No confusing options. Just monitoring that works.
             </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Step 1 */}
            <Card className="relative border-2 border-primary/20 hover:border-primary/40 transition-all duration-300">
                             <CardHeader className="text-center">
                 <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                   <span className="text-white font-bold text-lg sm:text-xl">1</span>
                 </div>
                 <CardTitle className="text-xl sm:text-2xl">Create Account</CardTitle>
                 <CardDescription className="text-sm sm:text-base">
                   Sign up for your free account
                 </CardDescription>
               </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Visit app.exit1.dev</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Use email or SSO (Google, GitHub, Discord)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Verify your email address</span>
                  </div>
                </div>
                                 <Button 
                   className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-semibold glass-primary border backdrop-blur-md hover:scale-105 transition-all duration-300 interactive" 
                   asChild
                 >
                   <a href="https://app.exit1.dev" target="_blank" rel="noopener noreferrer">
                     Go to App
                     <ArrowRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                   </a>
                 </Button>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="relative border-2 border-primary/20 hover:border-primary/40 transition-all duration-300">
                             <CardHeader className="text-center">
                 <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                   <span className="text-white font-bold text-lg sm:text-xl">2</span>
                 </div>
                 <CardTitle className="text-xl sm:text-2xl">Add Your Website</CardTitle>
                 <CardDescription className="text-sm sm:text-base">
                   Set up your first monitoring check
                 </CardDescription>
               </CardHeader>
                             <CardContent className="space-y-4">
                 <div className="space-y-2">
                   <div className="flex items-center gap-2">
                     <CheckCircle className="w-4 h-4 text-green-500" />
                     <span className="text-sm">Click &quot;Add Check&quot; button</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <CheckCircle className="w-4 h-4 text-green-500" />
                     <span className="text-sm">Enter your website URL</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <CheckCircle className="w-4 h-4 text-green-500" />
                     <span className="text-sm">Choose check frequency</span>
                   </div>
                 </div>
                 <div className="text-xs text-muted-foreground">
                   <strong>Available frequencies:</strong> 1 min, 5 min, 1 hour, 24 hours
                 </div>
                 <Button 
                   className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-semibold glass-primary border backdrop-blur-md hover:scale-105 transition-all duration-300 interactive" 
                   asChild
                 >
                   <a href="https://app.exit1.dev" target="_blank" rel="noopener noreferrer">
                     Add Your First Check
                     <ArrowRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                   </a>
                 </Button>
               </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="relative border-2 border-primary/20 hover:border-primary/40 transition-all duration-300">
                             <CardHeader className="text-center">
                 <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                   <span className="text-white font-bold text-lg sm:text-xl">3</span>
                 </div>
                 <CardTitle className="text-xl sm:text-2xl">Monitor & Alert</CardTitle>
                 <CardDescription className="text-sm sm:text-base">
                   Configure notifications and watch your site
                 </CardDescription>
               </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Set up email alerts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Configure webhooks (optional)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Monitor SSL and domain expiry</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  <strong>Included:</strong> SSL monitoring, domain expiry, uptime tracking
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

             {/* Key Features */}
       <section className="py-12 sm:py-16">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-12 sm:mb-16">
             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
               What You Get (Besides Peace of Mind)
             </h2>
             <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
               Real monitoring. Real alerts. Real results.
             </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card>
                             <CardHeader>
                 <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 mb-2" />
                 <CardTitle className="text-lg sm:text-xl">Real-Time Monitoring</CardTitle>
               </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Check your website every minute with instant status updates and response time tracking.
                </p>
              </CardContent>
            </Card>

            <Card>
                             <CardHeader>
                 <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mb-2" />
                 <CardTitle className="text-lg sm:text-xl">SSL Certificate Monitoring</CardTitle>
               </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Automatic tracking of SSL certificate expiry dates with alerts before expiration.
                </p>
              </CardContent>
            </Card>

            <Card>
                             <CardHeader>
                 <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 mb-2" />
                 <CardTitle className="text-lg sm:text-xl">Domain Expiry Alerts</CardTitle>
               </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get notified before your domain registration expires to prevent service disruption.
                </p>
              </CardContent>
            </Card>

            <Card>
                             <CardHeader>
                 <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 mb-2" />
                 <CardTitle className="text-lg sm:text-xl">Smart Notifications</CardTitle>
               </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Email alerts, webhooks, and Discord integration for instant issue notifications.
                </p>
              </CardContent>
            </Card>

            <Card>
                             <CardHeader>
                 <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 mb-2" />
                 <CardTitle className="text-lg sm:text-xl">Performance Analytics</CardTitle>
               </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Track uptime percentages, response times, and reliability scores over time.
                </p>
              </CardContent>
            </Card>

            <Card>
                             <CardHeader>
                 <Code className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500 mb-2" />
                 <CardTitle className="text-lg sm:text-xl">API Access</CardTitle>
               </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Full REST API with webhook support for integration with your existing tools.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

             {/* Notification Setup */}
       <section className="py-12 sm:py-16 bg-card/50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-12 sm:mb-16">
             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
               Set Up Alerts (Don&apos;t Skip This)
             </h2>
             <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
               Monitoring without alerts is like having a smoke detector without batteries.
             </p>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
            <div className="space-y-6">
                             <div className="space-y-4">
                 <h3 className="text-xl sm:text-2xl font-bold">Email Alerts</h3>
                 <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Navigate to &quot;Emails&quot; in the sidebar</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Add your email address</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Select alert types (Website Down, SSL Issues)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Send a test email to verify setup</span>
                  </div>
                </div>
              </div>

                             <div className="space-y-4">
                 <h3 className="text-xl sm:text-2xl font-bold">Webhooks (Advanced)</h3>
                 <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Go to &quot;Webhooks&quot; in the sidebar</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Create webhook with your endpoint URL</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Choose which events to send</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Test with sample payload</span>
                  </div>
                </div>
              </div>
            </div>

                         <div className="space-y-4 sm:space-y-6">
               <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                     <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                     Email Alert Example
                   </CardTitle>
                 </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-muted p-3 rounded text-sm font-mono">
                    <div className="text-red-500 font-bold">🚨 Website Down Alert</div>
                    <div>Site: example.com</div>
                    <div>Status: Offline</div>
                    <div>Last Check: 2 minutes ago</div>
                    <div>Response Time: Timeout</div>
                  </div>
                </CardContent>
              </Card>

                             <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                     <Webhook className="w-4 h-4 sm:w-5 sm:h-5" />
                     Webhook Payload
                   </CardTitle>
                 </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`{
  "event": "website.down",
  "site": "example.com",
  "status": "offline",
  "timestamp": "2024-01-15T10:30:00Z",
  "response_time": null
}`}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

             {/* Use Cases */}
       <section className="py-12 sm:py-16">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-12 sm:mb-16">
             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
               Perfect For Every Use Case
             </h2>
             <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
               From personal blogs to enterprise applications.
             </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <Card className="border-2 border-green-500/20">
              <CardHeader>
                                 <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                   <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                   Personal Website
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Check frequency: 5 minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Notifications: Email alerts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Monitor: Main site + SSL</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-500/20">
              <CardHeader>
                                 <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                   <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                   Business Application
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Check frequency: 1 minute (Premium)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Notifications: Email + Webhooks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Monitor: APIs + Critical pages</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-500/20">
              <CardHeader>
                                 <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                   <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                   E-commerce Site
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Check frequency: 1 minute (Premium)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Notifications: Email + Webhook + SMS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Monitor: Homepage + Checkout + APIs</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

             {/* Troubleshooting */}
       <section className="py-12 sm:py-16 bg-card/50">
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-12 sm:mb-16">
             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
               Common Issues (And How to Fix Them)
             </h2>
             <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
               Most problems are simple. Here&apos;s how to solve them.
             </p>
           </div>

           <div className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                                 <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                   <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                   Check Shows &quot;Unknown&quot; Status
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">
                  This is normal for the first few minutes. Here&apos;s what to check:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Wait 2-3 minutes for the first check to complete</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Ensure your URL is accessible from the internet</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Include https:// if your site requires it</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                                 <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                   <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                   Notifications Not Working
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">
                  If alerts aren&apos;t coming through, check these:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Check your spam folder</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Verify webhook URL returns 200 status</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Test notification settings in the app</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                                 <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                   <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                   High Response Times
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">
                  Slow response times? Don&apos;t worry:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>First few checks may be slower (normal)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Response times stabilize over time</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Check your website&apos;s actual performance</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-12 sm:py-16 lg:py-20 bg-card/50 backdrop-blur-md border-t border-primary/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6 tracking-tight">
            Ready to Stop Guessing?
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 px-2 sm:px-4">
            Your website is down right now and you don&apos;t even know it. Let&apos;s fix that.
          </p>
                     <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0">
             <Button
               asChild
               size="lg"
               className="px-6 sm:px-6 lg:px-8 py-4 sm:py-4 text-sm sm:text-base lg:text-lg font-semibold glass-primary border backdrop-blur-md hover:scale-105 transition-all duration-300 w-full sm:w-auto interactive"
             >
               <a href="https://app.exit1.dev" target="_blank" rel="noopener noreferrer">
                 Open Exit1 App
                 <ArrowRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4" />
               </a>
             </Button>
             <Button
               variant="outline"
               asChild
               size="lg"
               className="px-6 sm:px-6 lg:px-8 py-4 sm:py-4 text-sm sm:text-base lg:text-lg font-semibold backdrop-blur-md hover:scale-105 transition-all duration-300 w-full sm:w-auto interactive"
             >
               <a href="https://discord.com/invite/uZvWbpwJZS" target="_blank" rel="noopener noreferrer">
                 Get Help on Discord
               </a>
             </Button>
           </div>
        </div>
      </section>
    </div>
  );
}
