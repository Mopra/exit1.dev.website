import { promises as fs } from 'fs';
import path from 'path';
import { MetadataRoute } from 'next';
import { POSTS_PER_PAGE } from '@/lib/blogPagination';
import { getAllPublicMonitors, isIndexEntryMature } from '@/lib/publicMonitors';
import { getAllPosts } from '@/lib/markdownLoader';
import blogData from '@/content/blog.json';
import { competitors } from '@/content/competitors';

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

/**
 * Routes that have a `page.tsx` but must never be advertised to crawlers.
 *
 * The filesystem scan below finds every `page.tsx`, which silently swept in
 * redirect stubs and internal pages — a sitemap full of 301s and off-site
 * bounces wastes crawl budget and tells Google the file is unmaintained.
 *
 * When adding a `redirect()` stub or an internal-only route, add it here.
 */
const SITEMAP_EXCLUDED_ROUTES = new Set<string>([
  // Redirect stubs — the real 301 lives in next.config.js. Listing the source
  // URL asks Google to crawl a page whose only job is to point elsewhere.
  '/real-time-monitoring', // -> /live-checks
  '/install', // -> /getting-started
  '/product/alerting', // -> /alerting
  '/product/analytics', // -> /analytics
  '/product/global', // -> /global-monitoring
  '/product/monitoring', // -> /live-checks
  '/product/ssl-monitoring', // -> /ssl-monitoring

  // Off-site bounces into the app. Nothing to index, and they leak crawl
  // budget to a host we don't control.
  '/dashboard',
  '/signin',
  '/signup',

  // `/status` is emitted explicitly by the statusPages block below (with its
  // own changeFrequency), so the filesystem scan would duplicate it.
  '/status',

  // Internal-only routes. Both also carry `robots: { index: false }`.
  '/new_home', // homepage redesign draft
  '/badge-lab', // component sandbox
]);

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
          if (SITEMAP_EXCLUDED_ROUTES.has(finalUrl)) {
            continue;
          }
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

  // Blog posts. `lastModified` comes from the post's own frontmatter
  // (`updated`, falling back to `date`) — NOT the file mtime, which was the
  // previous source. Git does not preserve mtimes, so a fresh clone stamps
  // every `.md` with the checkout time: on Vercel that made all 103 posts
  // report a lastmod of "today" on every single deploy. That is exactly the
  // "everything changed" recrawl storm the note at the top of this file warns
  // against, and it made the freshness signal worthless.
  const blogPosts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: isoDay(new Date(post.dateModified).getTime()),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Topic-cluster hub pages (/blog/category/<slug>) — dynamic segments are
  // skipped by the filesystem scan, so add them explicitly.
  const blogCategoryPages: MetadataRoute.Sitemap = blogData.categories.map((cat) => ({
    url: `${baseUrl}/blog/category/${cat.slug}`,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

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

  // Head-to-head comparison pages (/compare/<competitor>). Dynamic segments are
  // skipped by the filesystem scan above, so add them explicitly.
  const comparePages: MetadataRoute.Sitemap = competitors.map((c) => ({
    url: `${baseUrl}/compare/${c.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

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
    ...blogCategoryPages,
    ...blogPaginationPages,
    ...comparePages,
    ...statusPages
  ];
}
