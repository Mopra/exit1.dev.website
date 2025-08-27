/**
 * Next.js configuration
 * - Adds redirects for removed guide URLs to avoid broken links
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/blog/get-started', destination: '/blog', permanent: true },
      { source: '/blog/webhook-alerts-slack-discord', destination: '/blog', permanent: true },
      { source: '/blog/downtime-alerts-guide', destination: '/blog', permanent: true },
      { source: '/blog/beyond-uptime-monitoring-guide', destination: '/blog', permanent: true },
    ];
  },
};

module.exports = nextConfig;

