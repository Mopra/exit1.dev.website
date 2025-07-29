import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://exit1.dev';

// Static routes configuration
const STATIC_ROUTES = [
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
  {
    loc: '/sitemap',
    changefreq: 'weekly',
    priority: 0.5,
  },
];

// Get all markdown files to generate blog routes
const getBlogPosts = async () => {
  try {
    const posts = await glob('src/content/posts/**/*.md');
    return posts.map(post => {
      // Normalize path separators and extract just the filename without extension
      const normalizedPath = post.replace(/\\/g, '/');
      const slug = normalizedPath
        .replace('src/content/posts/', '')
        .replace('.md', '')
        .split('/')
        .pop();
      return { slug, path: post };
    });
  } catch (error) {
    console.error('Error scanning blog posts:', error);
    return [];
  }
};

const generateSitemap = async () => {
  const urls = [...STATIC_ROUTES];
  const blogPosts = await getBlogPosts();

  // Add blog posts
  blogPosts.forEach((post) => {
    urls.push({
      loc: `/blog/${post.slug}`,
      changefreq: 'monthly',
      priority: 0.6,
    });
  });

  return {
    urls,
    lastUpdated: new Date().toISOString(),
  };
};

const generateSitemapXml = async () => {
  const sitemap = await generateSitemap();
  
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

const generateSitemapTxt = async () => {
  const sitemap = await generateSitemap();
  
  return sitemap.urls
    .map((url) => `${BASE_URL}${url.loc}`)
    .join('\n');
};

const generateSitemapFiles = async () => {
  const publicDir = path.join(process.cwd(), 'public');
  
  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  try {
    // Generate XML sitemap
    const xmlContent = await generateSitemapXml();
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xmlContent);
    console.log('✅ XML sitemap generated: public/sitemap.xml');

    // Generate text sitemap
    const txtContent = await generateSitemapTxt();
    fs.writeFileSync(path.join(publicDir, 'sitemap.txt'), txtContent);
    console.log('✅ Text sitemap generated: public/sitemap.txt');

    console.log('🎉 All sitemap files generated successfully!');
  } catch (error) {
    console.error('❌ Error generating sitemap files:', error);
    process.exit(1);
  }
};

// Run if called directly
generateSitemapFiles(); 