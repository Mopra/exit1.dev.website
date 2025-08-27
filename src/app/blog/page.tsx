import { getAllPosts } from '@/lib/markdownLoader';
import blogData from '@/content/blog.json';
import { BlogClient } from '@/components/BlogClient';

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = ['All', ...blogData.categories.map(cat => cat.name)];

  return (
    <div className="relative pt-24 sm:pt-28" role="main" aria-label="Blog">
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-4 sm:mb-6 leading-tight tracking-tight">
              {blogData.title}
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed px-2 sm:px-4">
              {blogData.subtitle}
            </p>
          </div>
        </div>
      </section>

      <BlogClient posts={posts} categories={categories} />
    </div>
  );
}
