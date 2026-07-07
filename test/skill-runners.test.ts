/**
 * Runner unit tests (design §12, unit row 1) — each runner against a stub
 * facade serving live-captured fixtures (test/fixtures/skill-runners/,
 * production capture 2026-07-06), plus the two confinement drift belts:
 * the import/token lint and the behavioral fetch-stub test.
 *
 * The self-authored outputSchema is reused as the oracle (validateArgs) —
 * outputs, with a host-style `calls` array attached the way runSkill does,
 * must validate against the runner's own contract.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { AdapterResult } from "../src/adapters/types.ts";
import { validateArgs } from "../src/policy/validate.ts";
import type { OpsFacade, SkillRunner } from "../src/skills/runners/types.ts";
import { RUNNERS } from "../src/skills/runners/index.ts";
import { stellarProjectDossier } from "../src/skills/runners/stellar-project-dossier.ts";
import { stellarEcosystemDigest } from "../src/skills/runners/stellar-ecosystem-digest.ts";
import fxGetProjectCompact from "./fixtures/skill-runners/lumenloop.get_project.compact.ts";
import fxGetProject from "./fixtures/skill-runners/lumenloop.get_project.ts";
import fxSearchDirectory from "./fixtures/skill-runners/lumenloop.search_directory.ts";
import fxScf from "./fixtures/skill-runners/lumenloop.get_scf_submissions.ts";
import fxContent from "./fixtures/skill-runners/lumenloop.find_content_about_project.ts";
import fxSimilar from "./fixtures/skill-runners/lumenloop.find_similar_projects_semantic.ts";
import fxSemantic from "./fixtures/skill-runners/lumenloop.search_content_semantic.ts";
import fxListDocs from "./fixtures/skill-runners/lumenloop.list_documents.ts";
import fxEntity from "./fixtures/skill-runners/lumenloop.find_content_by_entity.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const DOSSIER_ID = "skills.lumenloop.stellar-project-dossier";
const DIGEST_ID = "skills.lumenloop.stellar-ecosystem-digest";

// ---------------------------------------------------------------------------
// stub facade — records every call's op + args so default-application and
// mode-routing assertions read the wire, not runner internals.
// ---------------------------------------------------------------------------
type Recorded = { op: string; args: Record<string, unknown> };
type StubValue = AdapterResult | ((args: Record<string, unknown>) => AdapterResult);

function stubFacade(map: Record<string, StubValue>, recorded?: Recorded[]): OpsFacade {
  const out: OpsFacade = {};
  for (const [opId, v] of Object.entries(map)) {
    const service = opId.slice(0, opId.indexOf("."));
    const fnName = opId.slice(opId.indexOf(".") + 1);
    (out[service] ??= {})[fnName] = async (args?: unknown) => {
      const a = (args ?? {}) as Record<string, unknown>;
      recorded?.push({ op: opId, args: a });
      return typeof v === "function" ? v(a) : v;
    };
  }
  return out;
}

const softEmpty = (message = "nothing matched"): AdapterResult => ({
  ok: false,
  error: { service: "lumenloop", kind: "soft-empty", message }
});
const hardError = (message = "upstream 500"): AdapterResult => ({
  ok: false,
  error: { service: "lumenloop", kind: "error", message }
});
const okData = (data: unknown): AdapterResult => ({ ok: true, data });

/** The live-fixture happy map for the dossier (probe compact vs full split). */
const dossierHappy = (): Record<string, StubValue> => ({
  "lumenloop.get_project": (args) => (args["compact"] === true ? fxGetProjectCompact : fxGetProject),
  "lumenloop.search_directory": fxSearchDirectory,
  "lumenloop.get_scf_submissions": fxScf,
  "lumenloop.find_content_about_project": fxContent,
  "lumenloop.find_similar_projects_semantic": fxSimilar
});

const digestHappy = (): Record<string, StubValue> => ({
  "lumenloop.search_content_semantic": fxSemantic,
  "lumenloop.list_documents": fxListDocs,
  "lumenloop.find_content_by_entity": fxEntity
});

/** Oracle: output + a host-style calls array must satisfy the runner's own outputSchema. */
function expectValidates(runner: SkillRunner, out: unknown, ops: string[]) {
  const calls = ops.map((op) => ({ op, ok: true, ms: 1 }));
  const issues = validateArgs(runner.outputSchema, { ...(out as Record<string, unknown>), calls });
  expect(issues).toEqual([]);
}

const asRecord = (v: unknown) => v as Record<string, any>;

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

// ===========================================================================
// stellar-project-dossier
// ===========================================================================
describe("stellar-project-dossier runner", () => {
  it("happy path on live fixtures: input-slug resolution, all sections projected", async () => {
    const recorded: Recorded[] = [];
    const out = asRecord(
      await stellarProjectDossier.run({ project: "blend" }, stubFacade(dossierHappy(), recorded))
    );

    expect(out.slug).toBe("blend");
    expect(out.resolvedBy).toBe("input-slug");
    // profile: array-valued upstream fields joined into the declared strings
    expect(out.profile.title).toBe("Blend Capital");
    expect(out.profile.category).toBe("Financial Protocols");
    expect(out.profile.tags).toEqual(["DeFi", "Lending & Borrowing"]);
    expect(out.profile.basedIn).toBe("United States");
    expect(out.profile.operatingRegion).toBe("Global");
    expect(out.profile.links.website).toBe("blend.capital");
    expect(out.profile.description.length).toBeLessThanOrEqual(400);
    // scf
    expect(out.scf).toEqual({
      count: 1,
      softEmpty: false,
      submissions: [
        { round: "Liquidity Award - '24 Q1", awardType: "Liquidity Award", title: "Blend Capital", status: null }
      ]
    });
    // content: flattened across the four types; research rows carry no url
    expect(out.content.softEmpty).toBe(false);
    expect(out.content.items).toHaveLength(6);
    const research = out.content.items.filter((i: any) => i.type === "research");
    expect(research).toHaveLength(1);
    expect(research[0].url).toBeNull();
    for (const item of out.content.items) {
      expect(["articles", "av", "events", "research"]).toContain(item.type);
      expect(item.summary.length).toBeLessThanOrEqual(200);
    }
    // similar (bare-array payload)
    expect(out.similar.items).toEqual([
      { slug: "yieldblox", title: "Yieldblox", category: "Financial Protocols" },
      { slug: "turbolong", title: "Turbolong", category: "Financial Protocols" }
    ]);
    // the runner NEVER authors the audit trail
    expect("calls" in out).toBe(false);
    // probe (compact) + 4-way fan-out = 5 constituent calls
    expect(recorded).toHaveLength(5);
    expectValidates(stellarProjectDossier, out, recorded.map((r) => r.op));
  });

  it("applies its own defaults (schema `default` is documentation only): contentLimit 8, similarLimit 5", async () => {
    const recorded: Recorded[] = [];
    await stellarProjectDossier.run({ project: "blend" }, stubFacade(dossierHappy(), recorded));
    const content = recorded.find((r) => r.op === "lumenloop.find_content_about_project")!;
    expect(content.args).toEqual({
      slug: "blend",
      limit: 8,
      types: ["articles", "av", "events", "research"],
      response_format: "concise"
    });
    const similar = recorded.find((r) => r.op === "lumenloop.find_similar_projects_semantic")!;
    expect(similar.args).toEqual({ slug: "blend", limit: 5 });
  });

  it("propagates explicit limits instead of the defaults", async () => {
    const recorded: Recorded[] = [];
    await stellarProjectDossier.run(
      { project: "blend", contentLimit: 3, similarLimit: 2 },
      stubFacade(dossierHappy(), recorded)
    );
    expect(recorded.find((r) => r.op === "lumenloop.find_content_about_project")!.args["limit"]).toBe(3);
    expect(recorded.find((r) => r.op === "lumenloop.find_similar_projects_semantic")!.args["limit"]).toBe(2);
  });

  it('resolves "exact-slug" when the direct probe fails but the directory has the exact slug', async () => {
    const map = dossierHappy();
    map["lumenloop.get_project"] = (args) =>
      args["compact"] === true ? hardError("probe down") : fxGetProject;
    map["lumenloop.search_directory"] = okData({
      count: 2,
      projects: [
        { slug: "blend", title: "Blend Capital" },
        { slug: "blender", title: "Blender" }
      ]
    });
    const out = asRecord(await stellarProjectDossier.run({ project: "blend" }, stubFacade(map)));
    expect(out.resolvedBy).toBe("exact-slug");
    expect(out.slug).toBe("blend");
  });

  it('resolves "exact-title" case-insensitively', async () => {
    const map = dossierHappy();
    map["lumenloop.search_directory"] = okData({
      count: 2,
      projects: [
        { slug: "blend", title: "Blend Capital" },
        { slug: "other", title: "Other Project" }
      ]
    });
    // "blend capital" fails the slug regex (space) → search → exact title (ci)
    const out = asRecord(await stellarProjectDossier.run({ project: "blend capital" }, stubFacade(map)));
    expect(out.resolvedBy).toBe("exact-title");
    expect(out.slug).toBe("blend");
  });

  it('resolves "single-hit" when the directory returns exactly one project', async () => {
    const map = dossierHappy();
    map["lumenloop.search_directory"] = okData({
      count: 1,
      projects: [{ slug: "blend", title: "Blend Capital" }]
    });
    const out = asRecord(
      await stellarProjectDossier.run({ project: "Blendy Lending Thing" }, stubFacade(map))
    );
    expect(out.resolvedBy).toBe("single-hit");
    expect(out.slug).toBe("blend");
  });

  it("fails AS DATA on ambiguous multi-hit, listing the candidates (live fixture: substring noise)", async () => {
    // The live "Blend" directory search surfaces OTHER projects mentioning
    // Blend — no exact slug/title match, two hits → ambiguous, never fuzzy.
    const out = asRecord(await stellarProjectDossier.run({ project: "Blend" }, stubFacade(dossierHappy())));
    expect(out.ok).toBe(false);
    expect(out.error.kind).toBe("error");
    expect(out.error.message).toContain('ambiguous project "Blend"');
    expect(out.error.message).toContain("pass the exact slug");
    expect(out.error.hint).toContain("backyard — Backyard");
    expect(out.error.hint).toContain("bexo — Bexo");
    // The ambiguity branch is ALSO the live fabrication-trap path (upstream
    // fuzzy-matches nonexistent names into candidates), so the hint must
    // carry the absence-is-not-evidence framing and forbid substitution.
    expect(out.error.hint).toContain('none matches "Blend" exactly');
    expect(out.error.hint).toContain("do not substitute a similar-sounding one");
    expect(out.error.hint).toContain("is not evidence the project does not exist");
  });

  it("zero directory hits → soft-empty with the honesty hint (empty-array form)", async () => {
    const map = dossierHappy();
    map["lumenloop.search_directory"] = okData({ count: 0, projects: [] });
    const out = asRecord(await stellarProjectDossier.run({ project: "Quasarswap DEX" }, stubFacade(map)));
    expect(out.ok).toBe(false);
    expect(out.error.kind).toBe("soft-empty");
    expect(out.error.message).toBe('no directory project matched "Quasarswap DEX"');
    expect(out.error.hint).toContain("is not evidence the project does not exist");
  });

  it("zero directory hits → soft-empty (upstream soft-empty envelope form)", async () => {
    const map = dossierHappy();
    map["lumenloop.search_directory"] = softEmpty();
    const out = asRecord(await stellarProjectDossier.run({ project: "Quasarswap DEX" }, stubFacade(map)));
    expect(out.ok).toBe(false);
    expect(out.error.kind).toBe("soft-empty");
  });

  it("anchor get_project error → run fails with the anchor's kind and hint", async () => {
    const map = dossierHappy();
    map["lumenloop.get_project"] = (args) =>
      args["compact"] === true ? fxGetProjectCompact : hardError("row fetch exploded");
    const out = asRecord(await stellarProjectDossier.run({ project: "blend" }, stubFacade(map)));
    expect(out.ok).toBe(false);
    expect(out.error.kind).toBe("error");
    expect(out.error.message).toContain("anchor lumenloop.get_project failed");
    expect(out.error.message).toContain("row fetch exploded");
  });

  it("non-anchor constituent errors degrade per-section to null (scf / content / similar)", async () => {
    const map = dossierHappy();
    map["lumenloop.get_scf_submissions"] = hardError();
    map["lumenloop.find_content_about_project"] = hardError();
    map["lumenloop.find_similar_projects_semantic"] = hardError();
    const recorded: Recorded[] = [];
    const out = asRecord(await stellarProjectDossier.run({ project: "blend" }, stubFacade(map, recorded)));
    expect(out.scf).toBeNull();
    expect(out.content).toBeNull();
    expect(out.similar).toBeNull();
    expect(out.profile).not.toBeNull(); // the anchor still succeeded
    expectValidates(stellarProjectDossier, out, recorded.map((r) => r.op));
  });

  it("soft-empty constituents stay PRESENT with softEmpty: true (a finding, not a failure)", async () => {
    const map = dossierHappy();
    map["lumenloop.get_scf_submissions"] = softEmpty();
    map["lumenloop.find_content_about_project"] = softEmpty();
    map["lumenloop.find_similar_projects_semantic"] = softEmpty();
    const recorded: Recorded[] = [];
    const out = asRecord(await stellarProjectDossier.run({ project: "blend" }, stubFacade(map, recorded)));
    expect(out.scf).toEqual({ count: 0, softEmpty: true, submissions: [] });
    expect(out.content).toEqual({ softEmpty: true, items: [] });
    expect(out.similar).toEqual({ softEmpty: true, items: [] });
    expectValidates(stellarProjectDossier, out, recorded.map((r) => r.op));
  });

  it("shape drift (none of the expected keys) → section null, never guessed fields", async () => {
    const map = dossierHappy();
    map["lumenloop.get_scf_submissions"] = okData({ totally: "different-shape" });
    const out = asRecord(await stellarProjectDossier.run({ project: "blend" }, stubFacade(map)));
    expect(out.scf).toBeNull();
    expect(out.profile).not.toBeNull();
  });

  it("truncates per-field: description ≤ 400, summaries ≤ 200", async () => {
    const map = dossierHappy();
    map["lumenloop.get_project"] = (args) =>
      args["compact"] === true
        ? fxGetProjectCompact
        : okData({ title: "Blend Capital", category: "x", tags: [], description: "d".repeat(1000) });
    map["lumenloop.find_content_about_project"] = okData({
      articles: [{ title: "t", url: "https://u", publishing_date: "2026-01-01", summary: "s".repeat(999) }]
    });
    const out = asRecord(await stellarProjectDossier.run({ project: "blend" }, stubFacade(map)));
    expect(out.profile.description).toHaveLength(400);
    expect(out.content.items[0].summary).toHaveLength(200);
  });
});

// ===========================================================================
// stellar-ecosystem-digest
// ===========================================================================
describe("stellar-ecosystem-digest runner", () => {
  it("theme happy path on live fixtures: window framing, flat items, counts, upcoming", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-06T12:00:00Z"));
    const recorded: Recorded[] = [];
    const out = asRecord(
      await stellarEcosystemDigest.run({ subject: "RWA tokenization" }, stubFacade(digestHappy(), recorded))
    );

    expect(out.subject).toBe("RWA tokenization");
    expect(out.subjectType).toBe("theme");
    expect(out.window).toEqual({ dateStart: "2026-06-06", dateEnd: "2026-07-06" });
    expect(out.softEmpty).toBe(false);
    expect(out.items).toHaveLength(6);
    expect(out.counts).toEqual({ articles: 2, av: 1, events: 1, research: 2 });
    // date-desc ordering (nulls last)
    const dates = out.items.map((i: any) => i.date).filter((d: any) => d !== null);
    expect([...dates].sort().reverse()).toEqual(dates);
    // upcoming events: live slim rows carry no start_at → null, not guessed
    expect(out.upcomingEvents).toHaveLength(2);
    expect(out.upcomingEvents[0]).toEqual({
      title: "Built in Nairobi: Stellar Impact Studio Demo Day",
      url: "https://luma.com/xzvdmrt0",
      startAt: null
    });
    expect("calls" in out).toBe(false);
    expect(recorded).toHaveLength(2);
    expectValidates(stellarEcosystemDigest, out, recorded.map((r) => r.op));
  });

  it('applies its own defaults: 30-day window, "theme" mode, perTypeLimit 5, upcoming limit 5', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-06T12:00:00Z"));
    const recorded: Recorded[] = [];
    await stellarEcosystemDigest.run({ subject: "payments" }, stubFacade(digestHappy(), recorded));
    expect(recorded.map((r) => r.op).sort()).toEqual([
      "lumenloop.list_documents",
      "lumenloop.search_content_semantic"
    ]);
    const sem = recorded.find((r) => r.op === "lumenloop.search_content_semantic")!;
    expect(sem.args).toEqual({
      query: "payments",
      date_start: "2026-06-06",
      date_end: "2026-07-06",
      types: ["articles", "av", "events", "research"],
      limit: 5,
      response_format: "concise"
    });
    const docs = recorded.find((r) => r.op === "lumenloop.list_documents")!;
    expect(docs.args).toEqual({ collection: "events", period: "upcoming", limit: 5 });
  });

  it("window math honors explicit days and stays YYYY-MM-DD UTC", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-06T23:59:00Z"));
    const out = asRecord(
      await stellarEcosystemDigest.run({ subject: "x", days: 7 }, stubFacade(digestHappy()))
    );
    expect(out.window).toEqual({ dateStart: "2026-06-29", dateEnd: "2026-07-06" });
    expect(out.window.dateStart).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("entity mode routes to find_content_by_entity only; upcomingEvents stays null (not attempted)", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-06T12:00:00Z"));
    const recorded: Recorded[] = [];
    const out = asRecord(
      await stellarEcosystemDigest.run(
        { subject: "Soroswap", subjectType: "entity" },
        stubFacade(digestHappy(), recorded)
      )
    );
    expect(recorded.map((r) => r.op)).toEqual(["lumenloop.find_content_by_entity"]);
    expect(recorded[0]!.args).toEqual({
      entity: "Soroswap",
      date_start: "2026-06-06",
      date_end: "2026-07-06",
      limit: 5
    });
    expect(out.upcomingEvents).toBeNull();
    // live entity fixture: proposals/scf_submissions keys DROPPED (not digest
    // output types), rows carry no summary → projected ""
    expect(out.items).toHaveLength(2);
    for (const item of out.items) {
      expect(["articles", "av", "events", "research"]).toContain(item.type);
      expect(item.summary).toBe("");
    }
    expect(out.counts).toEqual({ articles: 2, av: 0, events: 0, research: 0 });
    expectValidates(stellarEcosystemDigest, out, recorded.map((r) => r.op));
  });

  it("dedups by url across types and by id when url is absent", async () => {
    const map = digestHappy();
    map["lumenloop.search_content_semantic"] = okData({
      articles: [
        { id: "1", title: "A", url: "https://dup", publishing_date: "2026-07-01", summary: "s" },
        { id: "2", title: "A again", url: "https://dup", publishing_date: "2026-07-02", summary: "s" }
      ],
      research: [
        { id: 9, title: "R", summary: "s", created_at: "2026-06-30" },
        { id: 9, title: "R copy", summary: "s", created_at: "2026-06-30" }
      ]
    });
    const out = asRecord(await stellarEcosystemDigest.run({ subject: "x" }, stubFacade(map)));
    expect(out.items).toHaveLength(2);
    expect(out.counts).toEqual({ articles: 1, av: 0, events: 0, research: 1 });
  });

  it("primary soft-empty → quiet-window answer: ok data with softEmpty true, items []", async () => {
    const map = digestHappy();
    map["lumenloop.search_content_semantic"] = softEmpty();
    const recorded: Recorded[] = [];
    const out = asRecord(await stellarEcosystemDigest.run({ subject: "x" }, stubFacade(map, recorded)));
    expect(out.ok).toBeUndefined(); // data payload, not an error envelope
    expect(out.softEmpty).toBe(true);
    expect(out.items).toEqual([]);
    expect(out.counts).toEqual({ articles: 0, av: 0, events: 0, research: 0 });
    expect(out.upcomingEvents).toHaveLength(2); // the sibling call still lands
    expectValidates(stellarEcosystemDigest, out, recorded.map((r) => r.op));
  });

  it("primary hard error → the run fails as data, naming the op", async () => {
    const map = digestHappy();
    map["lumenloop.search_content_semantic"] = hardError("pgvector down");
    const out = asRecord(await stellarEcosystemDigest.run({ subject: "x" }, stubFacade(map)));
    expect(out.ok).toBe(false);
    expect(out.error.kind).toBe("error");
    expect(out.error.message).toContain("lumenloop.search_content_semantic");
    expect(out.error.message).toContain("pgvector down");
  });

  it("upcoming-events error degrades that section to null; soft-empty to []", async () => {
    const errMap = digestHappy();
    errMap["lumenloop.list_documents"] = hardError();
    const outErr = asRecord(await stellarEcosystemDigest.run({ subject: "x" }, stubFacade(errMap)));
    expect(outErr.upcomingEvents).toBeNull();
    expect(outErr.items).toHaveLength(6); // primary unaffected

    const emptyMap = digestHappy();
    emptyMap["lumenloop.list_documents"] = softEmpty();
    const outEmpty = asRecord(await stellarEcosystemDigest.run({ subject: "x" }, stubFacade(emptyMap)));
    expect(outEmpty.upcomingEvents).toEqual([]);
  });

  it("primary shape drift (no expected type keys) → treated as the call erroring", async () => {
    const map = digestHappy();
    map["lumenloop.search_content_semantic"] = okData({ weird: 1 });
    const out = asRecord(await stellarEcosystemDigest.run({ subject: "x" }, stubFacade(map)));
    expect(out.ok).toBe(false);
    expect(out.error.message).toContain("unexpected payload shape");
  });

  it("upcoming-events shape drift → that section null, run unaffected", async () => {
    const map = digestHappy();
    map["lumenloop.list_documents"] = okData({ weird: 1 });
    const out = asRecord(await stellarEcosystemDigest.run({ subject: "x" }, stubFacade(map)));
    expect(out.upcomingEvents).toBeNull();
    expect(out.items).toHaveLength(6);
  });

  it("truncates item summaries to ≤ 200 chars", async () => {
    const map = digestHappy();
    map["lumenloop.search_content_semantic"] = okData({
      articles: [{ id: "1", title: "t", url: "https://u", publishing_date: "2026-07-01", summary: "s".repeat(5000) }]
    });
    const out = asRecord(await stellarEcosystemDigest.run({ subject: "x" }, stubFacade(map)));
    expect(out.items[0].summary).toHaveLength(200);
  });
});

// ===========================================================================
// confinement drift belts (design §2/§12)
// ===========================================================================
describe("runner confinement belts", () => {
  const RUNNER_DIR = join(ROOT, "src", "skills", "runners");
  const runnerFiles = readdirSync(RUNNER_DIR).filter(
    (f) => f.endsWith(".ts") && f !== "types.ts" && f !== "index.ts"
  );

  it("covers every registered runner (one module per registry entry)", () => {
    expect(runnerFiles.length).toBe(Object.keys(RUNNERS).length);
  });

  it("import-discipline lint: specifiers ⊆ {./types.ts}, no forbidden tokens", () => {
    // The design's §12 token set plus the dynamic-eval spellings (eval /
    // Function / constructor) a review flagged as lint-escapable egress
    // vectors. Still a drift BELT, not a boundary (design §2/§7) — the
    // behavioral fetch-stub test below and first-party review remain the
    // real enforcement.
    const FORBIDDEN = [
      "fetch(",
      "env.",
      "process.",
      "import(",
      "globalThis",
      "self.",
      "Reflect",
      "eval(",
      "Function(",
      "constructor"
    ];
    for (const file of runnerFiles) {
      const source = readFileSync(join(RUNNER_DIR, file), "utf8");
      const specifiers = [
        ...source.matchAll(/(?:import|export)[^"'\n]*from\s*["']([^"']+)["']/g),
        ...source.matchAll(/import\s*["']([^"']+)["']/g)
      ].map((m) => m[1]);
      expect(specifiers.length, `${file}: expected at least one import`).toBeGreaterThan(0);
      for (const spec of specifiers) {
        expect(spec, `${file}: import specifier ${spec}`).toBe("./types.ts");
      }
      for (const token of FORBIDDEN) {
        expect(source.includes(token), `${file}: forbidden token ${JSON.stringify(token)}`).toBe(false);
      }
    }
  });

  it("behavioral confinement: every runner completes end-to-end with global fetch stubbed to throw", async () => {
    vi.stubGlobal("fetch", () => {
      throw new Error("network egress attempted from a runner — facade-only rule violated");
    });
    const inputs: Record<string, { input: Record<string, unknown>; map: Record<string, StubValue> }> = {
      [DOSSIER_ID]: { input: { project: "blend" }, map: dossierHappy() },
      [DIGEST_ID]: { input: { subject: "RWA tokenization" }, map: digestHappy() }
    };
    for (const [id, runner] of Object.entries(RUNNERS)) {
      const setup = inputs[id];
      expect(setup, `no confinement-test input for ${id} — add one when registering a runner`).toBeDefined();
      const out = asRecord(await runner.run(setup!.input, stubFacade(setup!.map)));
      expect(out.ok).not.toBe(false); // completed on the facade alone
    }
  });
});

// ===========================================================================
// registry + schema dialect sanity
// ===========================================================================
describe("RUNNERS registry", () => {
  it("is keyed by exact catalog ids with declared ops on every runner", () => {
    expect(Object.keys(RUNNERS).sort()).toEqual([DIGEST_ID, DOSSIER_ID].sort());
    for (const runner of Object.values(RUNNERS)) {
      expect(runner.ops.length).toBeGreaterThan(0);
      for (const op of runner.ops) expect(op).toMatch(/^[a-z][a-zA-Z]*\.[a-z_]+$/);
    }
  });

  it("keeps schemas inside the bounded validate.ts dialect (no oneOf/$ref/allOf/anyOf)", () => {
    for (const [id, runner] of Object.entries(RUNNERS)) {
      for (const schema of [runner.inputSchema, runner.outputSchema]) {
        const text = JSON.stringify(schema);
        for (const kw of ['"oneOf"', '"anyOf"', '"allOf"', '"$ref"', '"not"']) {
          expect(text.includes(kw), `${id}: schema uses ${kw}`).toBe(false);
        }
      }
      expect(runner.inputSchema["additionalProperties"]).toBe(false);
    }
  });

  it("rejects unknown input keys and out-of-range limits via validateArgs (unknown keys refused, never ignored)", () => {
    const dossier = RUNNERS[DOSSIER_ID]!;
    expect(validateArgs(dossier.inputSchema, { project: "blend", section: "x" })).not.toEqual([]);
    expect(validateArgs(dossier.inputSchema, { project: "blend", contentLimit: 999 })).not.toEqual([]);
    expect(validateArgs(dossier.inputSchema, {})).not.toEqual([]);
    expect(validateArgs(dossier.inputSchema, { project: "blend" })).toEqual([]);
    const digest = RUNNERS[DIGEST_ID]!;
    expect(validateArgs(digest.inputSchema, { subject: "x", subjectType: "both" })).not.toEqual([]);
    expect(validateArgs(digest.inputSchema, { subject: "x", days: 365 })).not.toEqual([]);
    expect(validateArgs(digest.inputSchema, { subject: "x" })).toEqual([]);
  });
});
