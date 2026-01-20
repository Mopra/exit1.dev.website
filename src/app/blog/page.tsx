import { getAllPosts } from '@/lib/markdownLoader';
import blogData from '@/content/blog.json';
import { BlogClient } from '@/components/BlogClient';
import { PageHero } from '@/components/PageHero';
import { PageContainer, PageShell } from '@/components/PageLayout';
import { Metadata } from 'next';

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
            <p className="text-xl sm:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              {blogData.subtitle}
            </p>
          </PageHero>

          <BlogClient posts={posts} categories={categories} currentPage={1} />
        </PageContainer>
      </main>
    </PageShell>
  );
}
