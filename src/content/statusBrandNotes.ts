/**
 * Curated editorial notes for high-search-demand /status/[slug] pages.
 *
 * The status template is programmatic and identical across monitors; for the
 * brands people actually search for ("ahrefs status", "notion uptime"), a page
 * needs unique, intent-matching text to rank past position 10. Add an entry
 * here when GSC shows real impressions for a brand's status queries — keyed by
 * monitor host.
 *
 * Every field is hand-written per brand. Verify `officialStatus.url` resolves
 * before adding it (several brands' status hosts have moved or never existed).
 */

export type StatusBrandNote = {
  /** What the service is and who depends on it — unique context, not boilerplate. */
  whatItIs: string;
  /** What an outage of this service typically looks like from the user's side. */
  downSymptoms: string;
  /** The brand's own status page, when it has a working public one. */
  officialStatus?: { url: string; label: string };
  /** Shown instead when the brand publishes no public status page. */
  noOfficialStatusNote?: string;
};

export const statusBrandNotes: Record<string, StatusBrandNote> = {
  "ahrefs.com": {
    whatItIs:
      "Ahrefs is an SEO platform used by marketers and agencies for backlink analysis, keyword research, rank tracking, and site audits. Because so many workflows depend on it daily — client reports, keyword pulls, scheduled crawls — even a short outage gets noticed fast.",
    downSymptoms:
      "When Ahrefs has problems, the dashboard at app.ahrefs.com typically hangs or fails to load, Site Explorer and Keywords Explorer reports stall, scheduled Site Audit crawls fail, and the Ahrefs API starts returning errors or timeouts. Login loops are also common during partial outages.",
    noOfficialStatusNote:
      "Ahrefs does not currently publish a public status page, so there is no official place to confirm an outage. This page fills that gap with independent, continuously measured checks; the Ahrefs team also tends to acknowledge incidents on X (@ahrefs).",
  },
  "notion.so": {
    whatItIs:
      "Notion is an all-in-one workspace for notes, docs, wikis, and project management, used by teams as their primary knowledge base. When it goes down, whole companies lose access to their documentation at once.",
    downSymptoms:
      "A Notion outage usually shows up as pages stuck on the loading skeleton, an “offline” banner in the desktop and mobile apps, edits failing to sync across devices, and errors from the Notion API and integrations.",
    officialStatus: {
      url: "https://www.notion-status.com/",
      label: "notion-status.com",
    },
  },
  "anthropic.com": {
    whatItIs:
      "Anthropic is the AI company behind Claude, the Claude API, and Claude Code. This page tracks anthropic.com itself — the main website. Note that the Claude app and API can have incidents independently of the website (and vice versa).",
    downSymptoms:
      "Problems on Anthropic's side typically show up as the website failing to load, Claude conversations erroring or hanging mid-response, elevated error rates on the Claude API, or degraded model availability for specific models.",
    officialStatus: {
      url: "https://status.claude.com/",
      label: "status.claude.com",
    },
  },
};

export function getStatusBrandNote(host: string): StatusBrandNote | undefined {
  return statusBrandNotes[host.toLowerCase()];
}
