import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import { extractHeadings, addIdsToHeadings, type TocItem } from './tocUtils';

export interface BlogPostMeta {
  id: string;
  title: string;
  excerpt: string;
  readTime: string;
  category: string;
  slug: string;
  author: string;
  content: string;
  htmlContent: string;
  headings: TocItem[];
}

// Cache for processed posts
const postCache = new Map<string, BlogPostMeta>();
const metaCache = new Map<string, BlogPostMeta[]>();

// Import all markdown files from the posts directory and subdirectories
const postModules = import.meta.glob('../content/posts/**/*.md', { 
  eager: true
});

// Memoized remark processor
const remarkProcessor = remark().use(remarkGfm).use(remarkHtml);

export const getAllPosts = (): BlogPostMeta[] => {
  // Return cached result if available
  if (metaCache.has('all')) {
    return metaCache.get('all')!;
  }

  const posts: BlogPostMeta[] = [];

  for (const path in postModules) {
    const content = postModules[path] as { default: string };
    const { data, content: markdownContent } = matter(content.default);
    
    // Extract slug from filename
    const slug = path.split('/').pop()?.replace('.md', '') || '';
    
    // Calculate read time (rough estimate: 200 words per minute)
    const wordCount = markdownContent.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);
    
    posts.push({
      id: slug,
      title: data.title || 'Untitled',
      excerpt: data.excerpt || markdownContent.substring(0, 150) + '...',
      readTime: `${readTime} min read`,
      category: data.category || 'general',
      slug: data.slug || slug,
      author: data.author || 'Exit1 Team',
      content: markdownContent,
      htmlContent: '', // Will be processed on demand
      headings: [] // Will be processed on demand
    });
  }

  // Sort by date (newest first) or title if no date
  const sortedPosts = posts.sort((a, b) => {
    if (a.title && b.title) {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });
  
  // Cache the result
  metaCache.set('all', sortedPosts);
  
  return sortedPosts;
};

export const getPostBySlug = async (slug: string): Promise<BlogPostMeta | null> => {
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
  const htmlContent = processedContent.toString();
  
  // Extract headings and add IDs to HTML
  const headings = extractHeadings(markdownContent);
  const htmlWithIds = addIdsToHeadings(htmlContent);

  const post: BlogPostMeta = {
    id: slug,
    title: data.title || 'Untitled',
    excerpt: data.excerpt || markdownContent.substring(0, 150) + '...',
    readTime: data.readTime || '5 min read',
    category: data.category || 'general',
    slug: data.slug || slug,
    author: data.author || 'Exit1 Team',
    content: markdownContent,
    htmlContent: htmlWithIds,
    headings
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