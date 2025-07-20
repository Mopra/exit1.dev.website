import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
  author: string;
  tags: string[];
  content: string;
  htmlContent: string;
}

export interface BlogPostMeta {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
  author: string;
  tags: string[];
}

// Import all markdown files from the posts directory
const postModules = import.meta.glob('../content/posts/*.md', { 
  eager: true
});

export const getAllPosts = (): BlogPostMeta[] => {
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
      date: data.date,
      readTime: data.readTime,
      category: data.category,
      slug: data.slug || slug,
      author: data.author || 'exit1.dev Team',
      tags: data.tags || []
    });
  }

  // Sort by date (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const postPath = `../content/posts/${slug}.md`;
  
  if (!(postPath in postModules)) {
    return null;
  }

  const content = postModules[postPath] as { default: string };
  const { data, content: markdownContent } = matter(content.default);

  // Convert markdown to HTML
  const processedContent = await remark()
    .use(gfm)
    .use(html)
    .process(markdownContent);

  return {
    id: slug,
    title: data.title,
    excerpt: data.excerpt,
    date: data.date,
    readTime: data.readTime,
    category: data.category,
    slug: data.slug || slug,
    author: data.author || 'exit1.dev Team',
    tags: data.tags || [],
    content: markdownContent,
    htmlContent: processedContent.toString()
  };
};

export const getPostsByCategory = (category: string): BlogPostMeta[] => {
  return getAllPosts().filter(post => post.category === category);
};

export const getPostsByTag = (tag: string): BlogPostMeta[] => {
  return getAllPosts().filter(post => post.tags.includes(tag));
};

export const getCategories = (): string[] => {
  const categories = getAllPosts().map(post => post.category);
  return [...new Set(categories)];
};

export const getTags = (): string[] => {
  const tags = getAllPosts().flatMap(post => post.tags);
  return [...new Set(tags)];
}; 