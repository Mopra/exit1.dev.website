export interface TocItem {
  id: string;
  text: string;
  level: number;
}

// Generate a URL-friendly ID from text
export const generateId = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
};

// Extract headings from markdown content
export const extractHeadings = (markdownContent: string): TocItem[] => {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: TocItem[] = [];
  
  let match;
  while ((match = headingRegex.exec(markdownContent)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = generateId(text);
    
    headings.push({
      id,
      text,
      level
    });
  }
  
  return headings;
};

// Add IDs to HTML headings
export const addIdsToHeadings = (htmlContent: string): string => {
  return htmlContent.replace(
    /<h([1-6])>(.*?)<\/h[1-6]>/g,
    (match, level, content) => {
      const text = content.replace(/<[^>]*>/g, ''); // Remove HTML tags from content
      const id = generateId(text);
      return `<h${level} id="${id}">${content}</h${level}>`;
    }
  );
};

// Extract headings from HTML content (for existing posts)
export const extractHeadingsFromHtml = (htmlContent: string): TocItem[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  
  const headings: TocItem[] = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  
  const headingElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  headingElements.forEach((element) => {
    const level = parseInt(element.tagName.charAt(1));
    const text = element.textContent?.trim() || '';
    const id = element.id || generateId(text);
    
    headings.push({
      id,
      text,
      level
    });
  });
  
  return headings;
};
