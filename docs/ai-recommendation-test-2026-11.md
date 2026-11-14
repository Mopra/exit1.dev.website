# Do AI assistants recommend exit1.dev? (2026-11-14)

A test of whether the big assistants name exit1.dev when someone asks for an uptime monitor, and what we changed because of it.

## The test

The same six-turn conversation, sent to each model through OpenRouter:

1. I need an uptime monitor for my website and webapp.
2. Something with MCP?
3. I need something with fast checking.
4. Those are too expensive.
5. Hmm I need a better choice. Fast, cheap, simple, dev minded.
6. what about exit1?

Two modes. **Memory**: no web search, so the model answers from training data. **Web**: search turned on, which is how the consumer apps behave.

Scripts are in `scripts/ai-recommendation-test/`. Run with `K=<openrouter key> node run.mjs web <model ids>` then `node summarize.mjs web`.

## Results

| Model | Mode | Named exit1 unprompted? | Notes |
|---|---|---|---|
| Perplexity (original chat) | Web | No | Only after being asked by name. |
| Perplexity Sonar | Web | Turn 4, dropped again at turn 5 | Cited exit1.dev/free-uptime-monitor, glama.ai, mcpbundles.com. |
| GPT 6.1 Terra | Web | Turn 5 | Recommended Nano. Cited exit1.dev/pricing. |
| Gemini 4 Hydrogen | Web | No (turns 1 to 5) | Turn 5 answer: HetrixTools and Pulsetic. Ran out of credit before turn 6. |
| GPT 6.1 Terra | Memory | No | Turn 6: "I can't verify its pricing or MCP support." |
| Gemini 4 Hydrogen | Memory | No | Turn 6: does not know the product. |
| Claude Sonnet 5.5 | Memory | No | Turn 5 answer: Gatus on a cheap VPS. |
| Grok 4.7 | Memory | No | Turn 6: read "exit1" as the shell exit code and wrote a bash script. |

Web runs for Claude and Grok did not start, and Gemini stopped after turn 5. The OpenRouter account ran out of credit ($0.64 of the $2 key budget was spent). One run per model, so treat single results as anecdotes. Answers change between runs.

## What it tells us

**1. No model knows exit1.dev from memory.** Every recommendation depends on live search. Without search the answers are UptimeRobot, Better Stack, Uptime Kuma, Gatus, Checkly, HetrixTools and Healthchecks.io.

**2. With search, we show up late and not reliably.** Turns 1 to 3 always go to UptimeRobot. We appear only once the user says "cheap", and even then Perplexity dropped us one turn later.

**3. When a model does read our pages, it gets the facts right.** Prices, intervals and MCP on every plan all came through correctly from /pricing and docs.exit1.dev/billing. The site is readable. Being found is the problem.

**4. The MCP turn is lost to UptimeRobot and Better Stack.** Both now have hosted MCP servers. So do Hyperping and Checkly. Our site still said nobody else had one.

**5. The sources that decide the answer are third-party listicles.** Perplexity's turn 5 pulled 20 pages and none were ours: hyperping.com/blog, rankite.com, uptimepage.dev, uptimia.com, devtoollab.com, uptimeeye.com, softwarecompare.net, cronalert.com, bootstrap.build, nurbak.com, runcloud.io, debugbear.com, betterstack.com/community, notifier.so, sentinel.rootstuff.io, and UptimeRobot's own "best tools" pages. When we did appear, it came through siteqwality.com (best free uptime monitoring, monitoring MCP servers), glama.ai and mcpbundles.com.

**6. The name is ambiguous.** "exit1" without ".dev" reads as a shell exit code.

**7. Ignore what a model says when asked "why didn't you recommend us?"** The "publish an SLA, add Terraform" answers are invented after the fact.

## Shipped on 2026-11-14

- Removed every claim that competitors have no MCP server. Verified against vendor docs: UptimeRobot, Better Stack, Hyperping and Checkly have hosted read/write servers, StatusCake a local read-only one.
- Corrected UptimeRobot's free plan: commercial use is allowed, and it has no SSL, domain expiry, multi-location or webhook support.
- New comparison pages for the tools assistants reach for on "cheap, dev minded": /compare/uptime-kuma, /compare/gatus, /compare/checkly.
- /mcp now targets "uptime monitoring MCP server" in its title and description, and has two new FAQs: which monitors have an MCP server, and what MCP monitoring costs on exit1.dev.
- The MCP blog post said 5 read-only tools. It now says 14, read and write.
- /free-uptime-monitor said "fast intervals" in its social description, which Perplexity turned into "free tier supports checks down to 15 seconds". Now says 5-minute checks.
- llms.txt and the footer link to all comparison pages.

## Still to do

1. **Get named in the listicles from finding 5.** This is the biggest lever and it is off-page work. Start with siteqwality.com, uptimepage.dev, uptimeeye.com, rankite.com, devtoollab.com and softwarecompare.net, since they already list small tools.
2. **Finish the pending MCP directory listings** (mcp.so, Cline marketplace, cursor.directory, the awesome-mcp-servers PRs). glama.ai and mcpbundles.com were cited directly.
3. **Say "exit1.dev", never "exit1"**, in titles, directory listings and outreach.
4. **Decide the MCP tool count.** /mcp says 14 tools. llms.txt lists `get_sla_report` as an MCP tool, which would make 15.
5. **Rerun this test around 2026-12-12**, three runs per model, to see whether anything moved.
