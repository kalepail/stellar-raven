#!/usr/bin/env node
/**
 * build-catalog.mjs — deterministic catalog builder (PLAN §2, offline).
 *
 * Reads the three inventory snapshots (inventory/*.json) + the bundled skills
 * mirror (ecosystem-skills/) and emits catalog/manifest.json — the unified
 * index the MCP `search` tool ranks. Zero network, zero dependencies.
 *
 * Determinism: entries sorted by id, object keys sorted recursively,
 * generatedAt derived from the NEWEST input snapshot timestamp (never wall
 * clock) — running twice on the same inputs yields byte-identical output.
 *
 * The entry shape is validated end-to-end by src/catalog/types.ts
 * (catalogSchema) in test/catalog.test.ts; this script stays plain JS so it
 * runs with `node` alone.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
// Loaded via native type stripping (Node >= 23.6) — the same way
// eval/run-routing.mjs imports src/catalog/search.ts. Still zero deps.
import { extractKeywords } from "../src/catalog/extract-keywords.ts";
import { tokenize } from "../src/catalog/vendor/search-scoring.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_PATH = join(ROOT, "catalog", "manifest.json");

const readJson = (p) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));
const readText = (p) => readFileSync(join(ROOT, p), "utf8");

// ---------------------------------------------------------------------------
// Operation keywords (todo 824 items 4+5, M3/M4): descriptions are prose, so
// schema-level vocabulary — property names and enum values — plus the docs
// page-title snapshot are lexically invisible to the search scorer. Distill
// them into the same low-weight `keywords` field skill sections carry
// (KEYWORD_BLEND damping, scoring.ts lever 4). Two noise controls, both
// measured necessary (a naive schema-prose version regressed extended strict
// top1 74→71 and skills top5 23→22 on 2026-07-03): only NAMES and ENUMS are
// harvested (no schema description prose), and tokens shared across a large
// fraction of the same service's operations (pagination/envelope
// boilerplate: page, offset, total, …) are dropped by a document-frequency
// filter — shared vocabulary distinguishes nothing and rescues wrong ops
// into the gated tier.
// ---------------------------------------------------------------------------

/** Collect property names and enum values from a JSON schema subtree. */
function schemaTextParts(schema, out = []) {
  if (!schema || typeof schema !== "object") return out;
  if (Array.isArray(schema)) {
    for (const item of schema) schemaTextParts(item, out);
    return out;
  }
  for (const [key, value] of Object.entries(schema)) {
    if (key === "properties" && value && typeof value === "object" && !Array.isArray(value)) {
      for (const [prop, sub] of Object.entries(value)) {
        out.push(prop);
        schemaTextParts(sub, out);
      }
    } else if (key === "enum" && Array.isArray(value)) {
      for (const v of value) if (typeof v === "string") out.push(v);
    } else if (value && typeof value === "object") {
      schemaTextParts(value, out);
    }
  }
  return out;
}

/**
 * Fraction of a service's ops sharing a token before it is considered
 * boilerplate. 0.3: an envelope field on every op is dropped; a field
 * shared by 2–3 related ops (of 12+) survives.
 */
const OP_KEYWORD_MAX_DF = 0.3;

/**
 * Attach `keywords` to each operation entry of ONE service. Non-operation
 * entries pass through untouched. `extraBodiesById` adds service-specific
 * vocabulary sources (docs page titles), which join the schema tokens under
 * the SAME document-frequency filter: a routing keyword is only useful when
 * it distinguishes this op from its siblings ("muxed" appears on one docs
 * op and survives; "contract" appears on most and is dropped).
 */
function attachOperationKeywords(entries, extraBodiesById = new Map(), { cap } = {}) {
  const ops = entries.filter((e) => e.kind === "operation");
  const tokenSetById = new Map(
    ops.map((e) => [
      e.id,
      new Set(
        tokenize(
          [
            ...schemaTextParts(e.inputSchema),
            ...schemaTextParts(e.outputSchema),
            ...(extraBodiesById.get(e.id) ?? [])
          ].join("\n")
        )
      )
    ])
  );
  const df = new Map();
  for (const set of tokenSetById.values()) {
    for (const t of set) df.set(t, (df.get(t) ?? 0) + 1);
  }
  const maxDf = Math.max(1, Math.floor(ops.length * OP_KEYWORD_MAX_DF));
  return entries.map((entry) => {
    const tokens = tokenSetById.get(entry.id);
    if (!tokens) return entry;
    const distinctive = [...tokens].filter((t) => (df.get(t) ?? 0) <= maxDf);
    const keywords = extractKeywords(distinctive.join(" "), {
      exclude: [entry.id, entry.service, entry.kind, entry.description],
      ...(cap !== undefined ? { cap } : {})
    });
    return keywords.length > 0 ? { ...entry, keywords } : entry;
  });
}

/**
 * Per-op page-title bodies for stellarDocs (todo 824 item 5): titles from
 * inventory/stellar-docs-titles.json scoped by each op's clientFilter URL
 * prefixes. Whole-corpus ops (no prefix filter) get none — vocabulary shared
 * by the whole surface distinguishes nothing.
 */
function stellarDocsTitleExtras(entries, titlesSnapshot) {
  const out = new Map();
  for (const entry of entries) {
    const prefixes = entry.transport?.algolia?.clientFilter?.prefixesAnyOf;
    if (!Array.isArray(prefixes) || prefixes.length === 0) continue;
    const pathPrefixes = prefixes.map((p) => p.replace(/^https?:\/\/[^/]+/, ""));
    const titles = titlesSnapshot.titles
      .filter((t) => pathPrefixes.some((p) => t.path.startsWith(p)))
      .map((t) => t.title);
    if (titles.length > 0) out.set(entry.id, [titles.join("\n")]);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Policy: the deny-list is data (PLAN §4). Machine-checkable, lives here.
// ---------------------------------------------------------------------------

/** Lumenloop account-mutation surfaces — deny if they ever appear in inventory. */
const LUMENLOOP_ACCOUNT_OP_RE = /(^|_)(key|keys|webhook|webhooks|topup|top_?up)(_|$)/;

function lumenloopPolicy(tool) {
  if (tool.name === "request_research") {
    return {
      allow: false,
      denyReason:
        "metered paid call — disabled at launch (PLAN §8: request_research off by default; enable behind budget gate + dedup)"
    };
  }
  if (LUMENLOOP_ACCOUNT_OP_RE.test(tool.name)) {
    return {
      allow: false,
      denyReason: "account-mutation endpoint (keys/webhooks/topup) — deny-listed per PLAN §4"
    };
  }
  return { allow: true, denyReason: null };
}

function scoutPolicy(method, path) {
  if (method === "POST" && path === "/api/feedback") {
    return {
      allow: false,
      denyReason: "write-endpoint (submits feedback upstream) — deny-listed per PLAN §4"
    };
  }
  if (method === "POST" && path === "/api/partners/submit-listing") {
    return {
      allow: false,
      denyReason:
        "write-endpoint — creates a DRAFT partner account (or a claim request on an existing profile) reviewed by the Stellar Light team; deny-listed per PLAN §4"
    };
  }
  if (method === "POST" && path === "/api/partners/assistant") {
    return {
      allow: false,
      denyReason:
        "side-effecting — surfaced partners are logged as leads for the weekly partner digest (per upstream OpenAPI description); use POST /api/partners/match for side-effect-free ranking"
    };
  }
  // POST /api/partners/match and /api/partners/onboard stay allowed: their
  // OpenAPI descriptions declare pure AI ranking/extraction over published
  // partners ("nothing is invented", persistence happens only via the
  // separate submit-listing endpoint) — no write or logging is documented.
  return { allow: true, denyReason: null };
}

// ---------------------------------------------------------------------------
// Retired skills — deny-list as DATA (CLAUDE.md rule; decision 2026-07-03).
// The Lumenloop API-onboarding skills teach RAW HTTP/REST access (Bearer
// llmcp_ auth, key minting, rate limits, the REST response envelope). They are
// redundant AND misleading here: a model calling `execute` reaches Lumenloop
// only through the wrapped `lumenloop.*` sandbox globals — no network, secrets
// stay host-side, and the envelope is {ok,data}, not the REST shape these
// skills describe. Bodies stay in the ecosystem-skills mirror as the harvest
// source for operation-description enrichment (Solo todo 825).
const RETIRED_ONBOARDING_SKILLS = new Set([
  "lumenloop-api-billing",
  "lumenloop-api-connect",
  "lumenloop-api-integrate",
  "lumenloop-api-keys",
  "lumenloop-api-query",
  "lumenloop-api-research",
  "lumenloop-mcp-connect"
]);
const RETIRED_SKILL_DENY_REASON =
  "API-onboarding skill (raw HTTP/REST auth, key management, rate limits) — redundant with the wrapped lumenloop.* sandbox operations and misleading in-sandbox (no network, {ok,data} envelope); retired from exposure 2026-07-03, body retained in mirror as description-harvest source";

// Mirror-side (skills.*) policy: retire the onboarding skills by exact terminal
// name (only Lumenloop sources carry these names; other sources are untouched).
function mirrorSkillPolicy(skillName) {
  return RETIRED_ONBOARDING_SKILLS.has(skillName)
    ? { allow: false, denyReason: RETIRED_SKILL_DENY_REASON }
    : { allow: true, denyReason: null };
}

// Inventory-side (lumenloop.skill.*) policy: every one of the 14 API-served
// skills DUPLICATES a canonical skills.* mirror entry — store.ts resolves the
// `lumenloop.skill.X` alias straight to the mirror body (the metadata entry has
// transport:null and is bypassed on the read path), so this entry only ever
// double-listed the skill in search. Deny all 14 to collapse to one hit each:
// retired onboarding skills carry the retirement reason, surviving playbooks a
// de-dup reason. The store.ts alias stays as back-compat resolution.
const DEDUP_SKILL_DENY_REASON =
  "duplicate of the canonical skills.* mirror entry — the lumenloop.skill.* alias resolves to the mirror body via store.ts, so this inventory entry only double-listed the skill in search; de-dup 2026-07-03";
function lumenloopInventorySkillPolicy(skillName) {
  return RETIRED_ONBOARDING_SKILLS.has(skillName)
    ? { allow: false, denyReason: RETIRED_SKILL_DENY_REASON }
    : { allow: false, denyReason: DEDUP_SKILL_DENY_REASON };
}

// Refresh-safety guard: the deny-list is pinned to upstream skill NAMES, so an
// ecosystem-skills re-sync (update.sh) that RENAMES or REMOVES a retired skill
// would silently un-retire it (the stale name would stop matching and the skill
// would leak back into the exposed catalog). Fail the build LOUDLY instead —
// forcing a human to reconcile RETIRED_ONBOARDING_SKILLS with the new mirror.
function assertRetirementNamesResolve(skillsManifest) {
  const mirrorNames = new Set(
    skillsManifest.sources.flatMap((s) => s.skills.map((sk) => sk.name))
  );
  const stale = [...RETIRED_ONBOARDING_SKILLS].filter((n) => !mirrorNames.has(n));
  if (stale.length > 0) {
    throw new Error(
      `RETIRED_ONBOARDING_SKILLS names no longer present in the skills mirror: ${stale.join(", ")}. ` +
        `An upstream sync renamed or removed them — reconcile the deny-list in build-catalog.mjs ` +
        `(retire the new name, or drop the entry if the skill is gone) so nothing silently un-retires.`
    );
  }
}

// Description notes shared with build-super-spec.mjs — see that module for
// rationale (single source so manifest and in-sandbox spec cannot drift).
import { LUMENLOOP_DESCRIPTION_NOTES, SCOUT_DESCRIPTION_NOTES } from "./description-notes.mjs";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Recursively sort object keys (arrays keep order) for stable output. */
function sortKeysDeep(value) {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value && typeof value === "object") {
    const out = {};
    for (const key of Object.keys(value).sort()) out[key] = sortKeysDeep(value[key]);
    return out;
  }
  return value;
}

/** Resolve internal $refs against a root doc, inlining them (cycle-safe). */
function inlineRefs(schema, root, seen = new Set()) {
  if (Array.isArray(schema)) return schema.map((s) => inlineRefs(s, root, seen));
  if (!schema || typeof schema !== "object") return schema;
  if (typeof schema.$ref === "string") {
    const ref = schema.$ref;
    if (!ref.startsWith("#/") || seen.has(ref)) return { ...schema };
    let target = root;
    for (const seg of ref.slice(2).split("/")) {
      const key = seg.replace(/~1/g, "/").replace(/~0/g, "~");
      if (!target || typeof target !== "object") return { ...schema };
      target = target[key];
    }
    if (target === undefined) return { ...schema };
    return inlineRefs(target, root, new Set(seen).add(ref));
  }
  const out = {};
  for (const [key, value] of Object.entries(schema)) out[key] = inlineRefs(value, root, seen);
  return out;
}

/** Collapse whitespace, strip markdown links/emphasis/backticks for descriptions. */
function plainText(markdown) {
  return markdown
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text, max = 200) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > max * 0.6 ? lastSpace : max).trimEnd()}…`;
}

function slugify(text) {
  return (
    plainText(text)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

/** First paragraph after `startIndex` in `lines` (skips blanks, stops at blank/heading). */
function firstParagraph(lines, startIndex) {
  let i = startIndex;
  while (i < lines.length && lines[i].trim() === "") i++;
  const para = [];
  while (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith("#")) {
    para.push(lines[i]);
    i++;
  }
  return plainText(para.join(" "));
}

/** Minimal frontmatter parser — supports the flat `key: value` blocks the mirror uses. */
function parseFrontmatter(content) {
  if (!content.startsWith("---")) return { attrs: {}, body: content };
  const end = content.indexOf("\n---", 3);
  if (end === -1) return { attrs: {}, body: content };
  const block = content.slice(content.indexOf("\n") + 1, end);
  const body = content.slice(content.indexOf("\n", end + 1) + 1);
  const attrs = {};
  let currentKey = null;
  for (const line of block.split("\n")) {
    const keyMatch = line.match(/^([A-Za-z][A-Za-z0-9_-]*):\s?(.*)$/);
    if (keyMatch) {
      currentKey = keyMatch[1];
      attrs[currentKey] = keyMatch[2].trim().replace(/^["']|["']$/g, "");
    } else if (currentKey && line.trim() !== "") {
      attrs[currentKey] = `${attrs[currentKey]} ${line.trim()}`.trim();
    }
  }
  return { attrs, body };
}

// ---------------------------------------------------------------------------
// Lumenloop — 21 operations + 14 API skills (metadata only)
// ---------------------------------------------------------------------------

function buildLumenloop(inv) {
  const entries = [];
  const origin = inv.source.base.replace(/\/v1$/, ""); // https://api.lumenloop.com
  const consumedNotes = new Set();

  for (const tool of inv.tools) {
    const descriptionParts = [tool.description];
    if (tool.when_to_use) descriptionParts.push(`When to use: ${tool.when_to_use}`);
    if (tool.returns) descriptionParts.push(`Returns: ${tool.returns}`);
    const note = LUMENLOOP_DESCRIPTION_NOTES[tool.name];
    if (note !== undefined) {
      descriptionParts.push(note);
      consumedNotes.add(tool.name);
    }
    entries.push({
      id: `lumenloop.${tool.name}`,
      service: "lumenloop",
      kind: "operation",
      description: descriptionParts.join("\n\n"),
      inputSchema: tool.input_schema ?? null,
      outputSchema: tool.output_schema ?? null,
      transport: { type: "http", method: "POST", path: `/v1/tools/${tool.name}`, base: origin },
      auth: "partner-key",
      cost: tool.metered ? "metered" : "free",
      policy: lumenloopPolicy(tool),
      provenance: {
        source: inv.source.tools,
        fetchedAt: inv.fetchedAt,
        tier: tool.tier
      }
    });
  }

  // Fail loud on orphaned notes (mirrors the scout check below): notes are
  // exact-match data keyed on lumenloop tool names, so an upstream
  // rename/removal must break the build, not silently drop catalog guidance.
  for (const key of Object.keys(LUMENLOOP_DESCRIPTION_NOTES)) {
    if (!consumedNotes.has(key)) {
      throw new Error(
        `LUMENLOOP_DESCRIPTION_NOTES key "${key}" matched no lumenloop tool name — orphaned note ` +
          `(upstream renamed/removed the tool?); update scripts/description-notes.mjs`
      );
    }
  }

  // API-served skills: metadata only (bodies are not mirrored) — kind `skill`,
  // NOT sectioned; provenance says exactly that.
  for (const skill of inv.skills) {
    entries.push({
      id: `lumenloop.skill.${skill.name}`,
      service: "lumenloop",
      kind: "skill",
      description: skill.description || skill.name,
      inputSchema: null,
      outputSchema: null,
      transport: null,
      auth: skill.tier === "partner" ? "partner-key" : "none",
      cost: "free",
      policy: lumenloopInventorySkillPolicy(skill.name),
      provenance: {
        source: inv.source.skills,
        fetchedAt: inv.fetchedAt,
        tier: skill.tier,
        note: "metadata-only: skill bodies are served as zips by the Lumenloop API and are not mirrored locally; no sections were generated",
        files: skill.files ?? []
      }
    });
  }

  return entries;
}

// ---------------------------------------------------------------------------
// Stellar Light / Scout — one entry per OpenAPI operation
// ---------------------------------------------------------------------------

const HTTP_METHODS = ["get", "post", "put", "patch", "delete"];

function scoutInputSchema(op, pathItem, openapi) {
  const properties = {};
  const required = [];
  const parameters = [...(pathItem.parameters ?? []), ...(op.parameters ?? [])];
  for (const rawParam of parameters) {
    const param = inlineRefs(rawParam, openapi);
    if (!param?.name) continue;
    const schema = param.schema ? inlineRefs(param.schema, openapi) : { type: "string" };
    if (param.description && !schema.description) schema.description = param.description;
    properties[param.name] = schema;
    if (param.required) required.push(param.name);
  }
  const bodySchema = op.requestBody?.content?.["application/json"]?.schema;
  if (bodySchema) {
    const inlined = inlineRefs(bodySchema, openapi);
    if (inlined.type === "object" && inlined.properties) {
      for (const [name, schema] of Object.entries(inlined.properties)) {
        properties[name] = schema;
      }
      for (const name of inlined.required ?? []) required.push(name);
    } else {
      properties.body = inlined;
      required.push("body");
    }
  }
  if (Object.keys(properties).length === 0) return { type: "object", properties: {} };
  const schema = { type: "object", properties };
  if (required.length > 0) schema.required = [...new Set(required)].sort();
  return schema;
}

function scoutOutputSchema(op, openapi) {
  const schema = op.responses?.["200"]?.content?.["application/json"]?.schema;
  return schema ? inlineRefs(schema, openapi) : null;
}

function buildScout(inv) {
  const entries = [];
  const openapi = inv.openapi;
  const base = openapi.servers?.[0]?.url ?? "https://stellarlight.xyz";
  const consumedNotes = new Set();

  for (const [path, pathItem] of Object.entries(openapi.paths)) {
    for (const method of HTTP_METHODS) {
      const op = pathItem[method];
      if (!op) continue;
      const httpMethod = method.toUpperCase();
      const opId = op.operationId ?? `${method}_${slugify(path)}`;
      const description = [op.summary, op.description]
        .filter(Boolean)
        .join(". ")
        .replace(/\.\.\s/g, ". ");
      const note = SCOUT_DESCRIPTION_NOTES[opId];
      if (note !== undefined) consumedNotes.add(opId);
      entries.push({
        id: `scout.${opId}`,
        service: "scout",
        kind: "operation",
        description: [description || opId, note].filter(Boolean).join("\n\n"),
        inputSchema: scoutInputSchema(op, pathItem, openapi),
        outputSchema: scoutOutputSchema(op, openapi),
        transport: { type: "http", method: httpMethod, path, base },
        auth: "none",
        cost: "free",
        policy: scoutPolicy(httpMethod, path),
        provenance: {
          source: `${base}/api/openapi.json`,
          fetchedAt: inv.fetchedAt,
          openapiVersion: inv.openapiVersion
        }
      });
    }
  }
  // Fail loud on orphaned notes: the notes are exact-match data keyed on scout
  // operationIds, so an upstream rename/removal must break the build, not
  // silently drop catalog guidance.
  for (const key of Object.keys(SCOUT_DESCRIPTION_NOTES)) {
    if (!consumedNotes.has(key)) {
      throw new Error(
        `SCOUT_DESCRIPTION_NOTES key "${key}" matched no scout operationId — orphaned note ` +
          `(upstream renamed/removed the operation?); update scripts/description-notes.mjs`
      );
    }
  }
  return entries;
}

// ---------------------------------------------------------------------------
// Stellar Docs (Algolia) — 12 authored operations from specs/stellar-docs.json
// (Lane D, todo 796; mapping recipe: research/services/stellar-docs-spec-design.md §7)
// ---------------------------------------------------------------------------

function buildStellarDocs(spec) {
  const { backend, catalogHints } = spec;
  return spec.operations.map((op) => ({
    id: op.id, // "stellarDocs.search_docs" etc — verbatim from the spec
    service: spec.service,
    kind: catalogHints.kind,
    description: op.returns ? `${op.description}\n\nReturns: ${op.returns}` : op.description,
    inputSchema: op.params, // spec params are already a JSON Schema object
    outputSchema: null,
    // Transport = shared backend block + this op's exact Algolia query mapping.
    // Phase 3's adapter consumes `algolia` (paramMap/fixedParams/
    // conditionalParams/clientFilter/derivedQuery) as-is.
    transport: {
      type: "algolia",
      index: backend.index,
      endpoint: backend.endpoint,
      hosts: backend.hosts,
      applicationIdEnv: backend.applicationIdEnv,
      apiKeyEnv: backend.apiKeyEnv,
      retry: backend.retry,
      baseParams: backend.baseParams,
      constraints: backend.constraints,
      algolia: op.algolia
    },
    auth: catalogHints.auth,
    cost: catalogHints.cost,
    policy: { allow: true, denyReason: null },
    provenance: {
      source: catalogHints.provenanceSource,
      fetchedAt: spec.authoredAt,
      spec: "specs/stellar-docs.json",
      note: "authored spec-as-data operation (Lane D todo 796), live-verified against the Algolia index — not a fetched descriptor"
    }
  }));
}

// ---------------------------------------------------------------------------
// Ecosystem skills mirror — skill + per-##-section + per-extra-file entries
// ---------------------------------------------------------------------------

function skillEntryBase(sourceId, skillName, manifestSource, syncedAt) {
  return {
    service: "skills",
    inputSchema: null,
    outputSchema: null,
    auth: "none",
    cost: "free",
    policy: { allow: true, denyReason: null }, // PLAN §8: all skills exposed read-only
    provenance: {
      source: manifestSource.url,
      fetchedAt: syncedAt,
      commit: manifestSource.commit
    }
  };
}

function buildSkills(manifest) {
  const entries = [];
  const syncedAt = manifest.synced_at;

  for (const source of manifest.sources) {
    for (const skill of source.skills) {
      const skillDir = `ecosystem-skills/skills/${source.id}/${skill.name}`;
      const skillId = `skills.${source.id}.${skill.name}`;
      const raw = readText(`${skillDir}/SKILL.md`);
      const { attrs, body } = parseFrontmatter(raw);
      const bodyLines = body.split("\n");

      // 1) the whole-skill entry
      const policy = mirrorSkillPolicy(skill.name);
      entries.push({
        ...skillEntryBase(source.id, skill.name, source, syncedAt),
        id: skillId,
        kind: "skill",
        description: attrs.description || firstParagraph(bodyLines, 0) || skill.name,
        transport: { type: "file", path: `${skillDir}/SKILL.md` },
        policy
      });

      // Retired skills expose no section/file entries — the whole-skill entry
      // above stands as the auditable, deny-listed record (with denyReason).
      if (!policy.allow) continue;

      // 2) one entry per `##` section of SKILL.md
      const usedSlugs = new Set();
      for (let i = 0; i < bodyLines.length; i++) {
        const line = bodyLines[i];
        if (!line.startsWith("## ")) continue;
        const heading = plainText(line.slice(3));
        let slug = slugify(heading);
        for (let n = 2; usedSlugs.has(slug); n++) slug = `${slugify(heading)}-${n}`;
        usedSlugs.add(slug);
        const para = firstParagraph(bodyLines, i + 1);
        // Section body = everything until the next `##` heading; distilled
        // into low-weight `keywords` so mid-section content (error codes,
        // flags, function names) is lexically searchable (todo 810).
        let sectionEnd = i + 1;
        while (sectionEnd < bodyLines.length && !bodyLines[sectionEnd].startsWith("## ")) {
          sectionEnd++;
        }
        const sectionId = `${skillId}#${slug}`;
        const description = truncate(para ? `${heading} — ${para}` : heading, 200);
        const keywords = extractKeywords(bodyLines.slice(i + 1, sectionEnd).join("\n"), {
          exclude: [sectionId, description, "skills", "skill-section"]
        });
        entries.push({
          ...skillEntryBase(source.id, skill.name, source, syncedAt),
          id: sectionId,
          kind: "skill-section",
          description,
          ...(keywords.length > 0 ? { keywords } : {}),
          transport: { type: "file", path: `${skillDir}/SKILL.md`, section: heading }
        });
      }

      // 3) each additional .md file treated like a section
      for (const file of skill.files ?? []) {
        if (file.path === "SKILL.md" || !file.path.endsWith(".md")) continue;
        const fileRaw = readText(`${skillDir}/${file.path}`);
        const fileLines = parseFrontmatter(fileRaw).body.split("\n");
        const headingLine = fileLines.find((l) => /^#{1,2} /.test(l));
        const heading = headingLine ? plainText(headingLine.replace(/^#+ /, "")) : file.path;
        const headingIndex = headingLine ? fileLines.indexOf(headingLine) + 1 : 0;
        const para = firstParagraph(fileLines, headingIndex);
        const fileEntryId = `${skillId}#file:${file.path}`;
        const fileDescription = truncate(para ? `${heading} — ${para}` : heading, 200);
        // Whole file body → low-weight keywords (same rationale as sections).
        const fileKeywords = extractKeywords(fileLines.join("\n"), {
          exclude: [fileEntryId, fileDescription, "skills", "skill-section"]
        });
        entries.push({
          ...skillEntryBase(source.id, skill.name, source, syncedAt),
          id: fileEntryId,
          kind: "skill-section",
          description: fileDescription,
          ...(fileKeywords.length > 0 ? { keywords: fileKeywords } : {}),
          transport: { type: "file", path: `${skillDir}/${file.path}` }
        });
      }
    }
  }
  return entries;
}

// ---------------------------------------------------------------------------
// Assemble
// ---------------------------------------------------------------------------

function main() {
  const lumenloop = readJson("inventory/lumenloop.json");
  const stellarLight = readJson("inventory/stellar-light.json");
  const stellarDocsSpec = readJson("specs/stellar-docs.json");
  const stellarDocsTitles = readJson("inventory/stellar-docs-titles.json");
  const skillsManifest = readJson("ecosystem-skills/MANIFEST.json");
  assertRetirementNamesResolve(skillsManifest);

  const stellarDocsEntries = buildStellarDocs(stellarDocsSpec);
  const entries = [
    ...attachOperationKeywords(buildLumenloop(lumenloop)),
    ...attachOperationKeywords(buildScout(stellarLight)),
    // Docs ops carry page-title vocabulary (hundreds of distinct frequency-1
    // tokens post-DF) — the default 64 cap truncates the alphabetical tail,
    // so they get a roomier cap. Still bounded: 12 ops × ≤256 short tokens.
    ...attachOperationKeywords(
      stellarDocsEntries,
      stellarDocsTitleExtras(stellarDocsEntries, stellarDocsTitles),
      { cap: 256 }
    ),
    ...buildSkills(skillsManifest)
  ].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));

  const ids = new Set();
  for (const entry of entries) {
    if (ids.has(entry.id)) throw new Error(`duplicate catalog id: ${entry.id}`);
    ids.add(entry.id);
  }

  // generatedAt = newest input snapshot (deterministic; never wall clock).
  // Includes stellar-docs-titles.json's fetchedAt: its page-title vocabulary
  // feeds the manifest `keywords`, so a titles-only refresh must move the stamp.
  const generatedAt = [
    lumenloop.fetchedAt,
    stellarLight.fetchedAt,
    stellarDocsSpec.authoredAt,
    stellarDocsTitles.fetchedAt,
    skillsManifest.synced_at
  ].reduce((max, ts) => (Date.parse(ts) > Date.parse(max) ? ts : max));

  // The stellarDocs corpus taxonomy is deliberately NOT copied here: it lives
  // in specs/stellar-docs.json and reaches the model via the super spec
  // (build-super-spec.mjs reads it from the spec directly). A manifest-level
  // `docs.taxonomy` copy existed until 2026-07-03 but had no consumer —
  // neither the scorer, the adapters, nor codemode.catalog() read it.
  const catalog = sortKeysDeep({ version: 1, generatedAt, entries });
  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, `${JSON.stringify(catalog, null, 2)}\n`);

  const counts = {};
  for (const entry of entries) {
    counts[`${entry.service}/${entry.kind}`] = (counts[`${entry.service}/${entry.kind}`] ?? 0) + 1;
  }
  const denied = entries.filter((e) => !e.policy.allow).map((e) => e.id);
  console.log(`catalog/manifest.json — ${entries.length} entries`);
  for (const [key, count] of Object.entries(counts).sort()) console.log(`  ${key}: ${count}`);
  console.log(`  denied (${denied.length}): ${denied.join(", ")}`);
}

main();
