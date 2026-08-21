/**
 * Next.js configuration
 * - Adds redirects for removed guide URLs to avoid broken links
 * - Performance optimizations for better Core Web Vitals
 */

const { CONTENT_MOVES } = require('./src/content/contentMoves');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'peerpush.net',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Experimental features for performance
  experimental: {
    optimizePackageImports: ['lucide-react', 'gsap'],
  },

  async headers() {
    return [
      {
        // Static media in /public ships with Vercel's default
        // `max-age=0, must-revalidate` otherwise — Lighthouse flags it and
        // repeat visits re-download videos/logos. 30 days is safe as long as
        // changed assets get a new filename (the usual convention here).
        source: '/:path*\\.(mp4|webm|svg|png|jpg|jpeg|webp|avif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // Content moves live in src/content/contentMoves.js, shared with the
      // sitemap so recently-moved URLs stay crawlable long enough for Google to
      // actually see the 301. Add new consolidations there, not here.
      ...CONTENT_MOVES.map(({ from, to }) => ({
        source: from,
        destination: to,
        permanent: true,
      })),

      // ── kickbacks.ai campaign: typeable alias for the terminal surface ──
      // That surface renders an ambient, unclickable status line, so the reader
      // types the URL from memory. A query string is therefore not an option —
      // nobody types "?s=term&utm_source=..." — so the *path* has to carry the
      // attribution. /cli is 13 characters and lands on the same page with the
      // surface and UTMs attached, which is what lets GA4 group these sessions
      // as a campaign instead of dumping them into Direct.
      // Not a content move: this is a campaign alias, and deliberately not
      // permanent, so it stays out of contentMoves.js.
      {
        source: '/cli',
        destination:
          '/ai?s=term&utm_source=kickbacks&utm_medium=cli_terminal&utm_campaign=kickbacks_ai',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;

