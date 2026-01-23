import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, Check, X, Zap } from "lucide-react";
import { InsetCard } from "@/components/InsetCard";
import { FeatureGridItem } from "@/components/FeatureGridItem";
import { PageHero } from "@/components/PageHero";
import { PageContainer, PageSection, PageShell, SectionContent } from "@/components/PageLayout";
import { RelatedFeatures, type RelatedFeature } from "@/components/RelatedFeatures";

interface Feature {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface ComparisonRow {
  feature: string;
  exit1: string | boolean;
  competitors: string | boolean;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface NanoUpgrade {
  title: string;
  description: string;
}

interface ProductPageProps {
  title: string;
  subtitle: string;
  description: string;
  heroImage?: string;
  features: Feature[];
  ctaText: string;
  ctaHref: string;
  seoTitle?: string;
  seoDescription?: string;
  comparisonTable?: ComparisonRow[];
  faq?: FAQItem[];
  technicalDetails?: {
    architecture?: string;
    performance?: string;
    api?: string;
  };
  relatedFeatures?: RelatedFeature[];
  nanoUpgrade?: NanoUpgrade;
}

const ProductPage: React.FC<ProductPageProps> = ({
  title,
  subtitle,
  description,
  features,
  ctaText,
  ctaHref,
  comparisonTable,
  faq,
  technicalDetails,
  relatedFeatures,
  nanoUpgrade,
}) => {
  return (
    <PageShell>
      <main>
        <PageContainer>
          <PageHero id="overview" className="scroll-mt-20" contentClassName="text-center">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
                {title}
              </h1>
              <p className="text-xl sm:text-2xl text-white/70 mb-6 max-w-3xl mx-auto leading-relaxed">
                {subtitle}
              </p>
              <p className="text-lg sm:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
                {description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full px-8 py-6 text-lg font-semibold bg-white text-black hover:bg-white/90 cursor-pointer"
                >
                  <a href={ctaHref} target="_blank" rel="noopener noreferrer">
                    {ctaText}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 py-6 text-lg font-semibold border-white/20 hover:bg-white/5 cursor-pointer"
                >
                  <a href="https://app.exit1.dev" target="_blank" rel="noopener noreferrer">
                    Sign In
                  </a>
                </Button>
              </div>
          </PageHero>

          <PageSection id="key-features" className="!px-0 py-16 scroll-mt-20">
            <SectionContent size="xl">
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
                  Key Features
                </h2>
                <p className="text-lg text-white/70 max-w-2xl mx-auto">
                  Everything you need to monitor your infrastructure effectively
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => (
                  <FeatureGridItem
                    key={index}
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                  />
                ))}
              </div>
            </SectionContent>
          </PageSection>

          {comparisonTable && (
            <PageSection id="comparison" className="py-16 scroll-mt-20">
              <SectionContent size="lg">
                <div className="text-center mb-12 sm:mb-16">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
                    Why Choose exit1.dev?
                  </h2>
                  <p className="text-lg text-white/70 max-w-2xl mx-auto">
                    See how we stack up against the competition
                  </p>
                </div>

                <InsetCard className="overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%]">Feature</TableHead>
                        <TableHead className="text-center">exit1.dev</TableHead>
                        <TableHead className="text-center">Others</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comparisonTable.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{row.feature}</TableCell>
                          <TableCell className="text-center">
                            {typeof row.exit1 === "boolean" ? (
                              row.exit1 ? (
                                <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                              ) : (
                                <X className="w-5 h-5 text-red-400 mx-auto" />
                              )
                            ) : (
                              <span className="text-sm text-white/70">{row.exit1}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {typeof row.competitors === "boolean" ? (
                              row.competitors ? (
                                <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                              ) : (
                                <X className="w-5 h-5 text-red-400 mx-auto" />
                              )
                            ) : (
                              <span className="text-sm text-white/70">{row.competitors}</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </InsetCard>
              </SectionContent>
            </PageSection>
          )}

          {technicalDetails && (
            <PageSection id="technical-details" className="py-16 scroll-mt-20">
              <SectionContent size="lg">
                <div className="text-center mb-12 sm:mb-16">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
                    Technical Details
                  </h2>
                  <p className="text-lg text-white/70 max-w-2xl mx-auto">
                    Built for developers, by developers
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3">
                  {technicalDetails.architecture && (
                    <InsetCard className="h-full">
                      <CardContent className="p-10">
                        <h3 className="text-2xl font-semibold mb-3">Architecture</h3>
                        <p className="text-white/60 leading-relaxed">
                          {technicalDetails.architecture}
                        </p>
                      </CardContent>
                    </InsetCard>
                  )}

                  {technicalDetails.performance && (
                    <InsetCard className="h-full">
                      <CardContent className="p-10">
                        <h3 className="text-2xl font-semibold mb-3">Performance</h3>
                        <p className="text-white/60 leading-relaxed">
                          {technicalDetails.performance}
                        </p>
                      </CardContent>
                    </InsetCard>
                  )}

                  {technicalDetails.api && (
                    <InsetCard className="h-full">
                      <CardContent className="p-10">
                        <h3 className="text-2xl font-semibold mb-3">API</h3>
                        <p className="text-white/60 leading-relaxed">
                          {technicalDetails.api}
                        </p>
                      </CardContent>
                    </InsetCard>
                  )}
                </div>
              </SectionContent>
            </PageSection>
          )}

          {faq && (
            <PageSection id="faq" className="py-16 scroll-mt-20">
              <SectionContent size="md">
                <div className="text-center mb-12 sm:mb-16">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-lg text-white/70 max-w-2xl mx-auto">
                    Everything you need to know about our monitoring
                  </p>
                </div>

                <InsetCard>
                  <Accordion type="single" collapsible className="w-full">
                    {faq.map((item, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="px-6 text-left">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="px-6 text-white/60">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </InsetCard>
              </SectionContent>
            </PageSection>
          )}

          {nanoUpgrade && (
            <PageSection className="py-16">
              <SectionContent size="md">
                <div className="p-6 sm:p-8 rounded-2xl border border-green-500/30 bg-green-500/10">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{nanoUpgrade.title}</h3>
                      <p className="text-white/70 mb-4">{nanoUpgrade.description}</p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          asChild
                          className="rounded-full px-6 py-2 font-semibold bg-white text-black hover:bg-white/90"
                        >
                          <a href="https://app.exit1.dev" target="_blank" rel="noopener noreferrer">
                            Get Nano — $3/mo
                          </a>
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          className="rounded-full px-6 py-2 font-semibold border-white/20 hover:bg-white/5"
                        >
                          <Link href="/why-nano">
                            Learn More
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </SectionContent>
            </PageSection>
          )}

          {relatedFeatures && (
            <RelatedFeatures features={relatedFeatures} />
          )}

        </PageContainer>
      </main>
    </PageShell>
  );
};

export default ProductPage;
