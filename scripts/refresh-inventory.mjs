#!/usr/bin/env node
// refresh-inventory.mjs — regenerate the three service inventory snapshots under inventory/.
//
//   node scripts/refresh-inventory.mjs
//
// Plain Node 20+ (global fetch, node:fs only — no deps). Reads .env at the repo
// root for LUMENLOOP_API_KEY / ALGOLIA_APPLICATION_ID / ALGOLIA_API_KEY.
//
// Guarantees:
//   - Deterministic output: object keys sorted recursively, tool/skill arrays
//     sorted by name, so diffs are meaningful.
//   - Idempotent: a file is rewritten only if its content (ignoring the
//     top-level `fetchedAt`) actually changed; back-to-back runs produce zero diff.
//   - No key material in outputs: every .env value (including the Algolia app id,
//     which would otherwise appear in hostnames) is asserted absent from every
//     output before writing; URLs use `{ALGOLIA_APPLICATION_ID}` placeholders.
//
// Authored config (NOT fetched — preserved verbatim across refreshes):
//   LUMENLOOP_PARTNER_TOOLS / LUMENLOOP_PARTNER_SKILLS — the partner-lane names
//   hidden from the list endpoints (the union quirk, research/services/lumenloop.md);
//   validated against GET /v1/me counts every run so drift fails loudly.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { fetchJson, parseEnvFile, sortDeep } from "./lib/shared.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const INVENTORY_DIR = join(ROOT, "inventory");

// ---------------------------------------------------------------------------
// Authored config — Lumenloop partner lane
// ---------------------------------------------------------------------------
// GET /v1/tools and GET /v1/skills hide partner-tier items even with a partner
// key. These names come from research/services/lumenloop.md (verified live
// 2026-07-01); the script unions them with the list endpoints and asserts the
// tool union count equals GET /v1/me `tools.available`.
const LUMENLOOP_BASE = "https://api.lumenloop.com/v1";
const LUMENLOOP_PARTNER_TOOLS = ["list_my_research", "request_research", "research_result"];

// ---------------------------------------------------------------------------
// Stellar Docs (Algolia) — index name for the settings drift probe
// ---------------------------------------------------------------------------
const STELLAR_DOCS_INDEX = "crawler_Stellar Docs - Docusaurus";

// .env parser + JSON fetch + deep key sort live in scripts/lib/shared.mjs
// (shared with scripts/check-skills-drift.mjs; this file's behavior is canonical).
const ENV = { ...parseEnvFile(join(ROOT, ".env")), ...process.env };

function requireEnv(name) {
  const value = ENV[name];
  if (!value) throw new Error(`missing required env var ${name} (set it in .env)`);
  return value;
}

// ---------------------------------------------------------------------------
// Deterministic serialization + idempotent writes + secret scrubbing
// ---------------------------------------------------------------------------
function stableStringify(value) {
  return `${JSON.stringify(sortDeep(value), null, 2)}\n`;
}

const SECRET_VALUES = Object.entries(parseEnvFile(join(ROOT, ".env")))
  .filter(([, v]) => v && v.length >= 6)
  .map(([k, v]) => [k, v]);

function assertNoSecrets(fileName, text) {
  for (const [name, value] of SECRET_VALUES) {
    if (text.includes(value)) {
      throw new Error(`refusing to write ${fileName}: output contains the value of ${name}`);
    }
  }
}

function writeInventory(fileName, candidate) {
  const path = join(INVENTORY_DIR, fileName);
  const next = stableStringify(candidate);
  assertNoSecrets(fileName, next);
  if (existsSync(path)) {
    try {
      const existing = JSON.parse(readFileSync(path, "utf8"));
      const existingNormalized = { ...existing, fetchedAt: candidate.fetchedAt };
      if (stableStringify(existingNormalized) === next) {
        console.log(`inventory/${fileName}: unchanged (kept fetchedAt ${existing.fetchedAt})`);
        return;
      }
    } catch {
      // unreadable/invalid existing file — fall through and rewrite
    }
  }
  writeFileSync(path, next);
  console.log(`inventory/${fileName}: written`);
}

// ---------------------------------------------------------------------------
// fetch helpers (fetchJson imported from ./lib/shared.mjs)
// ---------------------------------------------------------------------------
async function lumenloopGet(path, apiKey) {
  const body = await fetchJson(`${LUMENLOOP_BASE}${path}`, {
    headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
    label: `lumenloop ${path}`,
  });
  if (body.success !== true) {
    throw new Error(`lumenloop ${path}: envelope error ${body.code ?? ""} ${body.error ?? ""}`);
  }
  return body.data;
}

const HTTP_METHODS = new Set(["get", "post", "put", "patch", "delete", "head", "options"]);

function countOperations(openapi) {
  let count = 0;
  for (const pathItem of Object.values(openapi.paths ?? {})) {
    for (const key of Object.keys(pathItem)) if (HTTP_METHODS.has(key)) count += 1;
  }
  return count;
}

// ---------------------------------------------------------------------------
// Lumenloop
// ---------------------------------------------------------------------------
async function refreshLumenloop() {
  const apiKey = requireEnv("LUMENLOOP_API_KEY");

  const [toolList, me, skillList, changelog, openapi] = await Promise.all([
    lumenloopGet("/tools"), // keyless list: guest lane only (hides partner tools)
    lumenloopGet("/me", apiKey),
    lumenloopGet("/skills", apiKey), // lists partner skills but marks them available:false
    lumenloopGet("/changelog"),
    // Raw OpenAPI 3.1 document (keyless, NOT enveloped — plain fetch, not lumenloopGet).
    // Covers the 18 guest tool-invoke paths + account/discovery endpoints only; the 3
    // partner tools are absent by design (same hidden-lane quirk as /v1/tools).
    fetchJson(`${LUMENLOOP_BASE}/openapi.json`, { label: "lumenloop /openapi.json" }),
  ]);

  const listedToolNames = (toolList.tools ?? []).map((t) => t.name);
  const toolNames = [...new Set([...listedToolNames, ...LUMENLOOP_PARTNER_TOOLS])].sort();

  const available = me?.tools?.available;
  if (toolNames.length !== available) {
    throw new Error(
      `lumenloop tool union has ${toolNames.length} tools but /v1/me reports ${available} available — ` +
        `update LUMENLOOP_PARTNER_TOOLS in scripts/refresh-inventory.mjs (the list endpoint hides partner tools).`,
    );
  }

  const listedSet = new Set(listedToolNames);
  const tools = await Promise.all(
    toolNames.map(async (name) => {
      const detail = await lumenloopGet(`/tools/${name}`, apiKey);
      return { ...detail, listed_in_catalog: listedSet.has(name) };
    }),
  );
  tools.sort((a, b) => a.name.localeCompare(b.name));

  // Skills: metadata only (never zip/file contents). The list marks partner-set
  // skills available:false even with a partner key; the detail endpoint is the
  // truth — union the same way, storing only file paths from the detail.
  const skills = await Promise.all(
    (skillList.skills ?? []).map(async (entry) => {
      const detail = await lumenloopGet(`/skills/${entry.name}`, apiKey);
      return {
        name: entry.name,
        set: entry.set,
        tier: entry.tier,
        description: entry.description,
        listed_available: entry.available,
        detail_available: true,
        files: (detail.files ?? []).map((f) => f.path).sort(),
      };
    }),
  );
  skills.sort((a, b) => a.name.localeCompare(b.name));

  const entries = changelog.entries ?? [];
  const latest = entries.reduce((a, b) => (!a || (b.date ?? "") > (a.date ?? "") ? b : a), null);

  writeInventory("lumenloop.json", {
    service: "lumenloop",
    fetchedAt: new Date().toISOString(),
    source: {
      base: LUMENLOOP_BASE,
      tools: `${LUMENLOOP_BASE}/tools`,
      toolDetail: `${LUMENLOOP_BASE}/tools/{name}`,
      me: `${LUMENLOOP_BASE}/me`,
      skills: `${LUMENLOOP_BASE}/skills`,
      changelog: `${LUMENLOOP_BASE}/changelog`,
      openapi: `${LUMENLOOP_BASE}/openapi.json`,
      authEnv: "LUMENLOOP_API_KEY",
      research: "research/services/lumenloop.md",
    },
    quirk:
      "GET /v1/tools and GET /v1/skills hide (or mark unavailable) partner-tier items even with a partner key. " +
      "This inventory unions the list endpoints with per-name detail fetches and validates the tool count against GET /v1/me tools.available.",
    changelogCursor: latest
      ? { date: latest.date, title: latest.title, breaking: latest.breaking ?? false }
      : null,
    changelogEntryCount: changelog.count ?? entries.length,
    me: {
      tier: me.tier,
      lane: me.lane,
      limits: me.limits,
      tools: me.tools,
    },
    toolCount: tools.length,
    tools,
    skillCount: skills.length,
    skills,
    // Full raw OpenAPI 3.1 spec, embedded like stellar-light's. Guest-lane only:
    // 18 POST /tools/{name} invoke paths + account/discovery endpoints; the 3
    // partner tools never appear here (see `quirk`) — `tools` above is the union truth.
    openapiVersion: openapi.info?.version ?? null,
    openapiOperationCount: countOperations(openapi),
    openapi,
  });

  return {
    toolCount: tools.length,
    partnerToolCount: tools.filter((t) => !t.listed_in_catalog).length,
    skillCount: skills.length,
    openapiOperationCount: countOperations(openapi),
  };
}

// ---------------------------------------------------------------------------
// Stellar Light / Scout
// ---------------------------------------------------------------------------
const STELLAR_LIGHT_BASE = "https://stellarlight.xyz";

async function refreshStellarLight() {
  const [openapi, status, changelog] = await Promise.all([
    fetchJson(`${STELLAR_LIGHT_BASE}/api/openapi.json`),
    fetchJson(`${STELLAR_LIGHT_BASE}/api/status`),
    fetchJson(`${STELLAR_LIGHT_BASE}/api/changelog?limit=1`),
  ]);

  const operationCount = countOperations(openapi);

  // Strip per-request/telemetry volatility so back-to-back runs are stable and
  // diffs reflect contract changes, not traffic. dataSources row counts /
  // snapshot dates churn daily (e.g. the Electric Capital snapshot) — keep only
  // which corpora EXIST; freshness belongs to the live /api/status call, and
  // letting it into the inventory would page the drift check every day.
  const { generatedAt: _g, usage: _u, ...statusSnapshot } = status;
  if (Array.isArray(statusSnapshot.dataSources)) {
    statusSnapshot.dataSources = statusSnapshot.dataSources.map(({ name }) => ({ name }));
  }

  writeInventory("stellar-light.json", {
    service: "stellar-light",
    fetchedAt: new Date().toISOString(),
    source: {
      base: STELLAR_LIGHT_BASE,
      openapi: `${STELLAR_LIGHT_BASE}/api/openapi.json`,
      status: `${STELLAR_LIGHT_BASE}/api/status`,
      changelog: `${STELLAR_LIGHT_BASE}/api/changelog`,
      auth: "none (keyless, read-only)",
      research: "research/services/stellar-light.md",
    },
    openapiVersion: openapi.info?.version ?? null,
    operationCount,
    openapi,
    status: statusSnapshot,
    statusNote:
      "volatile fields (generatedAt, usage, dataSources counts/dates/notes) stripped by scripts/refresh-inventory.mjs",
    changelogLatest: (changelog.entries ?? [])[0] ?? null,
    changelogEntryCount: changelog.meta?.total ?? null,
  });

  return { operationCount };
}

// ---------------------------------------------------------------------------
// Stellar Docs (Algolia)
// ---------------------------------------------------------------------------
async function refreshStellarDocs() {
  const appId = requireEnv("ALGOLIA_APPLICATION_ID");
  const apiKey = requireEnv("ALGOLIA_API_KEY");
  const settingsPath = `/1/indexes/${encodeURIComponent(STELLAR_DOCS_INDEX)}/settings`;

  const settings = await fetchJson(`https://${appId}-dsn.algolia.net${settingsPath}`, {
    headers: {
      "X-Algolia-Application-Id": appId,
      "X-Algolia-API-Key": apiKey,
    },
    label: "algolia index settings",
  });

  writeInventory("stellar-docs.json", {
    service: "stellar-docs",
    fetchedAt: new Date().toISOString(),
    source: {
      // Hostname templated so the output never contains the .env app-id value.
      settings: `https://{ALGOLIA_APPLICATION_ID}-dsn.algolia.net${settingsPath}`,
      authEnv: ["ALGOLIA_APPLICATION_ID", "ALGOLIA_API_KEY"],
      research: "research/services/stellar-docs-algolia.md",
    },
    index: STELLAR_DOCS_INDEX,
    settings,
  });

  return {};
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------
async function main() {
  mkdirSync(INVENTORY_DIR, { recursive: true });
  const [lumenloop, stellarLight] = await Promise.all([
    refreshLumenloop(),
    refreshStellarLight(),
    refreshStellarDocs(),
  ]);
  console.log(
    `done: lumenloop ${lumenloop.toolCount} tools (${lumenloop.partnerToolCount} partner, hidden from /v1/tools) + ${lumenloop.skillCount} skills + openapi (${lumenloop.openapiOperationCount} ops); ` +
      `stellar-light ${stellarLight.operationCount} ops; stellar-docs index settings`,
  );
}

main().catch((err) => {
  console.error(`refresh-inventory failed: ${err.message}`);
  process.exit(1);
});
