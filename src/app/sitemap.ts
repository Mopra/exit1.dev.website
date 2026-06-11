import { promises as fs } from 'fs';
import path from 'path';
import { MetadataRoute } from 'next';
import { POSTS_PER_PAGE } from '@/lib/blogPagination';
import { getAllPublicMonitors, isIndexEntryMature } from '@/lib/publicMonitors';

// NOTE — this route is ISR'd (it inherits the hourly revalidate from the
// monitors fetch) and Vercel only charges write units when the output actually
// changes. Keep every field deterministic per data snapshot: no `new Date()`
// timestamps, and day-granular lastmod. An hourly-churning lastmod across ~300
// URLs also tells Google "everything changed", inviting recrawl storms that
// trigger more ISR regenerations.

/** Day-granular ISO date (sitemaps don't need more, and it keeps output stable). */
function isoDay(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://exit1.dev';

  // Auto-discover pages from file system
  async function getStaticPages() {
    const appDir = path.join(process.cwd(), 'src', 'app');
    const pages: Array<{ url: string; changeFrequency: ChangeFrequency; priority: number }> = [];

    async function scanDirectory(dir: string, urlPath: string = '') {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          const isRouteGroup = entry.name.startsWith('(') && entry.name.endsWith(')');
          const isDynamicSegment = entry.name.startsWith('[') && entry.name.endsWith(']');

          // Skip dynamic segments and API routes
          if (isDynamicSegment || entry.name === 'api') {
            continue;
          }

          const nextUrlPath = isRouteGroup ? urlPath : `${urlPath}/${entry.name}`;
          await scanDirectory(fullPath, nextUrlPath);
        } else if (entry.name === 'page.tsx') {
          // Found a page
          const finalUrl = urlPath === '' ? '/' : urlPath;
          pages.push({
            url: finalUrl,
            changeFrequency: getChangeFreq(finalUrl),
            priority: getPriority(finalUrl)
          });
        }
      }
    }

    await scanDirectory(appDir);
    return pages;
  }

  function getChangeFreq(url: string): ChangeFrequency {
    if (url === '/') return 'weekly';
    if (url.includes('/blog')) return 'weekly';
    if (url.includes('/product') || url.includes('/signup') || url.includes('/signin')) return 'monthly';
    return 'monthly';
  }

  function getPriority(url: string): number {
    if (url === '/') return 1.0;
    if (url.includes('/dashboard')) return 0.9;
    if (url.includes('/product') || url.includes('/signup') || url.includes('/signin')) return 0.8;
    if (url === '/tools') return 0.8;
    if (url.includes('/tools/')) return 0.7;
    if (url.includes('/blog')) return 0.7;
    if (url.includes('/privacy')) return 0.3;
    return 0.5;
  }

  const staticPages = await getStaticPages();

  // Get blog posts dynamically
  const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');
  const categories = await fs.readdir(postsDir);

  const blogPosts: MetadataRoute.Sitemap = [];
  for (const category of categories) {
    const categoryDir = path.join(postsDir, category);
    const files = await fs.readdir(categoryDir);

    for (const file of files) {
      if (file.endsWith('.md')) {
        const slug = file.replace('.md', '');
        // Real freshness signal: the post file's last modification time.
        const stats = await fs.stat(path.join(categoryDir, file));

        blogPosts.push({
          url: `${baseUrl}/blog/${slug}`,
          lastModified: isoDay(stats.mtime.getTime()),
          changeFrequency: 'monthly',
          priority: 0.7
        });
      }
    }
  }

  const totalPages = Math.max(1, Math.ceil(blogPosts.length / POSTS_PER_PAGE));
  const blogPaginationPages: MetadataRoute.Sitemap = [];
  for (let page = 2; page <= totalPages; page++) {
    const url = `${baseUrl}/blog/page/${page}`;
    blogPaginationPages.push({
      url,
      changeFrequency: 'weekly',
      priority: 0.7
    });
  }

  // Public status pages (curated uptime landing pages). Dynamic segments are
  // skipped by the filesystem scan above, so add them explicitly. Only mature
  // pages (enough recorded history) are listed — thin pages are noindexed and
  // excluded here so crawl budget isn't spent on near-empty templates.
  const monitors = await getAllPublicMonitors();
  const statusPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/status`,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    ...monitors.filter(isIndexEntryMature).map((m) => ({
      url: `${baseUrl}/status/${m.slug}`,
      changeFrequency: 'daily' as const,
      priority: 0.6,
      // Real freshness signal: last time we recorded a check, day-granular.
      ...(m.lastChecked ? { lastModified: isoDay(m.lastChecked) } : {}),
    })),
  ];

  // Combine all. Pages without a known modification date simply omit
  // lastModified — a fabricated "now" is worse than none for crawlers.
  return [
    // llms.txt — machine-readable site summary for LLMs
    {
      url: `${baseUrl}/llms.txt`,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    ...staticPages.map(page => ({
      url: `${baseUrl}${page.url}`,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...blogPosts,
    ...blogPaginationPages,
    ...statusPages
  ];
}
