#!/usr/bin/env node
/**
 * build-super-spec.mjs — deterministic unified "super spec" builder
 * (todo 800; design rationale: research/super-spec-design.md).
 *
 * Emits specs/super-spec.json: ONE OpenAPI-3.1-STYLE document covering every
 * service this MCP fronts — lumenloop, scout, stellarDocs — plus a synthetic
 * `skills` core service. This is the document the code-shaped `search` tool
 * injects into its Dynamic Worker sandbox as `codemode.spec()` (mirroring
 * @cloudflare/codemode's openApiMcpServer), and that `execute` exposes via
 * the same `codemode.spec()` call.
 *
 * Dialect (see design doc §1):
 *  - paths keyed by namespaced callable name: `/{service}/{operation}`
 *    (e.g. "/lumenloop/search_directory", "/scout/searchProjects");
 *  - operationId = the exact catalog id ("lumenloop.search_directory") —
 *    identical to the sandbox call `lumenloop.search_directory(args)`;
 *  - standard OpenAPI shapes (summary/description/tags/parameters/
 *    requestBody/responses/components) so generic spec-grepping code works;
 *  - per-operation vendor extensions: x-service, x-policy {allow,denyReason},
 *    x-cost, x-auth, x-execute (exact sandbox call line), x-upstream (real
 *    HTTP method+path), x-algolia (stellarDocs query mapping);
 *  - spec-level x-services (per-service metadata incl. the stellarDocs
 *    backend block + measured corpus taxonomy) and x-generated (provenance,
 *    counts, size).
 *
 * Policy consistency: x-policy for every cataloged operation is copied from
 * catalog/manifest.json (the generated deny-list-as-data) — never re-derived
 * here. Lumenloop account/discovery endpoints that are NOT cataloged (no
 * sandbox fn exists) are included for honesty but always denied.
 *
 * Determinism: object keys sorted recursively, entries sorted by path,
 * generatedAt taken from the catalog manifest (itself derived from input
 * snapshots — never wall clock). Running twice yields byte-identical output
 * (asserted by test/super-spec.test.ts).
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  LUMENLOOP_DESCRIPTION_NOTES,
  SCOUT_DESCRIPTION_NOTES,
  scoutRefRewrites,
  rewriteScoutRefs
} from "./description-notes.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_PATH = join(ROOT, "specs", "super-spec.json");

const readJson = (p) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));
const readText = (p) => readFileSync(join(ROOT, p), "utf8");

// ---------------------------------------------------------------------------
// Shared helpers (kept in sync with scripts/build-catalog.mjs where noted)
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

/** MUST match scripts/build-catalog.mjs `plainText` (skills index consistency). */
function plainText(markdown) {
  return markdown
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** MUST match scripts/build-catalog.mjs `slugify` (section keys must line up). */
function slugify(text) {
  return (
    plainText(text)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

/** MUST match scripts/build-catalog.mjs `parseFrontmatter`. */
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

function firstSentence(text, max = 120) {
  const plain = plainText(text);
  const period = plain.indexOf(". ");
  const cut = period > 10 && period < max ? plain.slice(0, period + 1) : plain.slice(0, max);
  return cut.trim();
}

// ---------------------------------------------------------------------------
// Policy lookup — the catalog manifest is the single source of truth
// ---------------------------------------------------------------------------

function policyLookup(manifest) {
  const byId = new Map();
  for (const entry of manifest.entries) {
    byId.set(entry.id, { allow: entry.policy.allow, denyReason: entry.policy.denyReason });
  }
  return (id) => {
    const p = byId.get(id);
    if (!p) throw new Error(`no catalog policy for ${id} — run node scripts/build-catalog.mjs first`);
    return p;
  };
}

// ---------------------------------------------------------------------------
// lumenloop — 21 cataloged tools (18 free + 3 partner) + non-tool API surface
// ---------------------------------------------------------------------------

/** Account/billing mutation endpoints vs read-only discovery endpoints. */
const LUMENLOOP_ACCOUNT_PATH_RE = /^\/(billing|me)(\/|$)/;

function buildLumenloopPaths(inv, policyOf) {
  const paths = {};
  const consumedNotes = new Set();

  // Cataloged tools: authoritative descriptions from the inventory tools union
  // (carries when_to_use / returns), NOT the embedded OpenAPI /tools/* paths.
  for (const tool of inv.tools) {
    const id = `lumenloop.${tool.name}`;
    const policy = policyOf(id);
    const descriptionParts = [tool.description];
    if (tool.when_to_use) descriptionParts.push(`When to use: ${tool.when_to_use}`);
    if (tool.returns) descriptionParts.push(`Returns: ${tool.returns}`);
    const note = LUMENLOOP_DESCRIPTION_NOTES[tool.name];
    if (note !== undefined) {
      descriptionParts.push(note);
      consumedNotes.add(tool.name);
    }
    const op = {
      operationId: id,
      summary: firstSentence(tool.description),
      description: descriptionParts.join("\n\n"),
      tags: ["lumenloop", ...(tool.category ? [tool.category] : [])],
      requestBody: tool.input_schema
        ? {
            required: true,
            content: { "application/json": { schema: tool.input_schema } }
          }
        : undefined,
      responses: {
        200: {
          description: tool.returns ? plainText(tool.returns) : "Tool result",
          ...(tool.output_schema
            ? { content: { "application/json": { schema: tool.output_schema } } }
            : {})
        }
      },
      "x-service": "lumenloop",
      "x-policy": policy,
      "x-cost": tool.metered ? "metered" : "free",
      "x-auth": "partner-key",
      "x-upstream": { method: "POST", path: `/v1/tools/${tool.name}` },
      ...(policy.allow ? { "x-execute": `await lumenloop.${tool.name}(args)` } : {})
    };
    if (!op.requestBody) delete op.requestBody;
    paths[`/lumenloop/${tool.name}`] = { post: op };
  }

  // Fail loud on orphaned notes (mirrors scripts/build-catalog.mjs): an
  // upstream tool rename/removal must break the build, not silently drop
  // catalog guidance.
  for (const key of Object.keys(LUMENLOOP_DESCRIPTION_NOTES)) {
    if (!consumedNotes.has(key)) {
      throw new Error(
        `LUMENLOOP_DESCRIPTION_NOTES key "${key}" matched no lumenloop tool name — orphaned note ` +
          `(upstream renamed/removed the tool?); update scripts/description-notes.mjs`
      );
    }
  }

  // Non-tool API surface (account, billing, discovery): included for honesty,
  // ALWAYS denied — no sandbox fn exists for these; discovery data is already
  // in this spec / codemode.catalog() / codemode.skill.read. Schemas dropped
  // (dead weight on uncallable ops); summary + description kept greppable.
  const HTTP_METHODS = ["get", "post", "put", "patch", "delete"];
  for (const [path, pathItem] of Object.entries(inv.openapi.paths)) {
    if (path.startsWith("/tools/")) continue; // cataloged above
    for (const method of HTTP_METHODS) {
      const upstream = pathItem[method];
      if (!upstream) continue;
      const opName = upstream.operationId ?? `${method}_${slugify(path)}`;
      const denyReason = LUMENLOOP_ACCOUNT_PATH_RE.test(path)
        ? "account/billing surface (keys, webhooks, credits top-up, budget, introspection) — deny-listed per PLAN §4; never callable from the sandbox"
        : "host-side inventory/discovery surface — not exposed as a sandbox fn; the same information is in this spec, codemode.catalog(), and codemode.skill.read";
      const op = {
        operationId: `lumenloop.${opName}`,
        summary: plainText(upstream.summary ?? opName),
        ...(upstream.description ? { description: plainText(upstream.description) } : {}),
        tags: ["lumenloop"],
        "x-service": "lumenloop",
        "x-policy": { allow: false, denyReason },
        "x-cost": "free",
        "x-auth": "partner-key",
        "x-upstream": { method: method.toUpperCase(), path: `/v1${path}` }
      };
      (paths[`/lumenloop/${opName}`] ??= {})[method] = op;
    }
  }

  return paths;
}

// ---------------------------------------------------------------------------
// scout (Stellar Light) — embedded OpenAPI carried near-verbatim, re-keyed
// ---------------------------------------------------------------------------

/** Rewrite internal $refs to the namespaced components ("#/components/schemas/scout.X"). */
function namespaceRefs(node, service) {
  if (Array.isArray(node)) return node.map((n) => namespaceRefs(n, service));
  if (!node || typeof node !== "object") return node;
  const out = {};
  for (const [key, value] of Object.entries(node)) {
    if (key === "$ref" && typeof value === "string") {
      out[key] = value.replace(
        /^#\/components\/(schemas|parameters|responses|requestBodies)\//,
        `#/components/$1/${service}.`
      );
    } else {
      out[key] = namespaceRefs(value, service);
    }
  }
  return out;
}

function buildScout(inv, policyOf) {
  const openapi = inv.openapi;
  const paths = {};
  const HTTP_METHODS = ["get", "post", "put", "patch", "delete"];
  const consumedNotes = new Set();
  // MUST match scripts/build-catalog.mjs buildScout: rewrite raw-REST
  // cross-references to callable scout.<op> names and strip markdown so the
  // in-sandbox spec and the manifest present identical model-facing prose.
  const refPairs = scoutRefRewrites(openapi);

  for (const [path, pathItem] of Object.entries(openapi.paths)) {
    for (const method of HTTP_METHODS) {
      const upstream = pathItem[method];
      if (!upstream) continue;
      const opName = upstream.operationId ?? `${method}_${slugify(path)}`;
      const id = `scout.${opName}`;
      const policy = policyOf(id);
      // pathItem-level parameters are merged into the op so nothing is lost
      // when re-keying the path to the callable name.
      const parameters = [...(pathItem.parameters ?? []), ...(upstream.parameters ?? [])];
      // Same boundary guidance the catalog manifest carries (shared data map
      // in description-notes.mjs) so codemode.spec() readers see it too.
      const note = SCOUT_DESCRIPTION_NOTES[opName];
      if (note !== undefined) consumedNotes.add(opName);
      const summary = upstream.summary
        ? plainText(rewriteScoutRefs(upstream.summary, refPairs))
        : undefined;
      const cleanDescription = upstream.description
        ? plainText(rewriteScoutRefs(upstream.description, refPairs))
        : undefined;
      const description = [cleanDescription, note ? plainText(note) : undefined]
        .filter(Boolean)
        .join("\n\n");
      const op = {
        operationId: id,
        ...(summary ? { summary } : {}),
        ...(description ? { description } : {}),
        tags: ["scout", ...(upstream.tags ?? [])],
        ...(parameters.length > 0 ? { parameters: namespaceRefs(parameters, "scout") } : {}),
        ...(upstream.requestBody ? { requestBody: namespaceRefs(upstream.requestBody, "scout") } : {}),
        ...(upstream.responses ? { responses: namespaceRefs(upstream.responses, "scout") } : {}),
        "x-service": "scout",
        "x-policy": policy,
        "x-cost": "free",
        "x-auth": "none",
        "x-upstream": { method: method.toUpperCase(), path },
        ...(policy.allow ? { "x-execute": `await scout.${opName}(args)` } : {})
      };
      (paths[`/scout/${opName}`] ??= {})[method] = op;
    }
  }

  // Fail loud on orphaned notes (mirrors scripts/build-catalog.mjs): an
  // upstream rename/removal must break the build, not silently drop the
  // boundary guidance from codemode.spec().
  for (const key of Object.keys(SCOUT_DESCRIPTION_NOTES)) {
    if (!consumedNotes.has(key)) {
      throw new Error(
        `SCOUT_DESCRIPTION_NOTES key "${key}" matched no scout operationId — orphaned note ` +
          `(upstream renamed/removed the operation?); update scripts/description-notes.mjs`
      );
    }
  }

  // Namespaced components so scout $refs stay resolvable in the merged doc.
  const components = {};
  for (const [group, defs] of Object.entries(openapi.components ?? {})) {
    components[group] = {};
    for (const [name, def] of Object.entries(defs)) {
      components[group][`scout.${name}`] = namespaceRefs(def, "scout");
    }
  }

  return { paths, components, tags: openapi.tags ?? [] };
}

// ---------------------------------------------------------------------------
// stellarDocs — 12 authored spec-as-data operations (specs/stellar-docs.json)
// ---------------------------------------------------------------------------

function buildStellarDocs(spec, policyOf) {
  const paths = {};
  for (const op of spec.operations) {
    const policy = policyOf(op.id);
    paths[`/stellarDocs/${op.name}`] = {
      post: {
        operationId: op.id,
        summary: firstSentence(op.description),
        description: op.description,
        tags: ["stellarDocs"],
        requestBody: {
          required: true,
          content: { "application/json": { schema: op.params } }
        },
        responses: { 200: { description: op.returns ?? "Search result" } },
        "x-service": "stellarDocs",
        "x-policy": policy,
        "x-cost": spec.catalogHints.cost,
        "x-auth": spec.catalogHints.auth,
        // The exact Algolia query mapping the host adapter applies — kept as a
        // vendor extension so spec-grepping code can see what each intent op
        // actually does (facet filters, client-side URL-prefix filters, …).
        "x-algolia": op.algolia,
        ...(policy.allow ? { "x-execute": `await stellarDocs.${op.name}(args)` } : {})
      }
    };
  }
  return paths;
}

// ---------------------------------------------------------------------------
// skills — a synthetic core service: 3 operations, index embedded as data
// (design doc §3: judicious representation, NOT 278 paths; section-level
// discovery via a heading-list index per skill)
// ---------------------------------------------------------------------------

function buildSkillIndex(manifest, catalogManifest) {
  // Policy-aware: advertise ONLY skills/sections the catalog exposes. Retired
  // skills (deny-listed in build-catalog.mjs) have no allowed whole-skill entry
  // and no section entries, so they — and any per-section denials — drop out
  // here too. Keeps codemode.spec()'s index consistent with what read_skill
  // will actually serve (no advertised section that denies on read). Slug
  // disambiguation MUST match build-catalog.mjs so the candidate ids line up.
  const allowedIds = new Set(
    catalogManifest.entries.filter((e) => e.policy.allow).map((e) => e.id)
  );
  const index = [];
  for (const source of manifest.sources) {
    for (const skill of source.skills) {
      const skillId = `skills.${source.id}.${skill.name}`;
      if (!allowedIds.has(skillId)) continue; // retired/denied skill — not advertised
      const skillDir = `ecosystem-skills/skills/${source.id}/${skill.name}`;
      const { attrs, body } = parseFrontmatter(readText(`${skillDir}/SKILL.md`));
      const sections = [];
      const usedSlugs = new Set();
      for (const line of body.split("\n")) {
        if (!line.startsWith("## ")) continue;
        const heading = plainText(line.slice(3));
        let slug = slugify(heading);
        for (let n = 2; usedSlugs.has(slug); n++) slug = `${slugify(heading)}-${n}`;
        usedSlugs.add(slug);
        if (allowedIds.has(`${skillId}#${slug}`)) sections.push(heading);
      }
      for (const file of skill.files ?? []) {
        if (file.path === "SKILL.md" || !file.path.endsWith(".md")) continue;
        const key = `file:${file.path}`;
        if (allowedIds.has(`${skillId}#${key}`)) sections.push(key);
      }
      index.push({
        id: skillId,
        source: source.id,
        description: attrs.description || skill.name,
        sections
      });
    }
  }
  return index.sort((a, b) => (a.id < b.id ? -1 : 1));
}

function buildSkillsPaths(skillIndex) {
  const skillIds = skillIndex.map((s) => s.id);
  const sectionCount = skillIndex.reduce((n, s) => n + s.sections.length, 0);

  return {
    "/skills/list_skills": {
      get: {
        operationId: "skills.list_skills",
        summary: `List all ${skillIds.length} bundled skills (agent playbooks) with descriptions and section headings.`,
        description:
          `The full skill index is embedded RIGHT HERE in this operation's x-skill-index: ` +
          `${skillIds.length} skills across ${new Set(skillIndex.map((s) => s.source)).size} pinned upstream sources ` +
          `(${[...new Set(skillIndex.map((s) => s.source))].join(", ")}), ${sectionCount} addressable sections total. ` +
          `Each index entry: { id, source, description, sections } where sections lists '##' headings of SKILL.md ` +
          `plus 'file:<relpath>' keys for extra reference files. No separate call is needed — read x-skill-index from this spec.`,
        tags: ["skills"],
        responses: { 200: { description: "The x-skill-index array on this operation." } },
        "x-service": "skills",
        "x-policy": { allow: true, denyReason: null },
        "x-cost": "free",
        "x-auth": "none",
        "x-execute": `(await codemode.spec()).paths["/skills/list_skills"].get["x-skill-index"]`,
        "x-skill-index": skillIndex
      }
    },
    "/skills/read_skill": {
      post: {
        operationId: "skills.read_skill",
        summary: "Read one bundled skill's full SKILL.md, or only the requested sections.",
        description:
          "Delivers skill context when and as relevant: pass the exact skill id (see the enum / x-skill-index on " +
          "/skills/list_skills) and optionally a `sections` array of section headings (or their slugs) and/or " +
          "'file:<relpath>' keys to fetch only the parts you need instead of a 40 KB document. " +
          "Unknown sections fail the whole read and list what exists — names are exact-match, never fuzzy.",
        tags: ["skills"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                additionalProperties: false,
                required: ["name"],
                properties: {
                  name: {
                    type: "string",
                    description: "Exact skill id.",
                    enum: skillIds
                  },
                  sections: {
                    type: "array",
                    items: { type: "string" },
                    description:
                      "Section headings (or slugs) and/or 'file:<relpath>' keys from the skill's `sections` list in x-skill-index. Omit for the whole SKILL.md."
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description:
              "{ ok: true, id, path, content? (whole skill) | sections?: [{section, content}], availableSections } or { ok: false, error }."
          }
        },
        "x-service": "skills",
        "x-policy": { allow: true, denyReason: null },
        "x-cost": "free",
        "x-auth": "none",
        "x-execute": `await codemode.skill.read(name, { sections })`
      }
    },
    "/skills/search_skill_sections": {
      post: {
        operationId: "skills.search_skill_sections",
        summary: "Ranked lexical search over all skills and skill sections.",
        description:
          "Scores every skill and every '##' section against a short intent phrase and returns ranked hits with exact " +
          "ids (skill ids and 'skills.<source>.<name>#<section-slug>' section ids) that codemode.skill.read accepts. " +
          "Use when grepping x-skill-index headings is not enough and you want relevance ranking over descriptions too.",
        tags: ["skills"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                additionalProperties: false,
                required: ["query"],
                properties: {
                  query: { type: "string", description: "Short intent phrase, e.g. \"soroban storage patterns\"." },
                  limit: { type: "integer", minimum: 1, maximum: 50, default: 10 }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "{ ok: true, hits: [{ id, service, kind, score, description }], total }" }
        },
        "x-service": "skills",
        "x-policy": { allow: true, denyReason: null },
        "x-cost": "free",
        "x-auth": "none",
        "x-execute": `await codemode.search({ query, service: "skills" })`
      }
    }
  };
}

// ---------------------------------------------------------------------------
// Assemble
// ---------------------------------------------------------------------------

function main() {
  const lumenloop = readJson("inventory/lumenloop.json");
  const stellarLight = readJson("inventory/stellar-light.json");
  const stellarDocsSpec = readJson("specs/stellar-docs.json");
  const skillsManifest = readJson("ecosystem-skills/MANIFEST.json");
  const catalogManifest = readJson("catalog/manifest.json");
  const policyOf = policyLookup(catalogManifest);

  const scout = buildScout(stellarLight, policyOf);
  const skillIndex = buildSkillIndex(skillsManifest, catalogManifest);

  const paths = {
    ...buildLumenloopPaths(lumenloop, policyOf),
    ...scout.paths,
    ...buildStellarDocs(stellarDocsSpec, policyOf),
    ...buildSkillsPaths(skillIndex)
  };

  // operationId uniqueness — the ids double as sandbox callable names.
  const seen = new Set();
  for (const item of Object.values(paths)) {
    for (const op of Object.values(item)) {
      if (seen.has(op.operationId)) throw new Error(`duplicate operationId: ${op.operationId}`);
      seen.add(op.operationId);
    }
  }

  const serviceTags = [
    {
      name: "lumenloop",
      description:
        "Lumenloop Stellar ecosystem intelligence API: curated project directory, documents/content corpus, SCF submissions, semantic search, partner research (partner key held host-side)."
    },
    {
      name: "scout",
      description:
        "Stellar Light / Scout read-only public API: projects, repos, hackathons, builders, partners, funding/RFPs, research corpus, skills marketplace, analytics (keyless)."
    },
    {
      name: "stellarDocs",
      description:
        "Official Stellar developer docs at developers.stellar.org, searched via the Algolia DocSearch index (12 intent-named operations)."
    },
    {
      name: "skills",
      description:
        "Bundled agent-skill playbooks (ecosystem-skills mirror): list, targeted section reads, and ranked search. The skill index is embedded in /skills/list_skills x-skill-index."
    }
  ];

  const spec = {
    openapi: "3.1.0",
    info: {
      title: "stellar-raven-codemode — unified super spec",
      version: "1.0.0",
      description:
        "One spec covering every operation this MCP server can execute, across four services: lumenloop, scout " +
        "(Stellar Light), stellarDocs (Algolia-backed docs search), and skills (bundled agent playbooks). " +
        "Paths are keyed '/{service}/{operation}' and each operationId is the exact callable name: an operation " +
        "with operationId 'lumenloop.search_directory' is invoked inside the execute tool's sandbox as " +
        "`await lumenloop.search_directory(args)` — args is ONE object matching the operation's requestBody schema " +
        "(POST ops) or its parameter names (GET ops). The exact call line is on each operation as x-execute. " +
        "Every call resolves (never throws) to { ok: true, data } or { ok: false, error: { service, kind, " +
        "message } }; the 200 response schema documents `data`. Operations with x-policy.allow=false are " +
        "deny-listed: visible for completeness (denyReason says why) but refused at execution. x-cost 'metered' " +
        "marks paid calls. Auth (x-auth) is handled host-side — code never sees keys.",
      "x-generatedAt": catalogManifest.generatedAt
    },
    tags: [...serviceTags, ...scout.tags],
    paths,
    components: scout.components,
    "x-services": {
      lumenloop: {
        base: lumenloop.source.base,
        authEnv: lumenloop.source.authEnv,
        fetchedAt: lumenloop.fetchedAt,
        source: lumenloop.source.tools,
        note: "18 free + 3 partner research tools cataloged; account/billing/discovery endpoints included but always denied (x-policy)."
      },
      scout: {
        base: stellarLight.openapi.servers?.[0]?.url ?? "https://stellarlight.xyz",
        fetchedAt: stellarLight.fetchedAt,
        source: `${stellarLight.openapi.servers?.[0]?.url ?? "https://stellarlight.xyz"}/api/openapi.json`,
        note: "Read-only keyless API, carried near-verbatim from the upstream OpenAPI (components namespaced 'scout.*')."
      },
      stellarDocs: {
        backend: stellarDocsSpec.backend,
        taxonomy: stellarDocsSpec.taxonomy,
        authoredAt: stellarDocsSpec.authoredAt,
        source: "specs/stellar-docs.json",
        note: "Authored spec-as-data operations over the Algolia DocSearch index; x-algolia on each op records the exact query mapping."
      },
      skills: {
        mirror: "ecosystem-skills/",
        syncedAt: skillsManifest.synced_at,
        skillCount: skillIndex.length,
        sources: skillsManifest.sources.map((s) => ({ id: s.id, skills: s.skills.length })),
        note: "Deliberately 3 operations, not one path per skill/section — the index lives in /skills/list_skills x-skill-index (design doc §3)."
      }
    },
    "x-generated": {
      builder: "scripts/build-super-spec.mjs",
      generatedAt: catalogManifest.generatedAt,
      catalogEntries: catalogManifest.entries.length
    }
  };

  // Deterministic serialization: sort keys everywhere (arrays keep order;
  // `paths` key order therefore also becomes lexicographic — stable).
  const sorted = sortKeysDeep(spec);
  mkdirSync(dirname(OUT_PATH), { recursive: true });
  const pretty = `${JSON.stringify(sorted, null, 2)}\n`;
  writeFileSync(OUT_PATH, pretty);

  // Size report (design doc §4): the compact form is what ships into the
  // sandbox per search — that's the number that matters.
  const compactBytes = Buffer.byteLength(JSON.stringify(sorted), "utf8");
  const prettyBytes = Buffer.byteLength(pretty, "utf8");
  const counts = {};
  for (const item of Object.values(sorted.paths)) {
    for (const op of Object.values(item)) {
      const svc = op["x-service"];
      counts[svc] = counts[svc] ?? { operations: 0, denied: 0 };
      counts[svc].operations += 1;
      if (!op["x-policy"].allow) counts[svc].denied += 1;
    }
  }
  console.log(`specs/super-spec.json — ${Object.keys(sorted.paths).length} paths`);
  for (const [svc, c] of Object.entries(counts).sort()) {
    console.log(`  ${svc}: ${c.operations} operations (${c.denied} denied)`);
  }
  console.log(`  pretty: ${prettyBytes} bytes; compact (ships into sandbox): ${compactBytes} bytes ≈ ${Math.ceil(compactBytes / 4).toLocaleString()} tokens`);
}

main();
