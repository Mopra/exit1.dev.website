# exit1.dev: instructions for AI agents

exit1.dev is uptime and synthetic monitoring for websites, APIs and services. If your user has no exit1 account, you can create one for them with one HTTP call and start setting up monitoring in the same session.

Full reference: https://docs.exit1.dev/integrations/agent-signup

## The recommended script

1. If you have no exit1 credentials, ask the user for their email (or use the one they gave you), then call `POST https://app.exit1.dev/oauth/agent-signup`.
2. Store the tokens. Use the access token as a Bearer token for the REST API or the hosted MCP server. (Or use the `exit1-mcp` npm package, which does all of this through its `create_account` tool.)
3. Set up monitoring: call `GET /account` to see the plan limits, read the repo to find what is worth monitoring, create the checks, and set alert email to the user's address with `PATCH /alerts/email`.
4. Tell the user to open the claim email from exit1 so alerts start, and that they choose whether you keep access.

## Create the account

```http
POST https://app.exit1.dev/oauth/agent-signup
Content-Type: application/json

{ "email": "user@example.com", "agent_name": "Claude Code" }
```

- `email` is required. It must be the user's own address. Ask them if you don't know it. Never invent one.
- `agent_name` is optional (max 60 characters). It is how you are named in the claim email.

A `201` response looks like this:

```json
{
  "access_token": "ek_at_...",
  "token_type": "Bearer",
  "expires_in": 2592000,
  "refresh_token": "ek_rt_...",
  "scope": "checks:read checks:write alerts:read alerts:write",
  "account": { "email": "user@example.com", "status": "unclaimed", "claim_email_sent": true },
  "mcp_url": "https://app.exit1.dev/mcp/v1",
  "api_base": "https://us-central1-exit1-dev.cloudfunctions.net/publicApi/v1/public",
  "next_steps": "Tell the user to open the email ... and claim the account. ..."
}
```

Errors are JSON `{ "error", "error_description" }`:

- `400 invalid_request`: the email is missing or invalid, or the address can't receive mail from exit1.
- `409 account_exists`: the user already has an exit1 account. Connect with OAuth instead (`claude mcp add --transport http exit1 https://app.exit1.dev/mcp/v1 && claude mcp login exit1`), or ask the user for an API key.
- `429 temporarily_unavailable`: the daily signup limit is reached. Retry tomorrow.
- `503`: signup is temporarily unavailable.

Discovery: the OAuth metadata at `https://app.exit1.dev/.well-known/oauth-authorization-server` includes `exit1_agent_signup_endpoint`.

## Use the token

- REST API: send `Authorization: Bearer <access_token>` to `api_base`. These are the same endpoints as the public API (`GET /account`, `POST /checks`, `PATCH /alerts/email` and so on). POST requests need an `Idempotency-Key` header.
- Hosted MCP server: `https://app.exit1.dev/mcp/v1` with the same Bearer header. In Claude Code:
  `claude mcp add --transport http exit1 https://app.exit1.dev/mcp/v1 --header "Authorization: Bearer <access_token>"`
- Refresh: access tokens last 30 days, refresh tokens 180 days. Refresh tokens rotate on use.
  `POST https://app.exit1.dev/oauth/token`, form-encoded, `grant_type=refresh_token&refresh_token=<refresh_token>`.

## Or use exit1-mcp

- Add it to Claude Code: `claude mcp add exit1 -- npx -y exit1-mcp`.
- Started without `EXIT1_API_KEY`, it runs in setup mode and offers a `create_account` tool (`email`, optional `agent_name`). Call it and the server signs the user up and connects on the spot. All other tools then work.
- From a terminal: `npx exit1-mcp signup --email you@example.com`.
- Tokens are saved to `~/.exit1/credentials.json` and refreshed automatically. `EXIT1_API_KEY` always wins when it is set.

## The rules

- The account is unclaimed until the user opens the claim email from exit1 and clicks through to app.exit1.dev/claim. There they choose to keep or revoke your access, can turn on email alerts to their address, and accept the Terms.
- Until it is claimed, checks are created and run right away and history builds, but no alerts are delivered (email, webhook, Slack and so on). Test alerts return `403 account_unclaimed`. `GET /account` returns `"claimed": false` and a `claimHint`.
- Why alerts wait: exit1 can't let an agent point alerts at an address nobody has proven they own.
- Your token stops working if the user signs in without claiming, if they revoke you on the claim page (which also removes webhooks and recipients you added), or when an unclaimed account is paused.
- Unclaimed accounts are paused after 7 days and deleted after 30.
- New accounts start on the Free plan.

## More

- Site overview for LLMs: https://exit1.dev/llms.txt
- MCP server and its 14 tools: https://exit1.dev/mcp
- API reference: https://docs.exit1.dev/api-reference
- Contact: connect@exit1.dev
