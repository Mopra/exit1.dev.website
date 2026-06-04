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

## Tier 1 — Developer-aligned, high intent, converts best

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

## Tier 3 — High-volume consumer (huge search demand, Downdetector-dominated)

Big "is X down" volume but harder SERPs. Worth pages for reach + AI Overviews;
lower conversion. Add after Tiers 1–2 are healthy.

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
