import { getPostBySlug, getAllPosts } from '@/lib/markdownLoader';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { TableOfContents } from '@/components/TableOfContents';
import { Metadata } from 'next';
import { ArrowLeft, ArrowRight, Clock, Bell, BarChart3 } from 'lucide-react';
import StructuredData from '@/components/StructuredData';

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

  // Generate structured data for the blog post
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

  // Check if post has FAQ section and generate FAQ schema
  const hasFAQ = post.content.includes('## FAQs') || post.content.includes('### ');
  let faqStructuredData = null;
  
  if (hasFAQ) {
    // Extract FAQ questions and answers from content
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
      <main className="min-h-screen bg-background pt-24 sm:pt-28">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-background via-background/95 to-background/90 py-20 sm:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6 sm:mb-8">
              <Link
                href="/blog"
                className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors duration-200 mb-4 sm:mb-6 text-sm sm:text-base interactive"
              >
                <ArrowLeft className="mr-2 w-3 h-3 sm:w-4 sm:h-4" />
                Back to Blog
              </Link>
            </div>

            <div className="mb-4 sm:mb-6">
              <Badge variant="secondary" className="mb-3 sm:mb-4 text-xs backdrop-blur-md border-primary/20">
                {post.category}
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-4 sm:mb-6 leading-tight tracking-tight">
              {post.title}
            </h1>

            <div className="flex items-center text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" aria-hidden="true" />
                <span>{post.readTime}</span>
              </div>
              <span className="mx-2 hidden sm:inline">•</span>
              <div className="flex items-center gap-2">
                <svg className="w-2 h-2 fill-current text-primary" viewBox="0 0 8 8" aria-hidden="true"><circle cx="4" cy="4" r="4" /></svg>
                <span>{post.formattedDate}</span>
              </div>
              <span className="mx-2 hidden sm:inline">•</span>
              <div className="flex items-center gap-2">
                <Image
                  src="/Morten-Pradsgaard.jpg"
                  alt="Morten Pradsgaard"
                  width={24}
                  height={24}
                  className="rounded-full border border-primary/20"
                />
                <span>By <Link href="/about" className="text-primary hover:underline cursor-pointer interactive">{post.author}</Link></span>
              </div>
            </div>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>
          </div>
        </section>

        {/* Content Section with integrated TOC */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Table of Contents for all screen sizes */}
            <div className="mb-6">
              <TableOfContents headings={post.headings} />
            </div>

            <div className="mb-12">
              <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
                <Link
                  href="/free-uptime-monitor"
                  className="block rounded-2xl border border-primary/20 bg-card/60 backdrop-blur-md p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group interactive"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Clock className="w-4 h-4 text-primary" />
                      Free Uptime Monitor
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Unlimited monitors, 1-minute checks, and the blunt breakdown of why the legacy tools feel slow. See the feature deep dive and migration checklist.
                  </p>
                </Link>
                <Link
                  href="/analytics"
                  className="block rounded-2xl border border-primary/20 bg-card/60 backdrop-blur-md p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group interactive"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <BarChart3 className="w-4 h-4 text-primary" />
                      Analytics &amp; Reports
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Turn uptime data into SLAs, client reports, and long-term performance trends without bolting on another BI tool.
                  </p>
                </Link>
                <Link
                  href="/alerting"
                  className="block rounded-2xl border border-primary/20 bg-card/60 backdrop-blur-md p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group interactive"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Bell className="w-4 h-4 text-primary" />
                      Smart Alerting
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Ship webhook and email alerts that your team actually respects. Integrate PagerDuty, Opsgenie, Slack, or Discord without paying a premium.
                  </p>
                </Link>
              </div>
            </div>

            {/* Main Content */}
            <div className="w-full">
              <article className="prose prose-sm sm:prose lg:prose-lg max-w-none">
                <div 
                  dangerouslySetInnerHTML={{ __html: post.htmlContent }}
                  className="scroll-mt-20"
                />
                
                {/* EEAT Author Bio */}
                <div className="mt-12 pt-8 border-t border-primary/20">
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 backdrop-blur-md">
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                      <strong>Morten Pradsgaard</strong> is the founder of <strong>exit1.dev</strong> — the free uptime monitor for people who actually ship. He writes no-bullshit guides on monitoring, reliability, and building software that doesn&apos;t crumble under pressure.
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
