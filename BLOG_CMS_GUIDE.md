# Dynamic Blog CMS Guide

This guide explains how to use the new dynamic blog CMS system that automatically loads blog posts from markdown files.

## Overview

The blog system now uses markdown files stored in `/src/content/posts/` instead of static JSON. When you add a new `.md` file to this directory, it will automatically appear on the blog page.

## File Structure

```
src/
├── content/
│   └── posts/
│       ├── getting-started-with-exit1-dev.md
│       ├── best-practices-for-modern-web-development.md
│       └── performance-optimization-techniques.md
├── utils/
│   └── markdownLoader.ts
└── pages/
    ├── Blog.tsx
    └── BlogPost.tsx
```

## Creating a New Blog Post

### 1. Create a Markdown File

Create a new `.md` file in `/src/content/posts/` with the following naming convention:
- Use kebab-case (e.g., `my-awesome-post.md`)
- The filename will be used as the slug for the URL

### 2. Add Frontmatter

Every blog post must start with frontmatter (metadata) in YAML format:

```yaml
---
title: "Your Post Title"
excerpt: "A brief description of your post that appears in the blog listing."
date: "2024-01-15"
readTime: "5 min read"
category: "Tutorial"
slug: "your-post-slug"
author: "Morten Pradsgaard"

---
```

### 3. Write Your Content

After the frontmatter, write your blog post content using standard markdown:

```markdown
# Your Post Title

Your introduction paragraph here.

## Section 1

Content for section 1...

### Subsection

More detailed content...

## Section 2

- Bullet point 1
- Bullet point 2
- Bullet point 3

## Code Examples

```javascript
const example = "This is a code block";
console.log(example);
```

## Conclusion

Wrap up your post here.
```

## Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | The title of your blog post |
| `excerpt` | Yes | Brief description shown in blog listing |
| `date` | Yes | Publication date (YYYY-MM-DD format) |
| `readTime` | Yes | Estimated reading time (e.g., "5 min read") |
| `category` | Yes | Post category (used for filtering) |
| `slug` | Yes | URL slug for the post |
| `author` | No | Author name (defaults to "Morten Pradsgaard") |

## Supported Markdown Features

The blog system supports the following markdown features:

### Basic Formatting
- **Bold text**
- *Italic text*
- `Inline code`
- [Links](https://example.com)

### Headers
```markdown
# H1 Header
## H2 Header
### H3 Header
#### H4 Header
```

### Lists
```markdown
- Unordered list item
- Another item
  - Nested item

1. Ordered list item
2. Another item
```

### Code Blocks
```markdown
```javascript
const example = "JavaScript code block";
console.log(example);
```

```python
def example():
    return "Python code block"
```
```

### Blockquotes
```markdown
> This is a blockquote
> It can span multiple lines
```

### Tables
```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

### Images
```markdown
![Alt text](image-url.jpg)
```

## Blog Features

### Category Filtering
The blog page includes category filtering. Posts are automatically grouped by category, and users can filter by clicking category buttons.



### SEO-Friendly URLs
Each post gets a dedicated URL based on its slug: `/blog/your-post-slug`

### Responsive Design
The blog is fully responsive and optimized for all device sizes.

### Performance Optimized
- Posts are loaded dynamically using Vite's `import.meta.glob`
- Markdown is processed at build time
- Images are optimized with lazy loading

## Adding Images

### Option 1: External URLs
```markdown
![Alt text](https://example.com/image.jpg)
```

### Option 2: Local Images
Place images in `/public/images/` and reference them:
```markdown
![Alt text](/images/your-image.jpg)
```

## Best Practices

### 1. File Naming
- Use descriptive, kebab-case filenames
- Keep filenames short but meaningful
- Avoid special characters

### 2. Content Structure
- Start with a compelling introduction
- Use clear headings to organize content
- Include code examples where relevant
- End with a conclusion or call-to-action

### 3. SEO
- Write descriptive titles and excerpts
- Use relevant tags and categories
- Include alt text for images
- Keep content focused and valuable

### 4. Performance
- Optimize images before adding them
- Keep code examples concise
- Use appropriate heading hierarchy

## Example Blog Post

Here's a complete example of a blog post:

```markdown
---
title: "Building Scalable React Applications"
excerpt: "Learn the architecture patterns and best practices for building React applications that scale with your business."
date: "2024-01-01"
readTime: "10 min read"
category: "Architecture"
slug: "building-scalable-react-applications"
author: "Morten Pradsgaard"

---

# Building Scalable React Applications

Building scalable React applications requires careful planning and adherence to proven patterns. This guide covers the essential architecture principles that will help your application grow with your business.

## Understanding Scalability

Scalability in React applications refers to the ability to maintain performance, maintainability, and developer productivity as your codebase grows.

### Key Principles

1. **Component Composition**: Build reusable, composable components
2. **State Management**: Choose the right state management solution
3. **Code Splitting**: Split your bundle for better performance
4. **Testing**: Implement comprehensive testing strategies

## Component Architecture

### Atomic Design

Organize your components using atomic design principles:

```jsx
// Atoms
const Button = ({ children, ...props }) => (
  <button className="btn" {...props}>{children}</button>
);

// Molecules
const SearchBar = () => (
  <div className="search-bar">
    <Input placeholder="Search..." />
    <Button>Search</Button>
  </div>
);

// Organisms
const Header = () => (
  <header className="header">
    <Logo />
    <Navigation />
    <SearchBar />
  </header>
);
```

## State Management

Choose the right state management solution based on your needs:

- **Local State**: Use `useState` for component-specific state
- **Shared State**: Use Context API or Zustand for simple cases
- **Complex State**: Use Redux Toolkit for complex applications

## Conclusion

Building scalable React applications is an ongoing process. Start with these principles and adapt them to your specific needs.

Remember: **Scalability is not just about performance—it's about maintainability and developer experience.**
```

## Troubleshooting

### Post Not Appearing
- Check that the frontmatter is properly formatted
- Ensure the file is saved with `.md` extension
- Verify the date format is YYYY-MM-DD
- Check the browser console for any errors

### Markdown Not Rendering
- Ensure code blocks are properly fenced with triple backticks
- Check that frontmatter is separated from content with `---`
- Verify that the markdown syntax is correct

### Build Errors
- Check that all required frontmatter fields are present
- Ensure no syntax errors in the markdown file
- Verify that the slug is unique across all posts

## Development

The blog system uses the following technologies:
- **Markdown Processing**: `gray-matter`, `remark`, `remark-html`, `remark-gfm`
- **Dynamic Imports**: Vite's `import.meta.glob`
- **Styling**: Tailwind CSS with custom markdown styles
- **Routing**: React Router for individual post pages

For development questions or issues, refer to the main project documentation or create an issue in the repository. 