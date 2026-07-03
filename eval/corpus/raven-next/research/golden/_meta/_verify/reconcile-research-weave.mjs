#!/usr/bin/env node
// Reconcile the research-lane weave per the Codex review (RESEARCH-WEAVE-codex.md):
// REMOVE lumenloop_request_research from acceptable_cards on the 6 flagged files (redundant content
// lookups / non-corpus-primary / the perps contradiction); ADD it to 2 well-justified synthesis Qs.
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const GOLDEN = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const CARD = "lumenloop_request_research";
const REMOVE = new Set([
  "q-defi-perps-whitespace", "q-defi-blend-content", "q-defi-soroswap-content",
  "q-defi-reflector-content", "q-builder-content-by-person", "q-pay-unhcr-aid-assist",
]);
const ADD = new Set(["q-defi-streaming-payments-prior-art", "q-defi-agent-identity-stellar-experimental"]);

const CATS = readdirSync(GOLDEN).filter((d) => !d.startsWith("_") && d !== "compiled" && statSync(join(GOLDEN, d)).isDirectory());
const hit = new Set(); let removed = 0, added = 0;
for (const cat of CATS) {
  for (const f of readdirSync(join(GOLDEN, cat)).filter((f) => f.endsWith(".md"))) {
    const p = join(GOLDEN, cat, f);
    const txt = readFileSync(p, "utf8");
    const id = (txt.match(/^id:\s*(.+)$/m)?.[1] || "").trim();
    if (!REMOVE.has(id) && !ADD.has(id)) continue;
    hit.add(id);
    const out = txt.replace(/^(acceptable_cards:\s*)\[([^\]]*)\](.*)$/m, (_l, pre, inner, post) => {
      let toks = inner.split(",").map((x) => x.trim()).filter(Boolean);
      if (REMOVE.has(id)) { if (toks.includes(CARD)) { toks = toks.filter((t) => t !== CARD); removed++; } }
      else if (ADD.has(id)) { if (!toks.includes(CARD)) { toks.push(CARD); added++; } }
      return pre + `[${toks.join(", ")}]` + post;
    });
    if (out !== txt) writeFileSync(p, out);
  }
}
const miss = [...REMOVE, ...ADD].filter((id) => !hit.has(id));
console.log(`reconcile: removed ${removed}, added ${added}. matched ${hit.size}/${REMOVE.size + ADD.size}${miss.length ? " — MISSING: " + miss.join(", ") : ""}`);
