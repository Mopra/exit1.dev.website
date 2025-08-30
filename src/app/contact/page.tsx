"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Mail, MessageCircle, Github, Linkedin, Twitter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ContactPage() {
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
            "@type": "ContactPage",
            "name": "Contact exit1.dev",
            "description": "Get in touch with the exit1.dev team for support, feature requests, or feedback.",
            "url": "https://exit1.dev/contact",
            "mainEntity": {
              "@type": "Person",
              "name": "Morten Pradsgaard",
              "jobTitle": "Founder & CTO",
              "email": "mailto:mortenprads@gmail.com"
            }
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
              Get in Touch
            </h1>

            <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8">
                Have a question, feature request, or just want to say hi? I&apos;m here to help. <strong>I want the tough feedback</strong>—it&apos;s how we build better software.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Methods Section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:gap-8 lg:gap-10 grid-cols-1 sm:grid-cols-2">
              
              {/* Direct Contact Card */}
              <Card className="bg-card/50 backdrop-blur-md border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl">Email</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    For direct questions, feature requests, or feedback. I read every email.
                  </p>
                  {email && (
                    <Button asChild className="w-full">
                      <a href={`mailto:${email.replace(/[at]/g, '@').replace(/[dot]/g, '.')}`}>
                        <Mail className="mr-2 w-4 h-4" />
                        {email}
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Community Card */}
              <Card className="bg-card/50 backdrop-blur-md border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MessageCircle className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl">Community</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Join our Discord community for help, ideas, and calling out nonsense.
                  </p>
                  <Button asChild className="w-full">
                    <a href="https://discord.gg/uZvWbpwJZS" target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 w-4 h-4" />
                      Join Discord
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Social Links Card */}
              <Card className="bg-card/50 backdrop-blur-md border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 sm:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Connect & Follow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                    <Button variant="outline" asChild className="w-full">
                      <a href="https://www.linkedin.com/in/mopradk/" target="_blank" rel="noopener noreferrer">
                        <Linkedin className="mr-2 w-4 h-4" />
                        LinkedIn
                      </a>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <a href="https://github.com/Mopra" target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 w-4 h-4" />
                        GitHub
                      </a>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <a href="https://x.com/m_prads" target="_blank" rel="noopener noreferrer">
                        <Twitter className="mr-2 w-4 h-4" />
                        X (Twitter)
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Author Bio Section */}
            <div className="mt-12 sm:mt-16 lg:mt-20">
              <Card className="bg-card/50 backdrop-blur-md border border-primary/20 shadow-lg">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    <div className="flex-shrink-0">
                      <Image
                        src="/Morten-Pradsgaard.jpg"
                        alt="Morten Pradsgaard - Founder & CTO of exit1.dev"
                        width={80}
                        height={80}
                        className="rounded-full shadow-lg border-2 border-primary/20"
                        priority
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Morten Pradsgaard</h3>
                      <p className="text-sm sm:text-base text-primary font-medium mb-3">Founder & CTO</p>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        I&apos;m the person behind exit1.dev. I build software that ships and stays up. 
                        When you reach out, you&apos;re talking directly to me—no support bots, no ticket queues, 
                        just straight talk about monitoring and building reliable software.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Response Time Info */}
            <div className="mt-8 sm:mt-12 text-center">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 backdrop-blur-md">
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Response Time</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  I typically respond within <strong>24 hours</strong>. For urgent issues, 
                  the Discord community is your fastest path to help.
                </p>
              </div>
            </div>

          </div>
        </section>
      </main>
    </>
  );
}
