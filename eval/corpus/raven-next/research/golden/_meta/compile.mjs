#!/usr/bin/env node
// Compile the golden-question battery → research/golden/compiled/golden.json (the flat array the eval
// harness loads) + a derived `criteria` prose projection for eval/dataset.ts (GoldenCase) back-compat.
// Run: node research/golden/_meta/compile.mjs
import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const GOLDEN = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(GOLDEN, "compiled");
const CATS = readdirSync(GOLDEN).filter(
  (d) => !d.startsWith("_") && d !== "compiled" && statSync(join(GOLDEN, d)).isDirectory(),
);

const strip = (v) => {
  const trimmed = v.trim();
  const quote = trimmed[0];
  if ((quote === '"' || quote === "'") && trimmed.endsWith(quote)) return trimmed.slice(1, -1);
  return trimmed.replace(/\s+#.*$/, "").trim();
};
const scalar = (fm, k) => {
  const m = fm.match(new RegExp(`^${k}:\\s*(.*)$`, "m"));
  return m ? strip(m[1]) : "";
};
const nullableScalar = (fm, k) => {
  const v = scalar(fm, k);
  return v === "" || v === "null" ? null : v;
};
const bool = (fm, k) => scalar(fm, k) === "true";
const num = (fm, k) => { const v = scalar(fm, k); return v === "" ? null : Number(v); };
const inlineList = (fm, k) => {
  const m = fm.match(new RegExp(`^${k}:\\s*\\[([^\\]]*)\\]`, "m"));
  return m ? m[1].split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean) : [];
};
// Grab the block of lines under `key:` up to the next top-level (non-indented) key.
const block = (fm, k) => {
  const m = fm.match(new RegExp(`^${k}:\\s*(.*(?:\\n[ \\t].*)*)`, "m"));
  return m ? m[1] : "";
};
// Parse a weighted-claim list (flow `- { claim: "..", weight: N }` or block form).
const claims = (fm, k) => {
  const b = block(fm, k);
  if (/^\s*\[\s*\]/.test(b)) return [];
  const out = [];
  const re = /claim:\s*"((?:[^"\\]|\\.)*)"[\s\S]*?weight:\s*(\d+)/g;
  let m;
  while ((m = re.exec(b)) !== null) out.push({ claim: m[1].replace(/\\"/g, '"'), weight: Number(m[2]) });
  return out;
};
// Parse a plain string-list block (must_cite / sources): `- "..."` or `- ...`.
const strList = (fm, k) => {
  const b = block(fm, k);
  if (/^\s*\[\s*\]/.test(b)) return [];
  return [...b.matchAll(/^\s*-\s*(.+)$/gm)].map((m) => strip(m[1])).filter(Boolean);
};
const inlineMap = (fm, k) => {
  const raw = scalar(fm, k);
  const m = raw.match(/^\{(.*)\}$/);
  if (!m) return {};
  return Object.fromEntries(
    m[1].split(",")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const [key, ...rest] = part.split(":");
        const value = strip(rest.join(":"));
        return [key.trim(), value === "null" ? null : value];
      }),
  );
};

const rows = [];
for (const cat of CATS) {
  for (const f of readdirSync(join(GOLDEN, cat)).filter((f) => f.endsWith(".md"))) {
    const raw = readFileSync(join(GOLDEN, cat, f), "utf8");
    const fm = raw.split(/^---$/m)[1] || "";
    const must = claims(fm, "must_have"), should = claims(fm, "should_have"),
      nice = claims(fm, "nice_to_have"), avoid = claims(fm, "must_avoid");
    const expected = inlineList(fm, "expected_cards"), forbidden = inlineList(fm, "forbidden_cards");
    const acceptable = inlineList(fm, "acceptable_cards");
    const tiers = inlineList(fm, "must_not_use_tier");
    const cite = strList(fm, "must_cite");
    const shouldFire = bool(fm, "should_fire");

    // Derived prose `criteria` for GoldenCase back-compat (judge-readable gate summary).
    const j = (cs) => cs.map((c) => c.claim).join("; ");
    const criteria = [
      shouldFire ? `Raven SHOULD answer.` : `Raven should DECLINE / scope down / clarify (should_fire:false).`,
      // Surface acceptable_cards as route-pass-EQUIVALENT so the judge does not penalize a valid alternate
      // (e.g. parallel_search where perplexity_search is expected) — Codex review #2 / the recency de-bias.
      expected.length
        ? `Expected cards: ${expected.join(", ")}${acceptable.length ? ` (or any acceptable alternative — route-pass-equivalent: ${acceptable.join(", ")})` : ""}.`
        : acceptable.length ? `Acceptable cards (route-pass-equivalent): ${acceptable.join(", ")}.` : "",
      must.length ? `MUST include (gate): ${j(must)}.` : "",
      avoid.length ? `MUST AVOID (gate): ${j(avoid)}.` : "",
      should.length ? `Should include: ${j(should)}.` : "",
      cite.length ? `Must cite: ${cite.join("; ")}.` : "",
      forbidden.length ? `Forbidden cards: ${forbidden.join(", ")}.` : "",
      tiers.length ? `Must not use tier: ${tiers.join(", ")}.` : "",
    ].filter(Boolean).join(" ");

    rows.push({
      id: scalar(fm, "id"),
      q: scalar(fm, "q"),
      category: cat,
      subcategory: scalar(fm, "subcategory"),
      axes: inlineList(fm, "axes"),
      query_type: scalar(fm, "query_type"),
      difficulty: scalar(fm, "difficulty"),
      freshness_sensitive: bool(fm, "freshness_sensitive"),
      freshness_horizon: nullableScalar(fm, "freshness_horizon"),
      should_fire: shouldFire,
      expected_cards: expected,
      acceptable_cards: acceptable,
      forbidden_cards: forbidden,
      expected_service: scalar(fm, "expected_service"),
      must_not_use_tier: tiers,
      rubric: { must_have: must, should_have: should, nice_to_have: nice, must_avoid: avoid },
      must_cite: cite,
      pass_threshold: num(fm, "pass_threshold"),
      weight_profile: scalar(fm, "weight_profile"),
      source_kind: scalar(fm, "source_kind") || "canonical-urls",
      sources: strList(fm, "sources"),
      status: scalar(fm, "status"),
      authored: inlineMap(fm, "authored"),
      confidence: scalar(fm, "confidence"),
      notes: scalar(fm, "notes"),
      // GoldenCase {id,q,criteria,tags} back-compat projection.
      criteria,
      tags: [...new Set([cat, scalar(fm, "query_type"), ...inlineList(fm, "axes")])].filter(Boolean),
    });
  }
}

rows.sort((a, b) => a.id.localeCompare(b.id));
mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, "golden.json"), JSON.stringify(rows, null, 2) + "\n");

// Validation report.
const missing = rows.filter((r) => !r.id || !r.q || !r.criteria);
const noMust = rows.filter((r) => r.should_fire && r.rubric.must_have.length === 0);
const badWeights = rows.flatMap((r) =>
  Object.values(r.rubric).flat().filter((c) => !(c.weight >= 1 && c.weight <= 5)).map(() => r.id));
const badSourceKinds = rows.filter((r) => !["canonical-urls", "dynamic-corpus"].includes(r.source_kind));
const missingFreshnessHorizon = rows.filter((r) => r.freshness_sensitive && !r.freshness_horizon);
const citationGatedWithoutSources = rows.filter((r) =>
  r.should_fire && r.must_cite.length > 0 && r.sources.length === 0 && r.source_kind !== "dynamic-corpus");
console.log(`Compiled ${rows.length} → research/golden/compiled/golden.json`);
console.log(`  draft remaining: ${rows.filter((r) => r.status === "draft").length}`);
console.log(`  missing id/q/criteria: ${missing.length}${missing.length ? " → " + missing.map((r) => r.id || "?").join(",") : ""}`);
console.log(`  should_fire w/ no must_have: ${noMust.length}${noMust.length ? " → " + noMust.map((r) => r.id).join(",") : ""}`);
console.log(`  out-of-range weights: ${badWeights.length}${badWeights.length ? " → " + [...new Set(badWeights)].join(",") : ""}`);
console.log(`  invalid source_kind: ${badSourceKinds.length}${badSourceKinds.length ? " → " + badSourceKinds.map((r) => r.id).join(",") : ""}`);
console.log(`  freshness-sensitive w/ no horizon: ${missingFreshnessHorizon.length}${missingFreshnessHorizon.length ? " → " + missingFreshnessHorizon.map((r) => r.id).join(",") : ""}`);
console.log(`  citation-gated w/ no sources: ${citationGatedWithoutSources.length}${citationGatedWithoutSources.length ? " → " + citationGatedWithoutSources.map((r) => r.id).join(",") : ""}`);
