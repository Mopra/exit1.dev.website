import { getAllPosts } from '@/lib/markdownLoader';
import blogData from '@/content/blog.json';
import { BlogClient } from '@/components/BlogClient';
import { PageHero } from '@/components/PageHero';
import { PageContainer, PageShell } from '@/components/PageLayout';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: `${blogData.title} | exit1.dev`,
  description: blogData.subtitle,
  openGraph: {
    title: blogData.title,
    description: blogData.subtitle,
    url: 'https://exit1.dev/blog',
  },
  alternates: {
    canonical: 'https://exit1.dev/blog',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = ['All', ...blogData.categories.map(cat => cat.name)];

  return (
    <PageShell>
      <main role="main" aria-label="Blog">
        <PageContainer>
          <PageHero className="pb-12" contentClassName="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              {blogData.title}
            </h1>
            <p className="text-xl sm:text-2xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
              {blogData.subtitle}
            </p>

            {/* Crawlable topic hubs — server-rendered links so the category
                pillar pages are discoverable and pass link equity (the filter
                chips below are client-side only). */}
            <nav aria-label="Browse by topic" className="mt-8 flex flex-wrap gap-2 justify-center">
              {blogData.categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/blog/category/${cat.slug}`}
                  className="rounded-full border border-foreground/20 px-4 py-2 text-sm font-medium text-foreground hover:bg-foreground/5 transition-colors duration-200 cursor-pointer interactive"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </PageHero>

          <BlogClient posts={posts} categories={categories} currentPage={1} />
        </PageContainer>
      </main>
    </PageShell>
  );
}
