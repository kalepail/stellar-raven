/**
 * Offline smoke of src/executor/run.ts at the REAL worker boundary (Solo
 * todo 833) — the pieces plain-Node tests cannot touch: `cloudflare:workers`
 * tracing, `@cloudflare/codemode`'s DynamicWorkerExecutor, and a genuine
 * Dynamic Worker isolate via the LOADER binding.
 *
 * Offline is ENFORCED, not assumed: the lane's miniflare `outboundService`
 * (test/smoke/vitest.config.ts) turns any un-stubbed host-side fetch into a
 * 503. Sandbox-side there is no network at all (globalOutbound: null —
 * asserted below). The single vi.stubGlobal'd fetch exists to produce a real
 * { ok: true } envelope so the guard's payload-read trap can be exercised at
 * the true boundary. The live counterpart (test/live/run-live-execute.mjs)
 * still owns real-traffic coverage.
 */
import { env } from "cloudflare:test";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createExecuteRunner, createSpecSearchRunner } from "../../src/executor/run";
import { getCatalog } from "../../src/catalog/load";
import fxSemantic from "../fixtures/skill-runners/lumenloop.search_content_semantic.ts";
import fxListDocs from "../fixtures/skill-runners/lumenloop.list_documents.ts";

// The cast bridges OAUTH_PROVIDER: workos.ts augments the global Env with
// it (injected at runtime by workers-oauth-provider), but the runners never
// touch it and the test env legitimately lacks it.
const run = createExecuteRunner(env as unknown as Env);

function uniqueOwner(label: string): string {
  return `smoke-owner-${label}-${crypto.randomUUID()}`;
}

async function ownerPrefix(owner: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(owner));
  const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `art/${hex.slice(0, 16)}/`;
}

async function artifactKeysFor(owner: string): Promise<string[]> {
  const listed = await env.ARTIFACTS.list({ prefix: await ownerPrefix(owner) });
  return listed.objects.map((o) => o.key);
}

function artifactIdFrom(text: string): string {
  const match = /artifact: id=([0-9a-f-]{36}) /.exec(text);
  if (!match?.[1]) throw new Error(`artifact id missing from:\n${text.slice(-2000)}`);
  return match[1];
}

const BIG_SECRET_RESULT_CODE = `async () => {
  const refused = await lumenloop.search_directory({ limit: 2 });
  return {
    sourceUrl: "https://user:pass@example.test/path?secret=1#frag",
    refused,
    rows: Array.from({ length: 2500 }, (_, i) => ({
      i,
      nested: { envSecret: "smoke-test-lumenloop-key" },
      adminEcho: "smoke-test-admin-token",
      pad: "x".repeat(40)
    }))
  };
}`;

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("execute runner (real Dynamic Worker isolate)", () => {
  it("captures one deterministic host observation anchor per execute", async () => {
    const clock = vi.fn(() => new Date("2026-07-14T15:30:00.000Z"));
    const deterministicRun = createExecuteRunner(env as unknown as Env, { clock });

    const outcome = await deterministicRun("async () => ({ ok: true })");

    expect(clock).toHaveBeenCalledTimes(1);
    expect(outcome.ok).toBe(true);
    expect(outcome.observationContext).toEqual({
      observedAt: "2026-07-14T15:30:00.000Z",
      catalogGeneratedAt: getCatalog().generatedAt
    });
  });

  it("runs model code in a fresh isolate and returns its result", async () => {
    const outcome = await run("async (codemode) => 1 + 1");
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.result).toBe("2");
      expect(outcome.operationSummary).toEqual({ total: 0, ok: 0, error: 0, softEmpty: 0 });
      expect(outcome.evidenceSummary).toEqual({
        kind: "none",
        skillRead: false,
        buildAuthoritySkillIds: [],
        buildAuthorityRoles: [],
        skillRuns: 0,
        artifactReads: 0
      });
    }
  });

  it("writes an artifact only for a truncated result and stores redacted bytes before slicing", async () => {
    const owner = uniqueOwner("write");
    const outcome = await run(BIG_SECRET_RESULT_CODE, {
      artifactOwner: owner,
      requestId: "smoke-request",
      rayId: "smoke-ray"
    });
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) throw new Error(outcome.error);
    expect(outcome.truncated).toBe(true);
    expect(outcome.result).toContain("--- SOURCE BASIS ---");
    expect(outcome.result).not.toContain("--- TRUNCATED ---");
    expect(outcome.result).toContain("artifact: id=");
    expect(outcome.result).toContain("lumenloop.search_directory=error/");
    expect(outcome.result).toContain("https://example.test/path");
    expect(outcome.sourceBasis?.artifact?.state).toBe("available");
    expect(outcome.operationSummary).toEqual({ total: 1, ok: 0, error: 1, softEmpty: 0 });
    expect(outcome.evidenceSummary?.kind).toBe("service-inconclusive");

    const id = artifactIdFrom(outcome.result);
    const keys = await artifactKeysFor(owner);
    expect(keys.some((key) => key.endsWith(`/${id}`))).toBe(true);
    const key = keys.find((k) => k.endsWith(`/${id}`));
    if (!key) throw new Error("missing stored artifact key");
    const stored = await env.ARTIFACTS.get(key);
    const storedText = (await stored?.text()) ?? "";
    expect(storedText).not.toContain("smoke-test-lumenloop-key");
    expect(storedText).not.toContain("smoke-test-admin-token");
    expect(storedText).toContain("[REDACTED]");
  });

  it("does not write artifacts for non-truncated results, log truncation, or thrown errors", async () => {
    const owner = uniqueOwner("no-write");
    const before = await artifactKeysFor(owner);

    const small = await run("async () => ({ ok: true })", { artifactOwner: owner });
    expect(small.ok).toBe(true);
    if (small.ok) expect(small.truncated).toBe(false);

    const logHeavy = await run(`async () => {
      console.log("x".repeat(200000));
      return "ok";
    }`, { artifactOwner: owner });
    expect(logHeavy.ok).toBe(true);

    const thrown = await run(`async () => {
      throw new Error("x".repeat(100000));
    }`, { artifactOwner: owner });
    expect(thrown.ok).toBe(false);

    expect(await artifactKeysFor(owner)).toEqual(before);
  });

  it("keeps concurrent executes isolated across owners and operation ledgers on the cached runner", async () => {
    vi.stubGlobal("fetch", async (input: RequestInfo | URL) => {
      const url = new URL(typeof input === "string" || input instanceof URL ? input : input.url);
      if (url.pathname.endsWith("/search_directory")) {
        await new Promise((resolve) => setTimeout(resolve, 25));
        return Response.json({
          success: true,
          data: { count: 1, projects: [{ slug: "alpha" }] },
          error: null,
          meta: { tool: "search_directory", format: "json" }
        });
      }
      if (url.pathname.endsWith("/get_categories")) {
        await new Promise((resolve) => setTimeout(resolve, 5));
        return Response.json({
          success: true,
          data: { categories: ["payments"] },
          error: null,
          meta: { tool: "get_categories", format: "json" }
        });
      }
      return Response.json({ success: false, error: `unexpected ${url.pathname}` }, { status: 500 });
    });

    const ownerA = uniqueOwner("concurrent-a");
    const ownerB = uniqueOwner("concurrent-b");
    const [a, b] = await Promise.all([
      run(`async () => {
        const r = await lumenloop.search_directory({ query: "alpha" });
        return { label: "a", ok: r.ok, rows: Array.from({ length: 1800 }, (_, i) => ({ i, pad: "a".repeat(40) })) };
      }`, { artifactOwner: ownerA }),
      run(`async () => {
        const r = await lumenloop.get_categories({});
        return { label: "b", ok: r.ok, rows: Array.from({ length: 1800 }, (_, i) => ({ i, pad: "b".repeat(40) })) };
      }`, { artifactOwner: ownerB })
    ]);

    expect(a.ok).toBe(true);
    expect(b.ok).toBe(true);
    if (!a.ok) throw new Error(a.error);
    if (!b.ok) throw new Error(b.error);
    expect(a.sourceBasis?.calls.map((call) => call.op)).toEqual(["lumenloop.search_directory"]);
    expect(b.sourceBasis?.calls.map((call) => call.op)).toEqual(["lumenloop.get_categories"]);
    expect(a.operationSummary?.candidateEvidence).toBe(1);
    expect(b.operationSummary?.candidateEvidence).toBeUndefined();

    const idA = artifactIdFrom(a.result);
    const idB = artifactIdFrom(b.result);
    const keysA = await artifactKeysFor(ownerA);
    const keysB = await artifactKeysFor(ownerB);
    expect(keysA).toHaveLength(1);
    expect(keysB).toHaveLength(1);
    expect(keysA[0]).toContain(idA);
    expect(keysB[0]).toContain(idB);

    const metaA = (await env.ARTIFACTS.head(keysA[0]!))?.customMetadata;
    const metaB = (await env.ARTIFACTS.head(keysB[0]!))?.customMetadata;
    expect(metaA?.opLedger).toContain("lumenloop.search_directory");
    expect(metaA?.opLedger).not.toContain("lumenloop.get_categories");
    expect(metaB?.opLedger).toContain("lumenloop.get_categories");
    expect(metaB?.opLedger).not.toContain("lumenloop.search_directory");
  });

  it("classifies successful Scout repo searches as prior-art evidence", async () => {
    vi.stubGlobal("fetch", async (input: RequestInfo | URL) => {
      const url = new URL(typeof input === "string" || input instanceof URL ? input : input.url);
      if (!url.pathname.endsWith("/api/repos/search")) {
        return Response.json({ error: `unexpected ${url.pathname}` }, { status: 500 });
      }
      return Response.json({
        repos: [{ fullName: "example/escrow", url: "https://github.com/example/escrow" }],
        meta: { counts: { returned: 1, total: 1 } }
      });
    });

    const outcome = await run(`async () => {
      const repos = await scout.searchRepos({ q: "escrow", limit: 1 });
      return { ok: repos.ok };
    }`);
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) throw new Error(outcome.error);
    expect(outcome.operationSummary).toMatchObject({
      total: 1,
      ok: 1,
      error: 0,
      softEmpty: 0,
      priorArtCandidates: 1
    });
    expect(outcome.operationSummary?.candidateEvidence).toBeUndefined();
  });

  it("derives recovery advice for operation-scoped directories and suppresses it after a broad lane", async () => {
    vi.stubGlobal("fetch", async (input: RequestInfo | URL) => {
      const url = new URL(typeof input === "string" || input instanceof URL ? input : input.url);
      if (url.pathname.endsWith("/api/builders")) {
        return Response.json({
          builders: [{ displayName: "Example Builder", githubUsername: "example" }],
          meta: { counts: { returned: 1, total: 1 } }
        });
      }
      if (url.pathname.endsWith("/v1/tools/search_directory")) {
        return Response.json({
          success: true,
          data: { count: 1, projects: [{ slug: "example" }] },
          error: null,
          meta: { tool: "search_directory", format: "json" }
        });
      }
      if (url.pathname.endsWith("/api/projects/search")) {
        return Response.json({
          projects: [{ name: "Example", slug: "example" }],
          meta: { counts: { returned: 1, total: 1 } }
        });
      }
      if (url.pathname.endsWith("/v1/tools/search_content_semantic")) {
        return Response.json({
          success: true,
          data: {
            articles: [{ id: "article", similarity: 0.8 }],
            events: [],
            av: [],
            query: "Example Builder"
          },
          error: null,
          meta: { tool: "search_content_semantic", format: "json" }
        });
      }
      if (url.pathname.endsWith("/v1/tools/find_similar_projects_semantic")) {
        return Response.json({
          success: true,
          data: { results: [{ slug: "neighbor", title: "Neighbor", similarity: 0.8 }] },
          error: null,
          meta: { tool: "find_similar_projects_semantic", format: "json" }
        });
      }
      return Response.json({ error: `unexpected ${url.pathname}` }, { status: 500 });
    });

    const narrow = await run(`async () => {
      const builders = await scout.getBuilders({ q: "Example Builder", limit: 1 });
      return { ok: builders.ok };
    }`);
    expect(narrow.ok).toBe(true);
    if (!narrow.ok) throw new Error(narrow.error);
    expect(narrow.recoveryHint?.sourceOperations).toEqual(["scout.getBuilders"]);
    expect(narrow.recoveryHint?.candidates.map((candidate) => candidate.id)).toEqual([
      "lumenloop.search_content_semantic",
      "scout.searchResearch",
      "lumenloop.find_av_passages"
    ]);

    const lumenloopDirectory = await run(`async () => {
      const directory = await lumenloop.search_directory({ query: "Example Builder", limit: 1 });
      return { directoryOk: directory.ok };
    }`);
    expect(lumenloopDirectory.ok).toBe(true);
    if (!lumenloopDirectory.ok) throw new Error(lumenloopDirectory.error);
    expect(lumenloopDirectory.operationSummary?.candidateEvidence).toBe(1);
    expect(lumenloopDirectory.recoveryHint?.sourceOperations).toEqual([
      "lumenloop.search_directory"
    ]);
    expect(lumenloopDirectory.recoveryHint?.candidates.map((candidate) => candidate.id)).toEqual([
      "lumenloop.search_content_semantic",
      "scout.searchProjects",
      "scout.searchResearch"
    ]);

    const scoutDirectory = await run(`async () => {
      const projects = await scout.searchProjects({ query: "Example Builder", limit: 1 });
      return { projectsOk: projects.ok };
    }`);
    expect(scoutDirectory.ok).toBe(true);
    if (!scoutDirectory.ok) throw new Error(scoutDirectory.error);
    expect(scoutDirectory.operationSummary?.candidateEvidence).toBe(1);
    expect(scoutDirectory.recoveryHint?.sourceOperations).toEqual(["scout.searchProjects"]);
    expect(scoutDirectory.recoveryHint?.candidates.map((candidate) => candidate.id)).toEqual([
      "lumenloop.search_content_semantic",
      "scout.searchResearch",
      "scout.searchRepos"
    ]);

    const broadened = await run(`async () => {
      const [builders, semantic] = await Promise.all([
        scout.getBuilders({ q: "Example Builder", limit: 1 }),
        lumenloop.search_content_semantic({ query: "Example Builder", limit: 1 })
      ]);
      return { buildersOk: builders.ok, semanticOk: semantic.ok };
    }`);
    expect(broadened.ok).toBe(true);
    if (!broadened.ok) throw new Error(broadened.error);
    expect(broadened.operationSummary?.candidateEvidence).toBe(1);
    expect(broadened.recoveryHint).toBeUndefined();

    const unprofiledSemantic = await run(`async () => {
      const [builders, similar] = await Promise.all([
        scout.getBuilders({ q: "Example Builder", limit: 1 }),
        lumenloop.find_similar_projects_semantic({ slug: "example", limit: 1 })
      ]);
      return { buildersOk: builders.ok, similarOk: similar.ok };
    }`);
    expect(unprofiledSemantic.ok).toBe(true);
    if (!unprofiledSemantic.ok) throw new Error(unprofiledSemantic.error);
    expect(unprofiledSemantic.operationSummary?.candidateEvidence).toBeUndefined();
    expect(unprofiledSemantic.recoveryHint).toBeUndefined();
  });

  it("ownerless truncated results get a generic unavailable artifact line with no auth-mode wording", async () => {
    const outcome = await run(BIG_SECRET_RESULT_CODE);
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) throw new Error(outcome.error);
    expect(outcome.truncated).toBe(true);
    expect(outcome.result).toContain("artifact: absent (unavailable)");
    const artifactLine = outcome.result.split("\n").find((line) => line.startsWith("artifact:")) ?? "";
    expect(artifactLine).not.toMatch(/admin|dev|local|oauth/i);
  });

  it("reads artifacts inside the sandbox for the same owner, rejects other owners, and caps read loops", async () => {
    const owner = uniqueOwner("read");
    const written = await run(BIG_SECRET_RESULT_CODE, { artifactOwner: owner });
    expect(written.ok).toBe(true);
    if (!written.ok) throw new Error(written.error);
    const id = artifactIdFrom(written.result);

    const sameOwner = await run(`async () => {
      const r = await codemode.artifact.read("${id}");
      return {
        ok: r.ok,
        count: r.data.rows.length,
        firstSecret: r.data.rows[0].nested.envSecret,
        firstAdmin: r.data.rows[0].adminEcho
      };
    }`, { artifactOwner: owner });
    expect(sameOwner.ok).toBe(true);
    if (sameOwner.ok) {
      expect(JSON.parse(sameOwner.result)).toEqual({
        ok: true,
        count: 2500,
        firstSecret: "[REDACTED]",
        firstAdmin: "[REDACTED]"
      });
      expect(sameOwner.artifactReadCount).toBe(1);
      expect(sameOwner.artifactReadBytes).toBeGreaterThan(24_000);
    }

    const wrongOwner = await run(`async () => {
      const r = await codemode.artifact.read("${id}");
      return { ok: r.ok, kind: r.error.kind, message: r.error.message };
    }`, { artifactOwner: uniqueOwner("wrong") });
    expect(wrongOwner.ok).toBe(true);
    if (wrongOwner.ok) {
      expect(JSON.parse(wrongOwner.result)).toEqual({
        ok: false,
        kind: "error",
        message: "artifact not found"
      });
    }

    const capped = await run(`async () => {
      let last = null;
      for (let i = 0; i < 5; i++) last = await codemode.artifact.read("${id}");
      return { ok: last.ok, message: last.error.message };
    }`, { artifactOwner: owner });
    expect(capped.ok).toBe(true);
    if (capped.ok) {
      expect(JSON.parse(capped.result)).toEqual({
        ok: false,
        message: "artifact read cap exceeded: max 4 reads per execute"
      });
      expect(capped.artifactReadCount).toBe(5);
      expect(capped.artifactReadBytes).toBeGreaterThan(24_000 * 4);
    }
  });

  it("sandbox has NO network: fetch() rejects (globalOutbound: null)", async () => {
    const outcome = await run(`async () => {
      try {
        await fetch("https://example.com");
        return { fetched: true };
      } catch (e) {
        return { fetched: false, message: String(e && e.message) };
      }
    }`);
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      const parsed = JSON.parse(outcome.result) as { fetched: boolean; message: string };
      expect(parsed.fetched).toBe(false);
      expect(parsed.message.length).toBeGreaterThan(0);
    }
  });

  it("a build-excluded op has NO sandbox fn — calling it fails loudly (ADR-0003)", async () => {
    const outcome = await run(`async () => {
      try {
        await scout.submitPartnerListing({});
        return { threw: false };
      } catch (e) {
        return { threw: true, message: String(e && e.message) };
      }
    }`);
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      const parsed = JSON.parse(outcome.result) as { threw: boolean; message: string };
      expect(parsed.threw).toBe(true); // unknown name — nothing uncallable exists
    }
  });

  it("guards a FAILED envelope: r.data warns undefined, writes go through", async () => {
    // An arg-validation refusal produces the { ok: false } envelope entirely offline.
    const outcome = await run(`async () => {
      const r = await lumenloop.search_directory({ limit: 2 }); // missing required query
      const dataIsUndefined = r.data === undefined; // logs the [envelope] warning
      r.note = "write-through ok"; // decorating the envelope stays legal
      return { dataIsUndefined, note: r.note };
    }`);
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(JSON.parse(outcome.result)).toEqual({ dataIsUndefined: true, note: "write-through ok" });
      expect(outcome.logs.join("\n")).toContain("[envelope] lumenloop.search_directory");
    }
  });

  it("guards a SUCCESSFUL envelope: payload reads on the envelope throw a r.data.* pointer", async () => {
    // One stubbed upstream response → a real { ok: true, data } envelope
    // through the actual lumenloop adapter + guard prelude, no live traffic.
    // Host-side adapters run in this isolate, so the global stub reaches them.
    vi.stubGlobal("fetch", async (input: RequestInfo | URL) => {
      const url = new URL(typeof input === "string" || input instanceof URL ? input : input.url);
      expect(url.href).toBe("https://api.lumenloop.com/v1/tools/search_directory");
      return Response.json({
        success: true,
        data: { count: 1, projects: [{ slug: "smoke-project" }] },
        meta: { tool: "search_directory", format: "json" }
      });
    });
    const outcome = await run(`async () => {
      const dir = await lumenloop.search_directory({ query: "smoke" });
      let payloadReadError = "";
      try {
        dir.projects; // wrong level — must throw a pointer at dir.data.projects
      } catch (e) {
        payloadReadError = String(e && e.message);
      }
      return { ok: dir.ok, viaData: dir.data.count, payloadReadError };
    }`);
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      const parsed = JSON.parse(outcome.result) as {
        ok: boolean;
        viaData: number;
        payloadReadError: string;
      };
      expect(parsed.ok).toBe(true);
      expect(parsed.viaData).toBe(1);
      expect(parsed.payloadReadError).toContain("r.data.projects");
    }
  });

  it("guards a skill.read result: reading .data throws a pointer to top-level content", async () => {
    const outcome = await run(`async () => {
      const skill = await codemode.skill.read("skills.lumenloop.stellar-project-dossier");
      let dataReadError = "";
      try {
        skill.data; // wrong shape — skill content is top-level, not under .data
      } catch (e) {
        dataReadError = String(e && e.message);
      }
      return { ok: skill.ok, hasContent: typeof skill.content === "string", dataReadError };
    }`);
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      const parsed = JSON.parse(outcome.result) as {
        ok: boolean;
        hasContent: boolean;
        dataReadError: string;
      };
      expect(parsed.ok).toBe(true);
      expect(parsed.hasContent).toBe(true);
      expect(parsed.dataReadError).toContain("top level");
      expect(outcome.evidenceSummary?.kind).toBe("skill-content");
    }
  });

  it("appends the sandbox globals hint to an 'is not defined' error", async () => {
    const outcome = await run(`async () => { return nope.doThing(); }`);
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.error).toMatch(/is not defined/);
      expect(outcome.error).toContain("the only globals available in the sandbox are:");
      expect(outcome.error).toContain("lumenloop");
      expect(outcome.error).toContain("codemode");
    }
  });

  it("leaves a non-ReferenceError message unchanged (no globals hint)", async () => {
    const outcome = await run(`async () => { throw new Error("plain-boom"); }`);
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.error).toContain("plain-boom");
      expect(outcome.error).not.toContain("the only globals available");
    }
  });

  it("in-sandbox discovery works offline: codemode.search + catalog() + skill.read", async () => {
    const outcome = await run(`async () => {
      const found = await codemode.search("search directory");
      const catalog = await codemode.catalog();
      const skill = await codemode.skill.read("skills.lumenloop.stellar-project-dossier");
      return {
        topHit: found.ok ? found.hits[0]?.id ?? null : null,
        allCallable: catalog.entries.every((e) => !("policy" in e)), // ADR-0003: no policy layer
        skillOk: skill.ok === true && skill.availableSections.length > 0
      };
    }`);
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      const parsed = JSON.parse(outcome.result) as {
        topHit: string | null;
        allCallable: boolean;
        skillOk: boolean;
      };
      expect(parsed.topHit).toBe("lumenloop.search_directory");
      expect(parsed.allCallable).toBe(true);
      expect(parsed.skillOk).toBe(true);
      expect(outcome.evidenceSummary?.kind).toBe("skill-content");
    }
  });

  it("captures console output as shaped logs", async () => {
    const outcome = await run(`async () => {
      console.log("smoke line one");
      console.error("smoke line two");
      return "done";
    }`);
    expect(outcome.ok).toBe(true);
    const joined = outcome.logs.join("\n");
    expect(joined).toContain("smoke line one");
    expect(joined).toContain("smoke line two");
  });

  it("surfaces sandbox throws as { ok: false } with the error text", async () => {
    const outcome = await run(`async () => { throw new Error("smoke-kaboom"); }`);
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) expect(outcome.error).toContain("smoke-kaboom");
  });
});

describe("codemode.skill.run at the real worker boundary (design §12 smoke)", () => {
  /**
   * Route the host-side lumenloop adapter to the LIVE-CAPTURED runner
   * fixtures (test/fixtures/skill-runners/, production 2026-07-06) by tool
   * name — the run crosses the true chain: sandbox prelude → provider RPC →
   * runSkill → recording sub-facade → adapter fetch. This lane is offline by
   * design (miniflare outboundService), so the standing guard against LIVE
   * upstream payload drift is the wrangler-dev/live lane (rollout step 6,
   * §11 row 18 refresh discipline); this smoke pins the full dispatch path
   * and envelope semantics at the workerd boundary.
   */
  const stubLumenloop = (routes: Record<string, unknown>) => {
    vi.stubGlobal("fetch", async (input: RequestInfo | URL) => {
      const url = new URL(typeof input === "string" || input instanceof URL ? input : input.url);
      expect(url.pathname.startsWith("/v1/tools/")).toBe(true);
      const tool = url.pathname.slice("/v1/tools/".length);
      const data = routes[tool];
      if (data === undefined) {
        return Response.json(
          { success: false, error: `smoke stub: unstubbed lumenloop tool "${tool}"` },
          { status: 500 }
        );
      }
      return Response.json({ success: true, data, meta: { tool, format: "json" } });
    });
  };

  it("digest run (theme mode): envelope, sections non-null, host `calls` ledger all ok, guard traps live", async () => {
    stubLumenloop({
      search_content_semantic: fxSemantic.data,
      list_documents: fxListDocs.data
    });
    const outcome = await run(`async () => {
      const r = await codemode.skill.run("skills.lumenloop.stellar-ecosystem-digest", { subject: "RWA tokenization" });
      let envelopeTrap = "";
      try {
        r.items; // payload read on the envelope — must throw an r.data.* pointer
      } catch (e) {
        envelopeTrap = String(e && e.message);
      }
      return {
        ok: r.ok,
        window: r.data.window,
        softEmpty: r.data.softEmpty,
        sectionsNonNull: [r.data.items, r.data.upcomingEvents].every((s) => s !== null),
        itemCount: r.data.items === null ? null : r.data.items.length,
        upcomingCount: r.data.upcomingEvents === null ? null : r.data.upcomingEvents.length,
        calls: r.data.calls.map((c) => ({ op: c.op, ok: c.ok })),
        envelopeTrap
      };
    }`);
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      const parsed = JSON.parse(outcome.result) as {
        ok: boolean;
        window: { dateStart: string; dateEnd: string };
        softEmpty: boolean;
        sectionsNonNull: boolean;
        itemCount: number | null;
        upcomingCount: number | null;
        calls: { op: string; ok: boolean }[];
        envelopeTrap: string;
      };
      expect(parsed.ok).toBe(true);
      expect(parsed.window.dateStart).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(parsed.window.dateEnd).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(parsed.softEmpty).toBe(false);
      expect(parsed.sectionsNonNull).toBe(true);
      expect(parsed.itemCount).toBeGreaterThan(0);
      expect(parsed.upcomingCount).toBeGreaterThan(0);
      expect(parsed.calls.map((c) => c.op).sort()).toEqual([
        "lumenloop.list_documents",
        "lumenloop.search_content_semantic"
      ]);
      expect(parsed.calls.every((c) => c.ok)).toBe(true);
      expect(parsed.envelopeTrap).toContain("r.data.items");
    }
  });

  it("unknown runnable name fails AS DATA naming the runnable set + nearest suggestion (no fetch needed)", async () => {
    const outcome = await run(`async () => {
      const r = await codemode.skill.run("skills.lumenloop.stellar-ecosystem-diges", { subject: "RWA" });
      const dataIsUndefined = r.data === undefined; // ok:false envelope — logs the [envelope] warning
      return { ok: r.ok, message: r.error.message, dataIsUndefined };
    }`);
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      const parsed = JSON.parse(outcome.result) as { ok: boolean; message: string; dataIsUndefined: boolean };
      expect(parsed.ok).toBe(false);
      expect(parsed.message).toContain('unknown runnable skill "skills.lumenloop.stellar-ecosystem-diges"');
      expect(parsed.message).toContain("skills.lumenloop.stellar-ecosystem-digest");
      expect(parsed.message).toContain('Did you mean "skills.lumenloop.stellar-ecosystem-digest"?');
      // The retired dossier runner must not be advertised as runnable.
      expect(parsed.message).not.toContain("stellar-project-dossier");
      expect(parsed.dataIsUndefined).toBe(true);
    }
  });
});

describe("spec-search runner (kept for A/Bs, ADR-0001)", () => {
  it("evaluates codemode.spec() queries in a no-provider sandbox", async () => {
    const runSearch = createSpecSearchRunner(env as unknown as Env); // same OAUTH_PROVIDER bridge as above
    const outcome = await runSearch(`async () => {
      const spec = await codemode.spec();
      return { services: Object.keys(spec).length };
    }`);
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      const parsed = JSON.parse(outcome.result) as { services: number };
      expect(parsed.services).toBeGreaterThan(0);
    }
  });
});
