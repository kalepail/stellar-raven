/**
 * Catalog builder tests — determinism, entry counts, schema validity,
 * build-time exposure filtering (ADR-0003: the manifest IS the exposed
 * surface; exclusions never emit). Runs scripts/build-catalog.mjs for real
 * (offline; it only reads inventory/ + ecosystem-skills/).
 */
import { describe, expect, it, beforeAll } from "vitest";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadManifest, type Catalog } from "../src/catalog/search.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST_PATH = join(ROOT, "catalog", "manifest.json");

function runBuilder(): string {
  execFileSync(process.execPath, [join(ROOT, "scripts", "build-catalog.mjs")], {
    cwd: ROOT,
    stdio: "pipe"
  });
  return readFileSync(MANIFEST_PATH, "utf8");
}

// Capture the committed bytes BEFORE beforeAll rebuilds (which overwrites the
// file) — otherwise the staleness evidence is destroyed. Mirrors super-spec.test.ts.
const committed = readFileSync(MANIFEST_PATH, "utf8");

let raw: string;
let catalog: Catalog;

beforeAll(() => {
  raw = runBuilder();
  catalog = loadManifest(JSON.parse(raw));
});

describe("build-catalog.mjs", () => {
  it("the checked-in artifact is current — a rebuild is byte-identical", () => {
    expect(
      committed,
      "catalog/manifest.json is stale — run node scripts/build-catalog.mjs"
    ).toBe(raw);
  });

  it("is deterministic — a second run produces byte-identical output", () => {
    const second = runBuilder();
    expect(second).toBe(raw);
  });

  it("emits a manifest that passes loadManifest validation", () => {
    // beforeAll already parsed it; assert the envelope explicitly.
    expect(catalog.version).toBe(1);
    expect(typeof catalog.generatedAt).toBe("string");
    // generatedAt is derived from inputs, never wall clock: it must equal one
    // of the input snapshot timestamps, and re-running must not change it.
    expect(Date.parse(catalog.generatedAt)).not.toBeNaN();
  });

  it("has globally unique ids", () => {
    const ids = catalog.entries.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has the expected entry counts per service/kind", () => {
    const count = (pred: (e: Catalog["entries"][number]) => boolean) =>
      catalog.entries.filter(pred).length;

    // Lumenloop: 20 exposed operations — the 21st inventory tool
    // (request_research, metered paid call) is excluded at build time and
    // never emitted (ADR-0003; PLAN §8: off by default).
    expect(count((e) => e.service === "lumenloop" && e.kind === "operation")).toBe(20);
    expect(count((e) => e.id === "lumenloop.request_research")).toBe(0);

    // Lumenloop's 14 API-served skills are never emitted: each duplicates a
    // canonical skills.* mirror entry (the lumenloop.skill.* twin namespace is
    // dead — assertLumenloopSkillsMirrored guards the assumption).
    expect(count((e) => e.service === "lumenloop" && e.kind === "skill")).toBe(0);
    expect(count((e) => e.id.startsWith("lumenloop.skill."))).toBe(0);
    expect(
      catalog.entries.filter((e) => e.service === "lumenloop" && e.kind === "skill-section")
    ).toHaveLength(0);

    // Scout: 21 exposed of 24 upstream OpenAPI operations — the 3 write/
    // side-effecting endpoints (submitFeedback, submitPartnerListing,
    // partnerAssistant) are excluded at build time. matchPartners and
    // partnerOnboard stay exposed — their OpenAPI descriptions document pure
    // AI ranking/extraction with no persistence.
    expect(count((e) => e.service === "scout" && e.kind === "operation")).toBe(21);
    expect(count((e) => e.id === "scout.submitFeedback")).toBe(0);
    expect(count((e) => e.id === "scout.submitPartnerListing")).toBe(0);
    expect(count((e) => e.id === "scout.partnerAssistant")).toBe(0);
    expect(count((e) => e.id === "scout.matchPartners")).toBe(1);
    expect(count((e) => e.id === "scout.partnerOnboard")).toBe(1);

    // Stellar Docs: 12 authored operations from specs/stellar-docs.json.
    const docs = catalog.entries.filter((e) => e.service === "stellarDocs");
    expect(docs).toHaveLength(12);
    expect(docs.every((e) => e.kind === "operation")).toBe(true);
    expect(docs.map((e) => e.id)).toContain("stellarDocs.search_docs");
    expect(docs.map((e) => e.id)).toContain("stellarDocs.search_docs_in_category");
    expect(docs.map((e) => e.id)).toContain("stellarDocs.search_meeting_notes");
    // Every docs op carries the algolia execute-mapping block for Phase 3.
    for (const op of docs) {
      expect(op.transport?.type, op.id).toBe("algolia");
      expect((op.transport as Record<string, unknown>).algolia, op.id).toBeDefined();
      expect(op.inputSchema).not.toBeNull();
    }

    // Skills mirror: 18 whole-skill entries — the 7 retired Lumenloop
    // API-onboarding skills are never emitted, skill or sections (see
    // build-catalog.mjs RETIRED_ONBOARDING_SKILLS + the rename-guard).
    expect(count((e) => e.service === "skills" && e.kind === "skill")).toBe(18);
    expect(count((e) => e.service === "skills" && e.kind === "skill-section")).toBeGreaterThan(0);
    expect(count((e) => e.id.includes("lumenloop-api-"))).toBe(0);
    expect(count((e) => e.id.includes("lumenloop-mcp-connect"))).toBe(0);

    // Grand total: everything in the manifest is exposed (ADR-0003).
    expect(catalog.entries).toHaveLength(274);
  });

  it("carries exactly version/generatedAt/entries at the top level", () => {
    // No manifest-level corpus blobs: the stellarDocs taxonomy lives in
    // specs/stellar-docs.json and reaches the model via the super spec. A
    // `docs.taxonomy` copy lived here until 2026-07-03 with zero consumers —
    // anything added at this level must name who reads it. Asserted on the
    // RAW bytes (loadManifest's zod parse strips unknown keys).
    expect(Object.keys(JSON.parse(raw)).sort()).toEqual(["entries", "generatedAt", "version"]);
  });

  it("skill sections carry compact descriptions and file transports", () => {
    const sections = catalog.entries.filter(
      (e) => e.service === "skills" && e.kind === "skill-section"
    );
    for (const section of sections) {
      expect(section.id).toMatch(/#/);
      expect(section.description.length).toBeLessThanOrEqual(201); // 200 + ellipsis
      expect(section.transport?.type).toBe("file");
      expect(section.inputSchema).toBeNull();
    }
    // Multi-file skills: extra .md files become #file:<relpath> sections.
    expect(sections.some((e) => e.id.includes("#file:"))).toBe(true);
    expect(
      sections.some((e) => e.id === "skills.stellar-dev.smart-contracts#file:development.md")
    ).toBe(true);
  });

  it("operations carry input schemas and transports", () => {
    const ops = catalog.entries.filter((e) => e.kind === "operation");
    for (const op of ops) {
      expect(op.inputSchema, op.id).not.toBeNull();
      expect(op.transport, op.id).not.toBeNull();
      expect(op.provenance.source.length).toBeGreaterThan(0);
      expect(Date.parse(op.provenance.fetchedAt), op.id).not.toBeNaN();
    }
    // Spot-check transports.
    const searchDirectory = ops.find((e) => e.id === "lumenloop.search_directory");
    expect(searchDirectory?.transport).toMatchObject({
      type: "http",
      method: "POST",
      path: "/v1/tools/search_directory"
    });
    const searchProjects = ops.find((e) => e.id === "scout.searchProjects");
    expect(searchProjects?.transport).toMatchObject({
      type: "http",
      method: "GET",
      path: "/api/projects/search"
    });
  });
});

describe("loadManifest", () => {
  it("rejects malformed input", () => {
    expect(() => loadManifest(null)).toThrow();
    expect(() => loadManifest({ version: 1 })).toThrow();
    expect(() => loadManifest({ version: 1, generatedAt: "x", entries: [{}] })).toThrow();
    expect(() =>
      loadManifest({
        version: 1,
        generatedAt: "2026-07-01T00:00:00Z",
        entries: [
          {
            id: "x.y",
            service: "not-a-service",
            kind: "operation",
            description: "d",
            inputSchema: null,
            outputSchema: null,
            transport: null,
            provenance: { source: "s", fetchedAt: "t" }
          }
        ]
      })
    ).toThrow();
  });

  it("accepts a minimal well-formed catalog", () => {
    const minimal = {
      version: 1,
      generatedAt: "2026-07-01T00:00:00Z",
      entries: [
        {
          id: "scout.getStatus",
          service: "scout",
          kind: "operation",
          description: "Service health",
          inputSchema: { type: "object", properties: {} },
          outputSchema: null,
          transport: { type: "http", method: "GET", path: "/api/status" },
          provenance: { source: "https://example.com", fetchedAt: "2026-07-01T00:00:00Z" }
        }
      ]
    };
    expect(loadManifest(minimal).entries).toHaveLength(1);
  });
});
