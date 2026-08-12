// The paste-into-your-agent setup prompt, shared by the homepage hero
// (components/home/AgentSetupPrompt) and the /ai campaign landing page.
//
// It lived inline in AgentSetupPrompt until /ai needed the same text; two copies
// of a prompt that must already stay in sync with two other repos was one copy
// too many.
//
// Keep SETUP_PROMPT in sync with app.exit1.dev/mcp and the `setup_monitoring`
// MCP prompt in functions/src/mcp-tools.ts (exit1.dev repo).

export const MCP_ADD_COMMAND =
  'claude mcp add --transport http exit1 https://app.exit1.dev/mcp/v1';

export const SETUP_PROMPT = `Set up uptime monitoring for this project with Exit1.

1. Connect the MCP server. In Claude Code:
     ${MCP_ADD_COMMAND}
   Other tools: add the same HTTP MCP server however your tool does it.

   Connecting needs a one-time browser sign-in. Most AI tools CANNOT open that
   sign-in from inside a conversation turn. If the connection isn't
   authenticated, don't retry or improvise — stop and tell me to run /mcp (or my
   tool's equivalent), authenticate in the browser, and come back to you. Then
   carry on from step 2.

2. Call get_account to see my plan limits, and list_checks to see what's
   already monitored.

3. Work out what's worth monitoring by reading this project — don't ask me for
   URLs you can find yourself. Depending on the stack, look at deploy and
   infra config, environment files and examples, the README, DNS or domain
   config, container healthchecks, CI/CD workflows, and route or endpoint
   definitions. You're looking for:
     - the production site or app, and staging if there is one
     - health/status endpoints (these are the most valuable — assert on the
       response body, not just a 200, since a 200 with a dead database is
       still a 200)
     - public APIs and webhook receivers other systems depend on
     - scheduled jobs and workers (monitor these as heartbeats)
     - the apex domain, for SSL and registration expiry
   If this project has no deployed URL you can find, ask me for it.

4. Ask me two things in one go: which email address should receive alerts,
   and whether to add a Slack/Discord webhook. Then show me the checks you
   intend to create as one short list and create them when I confirm.

5. Send a test alert to every channel you set up and tell me to check it
   arrived. Don't leave a channel configured but untested.

Be fast and autonomous. Never put API keys, tokens or passwords into a check.
Prefer a few meaningful checks over many shallow ones.`;

/** First line of the prompt — used where the full text would bury the CTA. */
export const SETUP_PROMPT_PREVIEW =
  'Set up uptime monitoring for this project with Exit1…';
