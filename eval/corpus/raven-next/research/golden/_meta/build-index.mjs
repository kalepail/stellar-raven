#!/usr/bin/env node
// Regenerate research/golden/_meta/CATALOG.md from the question frontmatter.
// Lean scalar/inline-list extraction (the frontmatter is simple + flat); the Phase-2
// compiler (compiled/golden.json) will reuse this walk. Run: node research/golden/_meta/build-index.mjs
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const GOLDEN = join(dirname(fileURLToPath(import.meta.url)), "..");
const CATS = readdirSync(GOLDEN).filter(
  (d) => !d.startsWith("_") && d !== "compiled" && statSync(join(GOLDEN, d)).isDirectory(),
);

const strip = (v) => v.replace(/\s+#.*$/, "").trim();
const scalar = (fm, k) => {
  const m = fm.match(new RegExp(`^${k}:\\s*(.*)$`, "m"));
  return m ? strip(m[1]) : "";
};
const inlineList = (fm, k) => {
  const m = fm.match(new RegExp(`^${k}:\\s*\\[([^\\]]*)\\]`, "m"));
  return m ? m[1].split(",").map((s) => s.trim()).filter(Boolean) : [];
};

const rows = [];
for (const cat of CATS) {
  for (const f of readdirSync(join(GOLDEN, cat)).filter((f) => f.endsWith(".md"))) {
    const fm = readFileSync(join(GOLDEN, cat, f), "utf8").split("---")[1] || "";
    rows.push({
      id: scalar(fm, "id"),
      file: `${cat}/${f}`,
      category: cat,
      query_type: scalar(fm, "query_type"),
      difficulty: scalar(fm, "difficulty"),
      fresh: scalar(fm, "freshness_sensitive"),
      should_fire: scalar(fm, "should_fire"),
      status: scalar(fm, "status"),
      expected: inlineList(fm, "expected_cards"),
    });
  }
}

const tally = (key) => {
  const m = {};
  for (const r of rows) m[r[key]] = (m[r[key]] || 0) + 1;
  return m;
};
const cardCounts = {};
for (const r of rows) for (const c of r.expected) cardCounts[c] = (cardCounts[c] || 0) + 1;

let out = `# CATALOG — golden-question index (generated)\n\n`;
out += `> Regenerate: \`node research/golden/_meta/build-index.mjs\`. Do not hand-edit.\n\n`;
out += `**Total questions: ${rows.length}** across ${CATS.length} categories.\n\n`;

out += `## Per-category counts\n\n| Category | Count |\n|---|---|\n`;
const byCat = tally("category");
for (const c of CATS) out += `| ${c} | ${byCat[c] || 0} |\n`;
out += `| **total** | **${rows.length}** |\n\n`;

out += `## query_type distribution\n\n| query_type | count | % |\n|---|---|---|\n`;
for (const [k, v] of Object.entries(tally("query_type")).sort((a, b) => b[1] - a[1]))
  out += `| ${k} | ${v} | ${((v / rows.length) * 100).toFixed(1)}% |\n`;

out += `\n## expected_cards coverage (Axis A)\n\n| card | # questions |\n|---|---|\n`;
for (const [k, v] of Object.entries(cardCounts).sort((a, b) => b[1] - a[1]))
  out += `| ${k} | ${v} |\n`;

out += `\n## should_fire / status\n\n`;
out += `should_fire: ${JSON.stringify(tally("should_fire"))} · status: ${JSON.stringify(tally("status"))}\n`;

for (const cat of CATS) {
  out += `\n## ${cat}\n\n| id | query_type | difficulty | fresh | should_fire | expected_cards |\n|---|---|---|---|---|---|\n`;
  for (const r of rows.filter((r) => r.category === cat).sort((a, b) => a.id.localeCompare(b.id)))
    out += `| ${r.id} | ${r.query_type} | ${r.difficulty} | ${r.fresh} | ${r.should_fire} | ${r.expected.join(" ")} |\n`;
}

writeFileSync(join(GOLDEN, "_meta", "CATALOG.md"), out);
console.log(`Wrote CATALOG.md — ${rows.length} questions, ${Object.keys(cardCounts).length} distinct expected cards.`);
