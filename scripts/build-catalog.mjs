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
// Exposure filtering — build-time, data-driven (ADR-0003; supersedes the
// runtime deny-list of ADR-0002). The manifest IS the exposed surface: an
// entry is either emitted (callable/readable) or it does not exist to
// consumers. Exclusion reasons live HERE and in ADRs — never in emitted
// entries, never as runtime policy. Every exclusion list below is guarded by
// a fail-loud drift check so an upstream rename/removal breaks the build
// instead of silently changing the surface.
// ---------------------------------------------------------------------------

/** Lumenloop account-mutation surfaces — excluded if they ever appear in inventory. */
const LUMENLOOP_ACCOUNT_OP_RE = /(^|_)(key|keys|webhook|webhooks|topup|top_?up)(_|$)/;

// request_research is the paid deep-research trigger — excluded until the
// budget-gate + dedup feature is deliberately built (PLAN §8: off by default).
// Named explicitly (not just via the metered flag) so an upstream re-pricing
// cannot silently expose it.
const EXCLUDED_LUMENLOOP_OPS = new Set(["request_research"]);

/** True when a lumenloop tool must not be emitted: paid/metered, account
 *  mutation, or explicitly excluded by name. */
function lumenloopOpExcluded(tool) {
  return (
    tool.metered === true ||
    EXCLUDED_LUMENLOOP_OPS.has(tool.name) ||
    LUMENLOOP_ACCOUNT_OP_RE.test(tool.name)
  );
}

// Scout write/side-effecting endpoints — excluded (exact method+path):
//  POST /api/feedback                 submits feedback upstream
//  POST /api/partners/submit-listing  creates a DRAFT partner account / claim
//                                     request reviewed by the Stellar Light team
//  POST /api/partners/assistant       surfaced partners are logged as leads for
//                                     the weekly partner digest (per upstream
//                                     OpenAPI); scout.matchPartners is the
//                                     side-effect-free ranking alternative
// POST /api/partners/match and /api/partners/onboard stay exposed: their
// OpenAPI descriptions declare pure AI ranking/extraction over published
// partners ("nothing is invented", persistence happens only via the separate
// submit-listing endpoint) — no write or logging is documented.
const EXCLUDED_SCOUT_OPS = new Set([
  "POST /api/feedback",
  "POST /api/partners/submit-listing",
  "POST /api/partners/assistant"
]);

// Drift guard: exclusions are exact-match data, so an upstream rename/removal
// must break the build (stale exclusion = a write endpoint may have moved),
// not silently stop matching.
function assertScoutExclusionsResolve(openapi) {
  const present = new Set();
  for (const [path, pathItem] of Object.entries(openapi.paths)) {
    for (const method of HTTP_METHODS) {
      if (pathItem[method]) present.add(`${method.toUpperCase()} ${path}`);
    }
  }
  const stale = [...EXCLUDED_SCOUT_OPS].filter((k) => !present.has(k));
  if (stale.length > 0) {
    throw new Error(
      `EXCLUDED_SCOUT_OPS no longer present in the scout OpenAPI: ${stale.join(", ")}. ` +
        `Upstream renamed or removed them — reconcile the exclusion list in build-catalog.mjs.`
    );
  }
}

function assertLumenloopExclusionsResolve(inv) {
  const names = new Set(inv.tools.map((t) => t.name));
  const stale = [...EXCLUDED_LUMENLOOP_OPS].filter((n) => !names.has(n));
  if (stale.length > 0) {
    throw new Error(
      `EXCLUDED_LUMENLOOP_OPS no longer present in the lumenloop inventory: ${stale.join(", ")}. ` +
        `Upstream renamed or removed them — reconcile the exclusion list in build-catalog.mjs.`
    );
  }
}

// ---------------------------------------------------------------------------
// Retired skills — exclusion as DATA (ADR-0003; decision 2026-07-03).
// The Lumenloop API-onboarding skills teach RAW HTTP/REST access (Bearer
// llmcp_ auth, key minting, rate limits, the REST response envelope). They are
// redundant AND misleading here: a model calling `execute` reaches Lumenloop
// only through the wrapped `lumenloop.*` sandbox globals — no network, secrets
// stay host-side, and the envelope is {ok,data}, not the REST shape these
// skills describe. Bodies stay in the ecosystem-skills mirror as the harvest
// source for operation-description enrichment (Solo todo 825); they are simply
// never emitted — no skill entry, no sections.
const RETIRED_ONBOARDING_SKILLS = new Set([
  "lumenloop-api-billing",
  "lumenloop-api-connect",
  "lumenloop-api-integrate",
  "lumenloop-api-keys",
  "lumenloop-api-query",
  "lumenloop-api-research",
  "lumenloop-mcp-connect"
]);

// Refresh-safety guard: the retirement is pinned to upstream skill NAMES, so an
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
        `An upstream sync renamed or removed them — reconcile the exclusion list in build-catalog.mjs ` +
        `(retire the new name, or drop the entry if the skill is gone) so nothing silently un-retires.`
    );
  }
}

// Lumenloop serves 14 skills of its own via /v1/skills (metadata only; bodies
// are zips). They are NOT emitted: every one duplicates a canonical skills.*
// mirror entry — one skill, one id (ADR-0003 kills the lumenloop.skill.* twin
// namespace entirely). Guard the duplication assumption loudly: a NEW
// upstream-served skill with no mirror counterpart must break the build (mirror
// it via ecosystem-skills/update.sh, or exclude it here with a reason), not
// vanish silently.
function assertLumenloopSkillsMirrored(inv, skillsManifest) {
  const mirrorNames = new Set(
    skillsManifest.sources.flatMap((s) => s.skills.map((sk) => sk.name))
  );
  const unmirrored = inv.skills.map((s) => s.name).filter((n) => !mirrorNames.has(n));
  if (unmirrored.length > 0) {
    throw new Error(
      `Lumenloop /v1/skills serves skills with no ecosystem-skills mirror counterpart: ` +
        `${unmirrored.join(", ")}. Mirror them (ecosystem-skills/update.sh) or exclude them ` +
        `here with a reason — API-served skills are never emitted directly (ADR-0003).`
    );
  }
}

// Description notes shared with build-super-spec.mjs — see that module for
// rationale (single source so manifest and in-sandbox spec cannot drift).
import {
  LUMENLOOP_DESCRIPTION_NOTES,
  SCOUT_DESCRIPTION_NOTES,
  scoutRefRewrites,
  rewriteScoutRefs
} from "./description-notes.mjs";

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
// Lumenloop — one entry per exposed tool (exclusions filtered at build time;
// API-served skills are never emitted — see assertLumenloopSkillsMirrored)
// ---------------------------------------------------------------------------

function buildLumenloop(inv) {
  const entries = [];
  const origin = inv.source.base.replace(/\/v1$/, ""); // https://api.lumenloop.com
  const consumedNotes = new Set();

  for (const tool of inv.tools) {
    if (lumenloopOpExcluded(tool)) continue;
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
        `LUMENLOOP_DESCRIPTION_NOTES key "${key}" matched no exposed lumenloop tool name — orphaned note ` +
          `(upstream renamed/removed the tool, or it is now excluded?); update scripts/description-notes.mjs`
      );
    }
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
  // Rewrite the upstream OpenAPI's raw-REST cross-references to callable
  // scout.<op> names (map derived from this same spec) and strip markdown —
  // scout is the only source whose descriptions carry `**`/backticks and dead
  // "/api/..." pointers the sandbox can never call. See description-notes.mjs.
  const refPairs = scoutRefRewrites(openapi);

  for (const [path, pathItem] of Object.entries(openapi.paths)) {
    for (const method of HTTP_METHODS) {
      const op = pathItem[method];
      if (!op) continue;
      const httpMethod = method.toUpperCase();
      if (EXCLUDED_SCOUT_OPS.has(`${httpMethod} ${path}`)) continue;
      const opId = op.operationId ?? `${method}_${slugify(path)}`;
      const rawDescription = [op.summary, op.description]
        .filter(Boolean)
        .join(". ")
        .replace(/\.\.\s/g, ". ");
      const description = plainText(rewriteScoutRefs(rawDescription, refPairs));
      const note = SCOUT_DESCRIPTION_NOTES[opId];
      if (note !== undefined) consumedNotes.add(opId);
      entries.push({
        id: `scout.${opId}`,
        service: "scout",
        kind: "operation",
        description: [description || opId, note ? plainText(note) : undefined]
          .filter(Boolean)
          .join("\n\n"),
        inputSchema: scoutInputSchema(op, pathItem, openapi),
        outputSchema: scoutOutputSchema(op, openapi),
        transport: { type: "http", method: httpMethod, path, base },
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
      // Retired skills are not emitted at all — no skill entry, no sections
      // (ADR-0003; the auditable record is RETIRED_ONBOARDING_SKILLS above +
      // the ADR, not a manifest entry). Bodies stay in the mirror as the
      // description-harvest source.
      if (RETIRED_ONBOARDING_SKILLS.has(skill.name)) continue;

      const skillDir = `ecosystem-skills/skills/${source.id}/${skill.name}`;
      const skillId = `skills.${source.id}.${skill.name}`;
      const raw = readText(`${skillDir}/SKILL.md`);
      const { attrs, body } = parseFrontmatter(raw);
      const bodyLines = body.split("\n");

      // 1) the whole-skill entry
      entries.push({
        ...skillEntryBase(source.id, skill.name, source, syncedAt),
        id: skillId,
        kind: "skill",
        description: attrs.description || firstParagraph(bodyLines, 0) || skill.name,
        transport: { type: "file", path: `${skillDir}/SKILL.md` }
      });

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
  assertLumenloopExclusionsResolve(lumenloop);
  assertLumenloopSkillsMirrored(lumenloop, skillsManifest);
  assertScoutExclusionsResolve(stellarLight.openapi);

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
  // Transparency: name what the build filtered out (no silent surface changes).
  const excludedLumenloop = lumenloop.tools.filter(lumenloopOpExcluded).map((t) => t.name);
  console.log(`catalog/manifest.json — ${entries.length} entries`);
  for (const [key, count] of Object.entries(counts).sort()) console.log(`  ${key}: ${count}`);
  console.log(
    `  excluded at build: lumenloop ops [${excludedLumenloop.join(", ")}], ` +
      `scout ops [${[...EXCLUDED_SCOUT_OPS].join(", ")}], ` +
      `retired skills [${[...RETIRED_ONBOARDING_SKILLS].join(", ")}], ` +
      `lumenloop-served skill metadata (${lumenloop.skills.length}, all mirrored)`
  );
}

main();
