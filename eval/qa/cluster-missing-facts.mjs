#!/usr/bin/env node
import { readFileSync } from "node:fs";
import path from "node:path";
import { assertNotPlaygroundQuarantine } from "../playground/artifact-contract.mjs";

const CLASSES = ["caveat", "enumeration-tail", "version-number", "cross-source corroboration", "other"];

function classifyMissingFact(text) {
  const lower = text.toLowerCase();
  if (/\b(version|v\d|protocol|p\d{2}|cap-\d+|sep-\d+|number|amount|count|limit|rank|round|total|percent|%|\d[\d,.]*)\b/.test(lower)) {
    return "version-number";
  }
  if (/\b(corroborat|cross-source|multiple sources|source comparison|verify|verified|citation|cited|evidence|according to|from both)\b/.test(lower)) {
    return "cross-source corroboration";
  }
  if (/\b(caveat|qualif|nuance|framing|as of|freshness|current|snapshot|conditional|when|unless|not always|only if|scope|tradeoff)\b/.test(lower)) {
    return "caveat";
  }
  if (/\b(list|enumerat|all\b|complete|includes?|also|omits?|missing|examples?|names?|specific projects?|other|tail|set of)\b/.test(lower)) {
    return "enumeration-tail";
  }
  return "other";
}

function resultRows(file) {
  const parsed = JSON.parse(readFileSync(file, "utf8"));
  assertNotPlaygroundQuarantine(parsed, file);
  if (!Array.isArray(parsed.rows)) throw new Error(`${file}: missing rows[]`);
  return parsed.rows;
}

function main() {
  const files = process.argv.slice(2);
  if (!files.length) {
    throw new Error("usage: node eval/qa/cluster-missing-facts.mjs <results.json> ...");
  }

  const groups = Object.fromEntries(CLASSES.map((klass) => [klass, []]));
  const perRun = [];
  for (const file of files) {
    const rows = resultRows(file);
    let factCount = 0;
    for (const row of rows) {
      for (const fact of row.verdict?.missingFacts ?? []) {
        const text = String(fact ?? "").trim();
        if (!text) continue;
        const klass = classifyMissingFact(text);
        groups[klass].push({ file: path.basename(file), id: row.id, truth: row.truth ?? null, text });
        factCount += 1;
      }
    }
    perRun.push({ file: path.basename(file), rows: rows.length, missingFacts: factCount });
  }

  const summary = {
    files: perRun,
    totalMissingFacts: Object.values(groups).reduce((sum, items) => sum + items.length, 0),
    classes: Object.fromEntries(
      CLASSES.map((klass) => [
        klass,
        {
          count: groups[klass].length,
          cases: [...new Set(groups[klass].map((item) => item.id))].sort(),
          examples: groups[klass].slice(0, 8)
        }
      ])
    )
  };

  console.log(JSON.stringify(summary, null, 2));
}

main();
