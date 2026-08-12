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
      // /why-nano reframed as /why-upgrade to cover Indie, Nano, and Pro
      { source: '/why-nano', destination: '/why-upgrade', permanent: true },

      // ── Consolidation round 2 (July 2026) ────────────────────────────
      // See scripts/seo/consolidation-plan-2026-07.md. 126 -> 103 posts.

      // Tool-intent posts -> the actual tool pages. These were thin articles
      // whose meta descriptions promised a "free X lookup tool" while the real
      // tool page competed against them for the same query.
      { source: '/blog/free-nameserver-lookup', destination: '/tools/nameserver-lookup', permanent: true },
      { source: '/blog/free-a-record-lookup', destination: '/tools/dns-checker', permanent: true },
      { source: '/blog/free-mx-record-lookup', destination: '/tools/dns-checker', permanent: true },
      { source: '/blog/free-txt-record-lookup', destination: '/tools/dns-checker', permanent: true },
      { source: '/blog/free-cname-lookup-tool', destination: '/tools/dns-checker', permanent: true },
      { source: '/blog/free-caa-record-check', destination: '/tools/dns-checker', permanent: true },
      { source: '/blog/free-spf-record-checker', destination: '/tools/dns-checker', permanent: true },
      { source: '/blog/free-dmarc-checker', destination: '/tools/dns-checker', permanent: true },

      // Incident management: 4 near-identical ~440-word posts -> one runbook
      { source: '/blog/free-incident-management-toolkit', destination: '/blog/free-incident-management-runbook', permanent: true },
      { source: '/blog/free-incident-management-war-room', destination: '/blog/free-incident-management-runbook', permanent: true },
      { source: '/blog/free-incident-management-with-exit1', destination: '/blog/free-incident-management-runbook', permanent: true },

      // Infrastructure monitoring -> single checklist (comparison post kept)
      { source: '/blog/free-infrastructure-monitoring-stack', destination: '/blog/free-server-monitoring-checklist-2025', permanent: true },
      { source: '/blog/sre-playbook-free-infrastructure-monitoring', destination: '/blog/free-server-monitoring-checklist-2025', permanent: true },

      // Cronjob monitoring: 5 posts sharing one skeleton -> one playbook
      { source: '/blog/cronjob-monitoring-metrics-that-matter', destination: '/blog/cronjob-monitoring-playbook-free-scheduled-task-observability', permanent: true },
      { source: '/blog/free-cronjob-monitor-setup-serverless-schedules', destination: '/blog/cronjob-monitoring-playbook-free-scheduled-task-observability', permanent: true },
      { source: '/blog/scheduled-task-monitoring-checklist-heartbeats-retries-alerts', destination: '/blog/cronjob-monitoring-playbook-free-scheduled-task-observability', permanent: true },
      { source: '/blog/cron-job-worker-monitoring-http-hooks', destination: '/blog/cronjob-monitoring-playbook-free-scheduled-task-observability', permanent: true },

      // API monitoring playbooks -> single playbook
      { source: '/blog/api-observability-automation-toolkit', destination: '/blog/api-endpoint-monitoring-playbook-2025', permanent: true },
      { source: '/blog/platform-api-monitoring-operations-guide', destination: '/blog/api-endpoint-monitoring-playbook-2025', permanent: true },

      // Straight duplicate pairs
      { source: '/blog/free-uptime-monitor-ecommerce-guide', destination: '/blog/free-website-monitoring-shopify-woocommerce', permanent: true },
      { source: '/blog/jamstack-github-pages-uptime-monitoring', destination: '/blog/free-uptime-monitor-static-sites-jamstack', permanent: true },
      { source: '/blog/free-website-monitoring-beyond-uptime-checklist', destination: '/blog/free-uptime-monitor-checklist', permanent: true },
      { source: '/blog/free-website-monitoring-audit-sla-evidence', destination: '/blog/soc2-iso-website-monitoring-prep-guide', permanent: true },

      // Pagination shrank from 11 to 9 pages (126 -> 103 posts at 12/page).
      // These were indexed, so send them to the index rather than 404.
      { source: '/blog/page/10', destination: '/blog', permanent: true },
      { source: '/blog/page/11', destination: '/blog', permanent: true },

      // ── kickbacks.ai campaign: typeable alias for the terminal surface ──
      // That surface renders an ambient, unclickable status line, so the reader
      // types the URL from memory. A query string is therefore not an option —
      // nobody types "?s=term&utm_source=..." — so the *path* has to carry the
      // attribution. /cli is 13 characters and lands on the same page with the
      // surface and UTMs attached, which is what lets GA4 group these sessions
      // as a campaign instead of dumping them into Direct.
      // Not permanent: this is a campaign alias, not a content move.
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

