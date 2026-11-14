import fs from "node:fs";
const K = process.env.K;
const [,, mode, ...models] = process.argv; // mode: web | mem
const TURNS = [
  "I need an uptime monitor for my website and webapp.",
  "Something with MCP?",
  "I need something with fast checking.",
  "Those are too expensive.",
  "Hmm I need a better choice. Fast, cheap, simple, dev minded.",
  "what about exit1?",
];
const BUDGET = Number(process.env.BUDGET || 0.3); // per model, USD
async function call(model, messages) {
  const body = { model, messages, max_tokens: 1000, reasoning: { effort: "low" }, usage: { include: true } };
  if (mode === "web" && !model.startsWith("perplexity/")) body.plugins = [{ id: "web", max_results: 5 }];
  const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${K}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const j = await r.json();
  if (j.error && j.error.code === 402 && (call.tries = (call.tries||0)+1) < 12) { await new Promise(r=>setTimeout(r,125000)); return call(model, messages); }
  if (j.error) throw new Error(JSON.stringify(j.error).slice(0, 400));
  return j;
}
async function runModel(model) {
  const messages = []; let log = []; let cost = 0;
  const file = "out_"+mode+"_"+model.replace(/[/:]/g, "_")+".json";
  if (fs.existsSync(file)) { const o = JSON.parse(fs.readFileSync(file)); log = o.log.filter(l => l.assistant); cost = o.cost; for (const l of log) messages.push({role:"user",content:l.user},{role:"assistant",content:l.assistant}); }
  for (const t of TURNS.slice(log.length)) {
    if (cost > BUDGET) { log.push({ user: t, skipped: "budget" }); break; }
    messages.push({ role: "user", content: t });
    try {
      const j = await call(model, messages);
      const msg = j.choices[0].message;
      const content = msg.content || "";
      const cites = (msg.annotations || []).filter(a => a.type === "url_citation").map(a => a.url_citation?.url).concat(j.citations || []);
      cost += j.usage?.cost || 0;
      log.push({ user: t, assistant: content, citations: [...new Set(cites)], usage: { in: j.usage?.prompt_tokens, out: j.usage?.completion_tokens, cost: j.usage?.cost } });
      messages.push({ role: "assistant", content });
    } catch (e) { log.push({ user: t, error: String(e.message) }); break; }
  }
  const out = { model, mode, cost, log };
  fs.writeFileSync(`out_${mode}_${model.replace(/[\/:]/g, "_")}.json`, JSON.stringify(out, null, 1));
  const firstMention = log.findIndex(l => /exit1/i.test(l.assistant || ""));
  console.log(model, mode, "cost $" + cost.toFixed(4), "first exit1 mention at turn", firstMention + 1 || "never", log.find(l => l.error)?.error || "");
}
for (const m of models) await runModel(m);
