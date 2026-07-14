#!/usr/bin/env node
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import {
  GITHUB_REPO_RE,
  oneLineTitle,
  parseFinding,
  readIntake,
  resolveIntake,
  section,
  writeFindingFrontmatter,
} from "./improvements-lib.mjs";

const args = parseArgs(process.argv.slice(2));
const RAVEN_REPO = "kalepail/stellar-raven";
const HANDOFF_TEMPLATE = "upstream-improvement-ready.yml";
if (!args.file) {
  console.error("usage: node scripts/improvements-file-issue.mjs --file improvements/...md [--repo owner/name] [--dry-run] [--render-body-file /tmp/body.md]");
  process.exit(2);
}

const finding = parseFinding(path.resolve(args.file));
const repo = args.repo ?? resolveRepo(finding);
if (!GITHUB_REPO_RE.test(repo)) {
  console.error(`invalid repo '${repo}'; expected owner/repo`);
  process.exit(2);
}
const title = `${finding.frontmatter.id}: ${oneLineTitle(finding)}`;
const body = renderBody(finding);

if (args.dryRun) {
  console.log(`# ${title}\n\n${body}`);
  process.exit(0);
}

if (args.renderBodyFile) {
  writeFileSync(args.renderBodyFile, body);
  console.log(args.renderBodyFile);
  process.exit(0);
}

if (["reported-upstream", "declined-upstream", "fixed-upstream"].includes(finding.frontmatter.status)) {
  console.error(
    `${finding.frontmatter.id}: status is ${finding.frontmatter.status}; dedupe and live-recheck before filing a new issue`,
  );
  console.error("Use --dry-run or --render-body-file to inspect the issue body without posting.");
  process.exit(2);
}

const dir = mkdtempSync(path.join(tmpdir(), "improvement-issue-"));
const bodyFile = path.join(dir, "body.md");
writeFileSync(bodyFile, body);

const result = spawnSync("gh", [
  "issue",
  "create",
  "--repo",
  repo,
  "--title",
  title,
  "--body-file",
  bodyFile,
], { encoding: "utf8" });

if (result.status !== 0) {
  process.stderr.write(result.stderr);
  process.stderr.write(result.stdout);
  process.exit(result.status ?? 1);
}

function resolveRepo(finding) {
  const resolution = resolveIntake(finding, readIntake());
  if (resolution.kind === "repo") return resolution.repo;
  if (resolution.kind === "unclear") {
    console.error(`${finding.frontmatter.id}: intake is unclear (${resolution.reason}); pass --repo only after manual triage`);
    process.exit(2);
  }
  if (resolution.kind === "mixed") {
    console.error(`${finding.frontmatter.id}: intake is mixed (${resolution.reason}); add a finding override or pass --repo after manual triage`);
    process.exit(2);
  }
  console.error(`${finding.frontmatter.id}: intake unresolved (${resolution.reason}); update improvements/intake.json`);
  process.exit(2);
}

const url = result.stdout.trim();
console.log(url);
writeFindingFrontmatter(finding, {
  status: "reported-upstream",
  evidenceAppend: `upstream issue filed ${new Date().toISOString().slice(0, 10)}: ${url}`,
});
const indexResult = spawnSync(process.execPath, [path.join(import.meta.dirname, "improvements-index.mjs")], {
  encoding: "utf8",
});
if (indexResult.status !== 0) {
  process.stderr.write(indexResult.stderr);
  process.stderr.write(indexResult.stdout);
  console.error("issue was filed and the finding was updated, but improvements/INDEX.md regeneration failed");
  process.exit(indexResult.status ?? 1);
}

function renderBody(finding) {
  const fm = finding.frontmatter;
  const sourceUrl = `https://github.com/${RAVEN_REPO}/blob/main/${finding.relPath}`;
  const sourceCommit = latestSourceCommit(finding.relPath);
  const immutableSourceUrl = sourceCommit
    ? `https://github.com/${RAVEN_REPO}/blob/${sourceCommit}/${finding.relPath}`
    : null;
  const handoffUrl = `https://github.com/${RAVEN_REPO}/issues/new?template=${HANDOFF_TEMPLATE}&title=${encodeURIComponent(`[upstream-ready] ${fm.id}: `)}`;
  return [
    "## Finding",
    "",
    scrub(section(finding.body, "Finding")),
    "",
    "## Evidence",
    "",
    scrub(section(finding.body, "Evidence")),
    "",
    "Additional recorded evidence:",
    "",
    ...fm.evidence.map((entry) => scrub(entry)).filter(Boolean).map((entry) => `- ${entry}`),
    "",
    "## Recommendation",
    "",
    scrub(section(finding.body, "Recommendation")),
    "",
    "## Source Record",
    "",
    `This was found by the downstream Raven eval/improvements loop and recorded as ${fm.id} (${fm.service}, discovered ${fm.discovered}).`,
    "",
    `Public source record: [${finding.relPath}](${sourceUrl})`,
    ...(immutableSourceUrl ? ["", `Immutable source snapshot: [${sourceCommit.slice(0, 12)}](${immutableSourceUrl})`] : []),
    "",
    "## Resolution Handoff",
    "",
    "When a fix is deployed, please link the resolving issue or PR to the source record above and notify Raven through:",
    "",
    handoffUrl,
    "",
    "Include the finding id, resolving issue/PR, deployed version or timestamp, and the smallest live recheck. Raven independently verifies the upstream surface before changing the finding to `fixed-upstream`; issue closure or a merged PR alone is not treated as proof. After a distinct reviewer repeats the live check, the active finding is retired to Raven's resolved ledger while the immutable snapshot remains available.",
    "",
  ].join("\n");
}

function latestSourceCommit(relPath) {
  const result = spawnSync("git", ["log", "-1", "--format=%H", "--", relPath], { encoding: "utf8" });
  return result.status === 0 ? result.stdout.trim() : "";
}

function scrub(text) {
  return String(text)
    .split("\n")
    .filter((line) => !/\b(Solo|scratchpad|todo \d+|workflow\s+wf_[\w-]+|comment \d+)/i.test(line))
    .join("\n")
    .replace(/solo:\/\/\S+/gi, "[internal coordination record]")
    .replace(/\/Users\/[^\s)]+/g, "[local path elided]");
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--dry-run") out.dryRun = true;
    else if (arg === "--file") out.file = argv[++i];
    else if (arg === "--repo") out.repo = argv[++i];
    else if (arg === "--render-body-file") out.renderBodyFile = argv[++i];
  }
  return out;
}
