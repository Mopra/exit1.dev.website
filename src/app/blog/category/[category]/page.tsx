import { getAllPosts } from '@/lib/markdownLoader';
import blogData from '@/content/blog.json';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { CardContent } from '@/components/ui/card';
import { InsetCard } from '@/components/InsetCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import StructuredData from '@/components/StructuredData';
import { PageHero } from '@/components/PageHero';
import { PageContainer, PageSection, PageShell, SectionContent } from '@/components/PageLayout';

type Category = (typeof blogData.categories)[number];

function getCategory(slug: string): Category | undefined {
  return blogData.categories.find((c) => c.slug === slug);
}

export function generateStaticParams() {
  return blogData.categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);

  if (!cat) {
    return { title: 'Category Not Found' };
  }

  const title = `${cat.name}: Guides & Best Practices`;

  return {
    title,
    description: cat.description,
    openGraph: {
      title,
      description: cat.description,
      url: `https://exit1.dev/blog/category/${cat.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: cat.description,
    },
    alternates: {
      canonical: `https://exit1.dev/blog/category/${cat.slug}`,
    },
  };
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getCategory(category);

  if (!cat) {
    notFound();
  }

  const posts = getAllPosts().filter((post) => post.category === cat.id);

  if (posts.length === 0) {
    notFound();
  }

  // CollectionPage + ItemList so Google understands this is a topic hub and
  // can surface the post list as a structured collection.
  const collectionStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${cat.name}: Guides & Best Practices`,
    description: cat.description,
    url: `https://exit1.dev/blog/category/${cat.slug}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((post, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://exit1.dev/blog/${post.slug}`,
        name: post.title,
      })),
    },
  };

  return (
    <>
      <StructuredData type="CollectionPage" data={collectionStructuredData} />
      <PageShell>
        <main>
          <PageContainer>
            <PageHero
              size="md"
              breadcrumb={
                <Breadcrumbs
                  items={[
                    { name: 'Blog', href: '/blog' },
                    { name: cat.name, href: `/blog/category/${cat.slug}` },
                  ]}
                />
              }
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
                {cat.name}
              </h1>
              <p className="text-xl sm:text-2xl text-foreground/70 leading-relaxed max-w-3xl">
                {cat.description}
              </p>
              <p className="mt-4 text-sm text-foreground/50">
                {posts.length} {posts.length === 1 ? 'article' : 'articles'}
              </p>
            </PageHero>

            <PageSection className="py-12">
              <SectionContent size="xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post) => (
                    <InsetCard
                      key={post.id}
                      className="group cursor-pointer border border-foreground/10"
                    >
                      <CardContent className="p-10 h-full">
                        <div className="mb-4">
                          <Badge
                            variant="secondary"
                            className="mb-2 text-xs bg-foreground/10 text-foreground border border-foreground/10"
                          >
                            {post.categoryName}
                          </Badge>
                          <div className="flex items-center text-sm text-foreground/60 mb-3 flex-wrap gap-2">
                            <span>{post.formattedDate}</span>
                            <span className="mx-2">•</span>
                            <span>{post.readTime}</span>
                          </div>
                        </div>

                        <Link href={`/blog/${post.slug}`} className="block cursor-pointer">
                          <h2 className="text-lg sm:text-xl font-semibold mb-3 group-hover:text-foreground transition-colors duration-200 line-clamp-2">
                            {post.title}
                          </h2>
                          <p className="text-sm sm:text-base text-foreground/60 leading-relaxed mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center text-foreground font-medium group-hover:translate-x-1 transition-transform duration-200 text-sm sm:text-base">
                            Read more
                            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </Link>
                      </CardContent>
                    </InsetCard>
                  ))}
                </div>

                <div className="mt-12 flex items-center gap-3">
                  <Image src="/e_.svg" alt="" width={20} height={20} className="opacity-60" aria-hidden="true" />
                  <Link
                    href="/blog"
                    className="text-sm font-medium text-foreground hover:underline interactive cursor-pointer"
                  >
                    ← Back to all articles
                  </Link>
                </div>
              </SectionContent>
            </PageSection>
          </PageContainer>
        </main>
      </PageShell>
    </>
  );
}
