const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

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
    priority: 0.4,
  },
  {
    loc: '/quick-start',
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    loc: '/product/monitoring',
    changefreq: 'weekly',
    priority: 0.9,
  },
  {
    loc: '/product/ssl-monitoring',
    changefreq: 'weekly',
    priority: 0.9,
  },
  {
    loc: '/product/analytics',
    changefreq: 'weekly',
    priority: 0.9,
  },
  {
    loc: '/product/alerting',
    changefreq: 'weekly',
    priority: 0.9,
  },
  {
    loc: '/product/console',
    changefreq: 'weekly',
    priority: 0.9,
  },
  {
    loc: '/product/global',
    changefreq: 'weekly',
    priority: 0.9,
  },
];

// Function to get all markdown files recursively
const getAllMarkdownFiles = (dir) => {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getAllMarkdownFiles(fullPath));
    } else if (item.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  
  return files;
};

const generateSitemap = () => {
  const urls = [...STATIC_ROUTES];

  // Add blog posts from markdown files
  const postsDir = path.join(__dirname, '../src/content/posts');
  if (fs.existsSync(postsDir)) {
    const markdownFiles = getAllMarkdownFiles(postsDir);
    
    markdownFiles.forEach((filePath) => {
      const content = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(content);
      
      // Extract slug from filename
      const filename = path.basename(filePath, '.md');
      const slug = data.slug || filename;
      
      // Get file stats for lastmod
      const stats = fs.statSync(filePath);
      const lastmod = stats.mtime.toISOString().split('T')[0];
      
      urls.push({
        loc: `/blog/${slug}`,
        lastmod,
        changefreq: 'monthly',
        priority: 0.6,
      });
    });
  }

  return {
    urls,
    lastUpdated: new Date().toISOString(),
  };
};

const generateSitemapXml = () => {
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

const generateSitemapTxt = () => {
  const sitemap = generateSitemap();
  
  return sitemap.urls
    .map((url) => `${BASE_URL}${url.loc}`)
    .join('\n');
};

module.exports = {
  generateSitemapXml,
  generateSitemapTxt
}; 