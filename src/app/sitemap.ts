import { promises as fs } from 'fs';
import path from 'path';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://exit1.dev';

  // Auto-discover pages from file system
  async function getStaticPages() {
    const appDir = path.join(process.cwd(), 'src', 'app');
    const pages: Array<{ url: string; changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'; priority: number }> = [];
    
    async function scanDirectory(dir: string, urlPath: string = '') {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const url = urlPath + '/' + entry.name;
        
        if (entry.isDirectory()) {
          // Skip special Next.js directories
          if (!['api', 'globals.css', 'layout.tsx', 'loading.tsx', 'error.tsx', 'not-found.tsx'].includes(entry.name)) {
            await scanDirectory(fullPath, url);
          }
        } else if (entry.name === 'page.tsx') {
          // Found a page
          const finalUrl = urlPath === '' ? '/' : urlPath;
          pages.push({
            url: finalUrl,
            changefreq: getChangeFreq(finalUrl),
            priority: getPriority(finalUrl)
          });
        }
      }
    }
    
    await scanDirectory(appDir);
    return pages;
  }

  function getChangeFreq(url: string): 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' {
    if (url === '/') return 'weekly';
    if (url.includes('/blog')) return 'weekly';
    if (url.includes('/product') || url.includes('/signup') || url.includes('/signin')) return 'monthly';
    return 'monthly';
  }

  function getPriority(url: string): number {
    if (url === '/') return 1.0;
    if (url.includes('/dashboard')) return 0.9;
    if (url.includes('/product') || url.includes('/signup') || url.includes('/signin')) return 0.8;
    if (url.includes('/blog')) return 0.7;
    if (url.includes('/privacy')) return 0.3;
    return 0.5;
  }

  const staticPages = await getStaticPages();

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
