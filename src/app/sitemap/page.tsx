import React from 'react';
import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { promises as fs } from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: "Sitemap | exit1.dev",
  description: "Complete sitemap of exit1.dev - Find all pages, features, and resources for our website monitoring platform.",
  openGraph: {
    title: "Sitemap | exit1.dev",
    description: "Complete sitemap of exit1.dev - Find all pages, features, and resources for our website monitoring platform.",
  },
  twitter: {
    title: "Sitemap | exit1.dev",
    description: "Complete sitemap of exit1.dev - Find all pages, features, and resources for our website monitoring platform.",
  },
};


// Auto-discover pages from file system
async function getStaticPages() {
  try {
    const appDir = path.join(process.cwd(), 'src', 'app');
    const pages: Array<{ url: string; name: string }> = [];
    
    async function scanDirectory(dir: string, urlPath: string = '') {
      try {
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
            const name = getPageName(finalUrl);
            pages.push({
              url: finalUrl,
              name: name
            });
          }
        }
      } catch (error) {
        console.error(`Error scanning directory ${dir}:`, error);
      }
    }
    
    await scanDirectory(appDir);
    return pages;
  } catch (error) {
    console.error('Error in getStaticPages:', error);
    return [];
  }
}

// Get blog posts dynamically
async function getBlogPosts() {
  try {
    const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');
    console.log('Scanning posts directory:', postsDir);
    
    const categories = await fs.readdir(postsDir);
    console.log('Found categories:', categories);
    
    const blogPosts: Array<{ url: string; name: string }> = [];

    for (const category of categories) {
      try {
        const categoryDir = path.join(postsDir, category);
        const files = await fs.readdir(categoryDir);
        console.log(`Found ${files.length} files in ${category}`);
        
        for (const file of files) {
          if (file.endsWith('.md')) {
            const slug = file.replace('.md', '');
            const url = `/blog/${slug}`;
            const name = getBlogPostName(slug);
            blogPosts.push({ url, name });
          }
        }
      } catch (error) {
        console.error(`Error scanning category ${category}:`, error);
      }
    }
    
    console.log('Total blog posts found:', blogPosts.length);
    return blogPosts;
  } catch (error) {
    console.error('Error in getBlogPosts:', error);
    return [];
  }
}

function getPageName(url: string): string {
  if (url === '/') return 'Home';
  if (url === '/real-time-monitoring') return 'Real-Time Monitoring';
  if (url === '/ssl-monitoring') return 'SSL Certificate Monitoring';
  if (url === '/global-monitoring') return 'Global Monitoring';
  if (url === '/alerting') return 'Alerting & Notifications';
  if (url === '/analytics') return 'Analytics & Reports';
  if (url === '/logs') return 'Logs';
  if (url === '/api-webhooks') return 'API & Webhooks';
  if (url === '/getting-started') return 'Getting Started';
  if (url === '/privacy') return 'Privacy Policy';
  if (url === '/data-privacy') return 'Data Privacy';
  if (url === '/blog') return 'Blog';
  if (url === '/signup') return 'Sign Up';
  if (url === '/signin') return 'Sign In';
  if (url === '/dashboard') return 'Dashboard';
  if (url === '/install') return 'Install';
  if (url === '/roadmap') return 'Roadmap';
  if (url === '/sitemap') return 'Sitemap';
  if (url.startsWith('/product/')) {
    const product = url.replace('/product/', '');
    return `${product.charAt(0).toUpperCase() + product.slice(1).replace('-', ' ')}`;
  }
  
  // Default: capitalize and replace dashes
  return url.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || url;
}

function getBlogPostName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const Sitemap = async () => {
  console.log('Starting sitemap generation...');
  
  const staticPages = await getStaticPages();
  console.log('Static pages found:', staticPages.length);
  
  const blogPosts = await getBlogPosts();
  console.log('Blog posts found:', blogPosts.length);
  console.log('First few blog posts:', blogPosts.slice(0, 5));
  
  // Create a proper tree structure
  const siteTree = {
    root: {
      name: "exit1.dev",
      url: "/",
      children: {
        home: {
          name: "Home",
          url: "/",
          children: {
            gettingStarted: { name: "Getting Started", url: "/getting-started" },
            roadmap: { name: "Roadmap", url: "/roadmap" }
          }
        },
        features: {
          name: "Features",
          children: {
            realTime: { name: "Real-Time Monitoring", url: "/real-time-monitoring" },
            ssl: { name: "SSL Certificate Monitoring", url: "/ssl-monitoring" },
            global: { name: "Global Monitoring", url: "/global-monitoring" },
            alerting: { name: "Alerting & Notifications", url: "/alerting" },
            analytics: { name: "Analytics & Reports", url: "/analytics" },
            logs: { name: "Logs", url: "/logs" },
            api: { name: "API & Webhooks", url: "/api-webhooks" }
          }
        },
        product: {
          name: "Product Pages",
          children: Object.fromEntries(
            staticPages
              .filter(page => page.url.startsWith('/product/'))
              .map((page, index) => [
                `product-${index}`,
                { name: page.name, url: page.url }
              ])
          )
        },
        content: {
          name: "Content",
          children: {
            blog: { 
              name: "Blog", 
              url: "/blog",
              children: Object.fromEntries(
                blogPosts.slice(0, 15).map((post, index) => [
                  `post-${index}`,
                  { name: post.name, url: post.url }
                ])
              )
            }
          }
        },
        legal: {
          name: "Legal",
          children: {
            privacy: { name: "Privacy Policy", url: "/privacy" },
            dataPrivacy: { name: "Data Privacy", url: "/data-privacy" }
          }
        },
        other: {
          name: "Other Pages",
          children: Object.fromEntries(
            staticPages
              .filter(page => 
                !['/', '/blog', '/getting-started', '/privacy', '/data-privacy', '/roadmap', '/sitemap',
                  '/real-time-monitoring', '/ssl-monitoring', '/global-monitoring', '/alerting', '/analytics', '/logs', '/api-webhooks',
                  '/signup', '/signin', '/dashboard', '/install'].includes(page.url) &&
                !page.url.startsWith('/product/')
              )
              .map((page, index) => [
                `other-${index}`,
                { name: page.name, url: page.url }
              ])
          )
        },
        external: {
          name: "External",
          children: {
            app: { name: "App Dashboard", url: "https://app.exit1.dev", external: true },
            signup: { name: "Sign Up", url: "https://app.exit1.dev/sign-up", external: true },
            discord: { name: "Discord Support", url: "https://discord.gg/exit1", external: true }
          }
        }
      }
    }
  };

  // Tree component for rendering the site structure
  interface TreeNodeProps {
    node: {
      name: string;
      url?: string;
      external?: boolean;
      children?: Record<string, TreeNodeProps['node']>;
    };
    level?: number;
    isLast?: boolean;
    parentPrefix?: string;
  }

  const TreeNode = ({ node, level = 0, isLast = false, parentPrefix = "" }: TreeNodeProps) => {
    const hasChildren = node.children && Object.keys(node.children).length > 0;
    const children = hasChildren ? Object.values(node.children!) as TreeNodeProps['node'][] : [];
    
    // Create the tree prefix
    const getPrefix = () => {
      if (level === 0) return "";
      const connector = isLast ? "└── " : "├── ";
      return parentPrefix + connector;
    };
    
    const getChildPrefix = () => {
      if (level === 0) return "";
      const spacer = isLast ? "    " : "│   ";
      return parentPrefix + spacer;
    };
    
    return (
      <div className="font-mono text-sm">
        <div className={`flex items-center py-1 hover:bg-muted/30 transition-colors rounded ${
          level === 0 ? 'font-bold text-foreground text-base' : 'text-muted-foreground hover:text-foreground'
        }`}>
          <span className="text-muted-foreground/60 mr-2">
            {getPrefix()}
          </span>
          {node.url ? (
            <a
              href={node.url}
              className="hover:underline transition-colors flex-1"
              target={node.external ? "_blank" : undefined}
              rel={node.external ? "noopener noreferrer" : undefined}
            >
              {node.name}
            </a>
          ) : (
            <span className="flex-1">{node.name}</span>
          )}
          {node.external && (
            <ExternalLink className="w-3 h-3 text-muted-foreground ml-2" />
          )}
        </div>
        
        {hasChildren && (
          <div className="ml-0">
            {children.map((child, index: number) => (
              <TreeNode 
                key={index} 
                node={child} 
                level={level + 1} 
                isLast={index === children.length - 1}
                parentPrefix={getChildPrefix()}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Site Structure
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete hierarchical overview of all pages and resources available on exit1.dev
          </p>
        </div>

        <Card className="backdrop-blur-md bg-card/50 border-primary/20">
          <CardContent className="p-8">
            <div className="space-y-1">
              <TreeNode node={siteTree.root} />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Sitemap;
