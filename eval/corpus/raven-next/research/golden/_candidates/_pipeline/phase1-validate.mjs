import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const WORKLIST = path.join(ROOT, "research/golden/_candidates/_pipeline/phase1-worklist.json");
const CARDS = path.join(ROOT, "research/golden/_meta/CARDS.md");
const CANDIDATES = path.join(ROOT, "research/golden/_candidates/2026-06-29-jitsu-net-new-questions.md");

const validCards = new Set(
  [...fs.readFileSync(CARDS, "utf8").matchAll(/`([a-z][a-z0-9_]+)`/g)]
    .map((m) => m[1])
    .filter((id) =>
      /^(stellar_docs|scout|lumenloop|perplexity|parallel)_/.test(id),
    ),
);

const candidateIds = [
  ...fs.readFileSync(CANDIDATES, "utf8").matchAll(/^- \*\*(q-[^*]+)\*\*/gm),
].map((m) => m[1]);

function frontmatter(file) {
  const s = fs.readFileSync(file, "utf8");
  const m = s.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) throw new Error(`${file}: missing frontmatter`);
  return m[1];
}

function scalar(fm, key) {
  const m = fm.match(new RegExp(`^${key}:\\s*(.*)$`, "m"));
  return m ? m[1].trim() : null;
}

function arrayValue(fm, key) {
  const value = scalar(fm, key);
  if (!value) return [];
  const m = value.match(/^\[(.*)\]$/);
  if (!m) return [];
  return m[1].split(",").map((x) => x.trim()).filter(Boolean);
}

function sectionCount(fm, key) {
  const re = new RegExp(`^${key}:\\n((?:  - .*\\n?)*)`, "m");
  const m = fm.match(re);
  if (!m) return 0;
  return (m[1].match(/^  - /gm) ?? []).length;
}

function fail(errors, message) {
  errors.push(message);
}

const worklist = JSON.parse(fs.readFileSync(WORKLIST, "utf8"));
const errors = [];
const sourceIds = new Set(worklist.map((x) => x.source_id));
for (const id of candidateIds) {
  if (!sourceIds.has(id)) fail(errors, `candidate missing disposition: ${id}`);
}

const ids = new Map();
for (const file of fs.globSync("research/golden/*/q-*.md", { cwd: ROOT })) {
  const abs = path.join(ROOT, file);
  const fm = frontmatter(abs);
  const id = scalar(fm, "id");
  if (!id) fail(errors, `${file}: missing id`);
  if (ids.has(id)) fail(errors, `duplicate id ${id}: ${ids.get(id)} and ${file}`);
  ids.set(id, file);
}

const validDispositions = new Set(["RESEARCH", "DECLINE", "FOLD", "DROP"]);
for (const item of worklist) {
  if (!validDispositions.has(item.disposition)) fail(errors, `${item.source_id}: bad disposition ${item.disposition}`);
  if (item.disposition === "FOLD" && !item.fold_target_qid) fail(errors, `${item.source_id}: FOLD missing fold_target_qid`);
  if (!["RESEARCH", "DECLINE"].includes(item.disposition)) continue;
  const file = path.join(ROOT, "research/golden", item.category, `${item.id}.md`);
  if (!fs.existsSync(file)) {
    fail(errors, `${item.id}: missing draft ${path.relative(ROOT, file)}`);
    continue;
  }
  const fm = frontmatter(file);
  for (const key of ["id", "q", "category", "subcategory", "axes", "query_type", "difficulty", "expected_cards", "acceptable_cards", "forbidden_cards", "expected_service", "should_fire", "pass_threshold", "weight_profile", "status", "authored", "confidence"]) {
    if (scalar(fm, key) === null) fail(errors, `${item.id}: missing ${key}`);
  }
  if (scalar(fm, "status") !== "draft") fail(errors, `${item.id}: status must be draft`);
  if (sectionCount(fm, "must_have") === 0) fail(errors, `${item.id}: must_have empty`);
  if (sectionCount(fm, "must_avoid") === 0) fail(errors, `${item.id}: must_avoid empty`);
  for (const key of ["expected_cards", "acceptable_cards", "forbidden_cards"]) {
    for (const card of arrayValue(fm, key)) {
      if (!validCards.has(card)) fail(errors, `${item.id}: invalid ${key} card ${card}`);
    }
  }
  if (item.disposition === "DECLINE") {
    if (scalar(fm, "should_fire") !== "false") fail(errors, `${item.id}: DECLINE should_fire must be false`);
    if (scalar(fm, "weight_profile") !== "strict") fail(errors, `${item.id}: DECLINE weight_profile must be strict`);
    if (Number(scalar(fm, "pass_threshold")) < 0.8) fail(errors, `${item.id}: DECLINE pass_threshold < 0.8`);
    if (arrayValue(fm, "acceptable_cards").length !== 0) fail(errors, `${item.id}: DECLINE acceptable_cards must be []`);
  }
}

const counts = worklist.reduce((acc, x) => {
  acc[x.disposition] = (acc[x.disposition] ?? 0) + 1;
  return acc;
}, {});
if (errors.length) {
  console.error(JSON.stringify({ ok: false, counts, errors }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, candidates: candidateIds.length, worklist: worklist.length, counts }, null, 2));
