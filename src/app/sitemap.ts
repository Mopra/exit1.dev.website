import { promises as fs } from 'fs';
import path from 'path';
import { MetadataRoute } from 'next';
import { getAllPublicMonitors, isIndexEntryMature } from '@/lib/publicMonitors';
import { getAllPosts } from '@/lib/markdownLoader';
import blogData from '@/content/blog.json';
import { competitors } from '@/content/competitors';
import { movesAwaitingRecrawl } from '@/content/contentMoves';

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
 * Last substantive copy revision per static route, as an ISO day.
 *
 * Static pages carry no equivalent of a post's `updated` frontmatter, so they
 * shipped with no lastmod at all. That is the right default (see the note on
 * the return block: a fabricated "now" is worse than none), but it also means a
 * real correction to a page's copy gives Google no signal to recrawl, and these
 * pages are recrawled on a slow cadence precisely because they never change.
 *
 * So: an explicit, hand-maintained map. Add a route here only when its visible
 * copy or structured data actually changed, and set the date to the day of that
 * change. Routes absent from the map keep emitting no lastmod, unchanged.
 *
 * Dates are literals, never `Date.now()`, so sitemap output stays byte-stable
 * across regenerations and Vercel keeps deduping the ISR write.
 *
 * 2026-08-28: site-wide pricing audit after Free moved to 50 monitors. Corrected
 * stale tier numbers, removed unlimited-retention and invented API rate-limit
 * claims, and stripped fabricated aggregateRating markup from 14 pages.
 */
const CONTENT_REVISIONS: Record<string, string> = {
  '/': '2026-08-28',
  '/alerting': '2026-08-28',
  '/analytics': '2026-08-28',
  '/api-webhooks': '2026-08-28',
  '/badges': '2026-08-28',
  '/compare': '2026-08-28',
  '/domain-intelligence': '2026-08-28',
  '/features': '2026-08-28',
  '/free-uptime-monitor': '2026-08-28',
  '/free-website-monitor': '2026-08-28',
  '/getting-started': '2026-08-28',
  '/global-monitoring': '2026-08-28',
  '/icmp-monitoring': '2026-08-28',
  '/live-checks': '2026-08-28',
  '/logs': '2026-08-28',
  '/maintenance-mode': '2026-08-28',
  '/ssl-monitoring': '2026-08-28',
  '/status-pages': '2026-08-28',
  '/tools/redirect-checker': '2026-08-28',
  '/tools/ssl-checker': '2026-08-28',
  '/tools/uptime-checker': '2026-08-28',
  '/websocket-monitoring': '2026-08-28',
};

/** All five head-to-head pages are generated from competitors.ts, whose exit1
 *  columns were corrected in the same pass. */
const COMPARE_PAGES_REVISED = '2026-08-28';

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
  '/badge-lab', // component sandbox
  '/ai', // kickbacks.ai campaign landing page — /mcp is the indexed equivalent
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

  // Blog pagination is deliberately NOT advertised.
  //
  // Measured 2026-08-25 via the URL Inspection sweep
  // (scripts/seo/pull-index-coverage.mjs): all 8 of `/blog/page/2..9` were
  // unindexed, and had been for as long as they existed. That is the normal and
  // correct outcome for a paginated archive. The pages carry no content of their
  // own, only an ordering of posts that changes whenever a post is published, so
  // there is nothing stable for Google to rank.
  //
  // Advertising them anyway cost twice: it spent crawl budget re-fetching 8 URLs
  // that will never be served, and it made the sitemap's own indexing rate look
  // like a problem when it was not. They stay fully crawlable and linked from
  // /blog, so the posts behind them keep their discovery path. /site-map lists
  // every post as a flat index, and the 9 category hubs are all indexed, so no
  // post depends on pagination alone to be found.

  // Head-to-head comparison pages (/compare/<competitor>). Dynamic segments are
  // skipped by the filesystem scan above, so add them explicitly.
  const comparePages: MetadataRoute.Sitemap = competitors.map((c) => ({
    url: `${baseUrl}/compare/${c.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
    lastModified: COMPARE_PAGES_REVISED,
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

  // Recently moved URLs, re-advertised so Google actually recrawls them.
  //
  // A 301 does nothing until Google refetches the old URL, and consolidation
  // removes every route by which that happens: the post leaves the sitemap and
  // its internal links get repointed. Measured 2026-08-21, the 2026-08-02 batch
  // had split cleanly by whether Google happened to recrawl:
  // /blog/free-cname-lookup-tool (crawled 08-17) had moved its canonical, while
  // /blog/free-nameserver-lookup (crawled 08-01, one day before the deploy) was
  // still indexed and still ranking at position 10 against its own destination.
  //
  // So keep the source discoverable, with lastModified set to the move date as
  // the signal that it changed, until it ages out of the window. This is what
  // Google's site-move guidance asks for. Search Console will file these under
  // "Page with redirect", which is the goal state rather than a fault.
  //
  // Deliberately NOT priority 0: that reads as "never crawl", the opposite of
  // the intent. Low but non-zero, below every canonical page.
  // Date.now() is safe against the determinism note at the top of this file: it
  // only picks the day used to age entries out, and the emitted lastModified is
  // the fixed move date. Output therefore changes on the day a move expires, not
  // on every regeneration.
  const movedPages: MetadataRoute.Sitemap = movesAwaitingRecrawl(isoDay(Date.now())).map((m) => ({
    url: `${baseUrl}${m.from}`,
    changeFrequency: 'daily' as const,
    priority: 0.1,
    lastModified: m.since,
  }));

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
      ...(CONTENT_REVISIONS[page.url] ? { lastModified: CONTENT_REVISIONS[page.url] } : {}),
    })),
    ...blogPosts,
    ...blogCategoryPages,
    ...comparePages,
    ...statusPages,
    ...movedPages
  ];
}
