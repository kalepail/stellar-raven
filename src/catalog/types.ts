/**
 * Catalog types — the unified, machine-generated index that `search` ranks
 * (PLAN §2 as a starting sketch, deliberately trimmed).
 *
 * One entry per callable surface: every service operation, every skill, and
 * every skill section. `scripts/build-catalog.mjs` generates
 * `catalog/manifest.json`; `loadManifest` (src/catalog/search.ts) validates it
 * against `catalogSchema` before anything trusts it.
 *
 * Field rationale (what earns its place for a two-tool search+execute MCP):
 *  - id / service / kind / description → the search scorer's input fields.
 *  - inputSchema / outputSchema        → rendered into the TS `signature`
 *    returned with operation and runnable-skill hits, and execute-side arg
 *    validation — the model never owns URLs/args, PLAN §4.
 *  - transport                         → what the adapters need to actually
 *    place the call.
 *  - provenance                        → where the entry came from + snapshot
 *    time, so drift is attributable to an inventory refresh.
 *
 * Deliberately absent:
 *  - policy/auth/cost — exposure is filtered at BUILD time (ADR-0003): the
 *    manifest is the exposed surface, so every entry in it is callable or
 *    readable and a runtime allow/deny layer has nothing to express.
 *    Exclusions (paid ops, write endpoints, retired skills, upstream skill
 *    twins) live as data + reasons in scripts/build-catalog.mjs.
 *  - raven-next's `resultShape` (evidence/soft-empty/error paths): search
 *    never reads it, and execute-phase normalizers are per-service code, not
 *    per-entry data. Likewise the stellarDocs corpus taxonomy: it lives in
 *    specs/stellar-docs.json and ships to the model inside the super spec.
 */
import { z } from "zod";

export const CATALOG_SERVICES = ["lumenloop", "scout", "stellarDocs", "skills"] as const;

export const CATALOG_KINDS = ["operation", "skill", "skill-section"] as const;
export type CatalogKind = (typeof CATALOG_KINDS)[number];

/** A JSON Schema fragment — kept opaque; only the TS renderer walks it. */
const jsonSchemaShape = z.record(z.string(), z.unknown());

/**
 * How the host adapter reaches the surface. `type` discriminates:
 *  - "http"   → method + path (+ base) against a service origin
 *  - "algolia"→ Algolia REST query (hosts carry an app-id placeholder)
 *  - "file"   → path inside the bundled ecosystem-skills mirror
 * Extra transport detail (hosts, retry policy, …) rides along via catchall.
 */
export const transportSchema = z
  .object({
    type: z.enum(["http", "algolia", "file"]),
    method: z.string().optional(),
    path: z.string().optional(),
    base: z.string().optional()
  })
  .catchall(z.unknown());

export const provenanceSchema = z
  .object({
    /** Upstream origin of this entry (inventory endpoint URL or mirror URL). */
    source: z.string().min(1),
    /** ISO timestamp of the inventory/mirror snapshot the entry was built from. */
    fetchedAt: z.string().min(1)
  })
  .catchall(z.unknown());

export const catalogEntrySchema = z.object({
  /** Exact-match id, `<namespace>.<name>` (+ `#<section>` for skill sections). */
  id: z.string().min(1),
  service: z.enum(CATALOG_SERVICES),
  kind: z.enum(CATALOG_KINDS),
  description: z.string().min(1),
  /**
   * Skill-section entries only (optional): content tokens distilled from the
   * section BODY at build time (scripts/build-catalog.mjs via
   * src/catalog/extract-keywords.ts) — mid-section vocabulary the truncated
   * description can't carry. Blended into scoring at low weight
   * (src/catalog/scoring.ts); never rendered to users.
   */
  keywords: z.array(z.string()).optional(),
  /**
   * Runnable-skill marker (research/skill-run-design.md §5): literal `true`
   * ONLY on the kind:"skill" entries whose data-gathering core also ships as
   * a bundled host-side runner (src/skills/runners/), callable inside
   * `execute` via `codemode.skill.run(id, input)`. A deliberate contract
   * broadening, not a new kind: "skills are prose; a declared few are also
   * callable" — one skill, one id, two affordances (read + run). A second
   * kind/entry would recreate the twin-identity problem ADR-0002/0003 killed.
   * Runnable entries MUST carry both schemas (enforced by
   * refinedCatalogSchema in src/catalog/search.ts); the builder attaches the
   * flag + schemas from the RUNNERS registry (scripts/build-catalog.mjs).
   */
  runnable: z.literal(true).optional(),
  /**
   * JSON Schema for call args (operations) or for `codemode.skill.run` input
   * (runnable skills); null for prose-only skills and sections.
   */
  inputSchema: jsonSchemaShape.nullable(),
  /**
   * JSON Schema for the result where the upstream declares one, or the
   * runner's declared `data` payload contract (runnable skills); else null.
   */
  outputSchema: jsonSchemaShape.nullable(),
  transport: transportSchema.nullable(),
  provenance: provenanceSchema
});

export type CatalogEntry = z.infer<typeof catalogEntrySchema>;

export const catalogSchema = z.object({
  version: z.number().int().positive(),
  /** Derived from the newest input snapshot — NOT wall clock (determinism). */
  generatedAt: z.string().min(1),
  entries: z.array(catalogEntrySchema)
});

export type Catalog = z.infer<typeof catalogSchema>;
