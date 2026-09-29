# Status Page Targets — Curated Brand List

> The seed list for the programmatic-SEO status pages (`exit1.dev/status/<slug>`).
> Goal: own the "is X down", "X status", "X uptime", "X response time" queries for
> the tools our buyers actually use.

## How to add a target

Each target is a **check under the `connect@exit1.dev` account** with:

1. `public: true`
2. `name` = clean brand name (e.g. `GitHub`, not `github.com`) — drives the H1, title, and FAQ copy.
3. `publicSlug` = clean slug from the table below (e.g. `github`) — drives the URL.
4. `url` = the endpoint to probe (primary public domain unless noted).
5. `type` = `website` for sites, `rest`/`api` for API endpoints (drives the Websites/APIs filter).

The hourly `refreshPublicMonitors` cron picks them up automatically. **Pages stay
`noindex` and out of the sitemap until they have ≥ 7 days of recorded history**
(`MIN_DAYS_FOR_INDEX`), so seed early and let history accrue before expecting rank.

Slugs must be unique; the backend suffixes collisions (`-2`). Prefer the explicit
slug over the hostname default so `github` wins over `github.com`.

---

## What actually earns (read this first)

90 days of Search Console data (2026-06-29 to 2026-09-27, 292 status pages, 605
clicks) split the pages into two groups:

- **Big brands get impressions, not clicks.** They sit at position 9 to 12 under
  the vendor status page and Downdetector: ahrefs.com 14.7k impressions / 24
  clicks, notion.so 14.3k / 46, figma.com 10.1k / 16.
- **Niche dev infra earns.** Where the vendor has no strong status page, we rank
  3 to 8, and an outage turns into real traffic: pagespeed.web.dev 275 clicks,
  registry.npmjs.org 25, packagist.org 12 at position 3.6, plus homebrew.sh and
  golang.org.

So new pages go to package registries, CDNs and APIs that developers check
mid-outage. Existing pages keep their hostname slugs: every live page uses one,
and adding a `publicSlug` now would move a URL that already ranks.

## Seeded 2026-09-29: dev infra

Created directly in Firestore under the `connect@exit1.dev` account, cloned from
the packagist.org check (GET, 5 min, vps-eu-1, folder `Infrastructure`). Name and
slug are the hostname, like every other live page.

| Group | Hosts |
|---|---|
| Package registries | crates.io, proxy.golang.org, pkg.go.dev, pub.dev, hex.pm, cocoapods.org, registry.yarnpkg.com, artifacthub.io, registry.terraform.io |
| Container registries | hub.docker.com, ghcr.io, quay.io |
| CDNs | cdn.jsdelivr.net, unpkg.com, cdnjs.cloudflare.com, fonts.googleapis.com |
| APIs (`rest_endpoint`) | api.openai.com, api.anthropic.com, api.stripe.com |
| CI and app platforms | circleci.com, dev.azure.com, expo.dev |

Probe details that matter:

- The three APIs hit an authenticated path (`/v1/models`, `/v1/charges`) that
  returns 401 unauthenticated. The bare host returns 404 or 421.
- crates.io needs `Accept: text/html` on the request, or it answers 403/404.
- fonts.googleapis.com probes `/css2?family=Inter`; the root is a 404.
- files.pythonhosted.org was skipped (root is a 404). pypi.org is already live.

**The off-topic hosts in the live set (bain.com, 3cventures.com, sportbeach.com,
deloittedigital.com and similar) are not noise.** They feed the Cannes event page
via `src/lib/cannesEvents.ts`. Leave them public.

## Tier 1: Developer-aligned, high intent, converts best

These map directly to our buyer (a developer who, after checking "is GitHub down",
might monitor their own stack). Highest priority.

| Brand | name | publicSlug | url | type |
|---|---|---|---|---|
| GitHub | GitHub | `github` | https://github.com | website |
| GitLab | GitLab | `gitlab` | https://gitlab.com | website |
| Cloudflare | Cloudflare | `cloudflare` | https://www.cloudflare.com | website |
| AWS | AWS | `aws` | https://aws.amazon.com | website |
| Vercel | Vercel | `vercel` | https://vercel.com | website |
| Netlify | Netlify | `netlify` | https://www.netlify.com | website |
| npm | npm | `npm` | https://www.npmjs.com | website |
| Docker Hub | Docker Hub | `docker-hub` | https://hub.docker.com | website |
| OpenAI (ChatGPT) | ChatGPT | `chatgpt` | https://chatgpt.com | website |
| OpenAI API | OpenAI API | `openai-api` | https://api.openai.com | api |
| Anthropic (Claude) | Claude | `claude` | https://claude.ai | website |
| Stripe | Stripe | `stripe` | https://stripe.com | website |
| Stripe API | Stripe API | `stripe-api` | https://api.stripe.com | api |
| Slack | Slack | `slack` | https://slack.com | website |
| Discord | Discord | `discord` | https://discord.com | website |
| Notion | Notion | `notion` | https://www.notion.so | website |
| Figma | Figma | `figma` | https://www.figma.com | website |
| Linear | Linear | `linear` | https://linear.app | website |
| Supabase | Supabase | `supabase` | https://supabase.com | website |
| Firebase | Firebase | `firebase` | https://firebase.google.com | website |
| Twilio | Twilio | `twilio` | https://www.twilio.com | website |
| SendGrid | SendGrid | `sendgrid` | https://sendgrid.com | website |
| Heroku | Heroku | `heroku` | https://www.heroku.com | website |
| DigitalOcean | DigitalOcean | `digitalocean` | https://www.digitalocean.com | website |
| PyPI | PyPI | `pypi` | https://pypi.org | website |

## Tier 2 — Broad SaaS / cloud with strong dev overlap

| Brand | name | publicSlug | url | type |
|---|---|---|---|---|
| Google Cloud | Google Cloud | `google-cloud` | https://cloud.google.com | website |
| Microsoft Azure | Azure | `azure` | https://azure.microsoft.com | website |
| Zoom | Zoom | `zoom` | https://zoom.us | website |
| Microsoft Teams | Microsoft Teams | `microsoft-teams` | https://teams.microsoft.com | website |
| Salesforce | Salesforce | `salesforce` | https://www.salesforce.com | website |
| Atlassian Jira | Jira | `jira` | https://www.atlassian.com/software/jira | website |
| Atlassian Confluence | Confluence | `confluence` | https://www.atlassian.com/software/confluence | website |
| Shopify | Shopify | `shopify` | https://www.shopify.com | website |
| PayPal | PayPal | `paypal` | https://www.paypal.com | website |
| Square | Square | `square` | https://squareup.com | website |
| Airtable | Airtable | `airtable` | https://airtable.com | website |
| Asana | Asana | `asana` | https://asana.com | website |
| Trello | Trello | `trello` | https://trello.com | website |
| Google Gemini | Gemini | `gemini` | https://gemini.google.com | website |
| Perplexity | Perplexity | `perplexity` | https://www.perplexity.ai | website |
| Hugging Face | Hugging Face | `hugging-face` | https://huggingface.co | website |
| Mailchimp | Mailchimp | `mailchimp` | https://mailchimp.com | website |
| HubSpot | HubSpot | `hubspot` | https://www.hubspot.com | website |
| Zendesk | Zendesk | `zendesk` | https://www.zendesk.com | website |
| Dropbox | Dropbox | `dropbox` | https://www.dropbox.com | website |
| Okta | Okta | `okta` | https://www.okta.com | website |
| Auth0 | Auth0 | `auth0` | https://auth0.com | website |
| Cloudinary | Cloudinary | `cloudinary` | https://cloudinary.com | website |
| Fastly | Fastly | `fastly` | https://www.fastly.com | website |
| Render | Render | `render` | https://render.com | website |

## Tier 3: High-volume consumer (deprioritized 2026-09-29)

Big "is X down" volume, but the SERP belongs to the vendor's own status page and
Downdetector. Our data says don't bother: notion.so drew 14.3k impressions and 46
clicks in 90 days, figma.com 10.1k and 16. Only add these if the dev-infra
section below runs out of candidates.

| Brand | name | publicSlug | url | type |
|---|---|---|---|---|
| Instagram | Instagram | `instagram` | https://www.instagram.com | website |
| Facebook | Facebook | `facebook` | https://www.facebook.com | website |
| X (Twitter) | X | `x-twitter` | https://x.com | website |
| TikTok | TikTok | `tiktok` | https://www.tiktok.com | website |
| YouTube | YouTube | `youtube` | https://www.youtube.com | website |
| Reddit | Reddit | `reddit` | https://www.reddit.com | website |
| WhatsApp | WhatsApp | `whatsapp` | https://www.whatsapp.com | website |
| Snapchat | Snapchat | `snapchat` | https://www.snapchat.com | website |
| Netflix | Netflix | `netflix` | https://www.netflix.com | website |
| Spotify | Spotify | `spotify` | https://www.spotify.com | website |
| Steam | Steam | `steam` | https://store.steampowered.com | website |
| Roblox | Roblox | `roblox` | https://www.roblox.com | website |
| Epic Games | Epic Games | `epic-games` | https://www.epicgames.com | website |
| PlayStation Network | PlayStation Network | `playstation-network` | https://www.playstation.com | website |
| Xbox | Xbox | `xbox` | https://www.xbox.com | website |
| Gmail | Gmail | `gmail` | https://mail.google.com | website |
| Outlook | Outlook | `outlook` | https://outlook.live.com | website |
| LinkedIn | LinkedIn | `linkedin` | https://www.linkedin.com | website |
| Twitch | Twitch | `twitch` | https://www.twitch.tv | website |
| Zoom Phone | Zoom Phone | `zoom-phone` | https://www.zoom.us/phone | website |

---

## Notes & guardrails

- **Probe the public endpoint a user would hit.** For pure APIs (OpenAI, Stripe),
  an unauthenticated request often returns `401/404` — that's still "up". Make sure
  the check treats expected auth-required codes as online, or point at a public
  health/marketing URL instead so the page doesn't read as a false outage.
- **Don't fabricate history.** Pages are honest measurements; the 7-day index guard
  exists precisely so a brand-new monitor doesn't ship a thin, near-empty page.
- **Brand/trademark posture:** these are factual, third-party uptime measurements
  (like Downdetector). Keep copy factual ("independently measured… not self-reported")
  and link out with `rel="nofollow"`. The detail page already does both.
- **Target footprint:** ~100–300 once Tiers 1–3 plus long-tail are seeded. Expand
  the long tail with adjacent dev tools (Bitbucket, CircleCI, Sentry, Datadog,
  PagerDuty, Postman, MongoDB Atlas, Redis Cloud, Algolia, Plaid, etc.).
