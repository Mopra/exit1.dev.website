"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Mail, MessageCircle, Github, Linkedin, Twitter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { InsetCard } from '@/components/InsetCard';
import { PageHero } from '@/components/PageHero';
import { PageContainer, PageSection, PageShell, SectionContent } from '@/components/PageLayout';

export default function ContactPage() {
  const [email, setEmail] = useState('');

  useEffect(() => {
    const emailParts = ['mortenprads', '@', 'gmail', '.', 'com'];
    const obfuscatedEmail = emailParts.join('');
    setEmail(obfuscatedEmail);
  }, []);

  return (
    <>
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

      <PageShell>
        <main>
          <PageContainer>
            <PageHero size="lg">
                <div className="mb-6 sm:mb-8">
                  <Link
                    href="/"
                    className="inline-flex items-center text-white/70 hover:text-white transition-colors duration-200 mb-4 sm:mb-6 text-sm sm:text-base cursor-pointer interactive"
                  >
                    <ArrowLeft className="mr-2 w-3 h-3 sm:w-4 sm:h-4" />
                    Back to Home
                  </Link>
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
                  Get in Touch
                </h1>

                <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
                  <p className="text-xl sm:text-2xl text-white/70 leading-relaxed mb-8">
                    Have a question, feature request, or just want to say hi? I&apos;m here to help. <strong>I want the tough feedback</strong> — it&apos;s how we build better software.
                  </p>
                </div>
            </PageHero>

            <PageSection className="py-16">
              <SectionContent size="md">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <InsetCard className="h-full">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/10 rounded-lg">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold">Email</h3>
                      </div>
                      <p className="text-white/70 mb-6">
                        For direct questions, feature requests, or feedback. I read every email.
                      </p>
                      {email && (
                        <Button asChild className="w-full rounded-full bg-white text-black hover:bg-white/90 cursor-pointer">
                          <a href={`mailto:${email.replace(/[at]/g, '@').replace(/[dot]/g, '.')}`}>
                            <Mail className="mr-2 w-4 h-4" />
                            {email}
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  </InsetCard>

                  <InsetCard className="h-full">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/10 rounded-lg">
                          <MessageCircle className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold">Community</h3>
                      </div>
                      <p className="text-white/70 mb-6">
                        Join our Discord community for help, ideas, and calling out nonsense.
                      </p>
                      <Button asChild className="w-full rounded-full bg-white text-black hover:bg-white/90 cursor-pointer">
                        <a href="https://discord.gg/uZvWbpwJZS" target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="mr-2 w-4 h-4" />
                          Join Discord
                        </a>
                      </Button>
                    </CardContent>
                  </InsetCard>

                  <InsetCard className="md:col-span-2">
                    <CardContent className="p-8">
                      <h3 className="text-xl font-semibold mb-6">Connect & Follow</h3>
                      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                        <Button variant="outline" asChild className="w-full rounded-full border-white/20 hover:bg-white/5 cursor-pointer">
                          <a href="https://www.linkedin.com/in/mopradk/" target="_blank" rel="noopener noreferrer">
                            <Linkedin className="mr-2 w-4 h-4" />
                            LinkedIn
                          </a>
                        </Button>
                        <Button variant="outline" asChild className="w-full rounded-full border-white/20 hover:bg-white/5 cursor-pointer">
                          <a href="https://github.com/Mopra" target="_blank" rel="noopener noreferrer">
                            <Github className="mr-2 w-4 h-4" />
                            GitHub
                          </a>
                        </Button>
                        <Button variant="outline" asChild className="w-full rounded-full border-white/20 hover:bg-white/5 cursor-pointer">
                          <a href="https://x.com/m_prads" target="_blank" rel="noopener noreferrer">
                            <Twitter className="mr-2 w-4 h-4" />
                            X (Twitter)
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </InsetCard>
                </div>

                <div className="mt-12 sm:mt-16 lg:mt-20">
                  <InsetCard>
                    <CardContent className="p-6 sm:p-8">
                      <div className="flex flex-col sm:flex-row items-start gap-6">
                        <div className="flex-shrink-0">
                          <Image
                            src="/Morten-Pradsgaard.jpg"
                            alt="Morten Pradsgaard - Founder & CTO of exit1.dev"
                            width={80}
                            height={80}
                            className="rounded-full border border-white/20"
                            priority
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white mb-2">Morten Pradsgaard</h3>
                          <p className="text-base text-white/70 font-medium mb-3">Founder & CTO</p>
                          <p className="text-base text-white/70 leading-relaxed">
                            I&apos;m the person behind exit1.dev. I build software that ships and stays up.
                            When you reach out, you&apos;re talking directly to me — no support bots, no ticket queues,
                            just straight talk about monitoring and building reliable software.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </InsetCard>
                </div>

                <div className="mt-8 sm:mt-12 text-center">
                  <InsetCard>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-2">Response Time</h3>
                      <p className="text-base text-white/70">
                        I typically respond within <strong>24 hours</strong>. For urgent issues,
                        the Discord community is your fastest path to help.
                      </p>
                    </CardContent>
                  </InsetCard>
                </div>
              </SectionContent>
            </PageSection>
          </PageContainer>
        </main>
      </PageShell>
    </>
  );
}
