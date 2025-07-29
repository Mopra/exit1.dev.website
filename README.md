# Exit1.dev Website

A modern, static site generator for the Exit1.dev website monitoring service.

## 🚀 Static Site Generation (SSG)

This project has been converted from a Single Page Application (SPA) to a Static Site Generator (SSG) for optimal SEO and performance.

### Key Features

- **SEO Optimized**: Each route gets its own HTML file with proper meta tags
- **Fast Loading**: Static files load faster than SPAs
- **Better Crawling**: Google can easily index all pages
- **GitHub Pages Compatible**: Works perfectly with GitHub Pages hosting
- **Progressive Enhancement**: Still works as a React app for interactivity

### Build Commands

```bash
# Development
npm run dev

# Build static site (for production)
npm run build:static

# Deploy to GitHub Pages
npm run deploy

# Generate sitemap
npm run build:sitemap
```

### Generated Routes

The static generator creates HTML files for:
- `/` - Homepage
- `/blog` - Blog listing
- `/blog/[slug]` - Individual blog posts (15 posts)
- `/privacy` - Privacy policy
- `/roadmap` - Roadmap
- `/sitemap` - Sitemap

### SEO Features

- **Meta Tags**: Each page has proper title, description, and Open Graph tags
- **Canonical URLs**: Prevents duplicate content issues
- **Structured Data**: Blog posts include article schema
- **Sitemap**: Auto-generated XML sitemap
- **Robots.txt**: Proper crawling instructions

### Deployment

The site is automatically deployed to GitHub Pages when you push to the `main` branch. The GitHub Actions workflow:

1. Builds the static site
2. Generates the sitemap
3. Deploys to GitHub Pages

### File Structure

```
dist/
├── index.html                 # Homepage
├── blog/
│   ├── index.html            # Blog listing
│   └── [slug]/
│       └── index.html        # Individual blog posts
├── privacy/
│   └── index.html            # Privacy page
├── roadmap/
│   └── index.html            # Roadmap page
├── sitemap/
│   └── index.html            # Sitemap page
└── assets/                   # CSS, JS, images
```

## Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
npm install
npm run dev
```

### Adding New Blog Posts

1. Create a new `.md` file in `src/content/posts/[category]/`
2. Include frontmatter with title, excerpt, category, etc.
3. Run `npm run build:static` to regenerate the site
4. The new post will be automatically included in the static generation

### Performance Optimizations

- **Code Splitting**: React components are lazy-loaded
- **Asset Optimization**: Images and CSS are optimized
- **Caching**: Static assets have proper cache headers
- **CDN Ready**: Works with CDNs for global distribution

## License

MIT
