import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import blogData from '@/content/blog.json';
import { getAllPosts } from '@/lib/markdownLoader';
import { POSTS_PER_PAGE } from '@/lib/blogPagination';
import { BlogClient } from '@/components/BlogClient';
import { PageHero } from '@/components/PageHero';
import { PageContainer, PageShell } from '@/components/PageLayout';

export async function generateStaticParams() {
  const posts = getAllPosts();
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));

  return Array.from({ length: totalPages - 1 }, (_, index) => ({
    page: String(index + 2),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  const pageNumber = Number(page);

  if (!Number.isInteger(pageNumber) || pageNumber <= 1) {
    return {
      title: `${blogData.title} | exit1.dev`,
      description: blogData.subtitle,
      alternates: {
        canonical: 'https://exit1.dev/blog',
      },
    };
  }

  return {
    title: `${blogData.title} - Page ${pageNumber} | exit1.dev`,
    description: blogData.subtitle,
    openGraph: {
      title: `${blogData.title} - Page ${pageNumber}`,
      description: blogData.subtitle,
      url: `https://exit1.dev/blog/page/${pageNumber}`,
    },
    alternates: {
      canonical: `https://exit1.dev/blog/page/${pageNumber}`,
    },
  };
}

export default async function BlogPageByNumber({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const pageNumber = Number(page);

  if (!Number.isInteger(pageNumber)) {
    notFound();
  }

  if (pageNumber <= 1) {
    redirect('/blog');
  }

  const posts = getAllPosts();
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));

  if (pageNumber > totalPages) {
    notFound();
  }

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

          <BlogClient posts={posts} categories={categories} currentPage={pageNumber} />
        </PageContainer>
      </main>
    </PageShell>
  );
}
