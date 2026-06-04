# Getting Started with exit1

Welcome to exit1. This guide walks you through everything you need to start monitoring in a few minutes: creating your first check, dialing in the basics like check interval, turning on alerts so you hear about outages, and reading the logs to see what actually happened.

By the end you'll have a live monitor watching one of your URLs, alerting you the moment it goes down.

---

## Before you start

1. Go to **[app.exit1.dev](https://app.exit1.dev)** and sign in (or create a free account).
2. That's it — there's nothing to install. exit1 runs the checks for you from our own infrastructure.

The free plan lets you monitor up to 10 checks. You can upgrade later for faster intervals, more checks, SMS alerts, and multi-region monitoring.

---

## Step 1 — Create your first check

A **check** is one thing you want to watch — a website, an API endpoint, a server port, a DNS record, and so on.

1. Open the **Checks** page from the sidebar.
2. Click **Add Check** (top right). A panel slides in from the right titled **New Check**.
3. **Pick a check type.** The icon strip at the top lets you choose what to monitor. The default is **Web**, which covers most use cases:

   | Type | Use it for |
   |------|------------|
   | **Web** | Website / page availability (HTTP/HTTPS) |
   | **API** | REST endpoints — check status codes and response content |
   | **Redirect** | Verify a URL redirects to the right place |
   | **TCP** / **UDP** | Port reachability (databases, mail servers, game servers…) |
   | **Ping** | Host reachability via ICMP |
   | **WS** | WebSocket handshake |
   | **DNS** | Watch DNS records for changes |
   | **Domain** | Track domain registration expiry (no uptime probing) |

4. **Enter the URL** you want to monitor. For Web and API checks, pick the protocol (`https://` is the default) and type the rest, e.g. `example.com`.
5. The **Display name** fills in automatically from the URL. Edit it to whatever you'll recognize in your dashboard.
6. Click **Add Check**.

Your check is now live. exit1 starts probing it on a shared schedule and you'll see its status (online / offline) appear on the Checks page.

> **Tip:** You don't have to configure anything else to get started — sensible defaults are applied automatically. The steps below show you how to fine-tune them.

---

## Step 2 — Set the basics (interval, region, timezone)

In the **New Check** panel (or later, by editing a check), expand the **Settings** section to reveal **Schedule**.

### Check interval

Under **Check every**, choose how often exit1 probes your URL. The default is **5 minutes**, with options ranging from every few seconds up to once a day.

- Shorter intervals catch outages faster.
- The fastest intervals (down to **15 seconds**) are available on paid plans; the free plan starts at a longer minimum.

> Checks run on a shared schedule, so the actual interval is approximate — a "5 minute" check fires roughly every 5 minutes, not to the exact second.

### Region

By default, checks run from our **Europe (Frankfurt)** region. On paid plans you can also choose **America (Boston)** to monitor from closer to your users or compare results across regions.

### Alert timezone

Set the timezone used when formatting timestamps in your notifications. Leave it on **UTC** if you're not sure.

---

## Step 3 — Tune how outages are confirmed (optional)

Still inside **Settings**, the **Alert behavior** section controls how aggressively exit1 decides something is actually down. The defaults are good for most people — adjust them if you're getting false alarms or want stricter checking.

- **Immediate recheck** *(on by default)* — when a probe fails, exit1 re-checks the URL about 30 seconds later to confirm it wasn't a one-off blip before alerting.
- **Confirm down after** *(default: 4 failures)* — the number of consecutive failed probes required before a check is marked offline. Raise it to reduce noise; lower it to alert sooner.
- **Max response time** *(off by default)* — mark the check as down if a response takes longer than this many milliseconds. Useful for catching "up but painfully slow."
- **Disable peer confirmation** — by default, a suspected outage is double-checked from a second region before alerting. Only turn this off if your endpoint legitimately responds differently by geography (e.g. geo-blocked content).

For **API** checks you'll also find an **HTTP configuration** section to set the request method, expected status codes (e.g. `200, 201, 301-308`), request headers/body, and response-text validation.

When you're happy, click **Add Check** (or **Save Changes**).

---

## Step 4 — Turn on alerts

Monitoring is only useful if it tells you when something breaks. exit1 delivers alerts through several channels, each configured from the sidebar:

- **Emails** — email notifications (available on every plan)
- **SMS** — text-message alerts (paid plans)
- **Webhooks** — POST events to your own endpoint, Slack, Discord, or Teams
- **Integrations** — Pushover, PagerDuty, Opsgenie

### Set up email alerts

1. Open **Emails** from the sidebar (**Email Alerts**).
2. Your account email is added as a **recipient** automatically. Add or change recipients as needed.
3. Choose which **events** you want to be notified about:
   - **Down** — the check went offline
   - **Up** — the check recovered
   - **SSL Error / SSL Warning** — certificate problems
   - **Domain Expiring / Expired / Renewed** — registration changes
4. New checks are **included automatically**, so your first check is already covered. You can toggle alerts per check (or per folder) from the list on this page.
5. Click **Send test** to confirm a notification reaches your inbox.

> Want Slack or Discord instead? Open **Webhooks**, add your webhook URL, and pick the same events. The same per-check controls apply.

---

## Step 5 — Watch the logs

Once your check is running, you can see exactly what exit1 observed on every probe.

### Logs

Open **Logs** from the sidebar. Each row is a single probe result and shows:

- **Status** — online, offline, paused, or unknown
- **Response time** and **HTTP status code**
- A **timing breakdown** (DNS → connect → TLS → first byte) so you can spot *where* a slow request stalled
- The error reason when a probe failed

Use the filters at the top to narrow by **check**, **time range** (last hour up to 60 days), and **status** — handy for zeroing in on a specific incident.

### Live

For a real-time view, open **Live** from the sidebar to watch a continuously scrolling response-time chart for a single check — like a task-manager graph for your endpoint. Outages and recoveries appear as markers on the timeline.

---

## You're set

You now have a check that:

- ✅ probes your URL on the interval you chose,
- ✅ confirms outages before crying wolf,
- ✅ alerts you by email (and any other channel you added),
- ✅ records every result in the logs for you to review.

### Where to go next

- **Add more checks** — APIs, ports, DNS records, or your domain's expiry date.
- **Organize with folders** and apply alert settings in bulk.
- **Status pages & badges** — share live uptime with your users.
- **API & MCP** — automate check management or feed your data to AI assistants.

Browse the full documentation at **[docs.exit1.dev](https://docs.exit1.dev)**, or reach us any time at **connect@exit1.dev**.
