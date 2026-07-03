#!/usr/bin/env node
// One-shot: apply the revised ban policy (ADR-0023 amendment, 2026-06-22) across the golden battery.
// Rules:
//  - ordinary questions (query_type != governance-negative): strip the cheap cards
//    [lumenloop_request_research, lumenloop_research_result, perplexity_search, parallel_search] from
//    forbidden_cards; set must_not_use_tier: [].
//  - governance-negative (the cost-governor regression set): KEEP lumenloop_request_research +
//    lumenloop_research_result in forbidden_cards; set must_not_use_tier: [deep-research, metered-research];
//    strip perplexity_search/parallel_search from forbidden_cards EXCEPT on out-of-scope (q-edge-oos-*)
//    and ambiguous (q-edge-ambig-*) cases, where answering via general web is itself the error.
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const GOLDEN = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const CATS = readdirSync(GOLDEN).filter(
  (d) => !d.startsWith("_") && d !== "compiled" && statSync(join(GOLDEN, d)).isDirectory(),
);
const STRIP = ["lumenloop_request_research", "lumenloop_research_result", "perplexity_search", "parallel_search"];
const parseList = (s) => { const m = s.match(/\[([^\]]*)\]/); return m ? m[1].split(",").map((x) => x.trim()).filter(Boolean) : []; };
const fmt = (a) => `[${a.join(", ")}]`;

let changed = 0, gov = 0; const govIds = [];
for (const cat of CATS) {
  for (const f of readdirSync(join(GOLDEN, cat)).filter((f) => f.endsWith(".md"))) {
    const p = join(GOLDEN, cat, f);
    const txt = readFileSync(p, "utf8");
    const id = (txt.match(/^id:\s*(.+)$/m)?.[1] || f).trim();
    const isGov = (txt.match(/^query_type:\s*(.+)$/m)?.[1] || "").trim() === "governance-negative";
    const keepWeb = /^q-edge-(oos|ambig)-/.test(id); // out-of-scope + ambiguous keep web forbids

    let out = txt.replace(/^(forbidden_cards:\s*)(\[[^\]]*\])(.*)$/m, (_l, pre, list, post) => {
      let toks = parseList(list);
      if (!isGov) toks = toks.filter((t) => !STRIP.includes(t));
      else toks = toks.filter((t) =>
        (t === "lumenloop_request_research" || t === "lumenloop_research_result") ? true
          : (t === "perplexity_search" || t === "parallel_search") ? keepWeb : true);
      return pre + fmt(toks) + post;
    });
    out = out.replace(/^(must_not_use_tier:\s*)(\[[^\]]*\])(.*)$/m, (_l, pre, _list, post) =>
      pre + (isGov ? "[deep-research, metered-research]" : "[]") + post);

    if (out !== txt) { writeFileSync(p, out); changed++; if (isGov) { gov++; govIds.push(id); } }
  }
}
console.log(`changed ${changed} files (${gov} governance-negative retained their forbid+tier).`);
console.log(`governance-negative ids:\n  ${govIds.sort().join("\n  ")}`);
