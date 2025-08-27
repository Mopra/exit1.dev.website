import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import fs from 'fs';
import path from 'path';
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

// Custom remark plugin to add target="_blank" and rel="noopener noreferrer" to external links
const remarkExternalLinks = () => {
  return (tree: unknown) => {
    const visit = (node: unknown) => {
      if (typeof node === 'object' && node !== null && 'type' in node && 'url' in node) {
        const linkNode = node as { type: string; url: string; data?: Record<string, unknown>; children?: unknown[] };
        if (linkNode.type === 'link' && linkNode.url && linkNode.url.startsWith('http')) {
          // Add target and rel attributes to external links
          linkNode.data = linkNode.data || {};
          linkNode.data.hProperties = linkNode.data.hProperties || {};
          (linkNode.data.hProperties as Record<string, string>).target = '_blank';
          (linkNode.data.hProperties as Record<string, string>).rel = 'noopener noreferrer';
        }
        
        if (linkNode.children) {
          linkNode.children.forEach(visit);
        }
      }
    };
    
    visit(tree);
  };
};

// Memoized remark processor
const remarkProcessor = remark()
  .use(remarkGfm)
  .use(remarkExternalLinks)
  .use(remarkHtml);

// Get all markdown files from the posts directory
const getPostFiles = () => {
  const postsDirectory = path.join(process.cwd(), 'src/content/posts');
  const categories = ['monitoring', 'ai'];
  const files: string[] = [];

  categories.forEach(category => {
    const categoryPath = path.join(postsDirectory, category);
    if (fs.existsSync(categoryPath)) {
      const categoryFiles = fs.readdirSync(categoryPath);
      categoryFiles.forEach(file => {
        if (file.endsWith('.md')) {
          files.push(path.join(category, file));
        }
      });
    }
  });

  return files;
};

export const getAllPosts = (): BlogPostMeta[] => {
  const files = getPostFiles();
  const posts: BlogPostMeta[] = [];

  files.forEach(file => {
    const filePath = path.join(process.cwd(), 'src/content/posts', file);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content: markdownContent } = matter(fileContents);
    
    // Extract slug from filename
    const slug = path.basename(file, '.md');
    
    // Calculate read time (rough estimate: 200 words per minute)
    const wordCount = markdownContent.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);
    
    posts.push({
      id: slug,
      title: data.title || 'Untitled',
      excerpt: data.excerpt || markdownContent.substring(0, 150) + '...',
      readTime: `${readTime} min read`,
      category: data.category || path.dirname(file),
      slug: data.slug || slug,
      author: data.author || 'Exit1 Team',
      content: markdownContent,
      htmlContent: '', // Will be processed on demand
      headings: [] // Will be processed on demand
    });
  });

  // Sort by title
  const sortedPosts = posts.sort((a, b) => {
    if (a.title && b.title) {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });
  
  return sortedPosts;
};

export const getPostBySlug = async (slug: string): Promise<BlogPostMeta | null> => {
  const files = getPostFiles();
  
  // Find the file that matches the slug
  const targetFile = files.find(file => {
    const fileSlug = path.basename(file, '.md');
    return fileSlug === slug;
  });
  
  if (!targetFile) {
    return null;
  }

  const filePath = path.join(process.cwd(), 'src/content/posts', targetFile);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content: markdownContent } = matter(fileContents);
  
  // Calculate read time
  const wordCount = markdownContent.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);
  
  // Process markdown to HTML
  const processedContent = await remarkProcessor.process(markdownContent);
  const htmlContent = processedContent.toString();
  
  // Extract headings and add IDs
  const headings = extractHeadings(markdownContent);
  const htmlWithIds = addIdsToHeadings(htmlContent);
  
  return {
    id: slug,
    title: data.title || 'Untitled',
    excerpt: data.excerpt || markdownContent.substring(0, 150) + '...',
    readTime: `${readTime} min read`,
    category: data.category || path.dirname(targetFile),
    slug: data.slug || slug,
    author: data.author || 'Exit1 Team',
    content: markdownContent,
    htmlContent: htmlWithIds,
    headings
  };
};
