// The paste-into-your-agent setup prompt, shared by the homepage hero
// (components/home/AgentSetupPrompt) and the /ai campaign landing page.
//
// It lived inline in AgentSetupPrompt until /ai needed the same text; two copies
// of a prompt that must already stay in sync with two other repos was one copy
// too many.
//
// Keep SETUP_PROMPT in sync with app.exit1.dev/mcp (src/pages/Mcp.tsx in the
// exit1.dev repo) and the README in the exit1.dev.mcp repo. The hosted
// `setup_monitoring` MCP prompt (functions/src/mcp-tools.ts) intentionally has
// no connect step, since by definition the server is connected when it runs.
//
// Flow rationale: MCP clients load servers at startup, so a server added
// mid-session is unusable until restart. The CTA therefore leads with the two
// terminal commands (connect + browser sign-in via `claude mcp login`), and the
// prompt's step 1 only exists as a graceful bounce for people who paste first.

export const MCP_REMOTE_URL = 'https://app.exit1.dev/mcp/v1';

export const MCP_ADD_COMMAND = `claude mcp add --transport http exit1 ${MCP_REMOTE_URL}`;

export const MCP_LOGIN_COMMAND = 'claude mcp login exit1';

/**
 * The connect-first CTA, deliberately ONE line chained with `&&`. Pasting two
 * separate lines into a terminal is unreliable: in cmd.exe the first command's
 * process grabs console input while it runs and swallows the second line, so
 * the login step silently never executes (observed in a real run; a trailing
 * newline did not fix it). `&&` runs in cmd, bash, zsh and PowerShell 7; only
 * Windows PowerShell 5.1 rejects it, loudly, and those users can run the two
 * halves separately.
 */
export const MCP_CONNECT_COMMANDS = `${MCP_ADD_COMMAND} && ${MCP_LOGIN_COMMAND}`;

/**
 * Clipboard variant of MCP_CONNECT_COMMANDS. The trailing newline makes the
 * one-liner execute on paste instead of waiting for Enter. Use this for copy
 * buttons, MCP_CONNECT_COMMANDS for display.
 */
export const MCP_CONNECT_COMMANDS_COPY = `${MCP_CONNECT_COMMANDS}
`;

// ---- Per-client connect snippets ----
//
// The connect step is the only part of the flow that differs per tool, so the
// CTA carries a client selector and these are what it swaps between. The
// setup prompt itself is client-agnostic. Keep the JSON shapes in step with
// the tabs on app.exit1.dev/mcp (src/pages/Mcp.tsx in the exit1.dev repo).

export type ConnectClient = {
  id: string;
  label: string;
  /** One truncated line for the homepage hero. */
  displayLine: string;
  /** Full snippet where there is room to show it (the /ai panel). */
  snippet: string;
  /** Clipboard payload (trailing newline on shell commands so they run on paste). */
  copyText: string;
  /** Copy-button label; says what kind of thing lands on the clipboard. */
  copyLabel: string;
  /** One short line: where the snippet goes and how sign-in happens. */
  hint: string;
};

const CURSOR_JSON = `{
  "mcpServers": {
    "exit1": { "type": "http", "url": "${MCP_REMOTE_URL}" }
  }
}`;

const VSCODE_JSON = `{
  "servers": {
    "exit1": { "type": "http", "url": "${MCP_REMOTE_URL}" }
  }
}`;

export const CONNECT_CLIENTS: ConnectClient[] = [
  {
    id: 'claude-code',
    label: 'Claude Code',
    displayLine: MCP_CONNECT_COMMANDS,
    snippet: MCP_CONNECT_COMMANDS,
    copyText: MCP_CONNECT_COMMANDS_COPY,
    copyLabel: 'Copy command',
    hint: 'Run in your terminal before starting claude. The login opens your browser to sign in.',
  },
  {
    id: 'cursor',
    label: 'Cursor',
    displayLine: 'Copy JSON into .cursor/mcp.json, then approve the sign-in',
    snippet: CURSOR_JSON,
    copyText: `${CURSOR_JSON}
`,
    copyLabel: 'Copy JSON',
    hint: 'Add to .cursor/mcp.json in your project (or ~/.cursor/mcp.json), then approve the sign-in Cursor prompts for.',
  },
  {
    id: 'vscode',
    label: 'VS Code',
    displayLine: 'Copy JSON into .vscode/mcp.json, then complete the sign-in',
    snippet: VSCODE_JSON,
    copyText: `${VSCODE_JSON}
`,
    copyLabel: 'Copy JSON',
    hint: 'Add to .vscode/mcp.json (or run MCP: Add Server from the Command Palette and pick HTTP), then complete the sign-in it prompts for.',
  },
  {
    id: 'claude-desktop',
    label: 'Claude Desktop',
    displayLine: `Copy the URL into Settings > Connectors, then sign in`,
    snippet: MCP_REMOTE_URL,
    copyText: MCP_REMOTE_URL,
    copyLabel: 'Copy URL',
    hint: 'Settings > Connectors > Add custom connector, paste this URL, and sign in when prompted.',
  },
];

export const SETUP_PROMPT = `Set up uptime monitoring for this project with Exit1.

1. Check whether the Exit1 tools (get_account, list_checks, create_check) are
   available to you. If they are, go to step 2.

   If they are not, do NOT try to connect from inside this session, and do not
   improvise with the raw API. Most AI tools load MCP servers only at startup
   and cannot open a browser sign-in mid-conversation, so a server added now
   stays unusable until I restart. Instead:
     - In Claude Code: run
         ${MCP_ADD_COMMAND}
       then tell me to quit, run \`${MCP_LOGIN_COMMAND}\` in my terminal (my
       browser opens to sign in or sign up), and resume you with
       \`claude --continue\`. If my version has no \`mcp login\`, I
       authenticate via /mcp after restarting instead.
     - In other tools: tell me to add the HTTP MCP server
       https://app.exit1.dev/mcp/v1 the way my tool does it, restart it, and
       paste this prompt again.
   While you wait, do step 3 now and show me the checks you intend to create,
   so my first message after reconnecting can be "go".

2. Call get_account to see my plan limits, and list_checks to see what's
   already monitored.

3. Work out what's worth monitoring by reading this project. Don't ask me for
   URLs you can find yourself. Depending on the stack, look at deploy and
   infra config, environment files and examples, the README, DNS or domain
   config, container healthchecks, CI/CD workflows, and route or endpoint
   definitions. You're looking for:
     - the production site or app, and staging if there is one
     - health/status endpoints (these are the most valuable; assert on the
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

/** First line of the prompt, used where the full text would bury the CTA. */
export const SETUP_PROMPT_PREVIEW =
  'Set up uptime monitoring for this project with Exit1…';
