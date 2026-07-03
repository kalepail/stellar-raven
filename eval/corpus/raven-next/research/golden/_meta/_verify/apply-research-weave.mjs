#!/usr/bin/env node
// One-shot: weave lumenloop_request_research into acceptable_cards on the curated deep-synthesis subset
// (ban-policy follow-up, user-approved 2026-06-22: strong+medium ~20, acceptable-only). The free corpus
// search stays the expected primary; the metered lane is the governed escalation ("acceptable when thin").
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const GOLDEN = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const CARD = "lumenloop_request_research";
const TARGETS = new Set([
  // strong (12)
  "q-defi-rwa-overview", "q-rwa-projects-tokenizing-stellar", "q-eco-defi-market-map", "q-eco-dex-saturation",
  "q-defi-blend-content", "q-defi-soroswap-content", "q-defi-reflector-content", "q-defi-comet-content",
  "q-eco-2025-defi-launches", "q-defi-blend-alternatives", "q-defi-reflector-alternatives", "q-defi-bridges-content",
  // medium (8)
  "q-defi-liquid-staking-whitespace", "q-defi-perps-whitespace", "q-eco-nft-marketplace-whitespace",
  "q-defi-rwa-scf-similar", "q-scf-funded-similar-oracle", "q-scf-funded-similar-payroll",
  "q-builder-content-by-person", "q-pay-unhcr-aid-assist",
]);

const CATS = readdirSync(GOLDEN).filter((d) => !d.startsWith("_") && d !== "compiled" && statSync(join(GOLDEN, d)).isDirectory());
const seen = new Set();
let changed = 0, already = 0;
for (const cat of CATS) {
  for (const f of readdirSync(join(GOLDEN, cat)).filter((f) => f.endsWith(".md"))) {
    const p = join(GOLDEN, cat, f);
    const txt = readFileSync(p, "utf8");
    const id = (txt.match(/^id:\s*(.+)$/m)?.[1] || "").trim();
    if (!TARGETS.has(id)) continue;
    seen.add(id);
    const out = txt.replace(/^(acceptable_cards:\s*)\[([^\]]*)\](.*)$/m, (_l, pre, inner, post) => {
      const toks = inner.split(",").map((x) => x.trim()).filter(Boolean);
      if (toks.includes(CARD)) { already++; return pre + `[${toks.join(", ")}]` + post; }
      toks.push(CARD);
      changed++;
      return pre + `[${toks.join(", ")}]` + post;
    });
    if (out !== txt) writeFileSync(p, out);
  }
}
const missing = [...TARGETS].filter((id) => !seen.has(id));
console.log(`weave: ${changed} files got ${CARD} added to acceptable_cards (${already} already had it).`);
console.log(`targets matched: ${seen.size}/${TARGETS.size}${missing.length ? " — MISSING: " + missing.join(", ") : ""}`);
