import { getPostBySlug, getAllPosts } from '@/lib/markdownLoader';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { CardContent } from '@/components/ui/card';
import { TableOfContents } from '@/components/TableOfContents';
import { Metadata } from 'next';
import { ArrowLeft, ArrowRight, Clock, Bell, BarChart3 } from 'lucide-react';
import StructuredData from '@/components/StructuredData';
import { InsetCard } from '@/components/InsetCard';
import { PageHero } from '@/components/PageHero';
import { PageContainer, PageSection, PageShell, SectionContent } from '@/components/PageLayout';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} - Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      authors: [post.author],
      url: `https://exit1.dev/blog/${post.slug}`,
    },
    alternates: {
      canonical: `https://exit1.dev/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "author": {
      "@type": "Person",
      "name": post.author,
      "url": "https://exit1.dev/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Exit1.dev",
      "url": "https://exit1.dev",
      "logo": {
        "@type": "ImageObject",
        "url": "https://exit1.dev/e_.svg"
      }
    },
    "datePublished": post.date,
    "dateModified": post.date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://exit1.dev/blog/${post.slug}`
    },
    "image": {
      "@type": "ImageObject",
      "url": "https://exit1.dev/Morten-Pradsgaard.jpg"
    },
    "articleSection": post.categoryName,
    "wordCount": post.content.split(/\s+/).length,
    "timeRequired": post.readTime
  };

  const hasFAQ = post.content.includes('## FAQs') || post.content.includes('### ');
  let faqStructuredData = null;

  if (hasFAQ) {
    const faqMatches = post.content.match(/### (.+?)\n([\s\S]+?)(?=### |$)/g);
    const faqItems = faqMatches ? faqMatches.map(match => {
      const lines = match.split('\n');
      const question = lines[0].replace('### ', '').trim();
      const answer = lines.slice(1).join('\n').trim();
      return { question, answer };
    }) : [];

    if (faqItems.length > 0) {
      faqStructuredData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqItems.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      };
    }
  }

  return (
    <>
      <StructuredData type="Article" data={articleStructuredData} />
      {faqStructuredData && <StructuredData type="FAQPage" data={faqStructuredData} />}
      <PageShell>
        <main>
          <PageContainer>
            <PageHero size="md">
                <div className="mb-6 sm:mb-8">
                  <Link
                    href="/blog"
                    className="inline-flex items-center text-white/70 hover:text-white transition-colors duration-200 mb-4 sm:mb-6 text-sm sm:text-base cursor-pointer interactive"
                  >
                    <ArrowLeft className="mr-2 w-3 h-3 sm:w-4 sm:h-4" />
                    Back to Blog
                  </Link>
                </div>

                <div className="mb-4 sm:mb-6">
                  <Badge variant="secondary" className="mb-3 sm:mb-4 text-xs bg-white/10 text-white border border-white/10">
                    {post.category}
                  </Badge>
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
                  {post.title}
                </h1>

                <div className="flex items-center text-white/60 mb-6 sm:mb-8 text-sm sm:text-base flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" aria-hidden="true" />
                    <span>{post.readTime}</span>
                  </div>
                  <span className="mx-2 hidden sm:inline">•</span>
                  <div className="flex items-center gap-2">
                    <svg className="w-2 h-2 fill-current text-white/60" viewBox="0 0 8 8" aria-hidden="true"><circle cx="4" cy="4" r="4" /></svg>
                    <span>{post.formattedDate}</span>
                  </div>
                  <span className="mx-2 hidden sm:inline">•</span>
                  <div className="flex items-center gap-2">
                    <Image
                      src="/Morten-Pradsgaard.jpg"
                      alt="Morten Pradsgaard"
                      width={24}
                      height={24}
                      className="rounded-full border border-white/20"
                    />
                    <span>
                      By{' '}
                      <Link href="/about" className="text-white hover:underline cursor-pointer interactive">
                        {post.author}
                      </Link>
                    </span>
                  </div>
                </div>

                <p className="text-xl sm:text-2xl text-white/70 leading-relaxed">
                  {post.excerpt}
                </p>
            </PageHero>

            <PageSection className="py-16">
              <SectionContent size="md">
                {post.headings?.length > 0 && (
                  <div className="mb-6">
                    <InsetCard>
                      <CardContent className="p-6">
                        <TableOfContents headings={post.headings} />
                      </CardContent>
                    </InsetCard>
                  </div>
                )}

                <div className="mb-12">
                  <div className="grid grid-cols-1 md:grid-cols-3">
                    <Link
                      href="/free-uptime-monitor"
                      className="group block cursor-pointer"
                    >
                      <InsetCard className="h-full">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                              <Clock className="w-4 h-4 text-white" />
                              Free Uptime Monitor
                            </div>
                            <ArrowRight className="w-4 h-4 text-white/60 group-hover:text-white transition-colors duration-200" />
                          </div>
                          <p className="text-sm text-white/60 leading-relaxed">
                            Unlimited monitors, 1-minute checks, and the blunt breakdown of why the legacy tools feel slow. See the feature deep dive and migration checklist.
                          </p>
                        </CardContent>
                      </InsetCard>
                    </Link>
                    <Link
                      href="/analytics"
                      className="group block cursor-pointer"
                    >
                      <InsetCard className="h-full">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                              <BarChart3 className="w-4 h-4 text-white" />
                              Analytics &amp; Reports
                            </div>
                            <ArrowRight className="w-4 h-4 text-white/60 group-hover:text-white transition-colors duration-200" />
                          </div>
                          <p className="text-sm text-white/60 leading-relaxed">
                            Turn uptime data into SLAs, client reports, and long-term performance trends without bolting on another BI tool.
                          </p>
                        </CardContent>
                      </InsetCard>
                    </Link>
                    <Link
                      href="/alerting"
                      className="group block cursor-pointer"
                    >
                      <InsetCard className="h-full">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                              <Bell className="w-4 h-4 text-white" />
                              Smart Alerting
                            </div>
                            <ArrowRight className="w-4 h-4 text-white/60 group-hover:text-white transition-colors duration-200" />
                          </div>
                          <p className="text-sm text-white/60 leading-relaxed">
                            Ship webhook and email alerts that your team actually respects. Integrate PagerDuty, Opsgenie, Slack, or Discord without paying a premium.
                          </p>
                        </CardContent>
                      </InsetCard>
                    </Link>
                  </div>
                </div>

                <div className="w-full">
                  <article className="prose prose-sm sm:prose lg:prose-lg max-w-none">
                    <div
                      dangerouslySetInnerHTML={{ __html: post.htmlContent }}
                      className="scroll-mt-20"
                    />

                    <div className="mt-12">
                      <InsetCard>
                        <CardContent className="p-6">
                          <p className="text-base sm:text-lg text-white/60 leading-relaxed">
                            <strong>Morten Pradsgaard</strong> is the founder of <strong>exit1.dev</strong> — the free uptime monitor for people who actually ship. He writes no-bullshit guides on monitoring, reliability, and building software that doesn&apos;t crumble under pressure.
                          </p>
                        </CardContent>
                      </InsetCard>
                    </div>
                  </article>
                </div>
              </SectionContent>
            </PageSection>
          </PageContainer>
        </main>
      </PageShell>
    </>
  );
}
