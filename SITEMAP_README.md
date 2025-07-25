# Dynamic Sitemap System

This project includes a dynamic sitemap system that automatically updates when new content is added to the site.

## Features

- **Automatic Generation**: Sitemaps are generated automatically during the build process
- **Dynamic Content**: Blog posts are automatically included from `src/content/blog.json`
- **Multiple Formats**: Generates both XML and text sitemaps
- **SEO Optimized**: Includes proper priorities, change frequencies, and last modified dates
- **User-Friendly**: Includes a visual sitemap page at `/sitemap`

## Files Generated

- `public/sitemap.xml` - XML sitemap for search engines
- `public/sitemap.txt` - Text sitemap for easy reading
- `public/robots.txt` - Robots file referencing the sitemap

## How It Works

### 1. Static Routes
The system automatically includes all static routes defined in the application:
- `/` (Home) - Priority: 1.0, Change: weekly
- `/blog` - Priority: 0.8, Change: daily
- `/privacy` - Priority: 0.3, Change: monthly
- `/roadmap` - Priority: 0.7, Change: weekly
- `/sitemap` - Priority: 0.5, Change: weekly

### 2. Dynamic Blog Posts
Blog posts are automatically included from `src/content/blog.json`:
- Each post gets a URL like `/blog/{slug}`
- Priority: 0.6, Change: monthly
- Last modified date from the post's `date` field

### 3. Automatic Updates
When you add new blog posts to `src/content/blog.json`, they will automatically be included in the next build.

## Usage

### Manual Generation
```bash
npm run sitemap
```

### Automatic Generation (During Build)
```bash
npm run build
```
The sitemap is automatically generated during the build process.

### View Sitemap
- **Visual Sitemap**: Visit `/sitemap` for a user-friendly view
- **XML Sitemap**: Visit `/sitemap.xml` for search engines
- **Text Sitemap**: Visit `/sitemap.txt` for plain text format

## Configuration

### Adding New Static Routes
Edit `src/utils/sitemapGenerator.ts` and add new routes to the `STATIC_ROUTES` array:

```typescript
const STATIC_ROUTES: SitemapUrl[] = [
  // ... existing routes
  {
    loc: '/new-page',
    changefreq: 'weekly',
    priority: 0.6,
  },
];
```

### Modifying Blog Post Settings
Blog posts automatically inherit these settings:
- **Priority**: 0.6
- **Change Frequency**: monthly
- **Last Modified**: Uses the post's `date` field

### Base URL
The base URL is configured in `src/utils/sitemapGenerator.ts`:
```typescript
const BASE_URL = 'https://exit1.dev';
```

## SEO Benefits

1. **Search Engine Discovery**: Helps search engines find all pages
2. **Crawl Efficiency**: Provides change frequency hints to crawlers
3. **Priority Indication**: Tells search engines which pages are most important
4. **Last Modified Dates**: Helps with content freshness signals

## File Structure

```
src/
├── utils/
│   ├── sitemapGenerator.ts    # Core sitemap generation logic
│   └── sitemapServer.ts       # Server utilities
├── pages/
│   └── Sitemap.tsx           # Visual sitemap page
└── content/
    └── blog.json             # Blog data (automatically included)

scripts/
└── sitemap-generator.js      # Standalone generator script

public/
├── sitemap.xml              # Generated XML sitemap
├── sitemap.txt              # Generated text sitemap
└── robots.txt               # Robots file with sitemap reference
```

## Troubleshooting

### Sitemap Not Updating
1. Ensure new blog posts are added to `src/content/blog.json`
2. Run `npm run build` to regenerate sitemaps
3. Check that the build process completes successfully

### Missing Routes
1. Verify routes are added to `STATIC_ROUTES` in `sitemapGenerator.ts`
2. Ensure routes are also added to the React Router configuration in `App.tsx`

### Build Errors
1. Check TypeScript compilation errors
2. Ensure all imports are correct
3. Verify file paths in the sitemap generator

## Best Practices

1. **Keep Blog Data Updated**: Always update `blog.json` when adding new posts
2. **Regular Builds**: Run builds regularly to keep sitemaps current
3. **Monitor Search Console**: Submit sitemap to Google Search Console
4. **Test URLs**: Verify all URLs in the sitemap are accessible
5. **Update Priorities**: Adjust priorities based on page importance 