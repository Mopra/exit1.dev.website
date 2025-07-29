import { build } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get all markdown files to generate blog routes
const getBlogPosts = async () => {
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
};

// Routes to pre-render
const routes = [
  '/',
  '/blog',
  '/privacy',
  '/roadmap',
  '/sitemap'
];

const generateStaticSite = async () => {
  console.log('🚀 Starting static site generation...');
  
  // Build the app first
  await build();
  
  // Apply cache optimizations
  console.log('🔧 Applying cache optimizations...');
  const { execSync } = await import('child_process');
  try {
    execSync('node scripts/deploy-with-cache.cjs', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️  Cache optimization failed, continuing with static generation...');
  }
  
  // Get blog posts
  const blogPosts = await getBlogPosts();
  
  // Add blog post routes
  const allRoutes = [
    ...routes,
    ...blogPosts.map(post => `/blog/${post.slug}`)
  ];
  
  console.log('Blog posts found:', blogPosts.map(p => p.slug));
  console.log(`📝 Found ${blogPosts.length} blog posts`);
  console.log(`🔗 Generating ${allRoutes.length} routes`);
  
  // Read the Vite-built index.html as template
  const distDir = resolve(__dirname, '../dist');
  const templatePath = resolve(distDir, 'index.html');
  let templateHTML = fs.readFileSync(templatePath, 'utf8');
  
  // Find the main script tag to replace
  const scriptMatch = templateHTML.match(/<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/);
  if (!scriptMatch) {
    console.error('Could not find main script tag in template');
    return;
  }
  
  const mainScriptSrc = scriptMatch[1];
  console.log('Main script source:', mainScriptSrc);
  
  // Create HTML generator for each route
  const generateHTML = (route) => {
    const isBlogPost = route.startsWith('/blog/') && route !== '/blog';
    const title = isBlogPost 
      ? `Blog Post - ${route.split('/').pop()}`
      : route === '/' ? 'Exit1.dev - Website Monitoring' 
      : `${route.slice(1).charAt(0).toUpperCase() + route.slice(2)} - Exit1.dev`;
    
    // Replace title and meta tags while keeping the original script references
    let html = templateHTML
      .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
      .replace(/<meta name="description" content=".*?"/, `<meta name="description" content="Professional website monitoring and uptime tracking service"`)
      .replace(/<link rel="canonical" href=".*?"/, `<link rel="canonical" href="https://exit1.dev${route}"`)
      .replace(/<meta property="og:title" content=".*?"/, `<meta property="og:title" content="${title}"`)
      .replace(/<meta property="og:url" content=".*?"/, `<meta property="og:url" content="https://exit1.dev${route}"`)
      .replace(/<meta property="og:type" content=".*?"/, `<meta property="og:type" content="${isBlogPost ? 'article' : 'website'}"`)
      .replace(/<meta name="twitter:title" content=".*?"/, `<meta name="twitter:title" content="${title}"`);
    
    return html;
  };
  
  // Generate HTML files for each route
  for (const route of allRoutes) {
    const filePath = route === '/' 
      ? resolve(distDir, 'index.html')
      : resolve(distDir, route.slice(1), 'index.html');
    
    // Ensure directory exists
    const dir = dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, generateHTML(route));
    console.log(`✅ Generated: ${route}`);
  }
  
  console.log('🎉 Static site generation complete!');
};

generateStaticSite().catch(console.error); 