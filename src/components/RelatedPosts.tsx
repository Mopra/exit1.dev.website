import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BlogPostMeta } from '@/lib/markdownLoader';
import { InsetCard } from '@/components/InsetCard';
import { CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RelatedPostsProps {
  posts: BlogPostMeta[];
}

/**
 * Renders a small grid of related articles at the foot of a post. Server
 * component — the links are in the static HTML, so they pass internal link
 * equity and give Google a topical graph between posts (which the blog
 * previously lacked entirely).
 */
export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section aria-label="Related articles" className="mt-16 pt-10 border-t border-foreground/15">
      <h2 className="text-2xl font-bold mb-6 tracking-tight">Keep reading</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group block cursor-pointer">
            <InsetCard className="h-full border border-foreground/10">
              <CardContent className="p-6 h-full flex flex-col">
                <Badge
                  variant="secondary"
                  className="mb-3 self-start text-xs bg-foreground/10 text-foreground border border-foreground/10"
                >
                  {post.categoryName}
                </Badge>
                <h3 className="text-base font-semibold mb-2 leading-snug line-clamp-2 group-hover:text-foreground transition-colors duration-200">
                  {post.title}
                </h3>
                <p className="text-sm text-foreground/60 leading-relaxed line-clamp-2 mb-4">
                  {post.excerpt}
                </p>
                <div className="mt-auto flex items-center text-sm font-medium text-foreground group-hover:translate-x-1 transition-transform duration-200">
                  Read
                  <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                </div>
              </CardContent>
            </InsetCard>
          </Link>
        ))}
      </div>
    </section>
  );
}

/**
 * Pick related posts for a given post: prefer same-category articles
 * (strongest topical signal), then backfill with the most recent posts from
 * other categories so we always show a full row. Deterministic (no randomness)
 * to keep static output stable across builds.
 */
export function pickRelatedPosts(
  all: BlogPostMeta[],
  current: BlogPostMeta,
  count = 3,
): BlogPostMeta[] {
  const others = all.filter((p) => p.slug !== current.slug);
  const sameCategory = others.filter((p) => p.category === current.category);
  const rest = others.filter((p) => p.category !== current.category);
  return [...sameCategory, ...rest].slice(0, count);
}
