import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  readTime: string;
  category: string;
  slug: string;
  author: string;
  content: string;
  htmlContent: string;
}

export interface BlogPostMeta {
  id: string;
  title: string;
  excerpt: string;
  readTime: string;
  category: string;
  slug: string;
  author: string;
}

// Cache for processed posts
const postCache = new Map<string, BlogPost>();
const metaCache = new Map<string, BlogPostMeta[]>();

// Import all markdown files from the posts directory and subdirectories
const postModules = import.meta.glob('../content/posts/**/*.md', { 
  eager: true
});

// Memoized remark processor
const remarkProcessor = remark().use(gfm).use(html);

export const getAllPosts = (): BlogPostMeta[] => {
  // Return cached result if available
  if (metaCache.has('all')) {
    return metaCache.get('all')!;
  }

  const posts: BlogPostMeta[] = [];

  for (const path in postModules) {
    const content = postModules[path] as { default: string };
    const { data } = matter(content.default);
    
    // Extract slug from filename
    const slug = path.split('/').pop()?.replace('.md', '') || '';
    
    posts.push({
      id: slug,
      title: data.title,
      excerpt: data.excerpt,
      readTime: data.readTime,
      category: data.category,
      slug: data.slug || slug,
      author: data.author || 'Morten Pradsgaard'
    });
  }

  // Sort by title (alphabetical)
  const sortedPosts = posts.sort((a, b) => a.title.localeCompare(b.title));
  
  // Cache the result
  metaCache.set('all', sortedPosts);
  
  return sortedPosts;
};

export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  // Return cached result if available
  if (postCache.has(slug)) {
    return postCache.get(slug)!;
  }

  // Try to find the post in any subdirectory
  let postPath = '';
  for (const path in postModules) {
    const pathSlug = path.split('/').pop()?.replace('.md', '') || '';
    if (pathSlug === slug) {
      postPath = path;
      break;
    }
  }
  
  if (!postPath || !(postPath in postModules)) {
    return null;
  }

  const content = postModules[postPath] as { default: string };
  const { data, content: markdownContent } = matter(content.default);

  // Convert markdown to HTML using cached processor
  const processedContent = await remarkProcessor.process(markdownContent);

  const post: BlogPost = {
    id: slug,
    title: data.title,
    excerpt: data.excerpt,
    readTime: data.readTime,
    category: data.category,
    slug: data.slug || slug,
    author: data.author || 'Morten Pradsgaard',
    content: markdownContent,
    htmlContent: processedContent.toString()
  };

  // Cache the result
  postCache.set(slug, post);

  return post;
};

export const getPostsByCategory = (category: string): BlogPostMeta[] => {
  const cacheKey = `category-${category}`;
  
  if (metaCache.has(cacheKey)) {
    return metaCache.get(cacheKey)!;
  }

  const posts = getAllPosts().filter(post => post.category === category);
  metaCache.set(cacheKey, posts);
  
  return posts;
};

export const getCategories = (): string[] => {
  const cacheKey = 'categories';
  
  if (metaCache.has(cacheKey)) {
    return metaCache.get(cacheKey) as any;
  }

  const categories = getAllPosts().map(post => post.category);
  const uniqueCategories = [...new Set(categories)];
  
  metaCache.set(cacheKey, uniqueCategories as any);
  
  return uniqueCategories;
}; 