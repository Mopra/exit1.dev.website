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
      // Blog de-cannibalization — consolidate thin duplicate competitor pages
      // into their richer canonical post (301 preserves their ranking signals).
      { source: '/blog/uptimerobot-alternatives', destination: '/blog/uptimerobot-alternative-free-unlimited', permanent: true },
      { source: '/blog/pingdom-free-alternative', destination: '/blog/pingdom-alternative-free-unlimited-monitoring', permanent: true },
      // "Best free monitoring tools" mega-cluster -> single canonical
      { source: '/blog/free-website-monitoring-tools-2025', destination: '/blog/best-free-uptime-monitoring-tools', permanent: true },
      { source: '/blog/best-free-website-monitoring-tool-2025', destination: '/blog/best-free-uptime-monitoring-tools', permanent: true },
      { source: '/blog/best-website-monitoring-service-2025', destination: '/blog/best-free-uptime-monitoring-tools', permanent: true },
      { source: '/blog/free-uptime-monitors-no-limits-2025', destination: '/blog/best-free-uptime-monitoring-tools', permanent: true },
      // Freshping cluster -> canonical replacement page (migration checklist kept separate)
      { source: '/blog/free-freshping-alternative', destination: '/blog/freshping-replacement-uptime-monitoring', permanent: true },
      { source: '/blog/freshping-alternative-for-teams', destination: '/blog/freshping-replacement-uptime-monitoring', permanent: true },
      // Free vs paid pair -> canonical
      { source: '/blog/free-vs-paid-website-monitoring', destination: '/blog/free-uptime-monitor-vs-paid', permanent: true },
      // SSL monitoring: channel variants folded into one canonical
      { source: '/blog/free-ssl-monitoring-discord-alerts', destination: '/blog/free-ssl-certificate-monitoring', permanent: true },
      { source: '/blog/free-ssl-monitoring-email-alerts', destination: '/blog/free-ssl-certificate-monitoring', permanent: true },
      { source: '/blog/free-ssl-monitoring-slack-alerts', destination: '/blog/free-ssl-certificate-monitoring', permanent: true },
      { source: '/blog/ssl-certificate-monitoring-alerts-made-easy-and-why-it-matters', destination: '/blog/free-ssl-certificate-monitoring', permanent: true },
      // SLA cluster -> strategy pillar + reporting playbook
      { source: '/blog/free-sla-monitoring-guide', destination: '/blog/free-sla-monitoring-strategy', permanent: true },
      { source: '/blog/free-sla-monitoring-checklist', destination: '/blog/free-sla-monitoring-strategy', permanent: true },
      { source: '/blog/sla-reporting-free-uptime-stack', destination: '/blog/free-sla-monitoring-reporting-playbook', permanent: true },
      // Intro/101 -> single beginner pillar
      { source: '/blog/website-monitoring-101', destination: '/blog/intro-to-website-monitoring', permanent: true },
      // Live Checks rebrand — consolidate /real-time-monitoring into /live-checks
      { source: '/real-time-monitoring', destination: '/live-checks', permanent: true },
      // /why-nano reframed as /why-upgrade to cover Nano, Pro, and Agency
      { source: '/why-nano', destination: '/why-upgrade', permanent: true },
    ];
  },
};

module.exports = nextConfig;

