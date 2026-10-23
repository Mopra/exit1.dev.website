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

## Seeded 2026-10-12: 198 more dev infra

Same method and template as 2026-09-29 (GET, 5 min, vps-eu-1, folder `Infrastructure`,
hostname name and slug, one `check_edits` doc per check). The check doc also needs a
`nextCheckAt`, or the VPS loads it and never schedules it. Brings the live set to about 518.
Every URL was probed first and only 2xx, 3xx, 401 or 403 responders went in. APIs hit an
authenticated path so they answer 401 rather than 404.

| Group | Hosts |
|---|---|
| Package registries and indexes (44) | anaconda.org, conda.anaconda.org, repo.anaconda.com, repo1.maven.org, central.sonatype.com, plugins.gradle.org, services.gradle.org, metacpan.org, cpan.org, cran.r-project.org, hackage.haskell.org, opam.ocaml.org, luarocks.org, jsr.io, esm.sh, registry.npmmirror.com, index.rubygems.org, repo.packagist.org, getcomposer.org, pecl.php.net, api.nuget.org, docs.rs, swiftpackageindex.com, package.elm-lang.org, galaxy.ansible.com, forge.puppet.com, supermarket.chef.io, open-vsx.org, marketplace.visualstudio.com, plugins.jetbrains.com, addons.mozilla.org, chromewebstore.google.com, packagecontrol.io, formulae.brew.sh, community.chocolatey.org, snapcraft.io, flathub.org, aur.archlinux.org, search.nixos.org, cache.nixos.org, conan.io, vcpkg.io, sdkman.io, pkgs.alpinelinux.org |
| Container registries (9) | gcr.io, registry.k8s.io, public.ecr.aws, gallery.ecr.aws, mcr.microsoft.com, registry.gitlab.com, registry-1.docker.io, download.docker.com, get.docker.com |
| Mirrors, downloads, source hosting (19) | deb.debian.org, archive.ubuntu.com, security.ubuntu.com, dl-cdn.alpinelinux.org, mirrors.fedoraproject.org, mirrors.kernel.org, launchpad.net, ppa.launchpadcontent.net, releases.hashicorp.com, apt.releases.hashicorp.com, static.rust-lang.org, sh.rustup.rs, go.dev, raw.githubusercontent.com, codeload.github.com, gist.github.com, pages.github.com, kernel.org, git.kernel.org |
| CDNs (10) | ajax.googleapis.com, code.jquery.com, cdn.tailwindcss.com, ga.jspm.io, jspm.org, fonts.bunny.net, maxcdn.bootstrapcdn.com, img.shields.io, badgen.net, res.cloudinary.com |
| APIs (rest_endpoint) (61) | api.cloudflare.com, api.vercel.com, api.netlify.com, api.digitalocean.com, api.linode.com, api.hetzner.cloud, api.heroku.com, api.sendgrid.com, api.notion.com, api.telegram.org, graph.microsoft.com, googleapis.com, generativelanguage.googleapis.com, api.mistral.ai, api.cohere.com, api.together.xyz, api.fireworks.ai, api.deepseek.com, openrouter.ai, api.x.ai, api.assemblyai.com, api.deepgram.com, api.pinecone.io, api.pagerduty.com, api.datadoghq.com, api.honeycomb.io, api.airtable.com, api.hubapi.com, api.intercom.io, api-m.paypal.com, connect.squareup.com, api.lemonsqueezy.com, api.paddle.com, api.mapbox.com, api.cloudinary.com, api.clerk.com, api.workos.com, api.coinbase.com, api.atlassian.com, api.zoom.us, api.figma.com, httpbin.org, postman-echo.com, api.pwnedpasswords.com, api.backblazeb2.com, s3.amazonaws.com, api.tailscale.com, api.supabase.com, console.neon.tech, api.turso.tech, api.upstash.com, api.pulumi.com, app.terraform.io, api.buildkite.com, api.npmjs.org, api.osv.dev, services.nvd.nist.gov, rdap.org, api.brevo.com, api.mailjet.com, api.sparkpost.com |
| Docs and dev references (13) | docs.python.org, developer.mozilla.org, docs.docker.com, docs.npmjs.com, caniuse.com, regex101.com, readthedocs.org, docs.gitlab.com, docs.anthropic.com, docs.claude.com, code.visualstudio.com, vscode.dev, git-scm.com |
| CI, testing, dev tools (20) | buildkite.com, app.travis-ci.com, codecov.io, coveralls.io, sonarcloud.io, snyk.io, app.pulumi.com, cloud.elastic.co, app.launchdarkly.com, us.posthog.com, eu.posthog.com, ui.honeycomb.io, dashboard.ngrok.com, login.tailscale.com, gitpod.io, codepen.io, jsfiddle.net, jwt.io, excalidraw.com, app.diagrams.net |
| Cloud consoles and dashboards (11) | app.netlify.com, cloud.digitalocean.com, cloud.linode.com, console.hetzner.cloud, my.vultr.com, dashboard.heroku.com, dashboard.render.com, console.firebase.google.com, dash.deno.com, cloud.appwrite.io, cloud.temporal.io |
| AI apps (11) | claude.ai, chatgpt.com, aistudio.google.com, v0.app, bolt.new, lovable.dev, chat.deepseek.com, grok.com, kaggle.com, colab.research.google.com, smith.langchain.com |

Probed and left out: dl.google.com/go, objects.githubusercontent.com, use.fontawesome.com,
gstatic.com, api.fly.io, graph.facebook.com, api.perplexity.ai, api.linear.app (400/404 at the
probed path), crt.sh (502), gemini.google.com (header overflow), hashicorp.com (429).
Frameworks, language homepages, Linux distros and big SaaS marketing sites were probed fine but
held back for a later batch.

**The off-topic hosts in the live set (bain.com, 3cventures.com, sportbeach.com,
deloittedigital.com and similar) are not noise.** They feed the Cannes event page
via `src/lib/cannesEvents.ts`. Leave them public.

## Seeded 2026-10-23: 100 build-path hosts after the PECL/Launchpad spike

On 2026-10-21 pecl.php.net and ppa.launchpadcontent.net went down and their pages drew
about 960 Google clicks in one day (a normal day for the whole site is about 25), at
position 2 to 5 for "pecl status" and "launchpadcontent down". So this batch is hosts that a
CI job, Dockerfile, package manager or install script fetches directly, where a failure
breaks builds and there is no strong vendor status page.

Same method as 2026-10-12: GET, 5 min, vps-eu-1 (every public check runs there), folder
`Infrastructure`, hostname name and slug, `nextCheckAt` staggered over 4 minutes, one
`check_edits` doc per check. Every URL was probed with `redirect: 'manual'` and only fast
2xx, 3xx, 401 or 403 responders went in. Where the root is a 404 or a big listing, the check
hits a small stable file instead (a GPG key, a checksum, `stable.txt`, a JSON index). Registry
`/v2/` endpoints, ACME directories and other APIs are `rest_endpoint` (200/401/403 only).
Brings the account to 702 checks.

| Group | Hosts |
|---|---|
| OS package mirrors and repos (24) | security.debian.org, ftp.debian.org, snapshot.debian.org, ports.ubuntu.com, us.archive.ubuntu.com, releases.ubuntu.com, changelogs.ubuntu.com, api.launchpad.net, keyserver.ubuntu.com, dl.fedoraproject.org, download.fedoraproject.org, mirror.stream.centos.org, vault.centos.org, dl.rockylinux.org, repo.almalinux.org, geo.mirror.pkgbuild.com, archive.archlinux.org, download.opensuse.org, archive.raspberrypi.com, archive.raspberrypi.org, cdn.amazonlinux.com, pkg.freebsd.org, repo.msys2.org, yum.oracle.com |
| Language registries, indexes, installers (29) | test.pypi.org, upload.pypi.org, bootstrap.pypa.io, install.python-poetry.org, astral.sh (`/uv/install.sh`), api.anaconda.org, cloud.r-project.org, bioconductor.org, packagemanager.posit.co, cpan.metacpan.org, downloads.haskell.org, get-ghcup.haskell.org, cdn.cocoapods.org, index.crates.io, static.crates.io, sum.golang.org, dot.net (`/v1/dotnet-install.sh`), repo.maven.apache.org, maven.google.com, jitpack.io, repo.spring.io, downloads.gradle.org, cache.ruby-lang.org, dl.yarnpkg.com, pear.php.net, downloads.php.net, get.pnpm.io, repo.hex.pm, ziglang.org |
| Container registries (8) | auth.docker.io, index.docker.io, production.cloudflare.docker.com, nvcr.io, registry.redhat.io, registry.access.redhat.com, us-docker.pkg.dev, cgr.dev |
| Vendor apt/yum repos and toolchain downloads (26) | get.helm.sh, dl.k8s.io, pkgs.k8s.io, packages.microsoft.com, dl.google.com, api.adoptium.net, get.sdkman.io, deb.nodesource.com, rpm.nodesource.com, keys.openpgp.org, packages.gitlab.com, packages.cloud.google.com, apt.grafana.com, repo.mongodb.org, apt.postgresql.org, repo.mysql.com, pkg.jenkins.io, updates.jenkins.io, apt.llvm.org, cli.github.com, developer.download.nvidia.com, download.pytorch.org, downloads.apache.org, ftp.gnu.org, get.k3s.io, packages.sury.org |
| Cert, signing and CI identity (6) | acme-staging-v02.api.letsencrypt.org, dv.acme-v02.api.pki.goog, rekor.sigstore.dev, fulcio.sigstore.dev, token.actions.githubusercontent.com, timestamp.sectigo.com |
| Source hosting and app stores (7) | git.sr.ht, gitlab.gnome.org, gitlab.freedesktop.org, chromium.googlesource.com, go.googlesource.com, api.snapcraft.io, dl.flathub.org |

Probed and left out: mirrorlist.centos.org, cdn-lfs.huggingface.co, cdn.dl.k8s.io,
install.k0sproject.io, repo.saltproject.io (no DNS); packages.ubuntu.com (timeout);
ppa.launchpad.net (TLS name mismatch); api.cirrus-ci.com (connection reset); builds.sr.ht (418
bot block); oss.sonatype.org, s01.oss.sonatype.org (404, sunset); timestamp.digicert.com,
ocsp.pki.goog, lscr.io, repo.yarnpkg.com, repo.prefix.dev, registry.ollama.ai,
release-assets.githubusercontent.com, pipelines.actions.githubusercontent.com,
download.visualstudio.microsoft.com, api.buypass.com, apt.fury.io (404 at the probed path);
builds.dotnet.microsoft.com, pkg-containers.githubusercontent.com (400); acme.zerossl.com
(5.9 s on the final probe, 0.6 s earlier, too flaky). packages.debian.org and
salsa.debian.org answer every request with a bot-challenge redirect, so a check there would
always read up.

Probed fine but held back for a later batch: old-releases.ubuntu.com, cloud-images.ubuntu.com,
kojipkgs.fedoraproject.org, copr.fedorainfracloud.org, mirrors.rockylinux.org,
mirrors.almalinux.org, build.opensuse.org, downloads.raspberrypi.com, distfiles.gentoo.org,
download.freebsd.org, channels.nixos.org, http.kali.org, packages.termux.dev,
mirrors.aliyun.com, mirrors.edge.kernel.org, goproxy.io, goproxy.cn, gopkg.in, index.golang.org,
fastapi.metacpan.org, www.stackage.org, trunk.cocoapods.org, r-universe.dev, pkg.julialang.org,
builds.hex.pm, dl.deno.land, classic.yarnpkg.com, download.swift.org, npm.pkg.github.com,
maven.pkg.github.com, nuget.pkg.github.com, pkgs.dev.azure.com, repo.gradle.org, docker.elastic.co,
cdn.quay.io, k8s.gcr.io, registry.suse.com, container-registry.oracle.com, packages.adoptium.net,
api.sdkman.io, cdn.azul.com, rpm.grafana.com, pgp.mongodb.com, download.postgresql.org,
packages.redis.io, get.jenkins.io, get.pulumi.com, sdk.cloud.google.com, packagecloud.io,
nvidia.github.io, repo.radeon.com, dl.min.io, archive.apache.org, dlcdn.apache.org, sourceware.org,
curl.se, get.rke2.io, apt.puppet.com, yum.puppet.com, deb.torproject.org, archive.mariadb.org,
update.code.visualstudio.com, acme.ssl.com, tuf-repo-cdn.sigstore.dev, oauth2.sigstore.dev,
timestamp.acs.microsoft.com, rfc3161timestamp.globalsign.com, ocsp.digicert.com, crt.sh (200 now,
502 on 2026-10-12), x1.c.lencr.org, sr.ht, invent.kde.org, android.googlesource.com,
opendev.org, review.opendev.org, savannah.gnu.org, sourceforge.net, ci.appveyor.com, app.bitrise.io.

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
