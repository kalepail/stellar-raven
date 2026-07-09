#!/usr/bin/env node
import { appendFileSync } from "node:fs";
import { listFindingFiles, parseFinding } from "./improvements-lib.mjs";

const AUTH_PROBE_HOSTS = {
  LUMENLOOP_API_KEY: "api.lumenloop.com",
};

const today = new Date().toISOString().slice(0, 10);
const appendDrafts = process.argv.includes("--append-drafts");
const findings = listFindingFiles().map(parseFinding);
const probed = findings.filter((finding) => finding.frontmatter.status !== "fixed-upstream" && finding.frontmatter.probe);
const fixed = [];
const recurring = [];
const inconclusive = [];
const failed = [];

for (const finding of probed) {
  const { id, probe } = finding.frontmatter;
  try {
    const result = await runProbe(probe);
    if (result.ok) {
      recurring.push({ finding, result });
      console.log(`${id}: recurring (${result.summary})`);
      if (appendDrafts) appendRecurrenceDraft(finding, result.summary);
    } else if (result.inconclusive) {
      inconclusive.push({ finding, result });
      console.log(`${id}: inconclusive (${result.summary})`);
    } else {
      fixed.push({ finding, result });
      console.log(`${id}: fixed-candidate (${result.summary})`);
    }
  } catch (err) {
    failed.push({ finding, err });
    console.error(`${id}: probe error: ${err.message}`);
  }
}

console.log(
  `probe summary: ${recurring.length} recurring, ${fixed.length} fixed-candidate, ${inconclusive.length} inconclusive, ${failed.length} errors, ${probed.length} run`,
);

if (failed.length) process.exitCode = 1;

async function runProbe(probe) {
  if (probe.type !== "http-text") throw new Error(`unsupported probe type ${probe.type}`);
  const headers = { "user-agent": "stellar-raven-improvements-probe" };
  if (probe.authEnv) {
    const expectedHost = AUTH_PROBE_HOSTS[probe.authEnv];
    const target = new URL(probe.url);
    if (!expectedHost || target.origin !== `https://${expectedHost}`) {
      throw new Error(`auth probe target is not approved for ${probe.authEnv}`);
    }
    const token = process.env[probe.authEnv];
    if (!token) {
      return {
        ok: false,
        inconclusive: true,
        summary: `missing host credential ${probe.authEnv}`,
      };
    }
    headers.authorization = `Bearer ${token}`;
  }
  if (probe.body !== undefined) headers["content-type"] = "application/json";
  const res = await fetch(probe.url, {
    method: probe.method ?? "GET",
    headers,
    body: probe.body,
    redirect: probe.authEnv ? "error" : "follow",
    signal: AbortSignal.timeout(15_000),
  });
  const body = await res.text();
  const expect = probe.expect ?? {};
  const checks = [];
  if (expect.status !== undefined) {
    const statusOk = res.status === expect.status;
    const statusSummary = `status ${res.status} ${statusOk ? "==" : "!="} ${expect.status}`;
    if (!statusOk) return { ok: false, inconclusive: true, summary: statusSummary };
    checks.push({ ok: true, summary: statusSummary });
  }
  for (const needle of expect.contains ?? []) {
    checks.push({
      ok: body.includes(needle),
      summary: `contains ${JSON.stringify(needle)}: ${body.includes(needle)}`,
    });
  }
  for (const needle of expect.excludes ?? []) {
    checks.push({
      ok: !body.includes(needle),
      summary: `excludes ${JSON.stringify(needle)}: ${!body.includes(needle)}`,
    });
  }
  const ok = checks.every((check) => check.ok);
  return { ok, summary: checks.map((check) => check.summary).join("; ") };
}

function appendRecurrenceDraft(finding, summary) {
  appendFileSync(
    finding.file,
    `\n<!-- recurrence-draft ${today}: probe still reproduces finding (${summary}) -->\n`,
  );
}
