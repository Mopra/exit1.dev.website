import React from 'react';
import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: "Privacy Policy | exit1.dev",
  description: "Privacy policy for exit1.dev - Learn how we collect, use, and protect your data when using our website monitoring service.",
  openGraph: {
    title: "Privacy Policy | exit1.dev",
    description: "Privacy policy for exit1.dev - Learn how we collect, use, and protect your data when using our website monitoring service.",
  },
  twitter: {
    title: "Privacy Policy | exit1.dev",
    description: "Privacy policy for exit1.dev - Learn how we collect, use, and protect your data when using our website monitoring service.",
  },
};

const Privacy = () => {
  return (
    <main className="pt-24 sm:pt-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <Card className="mb-8 border-primary/20 backdrop-blur-md bg-background/50 glow-card">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight">Introduction</h2>
              <p className="text-muted-foreground mb-4">
                At exit1.dev, we respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our website monitoring service.
              </p>
              <p className="text-muted-foreground">
                By using our service, you agree to the collection and use of information in accordance with this policy.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8 border-primary/20 backdrop-blur-md bg-background/50 glow-card">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight">Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Personal Information</h3>
                  <p className="text-muted-foreground">
                    When you create an account, we collect your email address and any other information you choose to provide.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Monitoring Data</h3>
                  <p className="text-muted-foreground">
                    We collect data about the websites you monitor, including URLs, response times, status codes, and uptime information.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Usage Data</h3>
                  <p className="text-muted-foreground">
                    We collect information about how you use our service, including access logs, feature usage, and interaction data.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8 border-primary/20 backdrop-blur-md bg-background/50 glow-card">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight">How We Use Your Information</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  We use the collected information for the following purposes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>To provide and maintain our website monitoring service</li>
                  <li>To send you alerts and notifications about your monitored websites</li>
                  <li>To improve our service and develop new features</li>
                  <li>To communicate with you about your account and service updates</li>
                  <li>To ensure the security and integrity of our service</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8 border-primary/20 backdrop-blur-md bg-background/50 glow-card">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight">Data Security</h2>
              <p className="text-muted-foreground mb-4">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
              <p className="text-muted-foreground">
                Your data is encrypted in transit and at rest, and we regularly review our security practices to ensure the highest level of protection.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8 border-primary/20 backdrop-blur-md bg-background/50 glow-card">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight">Data Sharing</h2>
              <p className="text-muted-foreground mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>To comply with legal obligations</li>
                <li>To protect our rights and property</li>
                <li>To prevent fraud or security threats</li>
                <li>With your explicit consent</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8 border-primary/20 backdrop-blur-md bg-background/50 glow-card">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight">Your Rights</h2>
              <p className="text-muted-foreground mb-4">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Data portability</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8 border-primary/20 backdrop-blur-md bg-background/50 glow-card">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight">Cookies and Tracking</h2>
              <p className="text-muted-foreground mb-4">
                We use cookies and similar tracking technologies to improve your experience on our website and to analyze usage patterns.
              </p>
              <p className="text-muted-foreground">
                You can control cookie settings through your browser preferences, though disabling cookies may affect the functionality of our service.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8 border-primary/20 backdrop-blur-md bg-background/50 glow-card">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this privacy policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p>Email: privacy@exit1.dev</p>
                <p>Website: https://exit1.dev</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 backdrop-blur-md bg-background/50 glow-card">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight">Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &ldquo;Last updated&rdquo; date.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default Privacy;
