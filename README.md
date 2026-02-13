# Exit1.dev Website

Marketing site and blog for exit1 — uptime monitoring that doesn't get in your way.

**[exit1.dev](https://exit1.dev)**

> **Source-available, not open source.** This code is published for transparency and reference. See [LICENSE](LICENSE) for terms.

## What it does

This is the public-facing website for exit1. It covers the platform's features, pricing, and hosts 100+ blog posts on monitoring, infrastructure, and domain intelligence.

- Product and feature pages (monitoring, alerting, analytics, SSL, status pages)
- Pricing with plan comparison (Free vs Nano)
- Blog with categories: website monitoring, domain intelligence, API monitoring, incident management, SLA, cron jobs, infrastructure, and AI
- SEO infrastructure — dynamic sitemap, structured data, `llms.txt` for AI crawlers
- Interactive 3D globe visualization and GSAP/Framer Motion animations
- Performance-optimized with critical CSS inlining, Web Vitals tracking, and Vercel Speed Insights

## Tech stack

- **Framework:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui (New York), Radix UI primitives
- **Animation:** GSAP, Framer Motion, cobe/react-globe.gl
- **Content:** Markdown blog with gray-matter, remark, and GFM support
- **Analytics:** Google Analytics, Vercel Speed Insights, Web Vitals
- **Hosting:** Vercel

## Related repos

- [exit1.dev](https://github.com/Mopra/exit1.dev) — Monitor application
- [exit1.dev.docs](https://github.com/Mopra/exit1.dev.docs) — Official docs
- [pradsgaardlabs.website](https://github.com/Mopra/pradsgaardlabs.website) — Company site

## License

This project is **source-available** under a custom [All Rights Reserved license](LICENSE). You may view the code for personal, educational, and reference purposes. Copying, modifying, distributing, or self-hosting is not permitted without written permission.

For licensing inquiries: connect@exit1.dev
