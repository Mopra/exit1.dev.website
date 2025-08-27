import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, Check, X, ExternalLink } from 'lucide-react';

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

interface RelatedFeature {
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
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
  relatedFeatures
}) => {

  return (
    <main className="pt-24 sm:pt-28">
      {/* Hero Section */}
      <section id="overview" className="relative overflow-hidden bg-gradient-to-br from-background via-background/95 to-background/90 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight tracking-tight">
              {title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-4 sm:mb-6 max-w-3xl mx-auto px-2 sm:px-4 leading-relaxed">
              {subtitle}
            </p>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-2 sm:px-4 leading-relaxed">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button
                asChild
                size="lg"
                className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-semibold glass-primary border backdrop-blur-md hover:scale-105 transition-all duration-300 w-full sm:w-auto interactive"
              >
                <a href={ctaHref} target="_blank" rel="noopener noreferrer">
                  {ctaText}
                  <ArrowRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-semibold backdrop-blur-md border-primary/20 hover:bg-primary/10 transition-all duration-300 w-full sm:w-auto interactive"
              >
                <a href="https://app.exit1.dev" target="_blank" rel="noopener noreferrer">
                  Sign In
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Content */}
          <div className="w-full">
            {/* Features Section */}
            <section id="key-features" className="py-12 sm:py-16 lg:py-20 bg-background/50 backdrop-blur-md scroll-mt-20">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4 tracking-tight">
                    Key Features
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-2 sm:px-4">
                    Everything you need to monitor your infrastructure effectively
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {features.map((feature, index) => (
                    <Card
                      key={index}
                      className="border border-primary/20 backdrop-blur-md bg-background/50 hover:shadow-lg hover:scale-105 transition-all duration-300 interactive glow-card"
                    >
                      <CardContent className="p-4 sm:p-6 lg:p-8">
                        {feature.icon && (
                          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-center mb-3 sm:mb-4 lg:mb-6 backdrop-blur-md">
                            {feature.icon}
                          </div>
                        )}
                        <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-foreground mb-2 sm:mb-3 lg:mb-4">
                          {feature.title}
                        </h3>
                        <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* Comparison Table Section */}
            {comparisonTable && (
              <section id="comparison" className="py-12 sm:py-16 lg:py-20 bg-card/50 backdrop-blur-md border-t border-primary/20 scroll-mt-20">
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4 tracking-tight">
                      Why Choose exit1.dev?
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-2 sm:px-4">
                      See how we stack up against the competition
                    </p>
                  </div>
                  
                  <div className="overflow-hidden rounded-lg border border-primary/20 backdrop-blur-md bg-background/50">
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
                              {typeof row.exit1 === 'boolean' ? (
                                row.exit1 ? (
                                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                                ) : (
                                  <X className="w-5 h-5 text-red-500 mx-auto" />
                                )
                              ) : (
                                <span className="text-sm">{row.exit1}</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {typeof row.competitors === 'boolean' ? (
                                row.competitors ? (
                                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                                ) : (
                                  <X className="w-5 h-5 text-red-500 mx-auto" />
                                )
                              ) : (
                                <span className="text-sm">{row.competitors}</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </section>
            )}

            {/* Technical Details Section */}
            {technicalDetails && (
              <section id="technical-details" className="py-12 sm:py-16 lg:py-20 bg-background/50 backdrop-blur-md border-t border-primary/20 scroll-mt-20">
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4 tracking-tight">
                      Technical Details
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-2 sm:px-4">
                      Built for developers, by developers
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {technicalDetails.architecture && (
                      <Card className="border border-primary/20 backdrop-blur-md bg-background/50">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold text-foreground mb-3">Architecture</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {technicalDetails.architecture}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                    
                    {technicalDetails.performance && (
                      <Card className="border border-primary/20 backdrop-blur-md bg-background/50">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold text-foreground mb-3">Performance</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {technicalDetails.performance}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                    
                    {technicalDetails.api && (
                      <Card className="border border-primary/20 backdrop-blur-md bg-background/50">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold text-foreground mb-3">API</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {technicalDetails.api}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* FAQ Section */}
            {faq && (
              <section id="faq" className="py-12 sm:py-16 lg:py-20 bg-card/50 backdrop-blur-md border-t border-primary/20 scroll-mt-20">
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4 tracking-tight">
                      Frequently Asked Questions
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-2 sm:px-4">
                      Everything you need to know about our monitoring
                    </p>
                  </div>
                  
                  <div className="border border-primary/20 rounded-lg backdrop-blur-md bg-background/50">
                    <Accordion type="single" collapsible className="w-full">
                      {faq.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="px-6 text-left">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="px-6 text-muted-foreground">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </div>
              </section>
            )}

            {/* Related Features Section */}
            {relatedFeatures && (
              <section id="related-features" className="py-12 sm:py-16 lg:py-20 bg-background/50 backdrop-blur-md border-t border-primary/20 scroll-mt-20">
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4 tracking-tight">
                      Related Features
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-2 sm:px-4">
                      See how this works with our other monitoring tools
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {relatedFeatures.map((feature, index) => (
                      <Card
                        key={index}
                        className="border border-primary/20 backdrop-blur-md bg-background/50 hover:shadow-lg hover:scale-105 transition-all duration-300 interactive glow-card"
                      >
                        <CardContent className="p-4 sm:p-6 lg:p-8">
                          <div className="flex items-start justify-between mb-3 sm:mb-4 lg:mb-6">
                            {feature.icon && (
                              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-center backdrop-blur-md">
                                {feature.icon}
                              </div>
                            )}
                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-foreground mb-2 sm:mb-3 lg:mb-4">
                            {feature.title}
                          </h3>
                          <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed mb-4">
                            {feature.description}
                          </p>
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="w-full interactive"
                          >
                            <a href={feature.href}>
                              Learn More
                              <ArrowRight className="ml-2 w-3 h-3" />
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* CTA Section */}
            <section id="get-started" className="py-12 sm:py-16 lg:py-20 bg-card/50 backdrop-blur-md border-t border-primary/20 scroll-mt-20">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6 tracking-tight">
                  Ready to get started?
                </h2>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 px-2 sm:px-4">
                  Join thousands of developers who trust exit1.dev for their monitoring needs
                </p>
                <Button
                  asChild
                  size="lg"
                  className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-semibold glass-primary border backdrop-blur-md hover:scale-105 transition-all duration-300 w-full sm:w-auto interactive"
                >
                  <a href={ctaHref} target="_blank" rel="noopener noreferrer">
                    {ctaText}
                    <ArrowRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                  </a>
                </Button>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductPage;
