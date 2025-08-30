import { getPostBySlug, getAllPosts } from '@/lib/markdownLoader';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { TableOfContents } from '@/components/TableOfContents';
import { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';

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

  return (
    <>
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

            <div className="flex items-center text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
              <span>{post.readTime}</span>
              <span className="mx-2">•</span>
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
