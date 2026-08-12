import { getPostBySlug, getAllPosts } from '@/lib/markdownLoader';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { CardContent } from '@/components/ui/card';
import { TableOfContents } from '@/components/TableOfContents';
import { Metadata } from 'next';
import { ArrowRight, Clock, Bell, BarChart3 } from 'lucide-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import StructuredData from '@/components/StructuredData';
import { InsetCard } from '@/components/InsetCard';
import { PageHero } from '@/components/PageHero';
import { PageContainer, PageSection, PageShell, SectionContent } from '@/components/PageLayout';
import { RelatedPosts, pickRelatedPosts } from '@/components/RelatedPosts';
import { FOUNDER_ID, ORG_ID, SITE_URL } from '@/lib/siteSchema';
import blogData from '@/content/blog.json';

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

  // Keyword-led SEO title (frontmatter `seoTitle`) when provided, else the
  // post title. No generic "- Blog" suffix — it wasted ~7 chars of the SERP
  // pixel budget for zero keyword value.
  const seoTitle = post.seoTitle || post.title;

  return {
    // `absolute` keeps the root layout's "%s | exit1.dev" template off post
    // titles — same reasoning as dropping the "- Blog" suffix above: the SERP
    // pixel budget is better spent on keywords than on repeating the domain,
    // which already shows in the breadcrumb line.
    title: { absolute: seoTitle },
    description: post.metaDescription,
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      type: 'article',
      authors: [post.author],
      publishedTime: post.date,
      modifiedTime: post.dateModified,
      section: post.categoryName,
      url: `https://exit1.dev/blog/${post.slug}`,
    },
    // Mirror onto the twitter card so X uses the post copy + generated image
    // instead of inheriting the root layout's default card.
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.metaDescription,
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

  const relatedPosts = pickRelatedPosts(getAllPosts(), post);
  const categoryMeta = blogData.categories.find((c) => c.id === post.category);

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "author": {
      "@type": "Person",
      "@id": FOUNDER_ID,
      "name": post.author,
      "url": "https://exit1.dev/about"
    },
    // Reference the site Organization declared on `/` rather than redeclaring
    // a second, competing brand entity here. The old inline logo also pointed
    // at an SVG, which Google rejects for publisher.logo.
    "publisher": { "@id": ORG_ID },
    "isPartOf": { "@id": `${SITE_URL}/blog#blog` },
    "datePublished": post.date,
    // Was hardcoded to `post.date`, so every post claimed it had never been
    // touched since publication. Now driven by the `updated` frontmatter field.
    "dateModified": post.dateModified,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://exit1.dev/blog/${post.slug}`
    },
    // The generated per-post card (opengraph-image.tsx), not the author's
    // headshot — which is what this used to point at.
    "image": {
      "@type": "ImageObject",
      "url": `https://exit1.dev/blog/${post.slug}/opengraph-image`,
      "width": 1200,
      "height": 630
    },
    "articleSection": post.categoryName,
    "wordCount": post.content.split(/\s+/).length,
    "timeRequired": post.readTime
  };

  // FAQ structured data — ONLY emitted when a post has an explicit
  // "## FAQ"/"## Frequently Asked Questions" section, and only the `###`
  // question headings *within* that section are parsed. The previous logic
  // fired on ANY post containing a `###` heading, treating every subheading as
  // a fake FAQ question and emitting invalid FAQPage schema across the blog —
  // which Google can ignore or penalize as structured-data spam.
  let faqStructuredData = null;
  const faqHeading = post.content.match(
    /(?:^|\n)##\s+(?:FAQs?|Frequently Asked Questions)\b[^\n]*\n/i
  );

  if (faqHeading) {
    const sectionStart = (faqHeading.index ?? 0) + faqHeading[0].length;
    const rest = post.content.slice(sectionStart);
    const nextH2 = rest.search(/\n##\s/);
    const section = nextH2 === -1 ? rest : rest.slice(0, nextH2);

    const faqItems = [...section.matchAll(/(?:^|\n)###\s+(.+?)\n([\s\S]*?)(?=\n###\s|$)/g)]
      .map((m) => ({ question: m[1].trim(), answer: m[2].trim() }))
      // Only real Q&A pairs: a question ends with "?" and has an answer.
      .filter((item) => item.question.endsWith('?') && item.answer.length > 0);

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
            <PageHero size="md" breadcrumb={
              <Breadcrumbs
                items={[
                  { name: "Blog", href: "/blog" },
                  { name: post.title, href: `/blog/${post.slug}` },
                ]}
              />
            }>
                <div className="mb-4 sm:mb-6">
                  {categoryMeta ? (
                    <Link href={`/blog/category/${categoryMeta.slug}`} className="cursor-pointer interactive">
                      <Badge variant="secondary" className="mb-3 sm:mb-4 text-xs bg-foreground/10 text-foreground border border-foreground/10 hover:bg-foreground/20 transition-colors">
                        {post.categoryName}
                      </Badge>
                    </Link>
                  ) : (
                    <Badge variant="secondary" className="mb-3 sm:mb-4 text-xs bg-foreground/10 text-foreground border border-foreground/10">
                      {post.categoryName}
                    </Badge>
                  )}
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
                  {post.title}
                </h1>

                <div className="flex items-center text-foreground/60 mb-6 sm:mb-8 text-sm sm:text-base flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" aria-hidden="true" />
                    <span>{post.readTime}</span>
                  </div>
                  <span className="mx-2 hidden sm:inline">•</span>
                  <div className="flex items-center gap-2">
                    <svg className="w-2 h-2 fill-current text-foreground/60" viewBox="0 0 8 8" aria-hidden="true"><circle cx="4" cy="4" r="4" /></svg>
                    <span>{post.formattedDate}</span>
                  </div>
                  <span className="mx-2 hidden sm:inline">•</span>
                  <div className="flex items-center gap-2">
                    <Image
                      src="/Morten-Pradsgaard.jpg"
                      alt="Morten Pradsgaard"
                      width={24}
                      height={24}
                      className="rounded-full border border-foreground/20"
                    />
                    <span>
                      By{' '}
                      <Link href="/about" className="text-foreground hover:underline cursor-pointer interactive">
                        {post.author}
                      </Link>
                    </span>
                  </div>
                </div>

                <p className="text-xl sm:text-2xl text-foreground/70 leading-relaxed">
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
                              <Clock className="w-4 h-4 text-foreground" />
                              Free Uptime Monitor
                            </div>
                            <ArrowRight className="w-4 h-4 text-foreground/60 group-hover:text-foreground transition-colors duration-200" />
                          </div>
                          <p className="text-sm text-foreground/60 leading-relaxed">
                            50 free monitors with 5-minute checks. Paid plans start at $4/mo for 1-minute checks and scale to 1,000 monitors at 15 seconds. See the feature deep dive and migration checklist.
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
                              <BarChart3 className="w-4 h-4 text-foreground" />
                              Analytics &amp; Reports
                            </div>
                            <ArrowRight className="w-4 h-4 text-foreground/60 group-hover:text-foreground transition-colors duration-200" />
                          </div>
                          <p className="text-sm text-foreground/60 leading-relaxed">
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
                              <Bell className="w-4 h-4 text-foreground" />
                              Smart Alerting
                            </div>
                            <ArrowRight className="w-4 h-4 text-foreground/60 group-hover:text-foreground transition-colors duration-200" />
                          </div>
                          <p className="text-sm text-foreground/60 leading-relaxed">
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
                  </article>

                  <aside
                    aria-label="About the author"
                    className="mt-16 pt-10 border-t border-foreground/15"
                  >
                    <div className="flex items-start gap-5 sm:gap-6">
                      <Image
                        src="/Morten-Pradsgaard.jpg"
                        alt="Morten Pradsgaard"
                        width={80}
                        height={80}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-foreground/20 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold uppercase tracking-wider text-foreground/50 mb-2">
                          About the author
                        </div>
                        <p className="text-base sm:text-lg text-foreground/70 leading-relaxed">
                          <strong className="text-foreground">Morten Pradsgaard</strong> is the founder of <strong className="text-foreground">exit1.dev</strong> — the free uptime monitor for people who actually ship. He writes no-bullshit guides on monitoring, reliability, and building software that doesn&apos;t crumble under pressure.
                        </p>
                        <Link
                          href="/about"
                          className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-foreground hover:underline interactive"
                        >
                          More about Morten
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </aside>

                  <RelatedPosts posts={relatedPosts} />
                </div>
              </SectionContent>
            </PageSection>
          </PageContainer>
        </main>
      </PageShell>
    </>
  );
}
