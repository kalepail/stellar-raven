#!/usr/bin/env node
/**
 * bundle-skills.mjs — bundle the ecosystem-skills mirror into a JSON module
 * the Worker can import (Workers have no fs; PLAN §3 build-time skill store).
 *
 * Reads ecosystem-skills/MANIFEST.json (the pinned mirror manifest) and emits
 * src/skills/bundle.json:
 *
 *   {
 *     "generatedAt": "<manifest.synced_at — NOT wall clock (determinism)>",
 *     "files": { "ecosystem-skills/skills/<source>/<skill>/<file>": "<content>", … }
 *   }
 *
 * Keys are repo-root-relative paths, chosen to match catalog entries'
 * `transport.path` exactly — the skills store resolves an entry's transport
 * straight into this map with no path arithmetic.
 *
 * Deterministic: sorted keys, content byte-identical to the mirror; running
 * twice yields a zero diff. Run via `npm run skills:bundle` after any
 * ecosystem-skills refresh (catalog rebuild and bundle rebuild go together).
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(root, "ecosystem-skills/MANIFEST.json"), "utf8"));

const files = {};
for (const source of manifest.sources) {
  for (const skill of source.skills) {
    for (const file of skill.files ?? []) {
      if (!file.path.endsWith(".md")) continue; // markdown only — that's the exposed surface
      const rel = `ecosystem-skills/skills/${source.id}/${skill.name}/${file.path}`;
      files[rel] = readFileSync(join(root, rel), "utf8");
    }
  }
}

const sorted = Object.fromEntries(Object.entries(files).sort(([a], [b]) => (a < b ? -1 : 1)));
const bundle = { generatedAt: manifest.synced_at, files: sorted };

const outPath = join(root, "src/skills/bundle.json");
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, `${JSON.stringify(bundle, null, 2)}\n`);

const bytes = JSON.stringify(bundle).length;
console.log(
  `bundled ${Object.keys(sorted).length} skill files (${(bytes / 1024).toFixed(0)} KB) -> src/skills/bundle.json (generatedAt ${bundle.generatedAt})`
);
