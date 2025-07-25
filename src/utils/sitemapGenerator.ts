import blogData from '../content/blog.json';

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export interface SitemapData {
  urls: SitemapUrl[];
  lastUpdated: string;
}

const BASE_URL = 'https://exit1.dev';

// Static routes configuration
const STATIC_ROUTES: SitemapUrl[] = [
  {
    loc: '/',
    changefreq: 'weekly',
    priority: 1.0,
  },
  {
    loc: '/blog',
    changefreq: 'daily',
    priority: 0.8,
  },
  {
    loc: '/privacy',
    changefreq: 'monthly',
    priority: 0.3,
  },
  {
    loc: '/roadmap',
    changefreq: 'weekly',
    priority: 0.7,
  },
];

export const generateSitemap = (): SitemapData => {
  const urls: SitemapUrl[] = [...STATIC_ROUTES];

  // Add blog posts
  blogData.posts.forEach((post) => {
    urls.push({
      loc: `/blog/${post.slug}`,
      lastmod: post.date,
      changefreq: 'monthly',
      priority: 0.6,
    });
  });

  return {
    urls,
    lastUpdated: new Date().toISOString(),
  };
};

export const generateSitemapXml = (): string => {
  const sitemap = generateSitemap();
  
  const xmlUrls = sitemap.urls
    .map((url) => {
      const lastmod = url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : '';
      const changefreq = url.changefreq ? `\n    <changefreq>${url.changefreq}</changefreq>` : '';
      const priority = url.priority ? `\n    <priority>${url.priority}</priority>` : '';
      
      return `  <url>
    <loc>${BASE_URL}${url.loc}</loc>${lastmod}${changefreq}${priority}
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>`;
};

export const generateSitemapTxt = (): string => {
  const sitemap = generateSitemap();
  
  return sitemap.urls
    .map((url) => `${BASE_URL}${url.loc}`)
    .join('\n');
}; 