#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import {
  ALLOWED_SERVICES,
  ALLOWED_STATUSES,
  GITHUB_REPO_RE,
  IMPROVEMENTS_DIR,
  SERVICE_ORDER,
  collectIntakeRepos,
  listFindingFiles,
  parseFinding,
  readIntake,
  renderIndex,
  resolveIntake,
} from "./improvements-lib.mjs";

const AUTH_PROBE_HOSTS = {
  LUMENLOOP_API_KEY: "api.lumenloop.com",
};

const live = process.argv.includes("--live");
const statusRank = {
  proposed: 0,
  verified: 1,
  "reported-upstream": 2,
  "fixed-upstream": 3,
};

const errors = [];
const githubRefRe = /https:\/\/github\.com\/[^/\s)]+\/[^/\s)]+\/(?:issues|pull)\/\d+/i;
const dateRe = /^\d{4}-\d{2}-\d{2}$/;
const findings = [];

for (const file of listFindingFiles()) {
  let finding;
  try {
    finding = parseFinding(file);
  } catch (err) {
    errors.push(String(err.message ?? err));
    continue;
  }
  findings.push(finding);
  const fm = finding.frontmatter;
  const label = path.relative(process.cwd(), file);

  for (const key of ["id", "service", "status", "discovered", "evidence"]) {
    if (fm[key] === undefined) errors.push(`${label}: missing frontmatter field '${key}'`);
  }
  if (fm.service && !ALLOWED_SERVICES.has(fm.service)) {
    errors.push(`${label}: invalid service '${fm.service}'`);
  }
  if (fm.status && !ALLOWED_STATUSES.has(fm.status)) {
    errors.push(`${label}: invalid status '${fm.status}'`);
  }
  if (fm.discovered && !dateRe.test(fm.discovered)) {
    errors.push(`${label}: discovered must be YYYY-MM-DD`);
  }
  if (!Array.isArray(fm.evidence) || fm.evidence.length === 0) {
    errors.push(`${label}: evidence must be a non-empty list`);
  }
  if (fm.service && fm.id && !fm.id.startsWith(prefixForService(fm.service))) {
    errors.push(`${label}: id '${fm.id}' does not match service '${fm.service}'`);
  }
  if (fm.evidence?.some((entry) => githubRefRe.test(entry)) && statusRank[fm.status] < statusRank["reported-upstream"]) {
    errors.push(`${label}: evidence contains a GitHub issue/PR URL but status is '${fm.status}'`);
  }
  if (fm.recurrences !== undefined && !Array.isArray(fm.recurrences)) {
    errors.push(`${label}: recurrences must be a list when present`);
  }
  for (const [idx, recurrence] of (fm.recurrences ?? []).entries()) {
    if (!dateRe.test(recurrence.date ?? "")) {
      errors.push(`${label}: recurrences[${idx}].date must be YYYY-MM-DD`);
    }
    if (!recurrence.evidence) {
      errors.push(`${label}: recurrences[${idx}].evidence is required`);
    }
  }
  if (fm.probe !== undefined) validateProbe(label, fm.probe);
}

validateIndexFreshness(findings);
const intake = validateIntake(findings);
if (live && intake) validateLiveRepos(intake);

if (errors.length) {
  console.error(`improvements lint failed (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`improvements lint ok (${findings.length} findings${live ? ", live intake checked" : ""})`);

function prefixForService(service) {
  return {
    lumenloop: "ll-",
    "stellar-light-scout": "sls-",
    "stellar-docs": "sd-",
    skills: "sk-",
  }[service];
}

function validateProbe(label, probe) {
  if (!probe.type) errors.push(`${label}: probe.type is required`);
  if (probe.type !== "http-text") {
    errors.push(`${label}: unsupported probe.type '${probe.type}'`);
  }
  let parsedUrl;
  try {
    parsedUrl = new URL(probe.url);
  } catch {
    // Report the stable validation message below instead of parser-specific text.
  }
  if (!parsedUrl || !["http:", "https:"].includes(parsedUrl.protocol)) {
    errors.push(`${label}: probe.url must be an http(s) URL`);
  }
  if (probe.method !== undefined && !["GET", "POST"].includes(probe.method)) {
    errors.push(`${label}: probe.method must be GET or POST`);
  }
  if (probe.authEnv !== undefined) {
    const expectedHost = AUTH_PROBE_HOSTS[probe.authEnv];
    if (!expectedHost) {
      errors.push(`${label}: probe.authEnv is not an approved probe credential`);
    } else if (parsedUrl && parsedUrl.origin !== `https://${expectedHost}`) {
      errors.push(`${label}: probe.authEnv ${probe.authEnv} may only target https://${expectedHost}`);
    }
  }
  if (probe.body !== undefined) {
    try {
      JSON.parse(probe.body);
    } catch {
      errors.push(`${label}: probe.body must be valid JSON`);
    }
    if (probe.method !== "POST") {
      errors.push(`${label}: probe.body requires probe.method POST`);
    }
  }
  const expect = probe.expect;
  if (!expect || typeof expect !== "object") {
    errors.push(`${label}: probe.expect is required`);
    return;
  }
  if (expect.status !== undefined && !Number.isInteger(expect.status)) {
    errors.push(`${label}: probe.expect.status must be an integer`);
  }
  for (const key of ["contains", "excludes"]) {
    if (expect[key] !== undefined && !Array.isArray(expect[key])) {
      errors.push(`${label}: probe.expect.${key} must be a list`);
    }
  }
}

function validateIndexFreshness(findings) {
  const indexPath = path.join(IMPROVEMENTS_DIR, "INDEX.md");
  const actual = readFileSync(indexPath, "utf8");
  const expected = renderIndex(findings);
  if (actual !== expected) {
    errors.push("improvements/INDEX.md is stale; run npm run improvements:index");
  }
}

function validateIntake(findings) {
  let intake;
  try {
    intake = readIntake();
  } catch (err) {
    errors.push(`improvements/intake.json: invalid JSON or unreadable file (${err.message})`);
    return null;
  }

  const services = new Set(Object.keys(intake.services ?? {}));
  for (const service of SERVICE_ORDER) {
    if (!services.has(service)) errors.push(`improvements/intake.json: missing service '${service}'`);
  }
  for (const service of services) {
    if (!ALLOWED_SERVICES.has(service)) errors.push(`improvements/intake.json: unknown service '${service}'`);
  }

  const findingIds = new Set(findings.map((finding) => finding.frontmatter.id).filter(Boolean));
  for (const id of Object.keys(intake.findings ?? {})) {
    if (!findingIds.has(id)) {
      errors.push(`improvements/intake.json: findings override '${id}' does not match an existing finding id`);
    }
  }

  for (const { repo, source } of collectIntakeRepos(intake)) {
    if (typeof repo !== "string" || !GITHUB_REPO_RE.test(repo)) {
      errors.push(`improvements/intake.json: ${source} must be owner/repo, got '${repo}'`);
    }
  }

  for (const finding of findings) {
    const resolution = resolveIntake(finding, intake);
    if (resolution.kind === "unresolved") {
      errors.push(
        `${finding.relPath}: intake unresolved (${resolution.source}: ${resolution.reason}); add a repo, service rule, or intake: unclear`,
      );
    }
  }

  return intake;
}

function validateLiveRepos(intake) {
  const repos = [...new Set(
    collectIntakeRepos(intake)
      .map(({ repo }) => repo)
      .filter((repo) => typeof repo === "string" && GITHUB_REPO_RE.test(repo)),
  )].sort();

  for (const repo of repos) {
    const result = spawnSync("gh", ["api", "--method", "HEAD", "--include", `/repos/${repo}`], {
      encoding: "utf8",
      maxBuffer: 1024 * 1024,
    });
    const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
    if (result.status !== 0) {
      errors.push(`improvements/intake.json: stale or inaccessible repo '${repo}' (gh api HEAD /repos/${repo} failed)`);
      continue;
    }
    if (/^HTTP\/\S+\s+30[1278]\b/m.test(output) || /^location:/im.test(output)) {
      errors.push(`improvements/intake.json: stale repo string '${repo}' appears renamed or redirected`);
    }
  }
}
