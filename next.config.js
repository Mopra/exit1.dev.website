/**
 * Next.js configuration
 * - Adds redirects for removed guide URLs to avoid broken links
 * - Performance optimizations for better Core Web Vitals
 */

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
      { source: '/blog/get-started', destination: '/blog', permanent: true },
      { source: '/blog/webhook-alerts-slack-discord', destination: '/blog', permanent: true },
      { source: '/blog/downtime-alerts-guide', destination: '/blog', permanent: true },
      { source: '/blog/beyond-uptime-monitoring-guide', destination: '/blog', permanent: true },
      // Live Checks rebrand — consolidate /real-time-monitoring into /live-checks
      { source: '/real-time-monitoring', destination: '/live-checks', permanent: true },
      // /why-nano reframed as /why-upgrade to cover Nano, Pro, and Agency
      { source: '/why-nano', destination: '/why-upgrade', permanent: true },
    ];
  },
};

module.exports = nextConfig;

