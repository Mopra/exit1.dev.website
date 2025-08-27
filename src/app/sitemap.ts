import { promises as fs } from 'fs';
import path from 'path';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://exit1.dev';

  // Static pages
  const staticPages = [
    { url: '/', changefreq: 'weekly', priority: 1.0 },
    { url: '/real-time-monitoring', changefreq: 'monthly', priority: 0.8 },
    { url: '/ssl-monitoring', changefreq: 'monthly', priority: 0.8 },
    { url: '/global-monitoring', changefreq: 'monthly', priority: 0.8 },
    { url: '/alerting', changefreq: 'monthly', priority: 0.8 },
    { url: '/analytics', changefreq: 'monthly', priority: 0.8 },
    { url: '/blog', changefreq: 'weekly', priority: 0.7 },
    { url: '/privacy', changefreq: 'yearly', priority: 0.3 },
    { url: '/sitemap', changefreq: 'monthly', priority: 0.2 }
  ];

  // Get blog posts dynamically
  const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');
  const categories = await fs.readdir(postsDir);

  const blogPosts = [];
  for (const category of categories) {
    const categoryDir = path.join(postsDir, category);
    const files = await fs.readdir(categoryDir);
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        const slug = file.replace('.md', '');
        const url = `/blog/${slug}`;
        // Get lastmod from file stats
        const stats = await fs.stat(path.join(categoryDir, file));
        const lastmod = stats.mtime.toISOString();
        
        blogPosts.push({
          url,
          lastmod,
          changefreq: 'monthly',
          priority: 0.7
        });
      }
    }
  }

  // Combine all
  const allPages = [
    ...staticPages.map(page => ({
      url: `${baseUrl}${page.url}`,
      changefreq: page.changefreq,
      priority: page.priority,
      lastmod: new Date().toISOString() // Use current date for static
    })),
    ...blogPosts.map(post => ({
      ...post,
      url: `${baseUrl}${post.url}`
    }))
  ];

  return allPages;
}
