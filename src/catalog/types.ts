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
 *    returned with operation hits (and later, execute-side arg validation —
 *    the model never owns URLs/args, PLAN §4).
 *  - transport / auth / cost           → what the Phase 3 adapters need to
 *    actually place the call, and what the paid-gate keys off (`cost`).
 *  - policy                            → deny-list as DATA (machine-checkable;
 *    denied entries never leave `searchCatalog`, `execute` refuses by id).
 *  - provenance                        → where the entry came from + snapshot
 *    time, so drift is attributable to an inventory refresh.
 *
 * Deliberately absent: raven-next's `resultShape` (evidence/soft-empty/error
 * paths). Search never reads it, and execute-phase normalizers are per-service
 * code, not per-entry data — dropping it keeps the manifest lean. Likewise
 * the stellarDocs corpus taxonomy: it lives in specs/stellar-docs.json and
 * ships to the model inside the super spec; a manifest-level `docs.taxonomy`
 * copy (removed 2026-07-03) had no consumer anywhere.
 */
import { z } from "zod";

export const CATALOG_SERVICES = ["lumenloop", "scout", "stellarDocs", "skills"] as const;
export type CatalogService = (typeof CATALOG_SERVICES)[number];

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

export const policySchema = z.object({
  allow: z.boolean(),
  denyReason: z.string().nullable()
});

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
  /** JSON Schema for call args (operations); null for skills/sections. */
  inputSchema: jsonSchemaShape.nullable(),
  /** JSON Schema for the result where the upstream declares one; else null. */
  outputSchema: jsonSchemaShape.nullable(),
  transport: transportSchema.nullable(),
  auth: z.enum(["none", "partner-key", "algolia-key"]),
  cost: z.enum(["free", "metered"]),
  policy: policySchema,
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
